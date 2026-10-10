## 2026-03-30 - Fix Hardcoded ElevenLabs Agent ID
**Vulnerability:** Hardcoded ElevenLabs Agent ID (`agent_8501m0h2hvh0edr99jkqzr4rw53n`) directly embedded in component JSX/source code.
**Learning:** Hardcoding service agent IDs directly in source files prevents environment-specific configuration (e.g. staging vs production) and risks exposing default identifiers across environments without configurable overrides.
**Prevention:** Always expose environment variables (`NEXT_PUBLIC_ELEVENLABS_AGENT_ID`) and component props (`agentId`) for dynamic configuration with safe fallback defaults.
