# SecureX — AI-Powered Identity Security Platform

SecureX is a high-performance identity security platform designed to detect breaches, analyze risks, and provide actionable intelligence to harden your digital footprint.

## Features
- **Breach Detection**: Real-time lookup of email exposures across thousands of data breaches.
- **AI Risk Scoring**: Intelligent analysis of password strength and breach impact.
- **Contextual Security Analyst**: AI-driven chat to provide personalized security hardening plans.
- **Neural Void Aesthetic**: A premium, modern UI with glassmorphism and interactive elements.

## Tech Stack
- **Backend**: Flask (Python)
- **Frontend**: Vanilla HTML/JS with CSS Glassmorphism
- **APIs**: XposedOrNot, HaveIBeenPwned

## Deployment to Render

This project is configured for easy deployment on [Render](https://render.com).

### Steps:
1. **Push your code to GitHub.**
2. **Log in to Render** and click **"New +"** -> **"Blueprint"**.
3. **Connect your GitHub repository.**
4. Render will automatically detect the `render.yaml` file and set up the service.
5. Once deployed, your app will be live at `https://your-app-name.onrender.com`.

### Manual Configuration (if not using Blueprints):
- **Service Type**: Web Service
- **Runtime**: Python
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `gunicorn --chdir backend app:app`
- **Environment Variables**:
  - `PORT`: 10000 (Render default)
