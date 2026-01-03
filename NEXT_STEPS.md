# Miyabi Framework - Next Steps

## 🔐 1. Git Access (Required First)

Choose one:
- Add SSH key to youhonda30 account
- Request collaborator access
- Use GitHub personal access token

## 📤 2. Push Branch

```bash
git push -u origin setup/miyabi-framework
```

## 🔀 3. Create Pull Request

```bash
gh pr create --title "feat: Setup Miyabi framework with 7 autonomous agents" \
  --body "Complete framework setup with 7 autonomous agents" \
  --base main
```

## 🏷️ 4. Sync Labels to GitHub

```bash
gh label sync -f .github/labels.yml --force
```

This will create all 53 labels in your repository.

## 🧪 5. Test the Workflow - Create First Issue

```bash
gh issue create \
  --title "Add user authentication system" \
  --body "$(cat <<'EOF'
## Feature Request

Implement a JWT-based authentication system.

### Requirements
- User registration endpoint
- Login with email/password
- JWT token generation
- Protected route middleware
- Session management

### Acceptance Criteria
- [ ] Users can register with email/password
- [ ] Users can login and receive JWT token
- [ ] Protected routes validate JWT
- [ ] Tokens expire after 1 hour
- [ ] Refresh token mechanism

### Technical Details
- Use bcrypt for password hashing
- Use jsonwebtoken library
- Store tokens securely
- Add rate limiting
EOF
)"
```

## 📊 6. Monitor Agent Activity

Watch the agents work:

```bash
# Check overall status
npx miyabi status

# Real-time monitoring
npx miyabi status --watch

# Check specific agent
npx miyabi status --agent=CodeGenAgent
```

## 🔍 7. Verify Agents Working

After creating the issue, check:

1. **IssueAgent** should:
   - Analyze the issue
   - Apply labels (type:feature, complexity:complex, etc.)
   - Add initial comment

2. **CoordinatorAgent** should:
   - Create task breakdown
   - Assign agents
   - Update state to "analyzing"

3. **CodeGenAgent** should:
   - Create feature branch
   - Implement the authentication system
   - Run tests
   - Push commits

4. **TestAgent** should:
   - Run test suite
   - Verify coverage >= 80%
   - Report results

5. **ReviewAgent** should:
   - Review code quality
   - Calculate quality score
   - Approve if score >= 80

6. **PRAgent** should:
   - Create pull request
   - Link to issue
   - Request reviewers

7. **DeploymentAgent** should:
   - Deploy to staging (on PR merge)
   - Run smoke tests
   - Deploy to production (on main merge)

## 🎯 8. Expected Workflow

```
Issue Created (#1)
  ↓
IssueAgent analyzes → Labels applied (state:pending)
  ↓
CoordinatorAgent plans → state:analyzing
  ↓
CodeGenAgent implements → state:implementing
  ↓
TestAgent validates → state:testing
  ↓
ReviewAgent reviews → state:reviewing (score: 85/100)
  ↓
PRAgent creates PR → PR #1 created
  ↓
(Manual) Approve & Merge
  ↓
DeploymentAgent deploys → state:done
```

## 📋 9. System Health Check

```bash
npx miyabi health --verbose
```

Should show:
- ✅ GitHub Configuration
- ✅ Anthropic API
- ✅ Repository Structure
- ✅ Dependencies
- ✅ Build System
- ✅ Workflows
- ✅ Labels

## 🚀 10. Ready for Production

Once everything works:

1. Configure GitHub Secrets:
   - `ANTHROPIC_API_KEY` - For agent execution
   - Other secrets as needed

2. Enable GitHub Actions in repository settings

3. Set up branch protection rules for main

4. Configure deployment environments (staging, production)

5. Set up monitoring and alerts

## 📖 Documentation

- **Framework Docs**: See CLAUDE.md
- **Agent Definitions**: See .claude/agents/
- **Commands**: See .claude/commands/
- **Workflows**: See .github/workflows/

## 🎉 You're All Set!

The Miyabi framework is fully configured and ready to automate your development workflow!

Issues → Agents → Implementation → Tests → Review → PR → Deploy

All automated! 🤖✨
