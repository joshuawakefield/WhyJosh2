// This file runs on the server and provides the context for the Gemini model.
// FIX: Corrected multiple syntax errors in the object literal below. 
// Several property keys had misplaced quotes (e.g., `key":` instead of `"key":`), which has been fixed.
export const contextPack = {
  identity: {
    name: "Joshua Wakefield",
    headline: "Hardware-to-Cloud Builder • High-EQ Support • WPI EE Roots",
    links: {
      linkedin: "https://linkedin.com/in/joshwakefield",
      github: "https://github.com/joshwakefield",
      "portfolio": "https://joshwakefield.com"
    }
  },
  profiles: {
    mbti: "ENTP",
    big5: {"O":0.9,"C":0.7,"E":0.6,"A":0.8,"N":0.3},
    "work_styles": ["first-principles troubleshooting","clear RCAs","runbooks","calm under pressure"]
  },
  skills: {
    proven: ["Wireshark","tcpdump","Linux CLI","sngrep","REST APIs","Python (requests/pandas)","Technical Writing","Root Cause Analysis"],
    working: ["Terraform","Kubernetes","Grafana","Prometheus","Docker"],
    adjacent: ["LLM prompting","n8n automations","WordPress REST","SQL"]
  },
  domains: ["Technical Support / SRE-adjacent","DSP/EE","Automation/LLM","Network Troubleshooting"],
  education: ["WPI—Electrical & Computer Engineering coursework"],
  goals_90d: ["reduce MTTR","raise first-time-fix rate","establish clean RCA cadence"],
  proof_ledger: [
    {
      id: "result-mttr-50",
      statement: "Cut MTTR >50% across ~30 models via triage playbooks and crisp RCAs.",
      metrics: {"mttr_delta":"-50%"},
      tags: ["support","rca","triage"],
      links: [{"label":"LinkedIn post","url":"https://linkedin.com/..."}]
    },
    {
      id: "proj-ocr-pipeline",
      statement: "Python OCR pipeline (Tesseract+pandas) to structure scanned directories; saved hundreds of hours.",
      tags: ["automation","python","ocr"],
      "links": [{"label":"GitHub repo","url":"https://github.com/..."}]
    },
    {
      id: "skill-network-debug",
      statement: "Diagnosed complex network/API issues with Wireshark/tcpdump/sngrep; traced faults from packets to logs.",
      tags: ["support","network","debug","wireshark"],
      links: []
    },
    {
      id: "style-calm-comms",
      statement: "Maintained calm, clear, empathetic comms with enterprise customers during incidents.",
      tags: ["support","communication"],
      links: []
    }
  ],
  examples: [
    {"jd_hint":"NOC/support","bullet_style":"Impact→Mechanism→Metric","tone":"confident-precise"},
    {"jd_hint":"SRE/DevOps","bullet_style":"Capability→Tool→Context","tone":"learning-oriented"}
  ],
  phrasing_rules: {
    optimism_prior: 65,
    "score_bounds": [55,96],
    "risk_rule": "Include 2–3 real, solvable risks with concrete mitigations. One should be a technical skill gap."
  }
};