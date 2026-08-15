// Squirrel OS Installer — Single source of truth for deployment
// Returns full template: entity schemas, playbook seeds, neural node templates, agent/node seeds
// Called by target apps during installation to fetch the complete Squirrel OS package

export default async function getSquirrelOSInstaller(req, res) {
  const template = {
    version: "1.1",
    install_date: new Date().toISOString(),
    
    entities: [
      { name: "AegisAnomaly", schema: { properties: { title: { type: "string" }, anomaly_type: { type: "string" }, severity: { type: "string", enum: ["low", "medium", "high", "critical"] }, status: { type: "string", enum: ["detected", "isolated", "healing", "resolved", "escalated"] }, confidence_score: { type: "number" }, affected_agent_id: { type: "string" }, affected_node_id: { type: "string" }, description: { type: "string" }, root_cause: { type: "string" }, metrics: { type: "object" }, detected_at: { type: "string" }, linked_playbook_id: { type: "string" }, linked_healing_event_id: { type: "string" }, quantum_threat_level: { type: "string" }, vulnerable_algorithm: { type: "string" }, suggested_pqc_algorithm: { type: "string" }, estimated_break_year: { type: "number" }, component: { type: "string" }, category: { type: "string" } }, type: "object" } },
      { name: "AegisPlaybook", schema: { properties: { name: { type: "string" }, anomaly_type: { type: "string" }, trigger_condition: { type: "string" }, confidence_threshold: { type: "number" }, isolation_steps: { type: "array", items: { type: "string" } }, healing_steps: { type: "array", items: { type: "string" } }, verification_steps: { type: "array", items: { type: "string" } }, success_count: { type: "number" }, failure_count: { type: "number" }, avg_resolution_time_ms: { type: "number" } }, type: "object" } },
      { name: "AegisHealingEvent", schema: { properties: { event_id: { type: "string" }, anomaly_id: { type: "string" }, playbook_id: { type: "string" }, playbook_name: { type: "string" }, agent_id: { type: "string" }, node_id: { type: "string" }, trigger: { type: "string" }, steps_executed: { type: "array", items: { type: "string" } }, action_taken: { type: "string" }, result: { type: "string" }, outcome: { type: "string" }, result_summary: { type: "string" }, started_at: { type: "string" }, completed_at: { type: "string" }, duration_seconds: { type: "number" }, execution_time_ms: { type: "number" }, context_snapshot: { type: "object" }, learning_extracted: { type: "string" }, actions: { type: "array", items: { type: "string" } }, timestamp: { type: "string" } }, type: "object" } },
      { name: "SystemHealth", schema: { properties: { snapshot_id: { type: "string" }, app_id: { type: "string" }, status: { type: "string" }, overall_status: { type: "string" }, health_score: { type: "number" }, heartbeat_status: { type: "string" }, heartbeat_count: { type: "number" }, agent_count: { type: "number" }, node_count: { type: "number" }, active_anomaly_count: { type: "number" }, resolved_anomalies: { type: "number" }, total_healing_events: { type: "number" }, successful_heals: { type: "number" }, success_rate: { type: "number" }, avg_latency_ms: { type: "number" }, avg_recovery_ms: { type: "number" }, avg_token_efficiency: { type: "number" }, uptime_percentage: { type: "number" }, pqc_readiness_score: { type: "number" }, vulnerable_crypto_count: { type: "number" }, orphan_node_count: { type: "number" }, entities_checked: { type: "number" }, functions_inventory: { type: "number" }, active_anomalies: { type: "array", items: { type: "string" } }, chronos_vitality: { type: "number" }, timestamp: { type: "string" } }, type: "object" } },
      { name: "SystemHeartbeat", schema: { properties: { agent_id: { type: "string" }, node_id: { type: "string" }, status: { type: "string" }, latency_ms: { type: "number" }, cpu_usage: { type: "number" }, memory_usage: { type: "number" }, token_usage: { type: "number" }, error_count: { type: "number" }, last_healthy_at: { type: "string" }, timestamp: { type: "string" } }, type: "object" } },
      { name: "OrchestratorAgent", schema: { properties: { name: { type: "string" }, role: { type: "string" }, domain: { type: "string" }, status: { type: "string" }, health_score: { type: "number" }, app_id: { type: "string" }, last_heartbeat_at: { type: "string" }, current_task_count: { type: "number" }, max_task_capacity: { type: "number" }, avg_latency_ms: { type: "number" }, avg_token_efficiency: { type: "number" } }, type: "object" } },
      { name: "OrchestratorNode", schema: { properties: { name: { type: "string" }, type: { type: "string" }, status: { type: "string" }, agent_id: { type: "string" }, capacity: { type: "number" }, task_count: { type: "number" }, version: { type: "string" }, is_orphan: { type: "boolean" }, last_active_at: { type: "string" } }, type: "object" } },
      { name: "OrchestratorTask", schema: { properties: { task_type: { type: "string" }, status: { type: "string" }, priority: { type: "string" }, agent_id: { type: "string" }, node_id: { type: "string" }, created_at: { type: "string" }, started_at: { type: "string" }, completed_at: { type: "string" }, result_summary: { type: "string" }, token_count: { type: "number" } }, type: "object" } },
      { name: "Pattern", schema: { properties: { pattern_id: { type: "string" }, name: { type: "string" }, pattern_name: { type: "string" }, type: { type: "string" }, description: { type: "string" }, anomaly_types: { type: "array", items: { type: "string" } }, common_root_causes: { type: "array", items: { type: "string" } }, occurrence_count: { type: "number" }, first_seen: { type: "string" }, last_seen: { type: "string" }, confidence_score: { type: "number" }, recommended_playbook_id: { type: "string" }, auto_heal_enabled: { type: "boolean" }, status: { type: "string" }, source_domain: { type: "string" }, occurrences: { type: "array", items: { type: "string" } }, detected_at: { type: "string" }, metadata: { type: "object" } }, type: "object" } },
      { name: "Insight", schema: { properties: { insight_text: { type: "string" }, category: { type: "string" }, severity: { type: "string" }, source_patterns: { type: "array", items: { type: "string" } }, recommended_action: { type: "string" }, acted_on: { type: "boolean" }, created_at: { type: "string" } }, type: "object" } },
      { name: "NeuralNode", schema: { properties: { layer: { type: "number" }, pattern_type: { type: "string" }, weight: { type: "number" }, learning_rate: { type: "number" }, connections: { type: "array", items: { type: "string" } }, activation_count: { type: "number" }, last_activated: { type: "string" } }, type: "object" } },
      { name: "LearningMetric", schema: { properties: { metric_name: { type: "string" }, value: { type: "number" }, period: { type: "string" }, trend: { type: "string" }, comparison_to_previous: { type: "string" }, recorded_at: { type: "string" } }, type: "object" } },
      { name: "PredictiveAlert", schema: { properties: { alert_type: { type: "string" }, predicted_issue: { type: "string" }, severity: { type: "string" }, probability: { type: "number" }, affected_components: { type: "array", items: { type: "string" } }, recommended_action: { type: "string" }, status: { type: "string" }, created_at: { type: "string" }, resolved_at: { type: "string" } }, type: "object" } },
      { name: "SelfImprovementProposal", schema: { properties: { title: { type: "string" }, description: { type: "string" }, rationale: { type: "string" }, expected_impact: { type: "string" }, implementation_difficulty: { type: "string" }, source_pattern_id: { type: "string" }, source_insight_id: { type: "string" }, status: { type: "string" }, proposed_at: { type: "string" } }, type: "object" } },
      { name: "RemediationSweep", schema: { properties: { sweep_type: { type: "string" }, triggered_by: { type: "string" }, started_at: { type: "string" }, completed_at: { type: "string" }, anomalies_found: { type: "number" }, anomalies_resolved: { type: "number" }, healing_events_created: { type: "number" }, nodes_refreshed: { type: "number" }, orphans_purged: { type: "number" }, agents_rebalanced: { type: "number" }, summary: { type: "string" } }, type: "object" } }
    ],

    seed_agents: [
      { name: "Jasper Supervisor", role: "orchestration_supervisor", domain: "system", status: "active", health_score: 99.0, max_task_capacity: 20, current_task_count: 0, avg_latency_ms: 200, avg_token_efficiency: 0.85 },
      { name: "Amelia Healing Agent", role: "healing_agent", domain: "self_healing", status: "active", health_score: 98.0, max_task_capacity: 15, current_task_count: 0, avg_latency_ms: 150, avg_token_efficiency: 0.90 },
      { name: "Aegis Monitor", role: "infrastructure_monitor", domain: "infrastructure", status: "active", health_score: 97.0, max_task_capacity: 10, current_task_count: 0, avg_latency_ms: 100, avg_token_efficiency: 0.95 },
      { name: "Neural Mesh Coordinator", role: "mesh_coordinator", domain: "neural", status: "active", health_score: 96.0, max_task_capacity: 12, current_task_count: 0, avg_latency_ms: 180, avg_token_efficiency: 0.88 }
    ],

    seed_nodes: [
      { name: "Node-Alpha", type: "compute", status: "active", capacity: 100, task_count: 0, version: "1.1", is_orphan: false, last_active_at: new Date().toISOString() },
      { name: "Node-Beta", type: "compute", status: "active", capacity: 100, task_count: 0, version: "1.1", is_orphan: false, last_active_at: new Date().toISOString() },
      { name: "Node-Gamma", type: "storage", status: "active", capacity: 80, task_count: 0, version: "1.1", is_orphan: false, last_active_at: new Date().toISOString() },
      { name: "Node-Delta", type: "monitor", status: "active", capacity: 50, task_count: 0, version: "1.1", is_orphan: false, last_active_at: new Date().toISOString() }
    ],

    neural_nodes: [
      // Layer 1 - Input (8 nodes)
      { layer: 1, pattern_type: "heartbeat_monitor", weight: 0.8, learning_rate: 0.01, connections: ["pattern_match", "trend_detect"], activation_count: 0 },
      { layer: 1, pattern_type: "latency_monitor", weight: 0.75, learning_rate: 0.01, connections: ["pattern_match", "anomaly_classify"], activation_count: 0 },
      { layer: 1, pattern_type: "error_rate_monitor", weight: 0.85, learning_rate: 0.01, connections: ["anomaly_classify", "severity_eval"], activation_count: 0 },
      { layer: 1, pattern_type: "token_usage_monitor", weight: 0.7, learning_rate: 0.01, connections: ["trend_detect", "blast_radius"], activation_count: 0 },
      { layer: 1, pattern_type: "memory_monitor", weight: 0.8, learning_rate: 0.01, connections: ["pattern_match"], activation_count: 0 },
      { layer: 1, pattern_type: "cpu_monitor", weight: 0.85, learning_rate: 0.01, connections: ["trend_detect"], activation_count: 0 },
      { layer: 1, pattern_type: "pqc_status_monitor", weight: 0.9, learning_rate: 0.01, connections: ["quantum_threat", "anomaly_classify"], activation_count: 0 },
      { layer: 1, pattern_type: "anomaly_count_monitor", weight: 0.75, learning_rate: 0.01, connections: ["severity_eval"], activation_count: 0 },
      // Layer 2 - Hidden (8 nodes)
      { layer: 2, pattern_type: "pattern_match", weight: 0.85, learning_rate: 0.02, connections: ["isolation_strategy", "healing_selection"], activation_count: 0 },
      { layer: 2, pattern_type: "trend_detect", weight: 0.8, learning_rate: 0.02, connections: ["root_cause", "healing_selection"], activation_count: 0 },
      { layer: 2, pattern_type: "anomaly_classify", weight: 0.9, learning_rate: 0.02, connections: ["severity_eval", "playbook_match"], activation_count: 0 },
      { layer: 2, pattern_type: "severity_eval", weight: 0.85, learning_rate: 0.02, connections: ["escalation_eval", "isolation_strategy"], activation_count: 0 },
      { layer: 2, pattern_type: "root_cause", weight: 0.8, learning_rate: 0.02, connections: ["healing_selection"], activation_count: 0 },
      { layer: 2, pattern_type: "blast_radius", weight: 0.75, learning_rate: 0.02, connections: ["isolation_strategy", "cross_app_cascade"], activation_count: 0 },
      { layer: 2, pattern_type: "playbook_match", weight: 0.95, learning_rate: 0.02, connections: ["healing_selection", "verification_logic"], activation_count: 0 },
      { layer: 2, pattern_type: "confidence_score", weight: 0.85, learning_rate: 0.02, connections: ["escalation_eval"], activation_count: 0 },
      // Layer 3 - Deep (7 nodes)
      { layer: 3, pattern_type: "isolation_strategy", weight: 0.85, learning_rate: 0.04, connections: ["heal", "isolate"], activation_count: 0 },
      { layer: 3, pattern_type: "healing_selection", weight: 0.9, learning_rate: 0.04, connections: ["heal", "verification_logic"], activation_count: 0 },
      { layer: 3, pattern_type: "verification_logic", weight: 0.85, learning_rate: 0.04, connections: ["log", "healing_result"], activation_count: 0 },
      { layer: 3, pattern_type: "escalation_eval", weight: 0.8, learning_rate: 0.04, connections: ["escalate", "alert"], activation_count: 0 },
      { layer: 3, pattern_type: "quantum_threat", weight: 0.9, learning_rate: 0.04, connections: ["escalate", "alert"], activation_count: 0 },
      { layer: 3, pattern_type: "cross_app_cascade", weight: 0.75, learning_rate: 0.04, connections: ["escalate", "propose"], activation_count: 0 },
      { layer: 3, pattern_type: "learning_extract", weight: 0.8, learning_rate: 0.04, connections: ["propose", "pattern_update"], activation_count: 0 },
      // Layer 4 - Output (5 nodes)
      { layer: 4, pattern_type: "heal", weight: 0.9, learning_rate: 0.06, connections: ["healing_result"], activation_count: 0 },
      { layer: 4, pattern_type: "escalate", weight: 0.85, learning_rate: 0.06, connections: ["escalation_result"], activation_count: 0 },
      { layer: 4, pattern_type: "log", weight: 0.7, learning_rate: 0.06, connections: [], activation_count: 0 },
      { layer: 4, pattern_type: "alert", weight: 0.8, learning_rate: 0.06, connections: [], activation_count: 0 },
      { layer: 4, pattern_type: "propose", weight: 0.75, learning_rate: 0.06, connections: ["pattern_update"], activation_count: 0 },
      // Layer 5 - Terminal (4 nodes)
      { layer: 5, pattern_type: "healing_result", weight: 0.95, learning_rate: 0.08, connections: [], activation_count: 0 },
      { layer: 5, pattern_type: "escalation_result", weight: 0.9, learning_rate: 0.08, connections: [], activation_count: 0 },
      { layer: 5, pattern_type: "learning_extract_out", weight: 0.85, learning_rate: 0.08, connections: [], activation_count: 0 },
      { layer: 5, pattern_type: "pattern_update", weight: 0.8, learning_rate: 0.08, connections: [], activation_count: 0 }
    ],

    // Reference to master playbook library function
    playbook_source: "getMasterPlaybookLibrary",
    playbook_count: 200,

    skills: [
      { name: "heartbeat-check", description: "Run heartbeat scan on all agents and nodes" },
      { name: "full-system-sweep", description: "Full ecosystem sweep with anomaly detection and healing" },
      { name: "anomaly-response", description: "Detect-Isolate-Heal protocol for detected anomalies" },
      { name: "pattern-learning", description: "Extract patterns from healing events and update neural mesh" }
    ],

    rules: [
      "ALWAYS log every healing action as an AegisHealingEvent",
      "NEVER auto-heal critical-severity anomalies in fintech flows without human acknowledgment",
      "NEVER execute a playbook whose anomaly_type does not match the detected anomaly",
      "ALWAYS run heartbeat monitoring on schedule",
      "ALWAYS update Pattern and LearningMetric after every successful healing event",
      "NEVER expose PII or wallet addresses in healing logs",
      "ESCALATE when healing fails twice or critical anomaly has no matching playbook"
    ]
  };

  res.json(template);
}
