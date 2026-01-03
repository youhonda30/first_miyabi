# Status Command

## Command
`npx miyabi status [--watch] [--agent=<agent-name>]`

## Description
Check the current status of all agents and active tasks.

## Usage

### Basic Status
```bash
npx miyabi status
```

Displays:
- Active issues and their states
- Agent assignments
- Current task progress
- Recent activity
- System health

### Watch Mode
```bash
npx miyabi status --watch
```

Continuously monitors and updates status in real-time.

### Agent-Specific
```bash
npx miyabi status --agent=CodeGenAgent
```

Shows status for a specific agent only.

## Output Format

```
🌸 Miyabi Status Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 System Health: ✅ Healthy

Active Issues: 3
├─ #42 [state:implementing] Add JWT authentication
│  └─ 💻 CodeGenAgent (75% complete)
├─ #43 [state:reviewing] Fix null pointer in API
│  └─ 👁️ ReviewAgent (Quality score: 85/100)
└─ #44 [state:testing] Update user validation
   └─ 🧪 TestAgent (Coverage: 82%)

Recent Activity (last 1h):
├─ 10:45 - CodeGenAgent: Pushed commit to feature/auth
├─ 10:32 - ReviewAgent: Approved PR #43
└─ 10:15 - TestAgent: Tests passing (142/142)

Agent Status:
├─ 🤖 CoordinatorAgent: ✅ Active (2 tasks)
├─ 🏷️ IssueAgent: ✅ Active (monitoring)
├─ 💻 CodeGenAgent: ✅ Active (1 task)
├─ 👁️ ReviewAgent: ✅ Active (1 task)
├─ 📤 PRAgent: ⏸️ Idle
├─ 🚢 DeploymentAgent: ⏸️ Idle
└─ 🧪 TestAgent: ✅ Active (1 task)

System Metrics:
├─ Response Time: 142ms (avg)
├─ Success Rate: 98.7%
└─ Active Workflows: 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Last updated: 2024-01-15 10:50:23
```

## Implementation

The status command should:
1. Query GitHub API for active issues
2. Check agent execution status
3. Fetch recent activity from workflows
4. Calculate system metrics
5. Format and display results

## Notes
- Use GitHub API to fetch real-time data
- Cache results for 30 seconds in watch mode
- Color-code output for better readability
- Support JSON output with `--json` flag
