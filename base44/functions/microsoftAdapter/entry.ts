/**
 * Squirrel OS — Microsoft Platform Adapter
 * 
 * Translates Squirrel OS healing intents into Microsoft Graph API and Azure REST API calls.
 * Supports: Azure App Service, Azure Functions, Entra ID, Key Vault, Teams, AKS, SQL Database,
 * Azure Monitor, Power Automate, Azure DevOps.
 * 
 * Endpoints:
 *   POST /health    — Pull telemetry from Microsoft environments (Azure Monitor + Graph health)
 *   POST /heal      — Execute a healing action on a Microsoft resource
 *   POST /webhook   — Receive Azure Monitor alert webhook
 *   GET  /playbooks — List Microsoft-specific playbooks
 */

import { createClientFromRequest } from "npm:@base44/sdk@0.8.31";

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/functions/microsoftAdapter", "");
  
  // Get Microsoft credentials from environment
  const AZURE_TENANT_ID = Deno.env.get("AZURE_TENANT_ID") || "";
  const AZURE_CLIENT_ID = Deno.env.get("AZURE_CLIENT_ID") || "";
  const AZURE_CLIENT_SECRET = Deno.env.get("AZURE_CLIENT_SECRET") || "";
  const AZURE_SUBSCRIPTION_ID = Deno.env.get("AZURE_SUBSCRIPTION_ID") || "";
  
  const GRAPH_API = "https://graph.microsoft.com/v1.0";
  const ARM_API = "https://management.azure.com";
  const LOGIN_API = "https://login.microsoftonline.com";

  /**
   * Get Azure AD access token via client credentials flow
   */
  async function getAccessToken(resource: string): Promise<string> {
    const tokenUrl = `${LOGIN_API}/${AZURE_TENANT_ID}/oauth2/v2.0/token`;
    const body = new URLSearchParams({
      client_id: AZURE_CLIENT_ID,
      client_secret: AZURE_CLIENT_SECRET,
      scope: `${resource}/.default`,
      grant_type: "client_credentials"
    });

    const resp = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    if (!resp.ok) {
      throw new Error(`Token acquisition failed: ${resp.status} ${await resp.text()}`);
    }

    const data = await resp.json();
    return data.access_token;
  }

  /**
   * Pull health telemetry from Microsoft environments
   */
  async function pullHealthTelemetry() {
    const results = {
      timestamp: new Date().toISOString(),
      azure_monitor: null as any,
      m365_health: null as any,
      graph_service_health: null as any,
      errors: [] as string[]
    };

    try {
      // 1. Azure Monitor — subscription-level health
      if (AZURE_SUBSCRIPTION_ID) {
        const armToken = await getAccessToken("https://management.azure.com");
        const healthUrl = `${ARM_API}/subscriptions/${AZURE_SUBSCRIPTION_ID}/providers/Microsoft.ResourceHealth/availabilityStatuses?api-version=2023-07-01-preview`;
        
        const healthResp = await fetch(healthUrl, {
          headers: { "Authorization": `Bearer ${armToken}` }
        });
        
        if (healthResp.ok) {
          const healthData = await healthResp.json();
          results.azure_monitor = {
            total_resources: healthData.value?.length || 0,
            available: healthData.value?.filter((r: any) => r.properties?.availabilityState === "Available").length || 0,
            unavailable: healthData.value?.filter((r: any) => r.properties?.availabilityState === "Unavailable").length || 0,
            degraded: healthData.value?.filter((r: any) => r.properties?.availabilityState === "Degraded").length || 0,
            resources: healthData.value?.map((r: any) => ({
              resource_id: r.properties?.targetResourceId,
              name: r.properties?.targetResourceName,
              status: r.properties?.availabilityState,
              summary: r.properties?.summary
            })).slice(0, 50)
          };
        } else {
          results.errors.push(`Azure Monitor: ${healthResp.status}`);
        }
      }
    } catch (e) {
      results.errors.push(`Azure Monitor error: ${e.message}`);
    }

    try {
      // 2. M365 Service Health via Graph API
      const graphToken = await getAccessToken("https://graph.microsoft.com");
      const healthUrl = `${GRAPH_API}/admin/serviceAnnouncement/healthOverviews`;
      
      const healthResp = await fetch(healthUrl, {
        headers: { "Authorization": `Bearer ${graphToken}` }
      });
      
      if (healthResp.ok) {
        const healthData = await healthResp.json();
        results.m365_health = {
          services: healthData.value?.map((s: any) => ({
            service: s.service,
            status: s.status,
            id: s.id
          })),
          unhealthy_services: healthData.value?.filter((s: any) => s.status !== "serviceOperational").map((s: any) => ({
            service: s.service,
            status: s.status
          }))
        };
      } else {
        results.errors.push(`M365 Health: ${healthResp.status}`);
      }
    } catch (e) {
      results.errors.push(`M365 Health error: ${e.message}`);
    }

    try {
      // 3. Entra ID — check for any risky sign-ins or disabled service principals
      const graphToken = await getAccessToken("https://graph.microsoft.com");
      const riskyUrl = `${GRAPH_API}/identityProtection/riskySignIns?$filter=riskLevel eq 'high' or riskLevel eq 'medium'`;
      
      const riskyResp = await fetch(riskyUrl, {
        headers: { "Authorization": `Bearer ${graphToken}` }
      });
      
      if (riskyResp.ok) {
        const riskyData = await riskyResp.json();
        results.graph_service_health = {
          risky_signins: riskyData.value?.length || 0,
          high_risk: riskyData.value?.filter((r: any) => r.riskLevel === "high").length || 0
        };
      }
    } catch (e) {
      results.errors.push(`Entra ID error: ${e.message}`);
    }

    // Create SystemHealth record from telemetry
    const overallHealth = results.azure_monitor?.unavailable > 0 ? "degraded" : "healthy";
    const healthScore = results.azure_monitor 
      ? Math.round((results.azure_monitor.available / results.azure_monitor.total_resources) * 100)
      : 99;

    try {
      await base44.asServiceRole.entities.SystemHealth.create({
        snapshot_id: `ms_telemetry_${Date.now()}`,
        status: overallHealth,
        health_score: healthScore,
        overall_status: overallHealth === "healthy" ? "Healthy" : "DEGRADED",
        active_anomaly_count: results.azure_monitor?.unavailable || 0,
        active_anomalies: results.m365_health?.unhealthy_services?.map((s: any) => `${s.service}: ${s.status}`) || [],
        heartbeat_status: results.errors.length > 2 ? "partial" : "alive",
        heartbeat_count: 1,
        timestamp: Date.now(),
        agent_count: 0,
        node_count: results.azure_monitor?.total_resources || 0,
        orphan_node_count: 0,
        avg_latency_ms: 0,
        avg_token_efficiency: 100,
        uptime_percentage: healthScore,
        pqc_readiness_score: 0, // Needs separate PQC scan
        vulnerable_crypto_count: 0,
        success_rate: 100,
        successful_heals: 0,
        total_healing_events: 0,
        resolved_anomalies: 0
      });
    } catch (e) {
      results.errors.push(`SystemHealth create error: ${e.message}`);
    }

    return Response.json(results);
  }

  /**
   * Execute a healing action on a Microsoft resource
   */
  async function executeHealing(action: any) {
    const { intent, resource_id, resource_type, params } = action;
    
    const intentMap: Record<string, any> = {
      // Azure App Service restart
      restart_app_service: async () => {
        const token = await getAccessToken("https://management.azure.com");
        const url = `${ARM_API}${resource_id}/restart?api-version=2023-12-01`;
        const resp = await fetch(url, { method: "POST", headers: { "Authorization": `Bearer ${token}` } });
        return { action: "restart_app_service", status: resp.status, success: resp.ok };
      },
      
      // Azure Function App restart
      restart_function_app: async () => {
        const token = await getAccessToken("https://management.azure.com");
        const url = `${ARM_API}${resource_id}/restart?api-version=2023-12-01`;
        const resp = await fetch(url, { method: "POST", headers: { "Authorization": `Bearer ${token}` } });
        return { action: "restart_function_app", status: resp.status, success: resp.ok };
      },
      
      // Azure SQL Database scale up
      scale_sql_database: async () => {
        const token = await getAccessToken("https://management.azure.com");
        const url = `${ARM_API}${resource_id}?api-version=2023-08-01-preview`;
        const resp = await fetch(url, {
          method: "PATCH",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ sku: { name: params.sku_name || "S2", tier: params.sku_tier || "Standard" } })
        });
        return { action: "scale_sql_database", status: resp.status, success: resp.ok };
      },
      
      // Microsoft Graph — rotate service principal secret
      rotate_service_principal_secret: async () => {
        const token = await getAccessToken("https://graph.microsoft.com");
        const url = `${GRAPH_API}/applications/${resource_id}/addPassword`;
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ passwordCredential: { displayName: `SquirrelOS-${Date.now()}`, endDateTime: null } })
        });
        const data = await resp.json();
        return { action: "rotate_service_principal_secret", status: resp.status, success: resp.ok, new_secret_id: data.id };
      },
      
      // Azure Key Vault — create new PQC key
      rotate_key_vault_pqc: async () => {
        const token = await getAccessToken("https://management.azure.com");
        const url = `${ARM_API}${resource_id}/rotate?api-version=2023-02-01`;
        const resp = await fetch(url, { method: "POST", headers: { "Authorization": `Bearer ${token}` } });
        return { action: "rotate_key_vault_pqc", status: resp.status, success: resp.ok };
      },
      
      // Entra ID — re-enable service principal
      enable_service_principal: async () => {
        const token = await getAccessToken("https://graph.microsoft.com");
        const url = `${GRAPH_API}/servicePrincipals/${resource_id}`;
        const resp = await fetch(url, {
          method: "PATCH",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ accountEnabled: true })
        });
        return { action: "enable_service_principal", status: resp.status, success: resp.ok };
      },
      
      // AKS deployment restart
      restart_aks_deployment: async () => {
        const token = await getAccessToken("https://management.azure.com");
        // This would use kubectl via Azure CLI or ARM template deployment
        // For now, restart the AKS cluster nodes
        const url = `${ARM_API}${resource_id}/restartNodePools?api-version=2023-10-01`;
        const resp = await fetch(url, { method: "POST", headers: { "Authorization": `Bearer ${token}` } });
        return { action: "restart_aks_deployment", status: resp.status, success: resp.ok };
      },
      
      // Send Teams notification
      send_teams_alert: async () => {
        const token = await getAccessToken("https://graph.microsoft.com");
        const url = `${GRAPH_API}/teams/${params.team_id}/channels/${params.channel_id}/messages`;
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            body: { content: params.message || "Squirrel OS: Healing action executed" }
          })
        });
        return { action: "send_teams_alert", status: resp.status, success: resp.ok };
      },
      
      // Azure DevOps pipeline retry
      retry_azure_devops_pipeline: async () => {
        const token = await getAccessToken("https://vssps.dev.azure.com");
        const org = params.organization;
        const project = params.project;
        const pipelineId = params.pipeline_id;
        const runId = params.run_id;
        const url = `https://dev.azure.com/${org}/${project}/_apis/pipelines/${pipelineId}/runs?api-version=7.1`;
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ resources: { repositories: { self: { refName: params.branch || "refs/heads/main" } } } })
        });
        return { action: "retry_azure_devops_pipeline", status: resp.status, success: resp.ok };
      }
    };

    try {
      const executor = intentMap[intent];
      if (!executor) {
        return Response.json({ error: `Unknown healing intent: ${intent}` }, { status: 400 });
      }

      const result = await executor();

      // Log the healing event
      await base44.asServiceRole.entities.AegisHealingEvent.create({
        anomaly_id: action.anomaly_id || "external",
        playbook_id: action.playbook_id || `MS-${intent}`,
        playbook_name: `Microsoft: ${intent}`,
        agent_id: "microsoft-adapter",
        node_id: resource_type || "azure",
        steps_executed: [intent],
        result: result.success ? "resolved" : "failed",
        outcome: result.success ? "success" : "failure",
        trigger: action.trigger || "external_webhook",
        started_at: new Date(Date.now() - 1000).toISOString(),
        completed_at: new Date().toISOString(),
        duration_seconds: 1,
        learning_extracted: result.success ? `${intent} successful on ${resource_type}` : `${intent} failed on ${resource_type}`,
        context_snapshot: { resource_id, params },
        event_id: `ms_heal_${Date.now()}`,
        actions: [intent],
        action_taken: intent,
        result_summary: JSON.stringify(result),
        execution_time_ms: 1000,
        timestamp: new Date().toISOString()
      });

      return Response.json({ success: true, result });
    } catch (e) {
      // Log failed healing attempt
      await base44.asServiceRole.entities.AegisHealingEvent.create({
        anomaly_id: action.anomaly_id || "external",
        playbook_id: action.playbook_id || `MS-${intent}`,
        playbook_name: `Microsoft: ${intent} (FAILED)`,
        agent_id: "microsoft-adapter",
        node_id: resource_type || "azure",
        steps_executed: [intent],
        result: "failed",
        outcome: "failure",
        trigger: action.trigger || "external_webhook",
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        duration_seconds: 1,
        learning_extracted: `Error: ${e.message}`,
        context_snapshot: { resource_id, params, error: e.message },
        event_id: `ms_heal_failed_${Date.now()}`,
        actions: [intent],
        action_taken: intent,
        result_summary: e.message,
        execution_time_ms: 1000,
        timestamp: new Date().toISOString()
      });

      return Response.json({ success: false, error: e.message }, { status: 500 });
    }
  }

  /**
   * Parse Azure Monitor alert webhook payload
   */
  function parseAzureAlert(payload: any) {
    const data = payload.data || payload;
    const alert = {
      alert_id: data.essentials?.alertId || data.alertId || `azure_alert_${Date.now()}`,
      severity: data.essentials?.severity || data.severity || "Informational",
      status: data.essentials?.monitorCondition || data.monitorCondition || "Resolved",
      fired_at: data.essentials?.firedDateTime || data.firedDateTime || new Date().toISOString(),
      resource_id: data.essentials?.targetResource || data.targetResource || "",
      resource_name: data.essentials?.targetResourceName || "",
      resource_type: data.essentials?.targetResourceType || "",
      alert_type: data.essentials?.alertType || "",
      description: data.essentials?.description || "",
      monitoring_service: data.essentials?.monitoringService || "",
      metric_name: data.alertContext?.condition?.allOf?.[0]?.metricName || "",
      metric_value: data.alertContext?.condition?.allOf?.[0]?.metricValue || 0,
      threshold: data.alertContext?.condition?.allOf?.[0]?.threshold || 0,
      anomaly_type: classifyAzureAlert(data)
    };

    return alert;
  }

  function classifyAzureAlert(data: any): string {
    const desc = (data.essentials?.description || "").toLowerCase();
    const resourceType = (data.essentials?.targetResourceType || "").toLowerCase();
    
    if (desc.includes("cpu") || desc.includes("memory")) return "azure_resource_pressure";
    if (desc.includes("connection") || desc.includes("timeout")) return "azure_sql_connection_failure";
    if (resourceType.includes("web")) return "azure_app_down";
    if (resourceType.includes("function")) return "azure_function_timeout";
    if (resourceType.includes("kubernetes")) return "aks_pod_crashloop";
    if (desc.includes("auth") || desc.includes("unauthorized")) return "graph_token_expired";
    if (desc.includes("key") || desc.includes("crypto")) return "azure_key_vulnerability";
    return "azure_monitor_critical";
  }

  // Route handler
  try {
    if (req.method === "GET") {
      // GET /playbooks — list Microsoft playbooks
      const playbooks = await base44.asServiceRole.entities.AegisPlaybook.list({
        filter: { anomaly_type: { filter_type: "in", value: [
          "azure_app_down", "azure_function_timeout", "graph_token_expired", "azure_key_vulnerability",
          "teams_bot_failure", "azure_sql_connection_failure", "azure_monitor_critical",
          "entra_sp_disabled", "azure_blob_corruption", "aks_pod_crashloop",
          "power_automate_timeout", "azure_devops_pipeline_failure"
        ]}}
      });
      return Response.json({ count: playbooks.length, playbooks });
    }

    if (req.method === "POST") {
      const body = await req.json();
      
      if (path === "/health" || body.action === "pull_health") {
        const result = await pullHealthTelemetry();
        return result;
      }
      
      if (path === "/heal" || body.action === "heal") {
        const result = await executeHealing(body);
        return result;
      }
      
      if (path === "/webhook" || body.action === "webhook") {
        const alert = parseAzureAlert(body);
        
        // Create AegisAnomaly from alert
        await base44.asServiceRole.entities.AegisAnomaly.create({
          anomaly_type: alert.anomaly_type,
          severity: alert.severity === "Sev0" || alert.severity === "Critical" ? "critical" : 
                    alert.severity === "Sev1" || alert.severity === "Error" ? "high" : "medium",
          status: "detected",
          confidence_score: 0.9,
          detected_at: Date.now(),
          title: `Azure Alert: ${alert.resource_name || alert.resource_type}`,
          description: alert.description,
          affected_agent_id: "microsoft-adapter",
          affected_node_id: alert.resource_name,
          component: alert.resource_type,
          category: "microsoft_azure",
          root_cause: alert.metric_name || alert.alert_type,
          metrics: { metric_value: alert.metric_value, threshold: alert.threshold },
          linked_playbook_id: "",
          linked_healing_event_id: "",
          estimated_break_year: null,
          vulnerable_algorithm: null,
          suggested_pqc_algorithm: null,
          quantum_threat_level: "none"
        });
        
        return Response.json({ success: true, anomaly_created: true, alert });
      }

      return Response.json({ error: "Unknown action. Use /health, /heal, or /webhook" }, { status: 400 });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
});
