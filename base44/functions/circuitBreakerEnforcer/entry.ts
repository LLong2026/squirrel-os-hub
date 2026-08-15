// Circuit Breaker + Rate Limiter for Squirrel OS
// Enforces per-adapter and per-app circuit breakers and rate limits
// Called before any healing action executes

export default async function(req: any) {
  const { action, body, headers } = req;
  const { base44 } = req as any;
  
  try {
    const { adapter_name, app_id, action_type } = body || {};
    
    // 1. Check circuit breaker for adapter
    if (adapter_name) {
      const breakers = await base44.entities.CircuitBreaker.list({
        filter: { adapter_name, scope: "per_adapter" }
      });
      
      if (breakers && breakers.length > 0) {
        const breaker = breakers[0];
        const data = breaker.data || breaker;
        
        if (data.state === "open") {
          // Check if cooldown period has passed
          const lastChange = new Date(data.last_state_change || data.updated_date);
          const cooldownMs = (data.cooldown_minutes || 15) * 60 * 1000;
          const elapsed = Date.now() - lastChange.getTime();
          
          if (elapsed >= cooldownMs) {
            // Transition to half-open
            await base44.entities.CircuitBreaker.update(breaker.id, {
              state: "half_open",
              last_state_change: new Date().toISOString()
            });
          } else {
            // Still in cooldown — block action
            return {
              allowed: false,
              reason: "circuit_breaker_open",
              adapter_name,
              cooldown_remaining_ms: cooldownMs - elapsed,
              message: `Circuit breaker for ${adapter_name} is open. Cooldown: ${Math.ceil((cooldownMs - elapsed) / 1000)}s remaining.`
            };
          }
        }
        
        if (data.state === "half_open") {
          // Only one test action allowed in half-open state
          // Will transition to closed on success or back to open on failure
          return {
            allowed: true,
            reason: "circuit_breaker_half_open_test",
            adapter_name,
            message: `Test action allowed for ${adapter_name} (half-open state). Success will close breaker, failure will reopen.`
          };
        }
      }
    }
    
    // 2. Check global circuit breaker
    const globalBreakers = await base44.entities.CircuitBreaker.list({
      filter: { scope: "global" }
    });
    if (globalBreakers && globalBreakers.length > 0) {
      const globalBreaker = globalBreakers[0];
      const globalData = globalBreaker.data || globalBreaker;
      if (globalData.state === "open") {
        return {
          allowed: false,
          reason: "global_circuit_breaker_open",
          message: "Global circuit breaker is open. All healing actions suspended. System may be in safe mode."
        };
      }
    }
    
    // 3. Rate limiting — per app per hour (max 20) and per day (max 100)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Log this action attempt
    await base44.entities.RateLimitLog.create({
      action_type: action_type || "healing",
      app_id: app_id || "unknown",
      scope: app_id ? "per_app" : "global",
      action_count: 1,
      window_minutes: 60,
      period: now.toISOString(),
      limit_hit: false,
      timestamp: now.toISOString()
    });
    
    // Check hourly limit per app (max 20/hour)
    if (app_id) {
      const hourlyLogs = await base44.entities.RateLimitLog.list({
        filter: {
          app_id,
          scope: "per_app"
        }
      });
      
      const hourlyCount = (hourlyLogs || []).filter((log: any) => {
        const d = log.data || log;
        return new Date(d.timestamp || d.created_date) >= oneHourAgo;
      }).length;
      
      if (hourlyCount > 20) {
        // Create alert
        await base44.entities.RateLimitLog.update(
          ((hourlyLogs || [])[hourlyCount - 1] || {}).id || "",
          { limit_hit: true }
        );
        
        await base44.entities.PlatformAlert.create({
          alert_type: "rate_limit",
          severity: "warning",
          message: `Rate limit exceeded for app ${app_id}: ${hourlyCount} actions in 1 hour (limit: 20). Temporary safe mode activated for 30 minutes.`,
          app_id,
          created_at: now.toISOString(),
          escalated_to_gabriel: true
        });
        
        return {
          allowed: false,
          reason: "rate_limit_per_app_hourly",
          app_id,
          actions_this_hour: hourlyCount,
          limit: 20,
          message: `Rate limit exceeded: ${hourlyCount} actions in 1 hour (limit 20). Safe mode for 30 min.`
        };
      }
      
      // Check daily limit per app (max 100/day)
      const dailyCount = (hourlyLogs || []).filter((log: any) => {
        const d = log.data || log;
        return new Date(d.timestamp || d.created_date) >= oneDayAgo;
      }).length;
      
      if (dailyCount > 100) {
        await base44.entities.PlatformAlert.create({
          alert_type: "rate_limit",
          severity: "critical",
          message: `Daily rate limit exceeded for app ${app_id}: ${dailyCount} actions in 24 hours (limit: 100). Healing suspended for this app until tomorrow.`,
          app_id,
          created_at: now.toISOString(),
          escalated_to_gabriel: true
        });
        
        return {
          allowed: false,
          reason: "rate_limit_per_app_daily",
          app_id,
          actions_today: dailyCount,
          limit: 100,
          message: `Daily rate limit exceeded: ${dailyCount} actions (limit 100). Healing suspended until tomorrow.`
        };
      }
    }
    
    // 4. Global rate limit (max 200/hour, 1000/day)
    const allLogs = await base44.entities.RateLimitLog.list({
      filter: { scope: "per_app" }
    });
    
    const globalHourlyCount = (allLogs || []).filter((log: any) => {
      const d = log.data || log;
      return new Date(d.timestamp || d.created_date) >= oneHourAgo;
    }).length;
    
    if (globalHourlyCount > 200) {
      await base44.entities.PlatformAlert.create({
        alert_type: "rate_limit",
        severity: "critical",
        message: `GLOBAL rate limit exceeded: ${globalHourlyCount} actions in 1 hour (limit: 200). System entering safe mode for 30 minutes.`,
        created_at: now.toISOString(),
        escalated_to_gabriel: true
      });
      
      // Trip global circuit breaker
      const globalBreaker = (globalBreakers || [])[0];
      if (globalBreaker) {
        await base44.entities.CircuitBreaker.update(globalBreaker.id, {
          state: "open",
          last_state_change: now.toISOString(),
          trip_reason: "global_rate_limit_exceeded"
        });
      }
      
      return {
        allowed: false,
        reason: "rate_limit_global_hourly",
        actions_this_hour: globalHourlyCount,
        limit: 200,
        message: `Global rate limit exceeded: ${globalHourlyCount} actions (limit 200). Safe mode activated.`
      };
    }
    
    // All checks passed — action allowed
    return {
      allowed: true,
      reason: "all_checks_passed",
      adapter_name,
      app_id,
      message: "Circuit breaker closed, rate limits within bounds. Action approved."
    };
    
  } catch (error: any) {
    return {
      allowed: false,
      reason: "enforcement_error",
      error: error.message,
      message: "Circuit breaker check failed. Defaulting to BLOCK for safety."
    };
  }
}
