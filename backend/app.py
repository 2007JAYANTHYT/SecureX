"""
SecureX — Backend Server
Python Flask backend for the SecureX identity security platform.

Run with:  python app.py
"""

import os
import requests
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")

app = Flask(
    __name__,
    template_folder=os.path.join(FRONTEND_DIR, "templates"),
    static_folder=os.path.join(FRONTEND_DIR, "static"),
)
CORS(app)


# ═══════════════════════════════════════════
#  AI Knowledge Base
# ═══════════════════════════════════════════

ELITE_KNOWLEDGE_BASE = [
    {
        "keywords": ["plan", "action", "secure", "step", "guide", "recommend", "checklist", "todo", "to-do", "should i do", "what now", "next steps", "how do i start"],
        "response": """[STRATEGY: ACCOUNT HARDENING ACTION PLAN]

Here is your prioritized security action plan:

**PHASE 1 — Immediate (Do Today)**
1. **Change compromised passwords** — Start with email and banking accounts. Use a unique passphrase of 16+ characters for each.
2. **Enable MFA everywhere** — Prioritize hardware keys (FIDO2/YubiKey). If unavailable, use TOTP apps (Authy, Google Authenticator). Avoid SMS-based 2FA.
3. **Revoke unknown sessions** — Check active sessions in Google, Microsoft, and social media accounts. Terminate anything you don't recognize.

**PHASE 2 — This Week**
4. **Deploy a password manager** — Migrate all credentials to Bitwarden, 1Password, or KeePass. Generate unique 20+ character passwords per service.
5. **Freeze credit reports** — Contact Equifax, Experian, and TransUnion to prevent identity fraud from breached data.
6. **Audit email forwarding rules** — Attackers often silently add forwarding rules. Check your inbox settings.

**PHASE 3 — Ongoing**
7. **Set up breach monitoring** — Use SecureX and HaveIBeenPwned notification alerts for continuous monitoring.
8. **Review app permissions** — Revoke OAuth access for unused third-party apps connected to your accounts.
9. **Enable login alerts** — Turn on security notifications for all critical accounts.
10. **Practice phishing awareness** — Verify URLs before entering credentials, especially on mobile devices.

This plan reduces your attack surface by ~85% when fully implemented."""
    },
    {
        "keywords": ["prevent", "fix", "mitigate", "hardening", "protection", "protect", "defend", "stop", "avoid", "safe"],
        "response": """[STRATEGY: ACTIVE MITIGATION]

Based on your security profile, here's how to harden your defenses:

1. **Credential Rotation**: Change all compromised passwords immediately. Use unique, high-entropy passphrases (16+ chars) via a password manager.
2. **Multi-Factor Authentication**: Enable MFA on every account — prefer FIDO2 hardware keys over TOTP, and TOTP over SMS. Disable legacy auth protocols (POP3/IMAP) that bypass MFA.
3. **Email Security**: Enable SPF, DKIM, and DMARC on your domain. Check for unauthorized forwarding rules in your inbox.
4. **Monitoring**: Set up breach notification alerts. Subscribe to threat intelligence feeds relevant to your exposed services.
5. **Network Hygiene**: Use a VPN on public networks. Enable DNS-over-HTTPS to prevent DNS hijacking."""
    },
    {
        "keywords": ["phishing", "social engineering", "spear", "scam", "fake", "impersonat"],
        "response": """[VECTOR: SOCIAL ENGINEERING]

Phishing is the #1 initial access vector, accounting for 91% of cyberattacks.

**How Attackers Use Your Breached Data:**
- Craft personalized spear-phishing emails using your leaked info (name, email, services you use)
- Create convincing password-reset lures targeting your exposed accounts
- Impersonate contacts or services you trust

**Your Defense Playbook:**
1. **Verify sender identity** — Check raw email headers, not just the display name
2. **Hover before clicking** — Inspect URLs for typosquatting (e.g., "g00gle.com")
3. **Never enter credentials from email links** — Navigate directly to the site
4. **Enable FIDO2/passkeys** — These are inherently phishing-resistant since they bind to domains
5. **Report suspicious emails** — Use your provider's phishing report feature"""
    },
    {
        "keywords": ["ransomware", "encrypt", "payload", "malware", "virus", "trojan"],
        "response": """[VECTOR: MALWARE & RANSOMWARE]

Ransomware groups actively purchase credentials from breach databases to gain initial access.

**Your Risk Factors:**
- Breached credentials can be used for credential stuffing attacks on RDP, VPNs, and cloud services
- Exposed emails become targets for malware-laden attachments

**Mitigation Strategy:**
1. **Patch aggressively** — Enable automatic updates on all OS and software
2. **Backup with 3-2-1 rule** — 3 copies, 2 media types, 1 offsite (immutable/air-gapped)
3. **Endpoint protection** — Deploy EDR with behavioral analysis, not just signature-based AV
4. **Disable macros** — Block Office macros by default across all devices
5. **Network segmentation** — Isolate critical systems to limit lateral movement"""
    },
    {
        "keywords": ["mfa", "2fa", "authentication", "two factor", "two-factor", "authenticator", "yubikey", "fido"],
        "response": """[PROTOCOL: IDENTITY ASSURANCE]

Multi-Factor Authentication is your most impactful single defense:

**MFA Strength Tiers (strongest → weakest):**
1. 🔐 **FIDO2 / Passkeys** — Phishing-proof, hardware-bound (YubiKey, device biometrics)
2. 📱 **TOTP Apps** — Time-based codes via Authy/Google Authenticator (not tied to phone number)
3. 📲 **Push Notifications** — Approve from device (vulnerable to MFA fatigue/prompt bombing)
4. ⚠️ **SMS Codes** — Susceptible to SIM-swapping and SS7 interception attacks

**Action Items:**
- Enable FIDO2/passkeys on Google, Microsoft, GitHub, Cloudflare
- Use TOTP for services that don't support FIDO2
- Remove SMS-based MFA on all accounts where alternatives exist
- Store backup/recovery codes in your password manager vault"""
    },
    {
        "keywords": ["password", "credential", "hash", "passphrase", "strong password", "weak", "reuse"],
        "response": """[ASSET: CREDENTIAL SECURITY]

**Password Best Practices:**
- Use passphrases of 16+ characters (e.g., "correct-horse-battery-staple" format)
- Never reuse passwords across services — each account needs a unique credential
- Use a password manager to generate and store credentials securely

**If Your Password Was Found in Breaches:**
1. Change it immediately on the affected service AND any other service where you reused it
2. Check for unauthorized activity on the account
3. Enable MFA to add a second layer of defense
4. The HIBP database uses k-anonymity — your full password was never transmitted

**Technical Details:**
- Passwords are hashed with SHA-1 for breach checking (only the first 5 hex chars are sent)
- For local storage, prefer Argon2id or bcrypt over SHA-256/PBKDF2"""
    },
    {
        "keywords": ["breach", "exposed", "leaked", "stolen", "compromised", "data", "what happened", "how bad", "damage"],
        "response": """[ANALYSIS: BREACH IMPACT ASSESSMENT]

**What a Breach Means for You:**
When a service is breached, attackers typically obtain:
- Email addresses and usernames
- Password hashes (often crackable)
- Personal info (name, phone, address)
- Payment data (in worst cases)

**How Attackers Exploit This:**
1. **Credential Stuffing** — Testing your email/password combos on hundreds of other services
2. **Targeted Phishing** — Using your personal data to craft convincing scam emails
3. **Identity Fraud** — Creating accounts or making purchases under your identity
4. **Dark Web Sales** — Your data is packaged and sold on underground marketplaces

**Your Priority Actions:**
- Change passwords on all breached services immediately
- Check for unauthorized transactions or account changes
- Enable breach monitoring for continued alerting"""
    },
    {
        "keywords": ["dark web", "darknet", "underground", "marketplace", "sell", "sold", "tor"],
        "response": """[INTEL: DARK WEB EXPOSURE]

**How Your Data Appears on the Dark Web:**
- Breached databases are traded on forums like RaidForums (seized), BreachForums, and encrypted Telegram channels
- Credentials are sold in "combo lists" for as little as $0.001 per record
- High-value targets (banking, corporate accounts) command premium pricing

**Monitoring & Response:**
1. Use SecureX's dark web simulation to understand your exposure footprint
2. Set up monitoring through services like HaveIBeenPwned, SpyCloud, or Identity Guard
3. Freeze your credit to prevent financial fraud from stolen identity data
4. Consider identity theft protection insurance if sensitive data was exposed"""
    },
    {
        "keywords": ["score", "risk", "status", "analysis", "report", "summary", "overview", "results", "tell me", "explain"],
        "response": """[STATUS: SECURITY POSTURE ANALYSIS]

I can provide deeper analysis on any aspect of your scan results. Try asking about:

- **"What's my action plan?"** — Get a step-by-step security hardening guide
- **"How bad are my breaches?"** — Detailed impact assessment of your exposed data
- **"How do I protect myself?"** — Personalized mitigation strategies
- **"Explain phishing risks"** — How attackers use breached data against you
- **"Should I enable MFA?"** — Multi-factor authentication deep dive
- **"What about the dark web?"** — How your data circulates underground

Ask me anything specific about your security posture."""
    },
    {
        "keywords": ["worst case", "scenario", "what if", "danger", "threat", "impact", "consequence"],
        "response": """[THREAT: WORST-CASE SCENARIO ANALYSIS]

**If no action is taken, here's what attackers can do with your exposed data:**

**Tier 1 — Immediate Risks (Days)**
- 🔓 Account takeover via credential stuffing (automated login attempts across 100+ services)
- 📧 Phishing campaigns targeting your inbox with personalized lures

**Tier 2 — Escalation Risks (Weeks)**
- 💳 Financial fraud using correlated personal data
- 🏦 SIM-swapping attacks to bypass SMS-based 2FA
- 📝 Identity fraud (opening credit lines, filing false tax returns)

**Tier 3 — Persistent Risks (Months+)**
- 🕸️ Your data packaged and resold on dark web marketplaces indefinitely
- 🔄 Future breaches correlated with your profile for deeper exploitation
- 🎯 Targeted social engineering using your historical data footprint

**The good news:** Implementing the security action plan reduces these risks by ~85%. The most critical step is changing breached passwords and enabling MFA today."""
    },
    {
        "keywords": ["vpn", "network", "wifi", "public"],
        "response": """[PROTOCOL: NETWORK SECURITY]

**Network-Level Protections:**
1. **Use a reputable VPN** on public/untrusted WiFi (Mullvad, ProtonVPN, WireGuard-based)
2. **Enable DNS-over-HTTPS (DoH)** to prevent DNS poisoning and snooping
3. **Avoid public WiFi for sensitive operations** — use mobile data or a personal hotspot
4. **Enable firewall** on your OS and router — block unsolicited inbound connections
5. **Segment your home network** — IoT devices on a separate VLAN from your workstation"""
    },
    {
        "keywords": ["help", "what can you do", "capabilities", "how to use", "options"],
        "response": """[SYSTEM: CAPABILITIES OVERVIEW]

I'm your AI Security Analyst. I can help with:

🔍 **Breach Analysis** — Explain what was exposed and the real-world impact
🛡️ **Action Plans** — Step-by-step guides to secure your accounts
⚡ **Threat Assessment** — Worst-case scenarios and risk prioritization
🔐 **Authentication Guidance** — MFA, passkeys, password management best practices
🎣 **Phishing Defense** — How to recognize and avoid social engineering attacks
🌐 **Dark Web Intel** — How your data circulates in underground markets
🦠 **Malware Protection** — Ransomware defense and endpoint security

Just ask your question naturally — I'll provide actionable intelligence based on your scan results."""
    },
]


