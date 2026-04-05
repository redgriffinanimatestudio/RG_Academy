@echo off
:: =================================================================
:: Red Griffin Systems - Claude Code Proxy Setup
:: This script points Claude Code CLI to the local OmniRoute Gateway
:: =================================================================

:: Direct Claude Code to the local OmniRoute server
set ANTHROPIC_BASE_URL=http://localhost:3000/v1
set CLAUDE_CODE_API_BASE_URL=http://localhost:3000/v1

:: Use the internal bridge key (OmniRoute handles the real GEMINI_API_KEY)
set ANTHROPIC_API_KEY=sk-ant-omniroute-local

:: Bonus: Force tool search if using a bridge
set ENABLE_TOOL_SEARCH=true

echo [RG SYSTEMS] Initializing Claude Code via OmniRoute...
echo [RG SYSTEMS] Proxy: %ANTHROPIC_BASE_URL%
echo [RG SYSTEMS] Protocols: Kiro AI / Gemini Bridge Active

:: Start Claude Code
claude %*
