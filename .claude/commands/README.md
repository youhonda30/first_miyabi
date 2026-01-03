# Miyabi Commands

Custom commands for interacting with the Miyabi framework.

## Available Commands

### Status
```bash
npx miyabi status [--watch] [--agent=<name>]
```
Check system status and agent activity. See [status.md](./status.md)

### Health
```bash
npx miyabi health [--verbose]
```
Run comprehensive health diagnostics. See [health.md](./health.md)

## Usage in Issues

You can trigger commands directly from issue comments:

### Trigger Specific Agent
```
/coordinate
```
Manually trigger CoordinatorAgent

```
/analyze
```
Trigger IssueAgent to re-analyze

```
/implement
```
Start CodeGenAgent implementation

```
/review
```
Request ReviewAgent review

```
/test
```
Run TestAgent validation

```
/create-pr
```
Create pull request with PRAgent

```
/deploy
```
Trigger DeploymentAgent

### Status Commands
```
/status
```
Get current task status

```
/health
```
Run health check

## Creating Custom Commands

To add a new command:

1. Create a markdown file in `.claude/commands/`
2. Document the command format and behavior
3. Implement the command in the agent system
4. Update this README

### Command Template

```markdown
# Command Name

## Command
\`npx miyabi command-name [options]\`

## Description
What this command does

## Usage
How to use it

## Examples
Example usage

## Notes
Additional information
```

## Notes

- Commands are executed by agents
- All commands respect rate limits
- Commands are logged for audit
- Use `--help` flag for command details
