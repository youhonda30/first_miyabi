# Health Command

## Command
`npx miyabi health [--verbose]`

## Description
Perform comprehensive health check of the Miyabi system.

## Usage

### Basic Health Check
```bash
npx miyabi health
```

### Verbose Output
```bash
npx miyabi health --verbose
```

## Health Checks

### 1. GitHub Configuration
- ✅ GITHUB_TOKEN set and valid
- ✅ Repository accessible
- ✅ Webhook configured
- ✅ Actions enabled

### 2. Anthropic API
- ✅ ANTHROPIC_API_KEY set
- ✅ API accessible
- ✅ Rate limits OK
- ✅ Credits available

### 3. Repository Structure
- ✅ CLAUDE.md exists
- ✅ .claude/agents/ complete (7 agents)
- ✅ .claude/commands/ configured
- ✅ .github/labels.yml synced
- ✅ .github/workflows/ configured

### 4. Dependencies
- ✅ node_modules up to date
- ✅ No security vulnerabilities
- ✅ TypeScript version OK
- ✅ All dev dependencies present

### 5. Build System
- ✅ TypeScript compiles
- ✅ ESLint passes
- ✅ Tests executable
- ✅ Build scripts working

### 6. Workflows
- ✅ All workflows valid YAML
- ✅ No syntax errors
- ✅ Secrets configured
- ✅ Triggers properly set

### 7. Labels
- ✅ All 53 labels synced
- ✅ Label colors correct
- ✅ Label descriptions set
- ✅ No duplicate labels

## Output Format

```
🌸 Miyabi Health Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Running health diagnostics...

[1/7] GitHub Configuration............... ✅ PASS
  ├─ Token: Valid (expires in 42 days)
  ├─ Repository: Accessible
  ├─ Webhooks: Configured (3 active)
  └─ Actions: Enabled

[2/7] Anthropic API...................... ✅ PASS
  ├─ API Key: Valid
  ├─ Connectivity: OK (latency: 85ms)
  ├─ Rate Limits: 1000/1000 available
  └─ Credits: Sufficient

[3/7] Repository Structure............... ✅ PASS
  ├─ CLAUDE.md: Present
  ├─ Agents: 7/7 configured
  ├─ Commands: 5 commands found
  └─ Workflows: 8 workflows

[4/7] Dependencies....................... ✅ PASS
  ├─ Packages: Up to date
  ├─ Security: No vulnerabilities
  └─ TypeScript: v5.8.3

[5/7] Build System....................... ✅ PASS
  ├─ TypeCheck: PASS (0 errors)
  ├─ Lint: PASS (0 warnings)
  ├─ Tests: PASS (142/142)
  └─ Build: SUCCESS

[6/7] GitHub Workflows................... ✅ PASS
  ├─ YAML Syntax: Valid
  ├─ Secrets: 3/3 configured
  └─ Recent Runs: 15/15 successful

[7/7] Label System....................... ✅ PASS
  ├─ Synced: 53/53 labels
  ├─ Configured: All descriptions set
  └─ Status: Up to date

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All health checks passed!

System Status: HEALTHY 🎉
Uptime: 15 days, 7 hours
Last Issue: None
Recommendation: System operating normally

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Failure Output

```
❌ Health check failed!

[3/7] Repository Structure............... ❌ FAIL
  ├─ CLAUDE.md: Missing ⚠️
  ├─ Agents: 5/7 configured ⚠️
  │   Missing: ReviewAgent, TestAgent
  └─ Workflows: 6/8 ⚠️
      Missing: test.yml, deploy.yml

Recommendations:
1. Create CLAUDE.md file
2. Add missing agent definitions
3. Configure missing workflows
4. Run: npx miyabi setup --fix

Run with --verbose for detailed diagnostics.
```

## Exit Codes
- `0`: All health checks passed
- `1`: One or more checks failed
- `2`: Critical system error

## Implementation

The health command should:
1. Validate environment variables
2. Test API connectivity
3. Check file structure
4. Verify configurations
5. Test build system
6. Validate workflows
7. Check label synchronization

## Notes
- Use parallel checks for speed
- Cache API calls to avoid rate limits
- Provide actionable recommendations
- Support `--fix` flag to auto-repair issues
