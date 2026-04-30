/* ═══════════════════════════════════════════════════════════════
   SecureX — Dashboard Logic (Vanilla JS)
   Replaces React components with pure JavaScript rendering
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ─── Load scan data from sessionStorage ───
  const scanResult = JSON.parse(sessionStorage.getItem("scanResult"));
  const email = sessionStorage.getItem("scanEmail") || "";
  const passwordLength = parseInt(sessionStorage.getItem("passwordLength") || "0", 10);

  if (!scanResult) {
    window.location.href = "/";
    return;
  }

  // ─── SVG Icon Helpers ───
  const ICONS = {
    shield: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
    shieldAlert: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`,
    shieldCheck: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
    alertTriangle: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
    checkCircle: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    info: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    arrowRight: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    database: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
    lock: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    globe: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    calendar: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    brain: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/></svg>`,
    user: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    send: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
    zap: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    sparkles: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,
    award: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
    trendingUp: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    target: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    cpu: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
    keyRound: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>`,
    radar: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/></svg>`,
    eye: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    refreshCw: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
    copy: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    check: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    search: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    fingerprint: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4H14.26c-.16-1.49-.26-2.98-.26-4a2 2 0 0 0-2-2Z"/><path d="M14 22H10"/><path d="M5.65 8a8 8 0 1 1 12.7 0"/><path d="M12 2v2"/></svg>`,
    wifi: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>`,
    radio: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>`,
    activity: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    lightbulb: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    msgSquare: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    checkCircle2: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
    keyboard: `<svg width="SIZE" height="SIZE" viewBox="0 0 24 24" fill="none" stroke="COLOR" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" ry="2"/><path d="M6 8h.001"/><path d="M10 8h.001"/><path d="M14 8h.001"/><path d="M18 8h.001"/><path d="M8 12h.001"/><path d="M12 12h.001"/><path d="M16 12h.001"/><path d="M7 16h10"/></svg>`,
  };

  function icon(name, size, color) {
    size = size || 16;
    color = color || "currentColor";
    return (ICONS[name] || "").replace(/SIZE/g, size).replace(/COLOR/g, color);
  }

  // ─── Tab Navigation ───
  const navLinks = document.querySelectorAll(".dash-nav-link");
  const tabPanels = document.querySelectorAll(".tab-panel");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const tab = link.dataset.tab;
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      tabPanels.forEach((p) => {
        p.classList.remove("active");
        if (p.id === "tab-" + tab) p.classList.add("active");
      });
    });
  });

  // New Scan button
  document.getElementById("newScanBtn").addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "/";
  });

  // ─── Risk Colors ───
  function getRiskColor(level) {
    switch (level) {
      case "Critical": return { color: "#e11d48", glow: "rgba(225,29,72,0.6)" };
      case "High": return { color: "#f43f5e", glow: "rgba(244,63,94,0.4)" };
      case "Medium": return { color: "#f59e0b", glow: "rgba(245,158,11,0.4)" };
      default: return { color: "#7c3aed", glow: "rgba(124,58,237,0.4)" };
    }
  }

  // ═══════════════════════════════
  //  OVERVIEW TAB
  // ═══════════════════════════════

  const breachCount = scanResult.emailBreaches.length;
  const isClean = breachCount === 0 && scanResult.passwordPwnedCount === 0;

  // Status Banner
  const banner = document.getElementById("statusBanner");
  banner.className = `glass-card status-banner ${isClean ? "clean" : "threat"}`;
  banner.innerHTML = `
    <div class="status-left">
      ${isClean ? icon("checkCircle", 24, "#34d399") : icon("alertTriangle", 24, "#f87171")}
      <div>
        <h2 class="status-title">${isClean ? "No immediate threats detected" : `${breachCount} breach${breachCount !== 1 ? "es" : ""} found for ${email}`}</h2>
        <p class="status-subtitle">${isClean ? "Your email was not found in any known breach databases." : `Risk Level: ${scanResult.aiRiskLevel} — Score: ${scanResult.aiRiskScore}/100`}</p>
      </div>
    </div>
    ${breachCount > 0 ? `<button class="btn-ghost" onclick="document.querySelector('[data-tab=breaches]').click()" style="font-size:0.75rem; flex-shrink:0;">View Breaches ${icon("arrowRight", 14, "currentColor")}</button>` : ""}
  `;

  // Risk Meter
  (function renderRiskMeter() {
    const { color, glow } = getRiskColor(scanResult.aiRiskLevel);
    const score = scanResult.aiRiskScore;
    const radius = 80, stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    document.getElementById("riskMeterContainer").innerHTML = `
      <div class="risk-meter-svg-wrapper">
        <div class="risk-meter-aura" style="background-color:${color}"></div>
        <svg class="risk-meter-svg" height="${radius * 2}" width="${radius * 2}" style="--risk-glow:${glow}; transform: translate(-50%, -50%) rotate(-90deg) scale(1.8);">
          <circle class="track" stroke-width="${stroke}" r="${normalizedRadius}" cx="${radius}" cy="${radius}"/>
          <circle class="progress" stroke="${color}" stroke-width="${stroke}" stroke-dasharray="${circumference} ${circumference}" stroke-dashoffset="${circumference}" r="${normalizedRadius}" cx="${radius}" cy="${radius}" style="filter:drop-shadow(0 0 12px ${glow})"/>
        </svg>
        <div class="risk-meter-center">
          <div class="risk-score-row">
            <span class="risk-score-value">${score}</span>
            <span class="risk-score-percent">%</span>
          </div>
          <div class="risk-exposure-badge"><span>Risk Exposure</span></div>
        </div>
      </div>
      <div class="tactical-profile" style="width:100%;">
        <div class="tactical-label">Tactical Profile</div>
        <div class="tactical-row">
          <span class="tactical-level" style="color:${color}">${scanResult.aiRiskLevel}</span>
          <div class="tactical-icon-box">${icon("shieldAlert", 28, color)}</div>
        </div>
        <div class="protocol-grid">
          <div class="protocol-card">
            <span class="protocol-card-label">Protocol Link</span>
            <span class="protocol-card-value" style="color:var(--violet-400)">SYNCHRONIZED</span>
          </div>
          <div class="protocol-card">
            <span class="protocol-card-label">Exposure Cap</span>
            <span class="protocol-card-value" style="color:${score > 50 ? "var(--rose-400)" : "var(--violet-400)"}">${score > 50 ? "ABR-VEC" : "OPT-VEC"}</span>
          </div>
        </div>
      </div>
    `;

    // Animate the SVG circle
    setTimeout(() => {
      const circle = document.querySelector(".risk-meter-svg .progress");
      if (circle) circle.style.strokeDashoffset = strokeDashoffset;
    }, 100);
  })();

  // Security Score
  (function renderSecurityScore() {
    const safetyScore = Math.max(0, 100 - scanResult.aiRiskScore);
    let tier = "Baseline", color = "#f43f5e";
    if (safetyScore >= 90) { tier = "Sentinel"; color = "#7c3aed"; }
    else if (safetyScore >= 70) { tier = "Guardian"; color = "#3b82f6"; }
    else if (safetyScore >= 50) { tier = "Operational"; color = "#f59e0b"; }
    else if (safetyScore >= 25) { tier = "Vulnerable"; color = "#f97316"; }

    const tips = [];
    if (breachCount > 0) tips.push("Mitigate historical leak vectors");
    if (scanResult.passwordPwnedCount > 0) tips.push("Override compromised credentials");
    if (passwordLength < 12) tips.push("Increase character entropy depth");
    if (tips.length === 0) tips.push("Status: Zero immediate threats");

    document.getElementById("securityScoreContainer").innerHTML = `
      <div class="score-header">
        <div class="score-header-left">
          <div class="score-icon-box">${icon("award", 20, "var(--violet-400)")}</div>
          <span class="score-header-title">Resilience Metrics</span>
        </div>
        <div class="score-pulse" style="background:${color}; box-shadow:0 0 15px ${color}80"></div>
      </div>
      <div class="score-display">
        <span class="score-number">${safetyScore}</span>
        <div class="score-meta">
          <div class="index-label">Index Score</div>
          <div class="score-tier-badge">
            ${icon("shield", 14, color)}
            <span>${tier}</span>
          </div>
        </div>
      </div>
      <div class="score-bar">
        <div class="score-bar-fill" id="scoreBarFill"></div>
      </div>
      <div class="hardening-section">
        <div class="hardening-label">${icon("trendingUp", 16, "var(--violet-500)")} Strategic Hardening</div>
        ${tips.map((tip) => `
          <div class="hardening-tip">
            <span class="tip-icon">${icon("sparkles", 16, "currentColor")}</span>
            <span class="tip-text">${tip}</span>
            <span class="tip-zap">${icon("zap", 16, "currentColor")}</span>
          </div>
        `).join("")}
      </div>
    `;
    setTimeout(() => {
      const bar = document.getElementById("scoreBarFill");
      if (bar) bar.style.width = safetyScore + "%";
    }, 100);
  })();

  // Neural Threat Model
  (function renderNeuralThreat() {
    const isHighRisk = scanResult.aiRiskLevel === "High" || scanResult.aiRiskLevel === "Critical";
    const chain = [
      { label: "Initial Vectoring", detail: breachCount > 0 ? "Compromised Entity" : "OSINT Footprint Identified", icon: "target", color: "#00e1ff" },
      { label: "Neural Pivot", detail: scanResult.passwordPwnedCount > 0 ? "Cryptographic Match Found" : "Pattern Induction Sequence", icon: "cpu", color: "#3b82f6" },
      { label: "Predicted Incident", detail: isHighRisk ? "Unauthorized Access Imminent" : "Probabilistic Infiltration", icon: "shieldAlert", color: isHighRisk ? "#f43f5e" : "#f59e0b" },
    ];

    document.getElementById("neuralPanel").innerHTML = `
      <div class="neural-bg-icon">${icon("zap", 320, "currentColor")}</div>
      <div class="neural-header">
        <div class="neural-header-top">
          <div class="neural-icon-box">${icon("brain", 24, "#22d3ee")}</div>
          <h3 class="neural-title">Cognitive Vectoring</h3>
        </div>
        <p class="neural-subtitle">Predictive Attack Surface Modeling</p>
      </div>
      <div class="chain-container">
        <div class="chain-line"></div>
        ${chain.map((step, idx) => `
          <div class="chain-step">
            <div class="chain-icon-box">${icon(step.icon, 28, step.color)}</div>
            <div class="chain-detail">
              <div class="chain-detail-label">${step.label}</div>
              <div class="chain-detail-value" ${idx === 2 ? `style="color:${step.color}"` : ""}>${step.detail}</div>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="neural-output">
        <div class="neural-output-header">${icon("alertTriangle", 14, "currentColor")} <span style="font-style:italic">Neural Analytics Output</span></div>
        <p class="neural-output-text">"${scanResult.aiPredictiveThreat}"</p>
      </div>
    `;
  })();

  // Insights & Recommendations
  (function renderInsights() {
    document.getElementById("insightsGrid").innerHTML = `
      <div class="glass-card insights-card">
        <h3 class="insights-title">${icon("info", 16, "var(--indigo-400)")} AI Insights</h3>
        ${scanResult.aiInsights.map((ins) => `
          <div class="insight-item"><div class="insight-dot indigo"></div>${ins}</div>
        `).join("")}
      </div>
      <div class="glass-card insights-card">
        <h3 class="insights-title">${icon("shield", 16, "#34d399")} Recommendations</h3>
        ${scanResult.recommendations.map((rec) => `
          <div class="insight-item"><div class="insight-dot emerald"></div>${rec}</div>
        `).join("")}
      </div>
    `;
  })();

  // ═══════════════════════════════
  //  BREACHES TAB
  // ═══════════════════════════════
  (function renderBreaches() {
    const pwnedCount = scanResult.passwordPwnedCount;
    const breaches = scanResult.emailBreaches;
    const riskLevel = scanResult.aiRiskLevel;
    const riskColorClass = riskLevel === "Critical" ? "color:var(--red-400)" : riskLevel === "High" ? "color:var(--orange-400)" : riskLevel === "Medium" ? "color:var(--amber-400)" : "color:var(--emerald-400)";
    const riskIconColor = riskLevel === "Critical" || riskLevel === "High" ? "var(--red-400)" : "var(--amber-400)";

    let html = `
      <div class="page-header">
        <h1 class="page-title">Breach Report</h1>
        <p class="page-subtitle">Detailed breakdown of data exposures for <span class="highlight">${email}</span></p>
      </div>
      <div class="summary-grid">
        <div class="glass-card summary-card">
          <div class="summary-card-header">${icon("database", 18, "var(--indigo-400)")}<span class="summary-card-label">Breaches Found</span></div>
          <div class="summary-card-value">${breaches.length}</div>
        </div>
        <div class="glass-card summary-card">
          <div class="summary-card-header">${icon("lock", 18, "var(--red-400)")}<span class="summary-card-label">Password Exposures</span></div>
          <div class="summary-card-value">${pwnedCount > 0 ? pwnedCount.toLocaleString() : "None"}</div>
        </div>
        <div class="glass-card summary-card">
          <div class="summary-card-header">${icon("shieldAlert", 18, riskIconColor)}<span class="summary-card-label">Risk Level</span></div>
          <div class="summary-card-value" style="${riskColorClass}">${riskLevel}</div>
        </div>
      </div>
    `;

    if (pwnedCount > 0) {
      html += `
        <div class="glass-card password-warning">
          <div class="password-warning-inner">
            <div class="password-warning-icon">${icon("alertTriangle", 20, "var(--red-400)")}</div>
            <div>
              <h3>Password Compromised</h3>
              <p>Your password has appeared in <span class="count">${pwnedCount.toLocaleString()}</span> known data breaches. This password is actively circulating in hacker databases and should be changed immediately on all accounts where it is used.</p>
            </div>
          </div>
        </div>
      `;
    }

    html += `<div class="breach-section-title">Exposed Databases (${breaches.length})</div>`;

    if (breaches.length === 0) {
      html += `<div class="glass-card empty-state">${icon("shield", 40, "rgba(16,185,129,0.3)")}<p>No breaches found for this email.</p><p class="sub">Your email was not found in any known breach databases.</p></div>`;
    } else {
      breaches.forEach((breach) => {
        html += `
          <div class="glass-card breach-card">
            <div class="breach-card-header">
              <div class="breach-card-brand">
                <div class="breach-card-icon">${icon("globe", 20, "var(--red-400)")}</div>
                <div>
                  <div class="breach-card-name">${breach.Name}</div>
                  <div class="breach-card-domain">${breach.Domain}</div>
                </div>
              </div>
              <span class="badge badge-danger" style="font-size:9px">Verified</span>
            </div>
            <p class="breach-card-desc">${breach.Description}</p>
            <div class="breach-card-date">${icon("calendar", 12, "#4b5563")} ${breach.BreachDate}</div>
            <div class="data-classes">
              ${breach.DataClasses.map((dc) => {
                const isPw = dc.toLowerCase().includes("password");
                return `<span class="data-class ${isPw ? "password" : ""}">${isPw ? icon("lock", 8, "currentColor") : ""}${dc}</span>`;
              }).join("")}
            </div>
          </div>
        `;
      });
    }

    document.getElementById("breachesContent").innerHTML = html;
  })();

  // ═══════════════════════════════
  //  AI ANALYST TAB
  // ═══════════════════════════════
  (function renderAIChat() {
    // Badges
    const badgeClass = scanResult.aiRiskLevel === "High" || scanResult.aiRiskLevel === "Critical" ? "badge-danger" : scanResult.aiRiskLevel === "Medium" ? "badge-warning" : "badge-success";
    let badgesHtml = `<div class="badge ${badgeClass}">${icon("shield", 10, "currentColor")} ${scanResult.aiRiskLevel} Risk</div>`;
    if (breachCount > 0) badgesHtml += `<div class="badge badge-danger">${icon("database", 10, "currentColor")} ${breachCount} Breaches</div>`;
    document.getElementById("aiBadges").innerHTML = badgesHtml;

    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const chatSendBtn = document.getElementById("chatSendBtn");

    const welcome = `I've analyzed your security profile. Here's what I found:

**Risk Level:** ${scanResult.aiRiskLevel}
**Breaches:** ${scanResult.emailBreaches.length} databases
**Password Status:** ${scanResult.passwordPwnedCount > 0 ? `Compromised (${scanResult.passwordPwnedCount.toLocaleString()} exposures)` : "Not found in breach databases"}

${scanResult.aiRiskContext}

Ask me anything about your security posture, how to protect yourself, or what specific breaches mean for you.`;

    let messages = [{ role: "assistant", content: welcome }];
    let isTyping = false;

    function renderMessages() {
      let html = "";
      messages.forEach((msg) => {
        html += `
          <div class="chat-message ${msg.role}">
            <div class="chat-message-inner">
              <div class="chat-avatar ${msg.role}">${msg.role === "assistant" ? icon("brain", 14, "var(--indigo-400)") : icon("user", 14, "var(--text-muted)")}</div>
              <div class="chat-bubble ${msg.role}">${msg.content}</div>
            </div>
          </div>
        `;
      });

      if (isTyping) {
        html += `
          <div class="typing-indicator">
            <div class="chat-avatar assistant">${icon("brain", 14, "var(--indigo-400)")}</div>
            <div class="typing-dots">
              <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
              <span class="typing-text">Analyzing...</span>
            </div>
          </div>
        `;
      }

      if (messages.length <= 1 && !isTyping) {
        const prompts = [
          { icon: "shield", text: "How can I protect myself from these breaches?" },
          { icon: "alertTriangle", text: "What's the worst case scenario with my data?" },
          { icon: "zap", text: "Generate an action plan to secure my accounts" },
          { icon: "lightbulb", text: "Explain what data was exposed and why it matters" },
        ];
        html += `<div class="suggested-prompts">${prompts.map((p) => `
          <button class="glass-card suggested-prompt" data-prompt="${p.text}">
            ${icon(p.icon, 16, "currentColor")}
            <span>${p.text}</span>
          </button>
        `).join("")}</div>`;
      }

      chatMessages.innerHTML = html;
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Rebind suggestion clicks
      chatMessages.querySelectorAll(".suggested-prompt").forEach((btn) => {
        btn.addEventListener("click", () => sendMessage(btn.dataset.prompt));
      });
    }

    function sendMessage(text) {
      const msg = text || chatInput.value.trim();
      if (!msg || isTyping) return;

      messages.push({ role: "user", content: msg });
      chatInput.value = "";
      chatSendBtn.disabled = true;
      isTyping = true;
      renderMessages();

      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          scanContext: {
            riskLevel: scanResult.aiRiskLevel,
            breachCount: scanResult.emailBreaches.length,
            topBreach: scanResult.emailBreaches[0]?.Name,
            isPasswordPwned: scanResult.passwordPwnedCount > 0,
          },
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          messages.push({ role: "assistant", content: data.response });
          isTyping = false;
          renderMessages();
        })
        .catch(() => {
          messages.push({ role: "assistant", content: "I'm having trouble connecting. Please check if the backend server is running." });
          isTyping = false;
          renderMessages();
        });
    }

    chatInput.addEventListener("input", () => {
      chatSendBtn.disabled = !chatInput.value.trim();
    });
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });
    chatSendBtn.addEventListener("click", () => sendMessage());

    renderMessages();
  })();

  // ═══════════════════════════════
  //  TOOLS TAB
  // ═══════════════════════════════
  (function renderTools() {
    const tools = [
      { id: "generator", name: "Password Generator", icon: "keyRound", desc: "Generate cryptographically strong passwords" },
      { id: "checker", name: "Strength Checker", icon: "shieldCheck", desc: "Analyze password strength and entropy" },
      { id: "darkweb", name: "Dark Web Monitor", icon: "radar", desc: "View exposure on underground marketplaces" },
    ];

    let activeTool = "generator";
    const toolSwitcher = document.getElementById("toolSwitcher");
    const toolPanels = document.getElementById("toolPanels");

    function renderToolSwitcher() {
      toolSwitcher.innerHTML = tools.map((t) => `
        <button class="glass-card tool-switch-btn ${activeTool === t.id ? "active" : ""}" data-tool="${t.id}">
          <div class="tool-switch-header">
            <div class="tool-switch-icon">${icon(t.icon, 16, "currentColor")}</div>
            <span class="tool-switch-name">${t.name}</span>
          </div>
          <p class="tool-switch-desc">${t.desc}</p>
        </button>
      `).join("");

      toolSwitcher.querySelectorAll(".tool-switch-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeTool = btn.dataset.tool;
          renderToolSwitcher();
          renderToolPanel();
        });
      });
    }

    // ─── Password Generator State ───
    let pwLength = 16, pwUpper = true, pwNumbers = true, pwSymbols = true, pwLeet = false, pwWords = false, pwSeed = "", pwPassword = "", pwCopied = false;

    const CHARSETS = { lower: "abcdefghijklmnopqrstuvwxyz", upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ", numbers: "0123456789", symbols: "!@$%^&*_+-." };

    // AI-curated word list — strong, memorable, no offensive words
    const SMART_WORDS = [
      "Solar", "Tiger", "Haven", "Storm", "Blaze", "Coral", "Pixel", "Frost",
      "Cedar", "Ember", "Lunar", "Prism", "Ridge", "Spark", "Drift", "Noble",
      "Atlas", "Ivory", "Nexus", "Vapor", "Oasis", "Flint", "Heron", "Maple",
      "Arrow", "Delta", "Comet", "Eagle", "Flame", "Ghost", "Jewel", "Lotus",
      "Night", "Ocean", "Pearl", "Quartz", "Raven", "Stone", "Terra", "Ultra",
      "Vivid", "Winds", "Xenon", "Yacht", "Zephyr", "Agate", "Birch", "Crown",
      "Crane", "Cliff", "Dune", "Echo", "Focus", "Grace", "Hawk", "Iron",
      "Jade", "Knot", "Lake", "Mars", "Nova", "Orbit", "Peak", "Quest",
      "River", "Sage", "Thorn", "Unity", "Vault", "Wren", "Apex", "Bolt",
      "Crest", "Dawn", "Forge", "Glyph", "Helix", "Indie", "Kayak", "Lynx",
      "Mist", "Neon", "Onyx", "Plumb", "Reef", "Silk", "Titan", "Umbra",
      "Viper", "Wolf", "Zinc", "Astro", "Bliss", "Charm", "Dodge", "Epoch",
      "Fiber", "Grain", "Hover", "Inlet", "Jolly", "Kraft", "Lever", "Mocha",
      "Niche", "Optic", "Pulse", "Rapid", "Scout", "Tempo", "Unveil", "Vigor",
      "Wield", "Xerox", "Yield", "Zenith", "Amber", "Brisk", "Crisp", "Dusky"
    ];

    function pickRandomWords(count) {
      const arr = new Uint32Array(count);
      crypto.getRandomValues(arr);
      return Array.from(arr, (v) => SMART_WORDS[v % SMART_WORDS.length]);
    }

    function generatePassword() {
      // ── Word-based passphrase mode ──
      if (pwWords) {
        const separators = pwSymbols ? "!@$%^&*_+-." : "0123456789";
        const sepArr = new Uint32Array(4);
        crypto.getRandomValues(sepArr);

        // Pick 2-4 words depending on target length
        const wordCount = pwLength >= 24 ? 4 : pwLength >= 18 ? 3 : 2;
        const words = pickRandomWords(wordCount);

        // Optionally apply leet to words
        if (pwLeet) {
          const map = { a: "4", A: "4", e: "3", E: "3", i: "1", I: "1", o: "0", O: "0", s: "5", S: "5", t: "7", T: "7" };
          for (let i = 0; i < words.length; i++) {
            words[i] = words[i].split("").map((c) => map[c] || c).join("");
          }
        }

        // Build passphrase: Word + separator/number + Word...
        let passphrase = "";
        for (let i = 0; i < words.length; i++) {
          passphrase += words[i];
          if (i < words.length - 1) {
            if (pwNumbers) passphrase += (sepArr[i] % 90 + 10); // 2-digit number
            if (pwSymbols) passphrase += separators[sepArr[i] % separators.length];
          }
        }

        // Prepend seed if provided
        if (pwSeed) {
          passphrase = pwSeed + (pwSymbols ? separators[sepArr[0] % separators.length] : "") + passphrase;
        }

        // Trim or pad to target length
        if (passphrase.length > pwLength) {
          pwPassword = passphrase.substring(0, pwLength);
        } else if (passphrase.length < pwLength) {
          const pad = pwLength - passphrase.length;
          const padArr = new Uint32Array(pad);
          crypto.getRandomValues(padArr);
          let charset = CHARSETS.lower;
          if (pwUpper) charset += CHARSETS.upper;
          if (pwNumbers) charset += CHARSETS.numbers;
          if (pwSymbols) charset += CHARSETS.symbols;
          passphrase += Array.from(padArr, (v) => charset[v % charset.length]).join("");
          pwPassword = passphrase;
        } else {
          pwPassword = passphrase;
        }
        return;
      }

      // ── Classic random mode ──
      let charset = CHARSETS.lower;
      if (pwUpper) charset += CHARSETS.upper;
      if (pwNumbers) charset += CHARSETS.numbers;
      if (pwSymbols) charset += CHARSETS.symbols;

      let base = pwSeed;
      if (pwLeet && base) {
        const map = { a: "4", A: "4", e: "3", E: "3", i: "1", I: "1", o: "0", O: "0", s: "5", S: "5", t: "7", T: "7", g: "9", G: "9", b: "8", B: "8" };
        base = base.split("").map((c) => map[c] || c).join("");
      }

      const remaining = Math.max(0, pwLength - base.length);
      if (remaining === 0) { pwPassword = base.substring(0, pwLength); return; }

      const array = new Uint32Array(remaining);
      crypto.getRandomValues(array);
      const chars = Array.from(array, (v) => charset[v % charset.length]);
      const mid = Math.floor(chars.length / 2);
      pwPassword = chars.slice(0, mid).join("") + base + chars.slice(mid).join("");
    }

    function getStrengthInfo(pw) {
      let score = 0;
      if (pw.length >= 12) score += 25; else if (pw.length >= 8) score += 10;
      if (/[A-Z]/.test(pw)) score += 20;
      if (/[a-z]/.test(pw)) score += 15;
      if (/[0-9]/.test(pw)) score += 20;
      if (/[^A-Za-z0-9]/.test(pw)) score += 20;
      if (score >= 80) return { label: "Excellent", color: "#7c3aed", width: "100%", text: "NEURAL GRADE" };
      if (score >= 60) return { label: "Strong", color: "#3b82f6", width: "75%", text: "SECURE" };
      if (score >= 40) return { label: "Fair", color: "#fbbf24", width: "50%", text: "STRATEGIC" };
      return { label: "Weak", color: "#f43f5e", width: "25%", text: "VULNERABLE" };
    }

    // ─── Strength Checker State ───
    let testPassword = "";

    function analyzePassword(pw) {
      if (!pw) return null;
      const criteria = [
        { label: "8+ Char Entropy", met: pw.length >= 8 },
        { label: "12+ Char Entropy", met: pw.length >= 12 },
        { label: "Upper Register", met: /[A-Z]/.test(pw) },
        { label: "Lower Register", met: /[a-z]/.test(pw) },
        { label: "Numeric Sequence", met: /[0-9]/.test(pw) },
        { label: "High Entropy Symbols", met: /[^A-Za-z0-9]/.test(pw) },
      ];
      const metCount = criteria.filter((c) => c.met).length;
      const warnings = [];
      if (/^(123|password|qwerty|abc|letmein|admin)/i.test(pw)) warnings.push("Identified common dictionary pattern");
      if (/(.)(\1){2,}/.test(pw)) warnings.push("Redundant character repetition detected");
      if (/^[a-zA-Z]+$/.test(pw)) warnings.push("Alpha-only sequence identified");

      let score = 0, level = "Critical", color = "#f43f5e";
      if (metCount >= 6 && pw.length >= 14) { score = 100; level = "Vault-Grade"; color = "#7c3aed"; }
      else if (metCount >= 5) { score = 80; level = "Strong"; color = "#3b82f6"; }
      else if (metCount >= 3) { score = 55; level = "Solid"; color = "#6366f1"; }
      else if (metCount >= 2) { score = 30; level = "Standard"; color = "#f59e0b"; }
      else { score = 10; }

      let charsetSize = 0;
      if (/[a-z]/.test(pw)) charsetSize += 26;
      if (/[A-Z]/.test(pw)) charsetSize += 26;
      if (/[0-9]/.test(pw)) charsetSize += 10;
      if (/[^A-Za-z0-9]/.test(pw)) charsetSize += 32;
      const combos = Math.pow(charsetSize || 1, pw.length);
      const seconds = combos / 1e10;
      let crackTime = "Instantaneous";
      if (seconds > 31536000 * 1000) crackTime = "10,000+ Millennia";
      else if (seconds > 31536000 * 100) crackTime = "Multiple Centuries";
      else if (seconds > 31536000) crackTime = `~${Math.floor(seconds / 31536000)} Years`;
      else if (seconds > 86400) crackTime = `${Math.floor(seconds / 86400)} Days`;
      else if (seconds > 3600) crackTime = `${Math.floor(seconds / 3600)} Hours`;
      else if (seconds > 60) crackTime = `${Math.floor(seconds / 60)} Mins`;
      else if (seconds > 1) crackTime = `${Math.floor(seconds)} Secs`;

      return { criteria, warnings, score, level, color, crackTime };
    }

    function renderToolPanel() {
      if (activeTool === "generator") {
        generatePassword();
        const strength = getStrengthInfo(pwPassword);
        toolPanels.innerHTML = `
          <div class="glass-card" style="padding:1.5rem;">
            <div class="pwgen-header">
              <div class="pwgen-header-left">
                <div class="pwgen-icon-box">${icon("brain", 20, "var(--violet-400)")}</div>
                <div>
                  <h3 class="pwgen-title">Key Synthesis</h3>
                  <p class="pwgen-subtitle">AI Protocol Mapping</p>
                </div>
              </div>
            </div>
            <div class="pwgen-seed">
              <div class="pwgen-seed-label">${icon("keyboard", 14, "rgba(124,58,237,0.4)")} Root Passphrase</div>
              <input type="text" class="pwgen-seed-input" id="pwSeedInput" value="${pwSeed}" placeholder="Identity anchor...">
            </div>
            <div class="pwgen-output">
              <div class="pwgen-display" id="pwDisplay">${pwPassword}</div>
              <div class="pwgen-actions">
                <button class="pwgen-action-btn" id="pwCopyBtn" title="Copy">${pwCopied ? icon("check", 20, "#34d399") : icon("copy", 20, "currentColor")}</button>
                <button class="pwgen-action-btn" id="pwRegenBtn" title="Regenerate">${icon("refreshCw", 20, "currentColor")}</button>
              </div>
            </div>
            <div class="pwgen-strength">
              <div class="pwgen-strength-header">
                <span class="pwgen-strength-label">Entropy Index</span>
                <span class="pwgen-strength-level" style="color:${strength.color}">${strength.text}</span>
              </div>
              <div class="pwgen-strength-bar">
                <div class="pwgen-strength-fill" id="pwStrengthFill" style="background:${strength.color}; width:0%"></div>
              </div>
            </div>
            <div class="pwgen-controls">
              <div class="pwgen-length-control">
                <div class="pwgen-length-header">
                  <span class="pwgen-length-label">Protocol Depth</span>
                  <span class="pwgen-length-value" id="pwLengthValue">${pwLength}</span>
                </div>
                <input type="range" class="pwgen-range" id="pwLengthRange" min="12" max="64" value="${pwLength}">
              </div>
              <button class="pwgen-toggle ${pwWords ? "active" : ""}" data-opt="words">WORDS <div class="pwgen-toggle-dot"></div></button>
              <button class="pwgen-toggle ${pwUpper ? "active" : ""}" data-opt="upper">UPPER <div class="pwgen-toggle-dot"></div></button>
              <button class="pwgen-toggle ${pwNumbers ? "active" : ""}" data-opt="numbers">NUMS <div class="pwgen-toggle-dot"></div></button>
              <button class="pwgen-toggle ${pwSymbols ? "active" : ""}" data-opt="symbols">SYMB <div class="pwgen-toggle-dot"></div></button>
              <button class="pwgen-toggle ${pwLeet ? "active" : ""}" data-opt="leet">LEET <div class="pwgen-toggle-dot"></div></button>
            </div>
            <div class="pwgen-footer">
              <div style="display:flex; align-items:center; gap:1.25rem;">
                ${icon("shieldCheck", 20, "var(--violet-500)")} AES-V4 Synthesis Active
              </div>
            </div>
          </div>
        `;

        setTimeout(() => {
          const fill = document.getElementById("pwStrengthFill");
          if (fill) fill.style.width = strength.width;
        }, 50);

        // Event listeners
        document.getElementById("pwSeedInput").addEventListener("input", (e) => {
          pwSeed = e.target.value;
          const cursorPos = e.target.selectionStart;
          generatePassword();
          document.getElementById("pwDisplay").textContent = pwPassword;
          const s = getStrengthInfo(pwPassword);
          document.querySelector(".pwgen-strength-level").textContent = s.text;
          document.querySelector(".pwgen-strength-level").style.color = s.color;
          document.getElementById("pwStrengthFill").style.width = s.width;
          document.getElementById("pwStrengthFill").style.background = s.color;
          e.target.focus();
          e.target.setSelectionRange(cursorPos, cursorPos);
        });
        document.getElementById("pwLengthRange").addEventListener("input", (e) => {
          pwLength = parseInt(e.target.value);
          document.getElementById("pwLengthValue").textContent = pwLength;
          generatePassword();
          document.getElementById("pwDisplay").textContent = pwPassword;
          const s = getStrengthInfo(pwPassword);
          document.querySelector(".pwgen-strength-level").textContent = s.text;
          document.querySelector(".pwgen-strength-level").style.color = s.color;
          document.getElementById("pwStrengthFill").style.width = s.width;
          document.getElementById("pwStrengthFill").style.background = s.color;
        });
        document.getElementById("pwCopyBtn").addEventListener("click", () => {
          navigator.clipboard.writeText(pwPassword);
          pwCopied = true;
          document.getElementById("pwCopyBtn").innerHTML = icon("check", 20, "#34d399");
          setTimeout(() => { pwCopied = false; document.getElementById("pwCopyBtn").innerHTML = icon("copy", 20, "currentColor"); }, 2000);
        });
        document.getElementById("pwRegenBtn").addEventListener("click", () => {
          generatePassword();
          document.getElementById("pwDisplay").textContent = pwPassword;
          const s = getStrengthInfo(pwPassword);
          document.querySelector(".pwgen-strength-level").textContent = s.text;
          document.querySelector(".pwgen-strength-level").style.color = s.color;
          document.getElementById("pwStrengthFill").style.width = s.width;
          document.getElementById("pwStrengthFill").style.background = s.color;
        });
        document.querySelectorAll(".pwgen-toggle").forEach((btn) => {
          btn.addEventListener("click", () => {
            const opt = btn.dataset.opt;
            if (opt === "words") pwWords = !pwWords;
            if (opt === "upper") pwUpper = !pwUpper;
            if (opt === "numbers") pwNumbers = !pwNumbers;
            if (opt === "symbols") pwSymbols = !pwSymbols;
            if (opt === "leet") pwLeet = !pwLeet;
            renderToolPanel();
          });
        });

      } else if (activeTool === "checker") {
        const analysis = analyzePassword(testPassword);
        toolPanels.innerHTML = `
          <div class="glass-card" style="padding:1.5rem;">
            <div class="strength-input-group">
              <label class="strength-input-label">Enter a password to analyze</label>
              <div class="strength-input-wrapper">
                <div class="strength-input-icon">${icon("lock", 16, "var(--text-dim)")}</div>
                <input type="text" class="strength-input" id="strengthInput" value="${testPassword}" placeholder="Type a password to check its strength...">
              </div>
            </div>
            <div id="strengthResult">
              ${testPassword ? renderStrengthResult(analysis) : `
                <div class="strength-empty">
                  ${icon("eye", 32, "currentColor")}
                  <p>Enter a password above to see a detailed strength analysis.</p>
                  <p class="sub">We check length, complexity, entropy, and common patterns.</p>
                </div>
              `}
            </div>
          </div>
        `;

        document.getElementById("strengthInput").addEventListener("input", (e) => {
          testPassword = e.target.value;
          const a = analyzePassword(testPassword);
          document.getElementById("strengthResult").innerHTML = testPassword ? renderStrengthResult(a) : `<div class="strength-empty">${icon("eye", 32, "currentColor")}<p>Enter a password above to see a detailed strength analysis.</p><p class="sub">We check length, complexity, entropy, and common patterns.</p></div>`;
          // Animate bar
          setTimeout(() => {
            const bar = document.querySelector(".strength-bar-fill");
            if (bar && a) bar.style.width = a.score + "%";
          }, 50);
        });

        setTimeout(() => {
          const bar = document.querySelector(".strength-bar-fill");
          if (bar && analysis) bar.style.width = analysis.score + "%";
        }, 50);

      } else if (activeTool === "darkweb") {
        renderDarkWebPanel();
      }
    }

    function renderStrengthResult(a) {
      if (!a) return "";
      return `
        <div class="strength-result">
          <div class="strength-header">
            <div class="strength-header-left">
              <div class="strength-icon-box">${icon("lock", 14, "var(--violet-400)")}</div>
              <span class="strength-label">Protocol Hardening</span>
            </div>
            <span class="strength-level" style="color:${a.color}">${a.level}</span>
          </div>
          <div class="strength-bar">
            <div class="strength-bar-fill" style="background:${a.color}; width:0%"></div>
          </div>
          <div class="crack-time-row">
            <div class="crack-time-left">
              ${icon("zap", 14, "rgba(124,58,237,0.5)")}
              <span class="crack-time-label">Resistance Window:</span>
            </div>
            <span class="crack-time-value">${a.crackTime}</span>
          </div>
          <div class="criteria-grid">
            ${a.criteria.map((c) => `
              <div class="criteria-item ${c.met ? "met" : ""}">
                ${c.met ? icon("checkCircle2", 16, "var(--violet-400)") : '<div class="uncheck"></div>'}
                <span>${c.label}</span>
              </div>
            `).join("")}
          </div>
          ${a.warnings.length > 0 ? `
            <div class="strength-warnings">
              ${a.warnings.map((w) => `
                <div class="strength-warning">${icon("shieldAlert", 16, "currentColor")}<span>${w}</span></div>
              `).join("")}
            </div>
          ` : ""}
        </div>
      `;
    }

    function renderDarkWebPanel() {
      const breaches = scanResult.emailBreaches;
      const pwnedCount = scanResult.passwordPwnedCount;
      const maskedEmail = email ? email[0] + "***" + email.substring(email.indexOf("@") - 1) : "entity@aegis.node";
      const pasteEntries = breaches.map((b, i) => ({
        source: `VEC-DUMP-${b.Name.replace(/\s+/g, "-").toUpperCase()}`,
        marketplace: ["Shadow Ops Node", "Encrypted Intel Hub", "Sovereign Market", "P2P Mesh"][i % 4],
        valuation: ["Public Release", "Premium Asset", "Restricted Node", "V-Grade Bundle"][i % 4],
        exposure: ["700M+", "137M+", "153M+"][i % 3],
        date: b.BreachDate,
      }));

      let entriesHtml = "";
      if (pasteEntries.length > 0) {
        entriesHtml = pasteEntries.map((entry, idx) => `
          <div class="darkweb-entry">
            <div class="darkweb-entry-header">
              <div class="darkweb-entry-brand">
                <div class="darkweb-entry-icon">${icon("database", 20, "currentColor")}</div>
                <div>
                  <div class="darkweb-entry-name">${entry.source}</div>
                  <div class="darkweb-entry-date">${entry.date}</div>
                </div>
              </div>
            </div>
            <div class="darkweb-entry-meta">
              <div><div class="darkweb-meta-label">Protocol</div><div class="darkweb-meta-value" style="color:var(--text-muted)">${entry.marketplace}</div></div>
              <div><div class="darkweb-meta-label">Valuation</div><div class="darkweb-meta-value" style="color:var(--violet-400)">${entry.valuation}</div></div>
              <div><div class="darkweb-meta-label">Load Volume</div><div class="darkweb-meta-value" style="color:white">${entry.exposure}</div></div>
            </div>
            <div class="darkweb-entry-tags">
              ${(breaches[idx]?.DataClasses || []).slice(0, 4).map((dc) => `<span class="darkweb-tag">${dc}</span>`).join("")}
            </div>
          </div>
        `).join("");
      } else {
        entriesHtml = `<div class="darkweb-empty">${icon("globe", 64, "currentColor")}<p>Sovereign Node: Zero Exposure Matching Active Signal.</p></div>`;
      }

      let pwnAlert = "";
      if (pwnedCount > 0) {
        pwnAlert = `
          <div class="darkweb-pwn-alert">
            <div class="darkweb-pwn-inner">
              <div class="darkweb-pwn-icon">${icon("shieldAlert", 28, "var(--rose-500)")}</div>
              <div>
                <p class="darkweb-pwn-title">CRITICAL PWN MATCH</p>
                <p class="darkweb-pwn-text">Identity vector identified in ${pwnedCount.toLocaleString()} distributions.</p>
              </div>
            </div>
          </div>
        `;
      }

      toolPanels.innerHTML = `
        <div class="glass-card" style="overflow:hidden;">
          <div class="darkweb-container">
            <div class="darkweb-header">
              <div class="darkweb-header-left">
                <div class="darkweb-pulse"></div>
                <span class="darkweb-label">Dark-Net Recon Feed</span>
              </div>
              <div class="darkweb-status">${icon("wifi", 14, "var(--rose-500)")}<span>Active Search</span></div>
            </div>
            <div class="darkweb-content custom-scrollbar">
              <div class="darkweb-search">
                <div class="darkweb-search-icon">${icon("search", 24, "var(--violet-400)")}</div>
                <div>
                  <p class="darkweb-target-label">Target Identity</p>
                  <p class="darkweb-target-email">${maskedEmail}</p>
                </div>
              </div>
              <div class="darkweb-vectors-header">
                ${icon("fingerprint", 20, "#4b5563")}
                <span class="darkweb-vectors-label">Exfiltrated Vectors</span>
              </div>
              ${entriesHtml}
              ${pwnAlert}
            </div>
            <div class="darkweb-footer">
              <span>Feed Status: Nominal</span>
              <div class="darkweb-footer-dots"><div class="darkweb-footer-dot"></div><div class="darkweb-footer-dot"></div><div class="darkweb-footer-dot"></div></div>
            </div>
          </div>
        </div>
      `;
    }

    renderToolSwitcher();
    renderToolPanel();
  })();

})();