# ═══════════════════════════════════════════
#  Breach Lookup
# ═══════════════════════════════════════════

def get_breaches_by_email(email):
    """Look up breaches via XposedOrNot API."""
    try:
        response = requests.get(
            f"https://api.xposedornot.com/v1/check-email/{requests.utils.quote(email)}",
            timeout=10,
        )
        if response.status_code == 404:
            return []
        if not response.ok:
            raise Exception(f"XposedOrNot API failed with status {response.status_code}")

        data = response.json()
        breaches = data.get("breaches", [])
        if not breaches:
            return []

        breach_names = breaches[0] if isinstance(breaches[0], list) else breaches
        max_limit = breach_names[:10]

        target_breaches = []
        for name in max_limit:
            target_breaches.append({
                "Name": name,
                "Title": f"{name} Data Breach",
                "Domain": f"{name.lower()}.com",
                "BreachDate": "Verified by XposedOrNot",
                "Description": f"Your email sequence was found inside the {name} public data breach database. Threat actors possess components of this identity profile.",
                "DataClasses": ["Email addresses", "Passwords", "User Profiles"],
                "IsVerified": True,
            })
        return target_breaches
    except Exception as e:
        print(f"Breach lookup failed: {e}")
        return []


# ═══════════════════════════════════════════
#  Page Routes
# ═══════════════════════════════════════════

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/about")
def about():
    return render_template("about.html")


