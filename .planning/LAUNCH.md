# Launch Plan & Verification Review

**Document Version:** 1.0  
**Target Environment:** Vercel (Production)  
**Author:** Content Review Publish Lead  

## 1. Non-Bypassable Review Gate (Pre-Flight)

Before ANY code hits the `main` branch for Vercel deployment, the following P0 blockers must be resolved and verified locally via `npm run build` and `npm start`.

*   [ ] **Webhook Configuration:** `N8N_CALL_WEBHOOK_URL` must not point to `localhost` in production. Confirm production endpoint is wired and responding to mock payloads.
*   [ ] **ASR Service Path:** Replace `http://localhost:8000/transcribe` with a hosted Supertonic/ASR endpoint (`NEXT_PUBLIC_ASR_URL`). Voice Agent will fail gracefully or hang if missing.
*   [ ] **Environment Variables:** Must be set securely in Vercel settings prior to deployment:
    *   `AI_GATEWAY_API_KEY`
    *   `ELEVEN_API_KEY`
    *   `ELEVEN_DEFAULT_VOICE`
    *   `NEXT_PUBLIC_GWS_SCRIPT_URL`
    *   `N8N_CALL_WEBHOOK_URL`
    *   `GWS_CLI_PATH` (Set to the executable path in the Vercel environment, or ensure the fallback logic operates safely).

## 2. Dry Run & Verification

A dry run deployment must be executed to a Vercel Preview environment:

1.  **Deploy to Preview:** Push a branch to trigger a Vercel Preview URL.
2.  **Voice Agent UAT:** Trigger Voice Agent demo; ensure STT processes correctly via remote ASR endpoint.
3.  **Outbound Widget UAT:** Submit a test number to Darl/Robokev. Verify logs confirm payload hit the remote n8n instance.
4.  **Website Analyzer UAT:** Submit a test URL. Ensure GWS CLI path resolution works securely inside Vercel's serverless environment, or fails non-fatally, allowing the frontend to render the visual audit.
5.  **Audit Logs Check:** Check Vercel function logs for any `[SYSTEM]` tracking entries confirming workflows initiated correctly.

## 3. Token Discipline & Cost Management

*   **AI Gateway:** Monitor prompt sizing for `api/chat` and `api/analyze-website`. Ensure hard limits/timeouts (e.g., 10s) are configured on Vercel Edge/Serverless functions to prevent runaway LLM costs.
*   **TTS (ElevenLabs):** Enforce strict caching headers for static output. Ensure `VoiceAgentDemo` does not loop empty transcriptions.

## 4. Rollback & Recovery Playbook

If production deployment fails or causes a user-facing incident:

*   **Immediate Rollback:** Use Vercel's instant rollback feature to revert to the last known stable deployment ID.
*   **Feature Flags/Graceful Degradation:** If the n8n webhook or GWS CLI fails, the site should gracefully degrade to displaying static feedback instead of throwing 500 errors.
*   **Post-Mortem:** Any rollback must trigger a post-mortem review evaluating why the failure bypassed the Preview environment verification.
