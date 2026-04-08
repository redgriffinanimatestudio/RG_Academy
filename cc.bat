@echo off
set ANTHROPIC_BASE_URL=http://localhost:4000/v1
set ANTHROPIC_AUTH_TOKEN=sk-b62a19db50efd2e0-0c6386-1f7daa03
set ANTHROPIC_API_KEY=
set ANTHROPIC_MODEL=kr/claude-sonnet-4.5
set ANTHROPIC_SMALL_FAST_MODEL=kr/claude-sonnet-4.5
set CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
"C:\Users\User\.local\bin\claude.exe" %*