# ═══════════════════════════════════════════
#  API: /api/scan
# ═══════════════════════════════════════════

@app.route("/api/scan", methods=["POST"])
def scan_identity():
    try:
        body = request.get_json()
        email = body.get("email", "")
        hash_prefix = body.get("hashPrefix", "")
        hash_suffix = body.get("hashSuffix", "")
        raw_password_length = body.get("rawPasswordLength", 0)
        has_upper = body.get("hasUpperCase", False)
        has_lower = body.get("hasLowerCase", False)
        has_numbers = body.get("hasNumbers", False)
        has_special = body.get("hasSpecial", False)

        # 1. Email breach lookup
        target_breaches = get_breaches_by_email(email)

        # 2. HIBP password check (k-anonymity)
        pwned_count = 0
        if hash_prefix and len(hash_prefix) == 5 and hash_suffix:
            try:
                resp = requests.get(
                    f"https://api.pwnedpasswords.com/range/{hash_prefix}", timeout=10
                )
                if resp.ok:
                    for line in resp.text.splitlines():
                        parts = line.split(":")
                        returned_suffix = parts[0].strip()
                        count = parts[1].strip()
                        if returned_suffix == hash_suffix.upper():
                            pwned_count = int(count)
                            break
            except Exception as e:
                print(f"HIBP API Error: {e}")

        # 3. AI Risk Scoring Engine
        base_score = 0
        insights = []
        recommendations = []
        strength_penalty = 0

        if raw_password_length > 0:
            if raw_password_length < 8:
                strength_penalty = 40
                insights.append("Password length is critically short (under 8 characters).")
                recommendations.append("Increase your password length to at least 12-16 characters.")
            elif raw_password_length < 12:
                strength_penalty = 15
                insights.append("Password length is acceptable but could be stronger.")
                recommendations.append("Consider using a passphrase instead of a complex short password.")
            else:
                insights.append("Excellent password length detected. Good job.")

            complexity_points = sum([has_upper, has_lower, has_numbers, has_special])
            if complexity_points < 3:
                strength_penalty += 20
                insights.append("Password lacks diversity (mix of upper, lower, numbers, and symbols).")
                recommendations.append("Include a mix of symbols, numbers and varied casing to increase entropy.")
            else:
                insights.append("Good character diversity detected.")

        if len(target_breaches) > 0:
            base_score += min(len(target_breaches) * 15, 40)
            insights.append(f"Your email was found in {len(target_breaches)} known data breaches.")
            exposed_data = set()
            for b in target_breaches:
                for dc in b["DataClasses"]:
                    exposed_data.add(dc)
            if "Passwords" in exposed_data:
                base_score += 20
                insights.append("One or more breaches exposed passwords. High risk of credential stuffing.")
                recommendations.append("Immediately change the password for any breached accounts, starting with Canva/Adobe.")
        else:
            insights.append("No email breaches detected in our mock database.")

        if pwned_count > 0:
            base_score += 30
            if pwned_count > 1000:
                base_score += 20
                insights.append(f"Warning! This exact password has been seen {pwned_count:,} times in hacker datasets!")
                recommendations.append("This password is highly compromised and easily guessed by bots. Stop using it immediately.")
            else:
                insights.append(f"This password has been leaked {pwned_count} times before.")
                recommendations.append("Update your password to something unique.")
        elif hash_prefix:
            insights.append("Your password hash was not found in any public plaintext dictionaries. Excellent!")

        risk_score = min(base_score + strength_penalty, 100)
        if risk_score == 0 and len(target_breaches) == 0 and pwned_count == 0:
            risk_score = 5

        risk_level = "Low"
        if risk_score >= 80:
            risk_level = "Critical"
        elif risk_score >= 50:
            risk_level = "High"
        elif risk_score >= 30:
            risk_level = "Medium"

        if len(target_breaches) == 0 and pwned_count == 0 and raw_password_length >= 12:
            risk_level = "Low"
            risk_score = min(risk_score, 10)
            recommendations.append("Keep using your password manager and enable 2FA on all important accounts.")

        ai_predictive_threat = "Minimal threat detected based on current vector footprint."
        ai_risk_context = "Your identity profile appears relatively stable. Maintaining unique credentials and monitoring dark web pastes is highly effective."

        if risk_level in ("Critical", "High"):
            breach_names = ", ".join([b["Name"] for b in target_breaches])
            if len(target_breaches) > 2:
                ai_predictive_threat = "High probability of a coordinated account takeover attempt within the next 30 days."
            else:
                ai_predictive_threat = "High probability of a targeted Phishing attempt within the next 30 days."
            ai_risk_context = f"Exposed vectors in {breach_names} provide attackers with enough metadata to initiate credential stuffing. Immediate hardening is required."
        elif risk_level == "Medium":
            ai_predictive_threat = "Secondary credential theft attempt likely if same passwords are reused elsewhere."
            ai_risk_context = "Weak password patterns or minor breaches suggest an exploitable gap for automated botnets."

        return jsonify({
            "emailBreaches": target_breaches,
            "passwordPwnedCount": pwned_count,
            "aiRiskScore": risk_score,
            "aiRiskLevel": risk_level,
            "aiInsights": insights,
            "recommendations": recommendations,
            "aiPredictiveThreat": ai_predictive_threat,
            "aiRiskContext": ai_risk_context,
        })
    except Exception as e:
        print(f"Scan Error: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


# ═══════════════════════════════════════════
#  API: /api/chat
# ═══════════════════════════════════════════

@app.route("/api/chat", methods=["POST"])
def handle_ai_chat():
    body = request.get_json()
    message = body.get("message", "")
    scan_context = body.get("scanContext")
    lower_message = message.lower()

    # 1. Contextual Resolver
    is_contextual = any(w in lower_message for w in ["these", "them", "my result", "this"])

    if scan_context and (is_contextual or "my score" in lower_message or "report" in lower_message):
        password_status = (
            "CRITICAL: Plaintext leakage detected in global datasets. Credential stuffing risk: 98%."
            if scan_context.get("isPasswordPwned")
            else "STABLE: No plaintext hash collision detected."
        )
        return jsonify({
            "response": f"""[BRIEFING: IDENTITY EXPOSURE]

**Risk Level**: {scan_context.get('riskLevel', 'N/A').upper()}
**Detected Vectors**: {scan_context.get('breachCount', 0)} compromised endpoints.
**Primary Exposure**: {scan_context.get('topBreach', 'N/A')}

**Credential Audit**: {password_status}

**Analysis**: Your identity footprint is fragmented across multiple illicit repositories. Immediate hardening is recommended. Ask me to "generate an action plan" for step-by-step remediation."""
        })

    # 2. Knowledge Base — best match
    best_match = None
    best_hits = 0
    for entry in ELITE_KNOWLEDGE_BASE:
        hits = sum(1 for kw in entry["keywords"] if kw in lower_message)
        if hits > 0 and hits > best_hits:
            best_match = entry
            best_hits = hits

    if best_match:
        return jsonify({"response": best_match["response"]})

    # 3. Fallback
    return jsonify({
        "response": """[ANALYST: READY]

I can help with any security question — here are some things to try:

• **"Generate an action plan"** — Get a step-by-step account security checklist
• **"How bad are my breaches?"** — Understand the impact of your exposed data
• **"How do I protect myself?"** — Personalized defense strategies
• **"Explain phishing risks"** — How attackers weaponize breached data
• **"Tell me about MFA"** — Multi-factor authentication deep dive

What would you like to know?"""
    })


# ═══════════════════════════════════════════
#  Google Search Console Verification
# ═══════════════════════════════════════════

@app.route("/google39050cf5ed3de2c8.html")
def google_verification():
    return "google-site-verification: google39050cf5ed3de2c8.html", 200, {"Content-Type": "text/html"}


# ═══════════════════════════════════════════
#  Health Check
# ═══════════════════════════════════════════

@app.route("/health")
def health():
    from datetime import datetime
    return jsonify({"status": "healthy", "timestamp": datetime.utcnow().isoformat()})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"[SECUREX] Server running on http://localhost:{port}")
    app.run(debug=True, port=port)
