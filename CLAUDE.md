# Miyabi Framework - AI Agent Context

This project uses the **Miyabi** autonomous development framework with 7 specialized AI agents working together to automate the entire development lifecycle.

## Project Overview

**Project**: first_miyabi
**Framework**: Miyabi (Autonomous AI Development)
**Repository**: youhonda30/first_miyabi
**Purpose**: AI-driven development automation with autonomous agents

## Git/GitHub Configuration

### SSH Configuration

This project uses the **youhonda30** GitHub account.

**SSH Host**: Use `github-youhonda30` configured in `~/.ssh/config`
**SSH Key**: `~/.ssh/id_rsa_youhonda30` (configured in SSH config)

**Git Remote URL Format**:
```bash
git@github-youhonda30:youhonda30/first_miyabi.git
```

**Setting up new branches**:
```bash
# Always use github-youhonda30 host for this repository
git remote set-url origin git@github-youhonda30:youhonda30/first_miyabi.git
git push -u origin <branch-name>
```

### GitHub CLI (gh) Configuration

**Current Account**: ai247group (needs switching for this repo)

**To use gh commands**:
```bash
# Option 1: Switch gh account to youhonda30
gh auth login

# Option 2: Use Web UI for PR creation
# Recommended for this repository due to account mismatch
```

### Branch Strategy

- **Main branch**: `main`
- **Feature branches**: `feature/<issue-number>-<description>`
- **Bugfix branches**: `bugfix/<issue-number>-<description>`
- **All PRs** should target `main` branch

## Technology Stack

### Frontend
- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.1 (@tailwindcss/postcss)
- **Language**: TypeScript 5.8

### Development Tools
- **Linter**: ESLint 9 with Next.js config
- **Type Checker**: TypeScript strict mode
- **Package Manager**: npm
- **Testing**: Vitest with coverage

### Build & Deploy
- **Build Tool**: Next.js built-in (Turbopack)
- **CI/CD**: GitHub Actions
- **Target Platform**: Vercel / AWS (TBD)

## Environment Variables

See `.env.example` for required environment variables:

**Miyabi Framework**:
- `GITHUB_TOKEN`: GitHub API token (for agents)
- `ANTHROPIC_API_KEY`: Claude API key (for AI agents)
- `REPOSITORY`: Repository in format owner/repo

**EC Site Application**:
- `DATABASE_URL`: PostgreSQL connection string
- `STRIPE_SECRET_KEY`: Stripe payment API key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `NEXTAUTH_URL`: Application URL
- `NEXTAUTH_SECRET`: NextAuth.js secret key
- `NEXT_PUBLIC_APP_URL`: Public application URL
- `NEXT_PUBLIC_APP_NAME`: Application name

**Note**: Never commit actual values. Use `.env.example` as template.

## Architecture

### 7 Autonomous Agents

1. **CoordinatorAgent** - Task Planning & Orchestration
   - Analyzes incoming issues
   - Creates task breakdown
   - Assigns work to specialized agents
   - Monitors overall progress

2. **IssueAgent** - Issue Analysis & Labeling
   - Automatically analyzes new issues
   - Applies appropriate labels from 53-label system
   - Transitions issue states through workflow
   - Validates issue completeness

3. **CodeGenAgent** - AI-Powered Code Generation
   - Implements features based on requirements
   - Follows project coding standards
   - Generates type-safe TypeScript code
   - Creates comprehensive documentation

4. **ReviewAgent** - Code Quality Validation
   - Reviews all generated code
   - Ensures quality score >= 80
   - Validates security best practices
   - Checks performance optimization

5. **PRAgent** - Automatic Pull Request Creation
   - Creates well-formatted PRs
   - Generates detailed descriptions
   - Links related issues
   - Requests appropriate reviewers

6. **DeploymentAgent** - CI/CD Automation
   - Manages deployment pipeline
   - Monitors build status
   - Handles environment configurations
   - Coordinates releases

7. **TestAgent** - Test Execution & Coverage
   - Runs test suite automatically
   - Validates code coverage
   - Generates test reports
   - Ensures quality gates pass

## Workflow

### Issue → PR Pipeline

```
1. Issue Created
   └─> IssueAgent analyzes & labels (state:pending)
       └─> CoordinatorAgent creates task plan
           └─> state:analyzing
               └─> CodeGenAgent implements (state:implementing)
                   └─> TestAgent validates
                       └─> ReviewAgent reviews (state:reviewing)
                           └─> PRAgent creates PR
                               └─> DeploymentAgent deploys
                                   └─> state:done
```

### Label State Machine (53 Labels)

