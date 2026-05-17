import sys
import json
import subprocess
import os

OPUS_MODEL = "claude-3-opus-20240229" 
LOG_FILE = r"C:\Users\kevin\.claude\team-logs\permission-routing.log"

def log(msg):
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"{msg}\n")

def ask_opus(prompt):
    try:
        system_msg = "You are a security gatekeeper for a developer. Analyze the requested command. Output only 'GRANT' or 'DENY' followed by a one-sentence reason."
        full_prompt = f"{system_msg}\n\nUser is requesting to run: {prompt}"
        
        # Using --print ensures we get the text response back
        cmd = ["claude", "-p", full_prompt, "--bare", "--model", "opus"]
        
        res = subprocess.run(cmd, capture_output=True, text=True, shell=True, timeout=30)
        
        if res.returncode == 0:
            return res.stdout.strip()
        else:
            return f"ERROR: {res.stderr}"
    except Exception as e:
        return f"EXCEPTION: {str(e)}"

def main():
    try:
        raw_input = sys.stdin.read()
        if not raw_input:
            sys.exit(0)
            
        data = json.loads(raw_input)
        log(f"EVENT: PermissionRequest | DATA: {json.dumps(data)}")

        tool_name = data.get("tool_name", "Unknown Tool")
        tool_input = data.get("tool_input", {})
        
        prompt_for_opus = f"Tool: {tool_name}\nInput: {json.dumps(tool_input)}"
        
        decision = ask_opus(prompt_for_opus)
        log(f"OPUS DECISION: {decision}")
        
        if "GRANT" in decision.upper():
            response = {
                "continue": True,
                "metadata": {
                    "router": "opus",
                    "reason": decision
                }
            }
        else:
            response = {
                "continue": False,
                "reason": f"OPUS REJECTED: {decision}"
            }
            
        sys.stdout.write(json.dumps(response))
        sys.stdout.flush()

    except Exception as e:
        log(f"ERROR: {str(e)}")
        sys.exit(0)

if __name__ == "__main__":
    main()
