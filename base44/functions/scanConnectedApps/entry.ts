import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    // Read all connected apps from the hub
    const connectedApps = await base44.entities.ConnectedApp.list({
      filter: { status: "active" },
      limit: 500
    });
    
    const results = [];
    
    for (const app of connectedApps) {
      try {
        // Read SystemHealth from the customer's app
        const healthRecords = await base44.entities.SystemHealth.list({
          filter: { app_id: app.app_id },
          limit: 1,
          sort: "-created_date"
        });
        
        const health = healthRecords[0] || null;
        const healthScore = health?.data?.health_score || 0;
        
        // Create HealthManifest on the hub
        await base44.entities.HealthManifest.create({
          customer_id: app.customer_id,
          app_id: app.app_id,
          health_score: healthScore,
          heartbeat_status: health?.data?.heartbeat_status || "unknown",
          cpu_usage: health?.data?.avg_latency_ms || 0,
          latency_ms: health?.data?.avg_latency_ms || 0,
          token_usage: health?.data?.avg_token_efficiency || 0,
          generated_at: new Date().toISOString()
        });
        
        // Check if health dropped below threshold
        if (healthScore > 0 && healthScore < 70) {
          await base44.entities.PlatformAlert.create({
            customer_id: app.customer_id,
            app_id: app.app_id,
            alert_type: "health_drop",
            severity: "critical",
            message: `App ${app.app_name} health score dropped to ${healthScore}`,
            escalated_to_gabriel: true
          });
        }
        
        results.push({
          app_id: app.app_id,
          app_name: app.app_name,
          health_score: healthScore,
          status: healthScore > 70 ? "healthy" : healthScore > 0 ? "degraded" : "offline"
        });
      } catch (error) {
        results.push({
          app_id: app.app_id,
          app_name: app.app_name,
          health_score: 0,
          status: "error",
          error: error.message
        });
      }
    }
    
    const totalApps = results.length;
    const healthyApps = results.filter(r => r.status === "healthy").length;
    const degradedApps = results.filter(r => r.status === "degraded").length;
    const offlineApps = results.filter(r => r.status === "offline" || r.status === "error").length;
    
    return Response.json({
      scanned_at: new Date().toISOString(),
      total_apps: totalApps,
      healthy: healthyApps,
      degraded: degradedApps,
      offline: offlineApps,
      results
    });
  } catch (error) {
    return Response.json({ error: error.message, status: "failed" }, { status: 500 });
  }
});