#### State Labels
- `📥 state:pending` - Waiting for agent assignment
- `🔍 state:analyzing` - Being analyzed by agents
- `🏗️ state:implementing` - Code being written
- `🧪 state:testing` - Tests running
- `👀 state:reviewing` - Under code review
- `🚀 state:deploying` - Being deployed
- `✅ state:done` - Completed & merged
- `⏸️ state:blocked` - Blocked, needs intervention
- `🔄 state:reopened` - Reopened for additional work

#### Type Labels
- `🐛 type:bug` - Bug fix
- `✨ type:feature` - New feature
- `📝 type:documentation` - Documentation updates
- `♻️ type:refactor` - Code refactoring
- `⚡ type:performance` - Performance improvement
- `🔒 type:security` - Security enhancement
- `🧪 type:test` - Test additions/changes
- `🔧 type:chore` - Maintenance tasks

#### Priority Labels
- `🔥 priority:critical` - Critical, immediate attention
- `⚠️ priority:high` - High priority
- `📊 priority:medium` - Medium priority
- `📌 priority:low` - Low priority

#### Complexity Labels
- `🎯 complexity:trivial` - < 1 hour
- `🟢 complexity:simple` - 1-4 hours
- `🟡 complexity:moderate` - 4-8 hours
- `🟠 complexity:complex` - 1-2 days
- `🔴 complexity:epic` - > 2 days

#### Agent Assignment
- `🤖 agent:coordinator` - Assigned to CoordinatorAgent
- `🏷️ agent:issue` - Assigned to IssueAgent
- `💻 agent:codegen` - Assigned to CodeGenAgent
- `👁️ agent:review` - Assigned to ReviewAgent
- `📤 agent:pr` - Assigned to PRAgent
- `🚢 agent:deployment` - Assigned to DeploymentAgent
- `🧪 agent:test` - Assigned to TestAgent

## Agent Execution

### GitHub Actions Triggers

Agents execute automatically via GitHub Actions on:
- **Issue events**: `opened`, `edited`, `labeled`, `assigned`
- **Pull request events**: `opened`, `synchronize`, `ready_for_review`
- **Push events**: To `main` and feature branches
- **Schedule**: Hourly health checks

### Environment Variables

Required secrets in GitHub Actions:
```
GITHUB_TOKEN          # Auto-provided by GitHub
ANTHROPIC_API_KEY     # Claude API key (required)
REPOSITORY            # Format: owner/repo
```

### Local Development

```bash
# Run specific agent locally
AGENT=CodeGenAgent npm run agent

# Watch agent execution
npx miyabi status --watch

# Check system health
npx miyabi health
```

## Development Guidelines

### Code Standards

- **Language**: TypeScript (strict mode)
- **Style**: ESLint configuration enforced
- **Testing**: 80%+ coverage required
- **Documentation**: JSDoc for all public APIs
- **Security**: No secrets in code, environment variables only

### Commit Messages

Follow conventional commits:
```
feat: Add new feature
fix: Fix bug
docs: Update documentation
refactor: Refactor code
test: Add tests
chore: Maintenance tasks
```

### Quality Gates

All code must pass:
1. TypeScript compilation (`npm run typecheck`)
2. Linting (`npm run lint`)
3. Tests (`npm test`)
4. Code review (score >= 80)
5. Security scan

## Agent Communication

Agents communicate via:
- **GitHub Issues**: Task coordination
- **PR Comments**: Code review feedback
- **Labels**: State transitions
- **Workflow runs**: Execution status
- **Artifacts**: Reports and logs

## Monitoring

### Status Dashboard

```bash
# Check all agents status
npx miyabi status

# Real-time monitoring
npx miyabi status --watch

# Agent-specific status
npx miyabi status --agent=CodeGenAgent
```

### Logs

Agent logs are stored in:
- `.ai/logs/` - Local development logs
- GitHub Actions logs - CI/CD execution
- `.ai/parallel-reports/` - Parallel execution reports

## Troubleshooting

### Common Issues

1. **Agent not executing**
   - Check GitHub Actions secrets
   - Verify webhook configuration
   - Review workflow permissions

2. **Build failures**
   - Check TypeScript errors
   - Verify dependencies installed
   - Review test failures

3. **Label not applying**
   - Sync labels: `gh label sync -f .github/labels.yml`
   - Check label configuration
   - Verify agent permissions

## Resources

- **Miyabi Framework**: https://github.com/ShunsukeHayashi/Miyabi
- **NPM Package**: https://www.npmjs.com/package/miyabi
- **Documentation**: See README.md
- **Support**: https://github.com/ShunsukeHayashi/Miyabi/issues

---

**Note**: This file provides context for AI agents. Human developers should refer to README.md for getting started guide.
