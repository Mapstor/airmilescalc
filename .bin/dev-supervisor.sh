#!/usr/bin/env bash
# dev-supervisor.sh — keep `npm run dev` alive across crashes.
#
# Why this exists: Turbopack occasionally crashes under memory pressure when
# many MDX pages compile in parallel, and parent-shell signals from
# tool-driven sessions sometimes propagate to the dev server and kill it.
# This script wraps `npm run dev` in a restart loop so the dev server is
# always reachable at http://localhost:3000 (host 3004 via the devcontainer
# port mapping).
#
# Usage: launched once via setsid nohup; runs forever.
# Logs:  /workspace/dev.log (overwritten each restart so it stays small)
# Stop:  pkill -f dev-supervisor.sh    (then pkill -f "next dev" to be sure)

set -u
cd /workspace

# How long to wait between restart attempts. Short enough that the user
# barely notices a crash; long enough to avoid restart-loops if a code change
# breaks the server outright.
RESTART_DELAY=3

# Rolling crash counter for visibility
restarts=0
started_at="$(date -Iseconds)"

echo "[supervisor] started at $started_at" >&2

while true; do
  echo "[supervisor] launching npm run dev (restart #$restarts)" >&2
  # npm run dev runs in the foreground of THIS script's process; if it exits
  # for any reason we loop and restart. stdout+stderr are inherited so they
  # land in whatever log the supervisor itself is writing to.
  npm run dev
  exit_code=$?

  restarts=$((restarts + 1))
  echo "[supervisor] npm run dev exited (code=$exit_code) at $(date -Iseconds); restart #$restarts in ${RESTART_DELAY}s" >&2

  # Quick guard against tight restart loops on syntax errors — if we crash
  # 10 times in a row within 60 seconds, give up so the operator notices.
  now=$(date +%s)
  if [[ -z "${first_crash_at:-}" ]] || (( now - first_crash_at > 60 )); then
    first_crash_at=$now
    crash_count=1
  else
    crash_count=$((crash_count + 1))
  fi
  if (( crash_count >= 10 )); then
    echo "[supervisor] 10 crashes in 60s — aborting so you can fix the source error" >&2
    exit 1
  fi

  sleep $RESTART_DELAY
done
