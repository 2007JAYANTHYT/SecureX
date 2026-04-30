/* ═══════════════════════════════════════════════════════════════
   SecureX — Landing Page Logic (Vanilla JS)
   Replaces React + Framer Motion with pure JavaScript
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ─── DOM Elements ───
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const emailContainer = document.getElementById("emailContainer");
  const passwordContainer = document.getElementById("passwordContainer");
  const scanBtn = document.getElementById("scanBtn");
  const ctaWrapper = document.getElementById("ctaWrapper");
  const ctaContent = document.getElementById("ctaContent");
  const scanError = document.getElementById("scanError");
  const scanErrorText = document.getElementById("scanErrorText");
  const scanModeDot = document.getElementById("scanModeDot");
  const scanModeValue = document.getElementById("scanModeValue");
  const scanModal = document.getElementById("scanModal");
  const modalSteps = document.getElementById("modalSteps");
  const modalProgressBar = document.getElementById("modalProgressBar");
  const modalScanMode = document.getElementById("modalScanMode");
  const modalActiveLabel = document.getElementById("modalActiveLabel");
  const hashDetailsEl = document.getElementById("hashDetails");
  const hashPrefixEl = document.getElementById("hashPrefix");
  const hashSuffixEl = document.getElementById("hashSuffix");

  let isScanning = false;

  // ─── Floating Particles ───
  function createParticles() {
    const container = document.getElementById("particles");
    const colors = ["#818cf8", "#22d3ee", "#a78bfa"];
    const shadows = ["rgba(129,140,248,0.3)", "rgba(34,211,238,0.3)"];

    for (let i = 0; i < 25; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 2.5 + 1.5;
      const x = Math.random() * 100;
      const dur = Math.random() * 10 + 8;
      const delay = Math.random() * 8;
      const color = colors[i % 3];
      const shadow = shadows[i % 2];

      p.style.cssText = `
        left: ${x}%;
        bottom: -10px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        box-shadow: 0 0 ${Math.random() * 4 + 2}px ${shadow};
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  // ─── Input Focus Handling ───
  function setupInput(input, container) {
    input.addEventListener("focus", () => {
      container.classList.add("focused");
      updateMode();
    });
    input.addEventListener("blur", () => {
      container.classList.remove("focused");
    });
    input.addEventListener("input", () => {
      if (input.value) {
        container.classList.add("has-value");
      } else {
        container.classList.remove("has-value");
      }
      updateMode();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") startScan();
    });
  }
  setupInput(emailInput, emailContainer);
  setupInput(passwordInput, passwordContainer);

  // ─── Scan Mode Indicator ───
  function updateMode() {
    const hasEmail = emailInput.value.trim().length > 0;
    const hasPassword = passwordInput.value.trim().length > 0;

    if (hasEmail && hasPassword) {
      scanModeValue.textContent = "Email + Password";
      scanModeValue.classList.add("active");
      scanModeDot.classList.add("active");
    } else if (hasEmail) {
      scanModeValue.textContent = "Email Only";
      scanModeValue.classList.add("active");
      scanModeDot.classList.add("active");
    } else if (hasPassword) {
      scanModeValue.textContent = "Password Only";
      scanModeValue.classList.add("active");
      scanModeDot.classList.add("active");
    } else {
      scanModeValue.textContent = "Enter data below";
      scanModeValue.classList.remove("active");
      scanModeDot.classList.remove("active");
    }

    const canScan = hasEmail || hasPassword;
    scanBtn.disabled = !canScan || isScanning;
    if (canScan && !isScanning) {
      ctaWrapper.classList.add("ready");
    } else {
      ctaWrapper.classList.remove("ready");
    }
  }

  // ─── SHA-1 Hashing ───
  async function hashPassword(pwd) {
    const data = new TextEncoder().encode(pwd);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
    return { prefix: hex.substring(0, 5), suffix: hex.substring(5) };
  }

  // ─── Password Complexity ───
  function getComplexity(pwd) {
    return {
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumbers: /[0-9]/.test(pwd),
      hasSpecial: /[^A-Za-z0-9]/.test(pwd),
    };
  }

  // ─── Modal Step Rendering ───
  const STEP_ICONS = {
    done: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    active: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-400)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="active-spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
    skipped: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4b5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    pending: `<div class="dot"></div>`,
  };

  function renderSteps(steps) {
    modalSteps.innerHTML = "";
    const nonSkipped = steps.filter((s) => s.status !== "skipped");
    const doneCount = steps.filter((s) => s.status === "done").length;
    const progress = nonSkipped.length > 0 ? (doneCount / nonSkipped.length) * 100 : 0;
    modalProgressBar.style.width = progress + "%";

    const activeStep = steps.find((s) => s.status === "active");
    modalActiveLabel.textContent = activeStep ? activeStep.label + "..." : "Finalizing...";

    steps.forEach((step) => {
      const div = document.createElement("div");
      div.className = `modal-step ${step.status}`;
      div.innerHTML = `
        <div class="step-icon">${STEP_ICONS[step.status]}</div>
        <div style="flex:1; min-width:0;">
          <p class="step-label">${step.label}</p>
          <p class="step-detail">${step.detail}</p>
        </div>
      `;
      modalSteps.appendChild(div);
    });
  }

  // ─── Delay Helper ───
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  // ─── Start Scan ───
  async function startScan() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email && !password) {
      showError("Enter an email, a password, or both to scan");
      return;
    }
    hideError();

    const hasEmail = email.length > 0;
    const hasPassword = password.length > 0;
    const mode = hasEmail && hasPassword ? "Email + Password Scan" : hasEmail ? "Email-Only Scan" : "Password-Only Scan";

    modalScanMode.textContent = mode;
    isScanning = true;
    scanBtn.disabled = true;
    ctaWrapper.classList.remove("ready");

    // Update button to scanning state
    ctaContent.innerHTML = `
      <span class="spinner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" x2="17" y1="12" y2="12"/></svg>
      </span>
      Scanning...
    `;
    scanBtn.classList.add("scanning");

    // Build steps
    let steps = [
      { id: "init", label: "Initializing scan engine", detail: "Preparing secure connection...", status: "pending" },
      { id: "email", label: "Querying breach databases", detail: hasEmail ? `Scanning ${email}` : "No email provided", status: hasEmail ? "pending" : "skipped" },
      { id: "hash", label: "Hashing password (SHA-1)", detail: hasPassword ? "Computing k-anonymity hash..." : "No password provided", status: hasPassword ? "pending" : "skipped" },
      { id: "hibp", label: "Checking HIBP database", detail: hasPassword ? "Matching against 15B+ records" : "Skipped — no password", status: hasPassword ? "pending" : "skipped" },
      { id: "ai", label: "Running AI risk analysis", detail: "Calculating threat profile...", status: "pending" },
    ];

    hashDetailsEl.style.display = "none";
    renderSteps(steps);
    scanModal.classList.add("active");

    try {
      // Step 1: Init
      await delay(600);
      updateStep(steps, "init", "active", "Establishing secure tunnel...");
      renderSteps(steps);
      await delay(800);
      updateStep(steps, "init", "done", "Engine ready");
      renderSteps(steps);

      // Step 2: Email
      if (hasEmail) {
        updateStep(steps, "email", "active", `Querying XposedOrNot for ${email}`);
        renderSteps(steps);
        await delay(500);
      }

      // Step 3: Hash password
      let prefix = "", suffix = "";
      const comp = getComplexity(password);
      if (hasPassword) {
        updateStep(steps, "hash", "active", "Computing SHA-1 digest...");
        renderSteps(steps);
        await delay(600);
        const h = await hashPassword(password);
        prefix = h.prefix;
        suffix = h.suffix;
        hashPrefixEl.textContent = prefix;
        hashSuffixEl.textContent = suffix.substring(0, 8) + "...";
        hashDetailsEl.style.display = "block";
        updateStep(steps, "hash", "done", `Hash: ${prefix}•••••`);
        renderSteps(steps);
      }

      // Step 4: HIBP
      if (hasPassword) {
        updateStep(steps, "hibp", "active", `Sending prefix ${prefix} to HIBP API...`);
        renderSteps(steps);
        await delay(400);
      }

      // Perform actual scan
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          hashPrefix: prefix,
          hashSuffix: suffix,
          rawPasswordLength: password.length,
          ...comp,
        }),
      });

      if (!response.ok) throw new Error("Backend scan failed");
      const result = await response.json();

      // Mark email done
      if (hasEmail) {
        updateStep(steps, "email", "done", `Found ${result.emailBreaches.length} breach${result.emailBreaches.length !== 1 ? "es" : ""}`);
        renderSteps(steps);
      }

      // Mark HIBP done
      if (hasPassword) {
        updateStep(steps, "hibp", "done",
          result.passwordPwnedCount > 0
            ? `Compromised — ${result.passwordPwnedCount.toLocaleString()} exposures`
            : "Password not found in breaches ✓"
        );
        renderSteps(steps);
      }

      await delay(400);

      // Step 5: AI
      updateStep(steps, "ai", "active", "Neural risk engine processing...");
      renderSteps(steps);
      await delay(800);
      updateStep(steps, "ai", "done", `Risk: ${result.aiRiskLevel} (${result.aiRiskScore}/100)`);
      renderSteps(steps);

      await delay(600);

      // Store result and navigate to dashboard
      sessionStorage.setItem("scanResult", JSON.stringify(result));
      sessionStorage.setItem("scanEmail", email);
      sessionStorage.setItem("passwordLength", password.length.toString());
      window.location.href = "/dashboard";

    } catch (e) {
      console.error(e);
      showError("Scan failed. Ensure the backend server is running.");
      scanModal.classList.remove("active");
      isScanning = false;
      resetButton();
    }
  }

  function updateStep(steps, id, status, detail) {
    const step = steps.find((s) => s.id === id);
    if (step) {
      step.status = status;
      if (detail) step.detail = detail;
    }
  }

  function showError(msg) {
    scanErrorText.textContent = msg;
    scanError.style.display = "flex";
  }

  function hideError() {
    scanError.style.display = "none";
  }

  function resetButton() {
    scanBtn.classList.remove("scanning");
    ctaContent.innerHTML = `
      Initiate Security Scan
      <span class="arrow-bounce">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </span>
    `;
    updateMode();
  }

  // ─── Button Click ───
  scanBtn.addEventListener("click", startScan);
})();
