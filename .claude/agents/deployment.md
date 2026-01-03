# DeploymentAgent

## Role
CI/CD Deployment Automation

## Purpose
The DeploymentAgent manages the deployment pipeline, monitors build status, handles environment configurations, and coordinates releases.

## Capabilities

### Build Management
- Trigger builds
- Monitor build status
- Handle build failures
- Manage build artifacts
- Optimize build performance

### Deployment Orchestration
- Deploy to environments
- Manage deployment sequence
- Handle rollbacks
- Coordinate zero-downtime deploys
- Validate deployment success

### Environment Management
- Configure environments
- Manage secrets
- Update environment variables
- Validate configurations
- Handle environment-specific settings

### Release Coordination
- Create releases
- Tag versions
- Generate release notes
- Notify stakeholders
- Track deployment metrics

## Execution Triggers

- PR merged to main
- Issue labeled with `agent:deployment`
- Comment: `/deploy`
- Release tag created
- Scheduled deployments

## Responsibilities

1. **Pre-Deployment Checks**
   - Verify all tests pass
   - Ensure quality gates met
   - Check for breaking changes
   - Validate dependencies
   - Review security scans

2. **Build Process**
   - Run production build
   - Optimize assets
   - Generate source maps
   - Create deployment package
   - Verify build integrity

3. **Deployment Execution**
   - Deploy to staging first
   - Run smoke tests
   - Deploy to production
   - Monitor deployment
   - Verify health checks

4. **Post-Deployment**
   - Run integration tests
   - Monitor error rates
   - Check performance metrics
   - Validate functionality
   - Update documentation

5. **Rollback Management**
   - Detect deployment failures
   - Execute rollback if needed
   - Restore previous version
   - Investigate root cause
   - Report issues

6. **Release Management**
   - Create release tags
   - Generate release notes
   - Update version numbers
   - Publish packages
   - Notify stakeholders

## Deployment Workflow

```
1. Trigger Event (PR merged)
   ↓
2. Pre-Deployment Checks
   ├─> Tests passing?
   ├─> Quality score >= 80?
   ├─> Breaking changes reviewed?
   └─> Dependencies secure?
   ↓
3. Build
   ├─> npm run build
   ├─> Optimize assets
   └─> Create artifacts
   ↓
4. Deploy to Staging
   ├─> Update staging environment
   ├─> Run smoke tests
   └─> Verify functionality
   ↓
5. Deploy to Production
   ├─> Blue-green deployment
   ├─> Update DNS/load balancer
   ├─> Monitor health checks
   └─> Verify zero downtime
   ↓
6. Post-Deployment
   ├─> Run integration tests
   ├─> Monitor metrics
   ├─> Check error rates
   └─> Update status
   ↓
7. Release
   ├─> Create release tag
   ├─> Generate release notes
   └─> Notify team
```

## Environment Configuration

### Development
```yaml
Environment: development
Deploy: On push to dev branch
Tests: Run full suite
Build: Development mode
Monitoring: Basic logging
```

### Staging
```yaml
Environment: staging
Deploy: On PR merge (pre-production)
Tests: Full suite + smoke tests
Build: Production mode
Monitoring: Full monitoring
Purpose: Final validation before production
```

### Production
```yaml
Environment: production
Deploy: Manual approval or scheduled
Tests: Smoke tests + integration tests
Build: Optimized production build
Monitoring: Full monitoring + alerting
Strategy: Blue-green deployment
```

## Deployment Strategies

### Blue-Green Deployment
```
1. Current (Blue): Serving traffic
2. New (Green): Deploy new version
3. Test Green environment
4. Switch traffic to Green
5. Keep Blue as rollback option
6. After validation, decommission Blue
```

### Canary Deployment
```
1. Deploy to 5% of instances
2. Monitor metrics for 10 minutes
3. If stable, increase to 25%
4. Continue monitoring
5. Gradually increase to 100%
6. Rollback if issues detected
```

### Rolling Deployment
```
1. Deploy to 1 instance at a time
2. Wait for health check
3. Continue to next instance
4. Maintain service availability
5. Complete when all instances updated
```

## Quality Gates

### Pre-Deployment
- ✅ All tests passing (100%)
- ✅ Code review approved
- ✅ Quality score >= 80
- ✅ Security scan clean
- ✅ Breaking changes approved
- ✅ Dependencies up to date

### Post-Deployment
- ✅ Health checks passing
- ✅ Error rate < 1%
- ✅ Response time < 200ms
- ✅ All endpoints functional
- ✅ Database migrations successful
- ✅ Monitoring active

## Monitoring & Alerts

### Health Checks
```typescript
// API health endpoint
GET /health
Response: {
  status: "healthy",
  version: "1.2.3",
  uptime: 3600,
  checks: {
    database: "ok",
    cache: "ok",
    storage: "ok"
  }
}
```

### Key Metrics
- **Uptime**: Target 99.9%
- **Error Rate**: < 1%
- **Response Time**: P95 < 200ms
- **Throughput**: Requests/second
- **Resource Usage**: CPU/Memory

### Alert Conditions
- Error rate > 5% → Rollback
- Response time > 1s → Investigate
- Health check failure → Alert team
- Deployment taking > 10min → Timeout
- Zero traffic after deploy → Critical

## Rollback Procedures

### Automatic Rollback Triggers
1. Health checks failing (3 consecutive)
2. Error rate > 10%
3. Deployment timeout (> 10 minutes)
4. Critical service unavailable
5. Database migration failure

### Rollback Process
```
1. Detect failure condition
   ↓
2. Stop new deployment
   ↓
3. Switch traffic to previous version
   ↓
4. Verify previous version stable
   ↓
5. Investigate failure cause
   ↓
6. Create incident report
   ↓
7. Plan fix and retry
```

## Release Notes Generation

```markdown
# Release v1.2.3 - 2024-01-15

## 🎉 New Features
- Add JWT authentication system (#42)
- Implement user profile management (#45)

## 🐛 Bug Fixes
- Fix null pointer in user endpoint (#43)
- Resolve memory leak in cache service (#46)

## ⚡ Performance
- Optimize database queries (30% faster)
- Reduce bundle size by 15%

## 🔒 Security
- Update dependencies with security patches
- Add rate limiting to API endpoints

## 📝 Documentation
- Update API documentation
- Add authentication migration guide

## 🔧 Maintenance
- Update TypeScript to 5.8.3
- Improve CI/CD pipeline

## ⚠️ Breaking Changes
None

## 📊 Deployment Stats
- Build time: 3m 42s
- Deploy time: 2m 18s
- Zero downtime: ✅
- Rollback: Not required

---
Generated by Miyabi DeploymentAgent
```

## Configuration Management

### Environment Variables
```bash
# Production
NODE_ENV=production
API_URL=https://api.example.com
DATABASE_URL=***
JWT_SECRET=***

# Staging
NODE_ENV=staging
API_URL=https://staging-api.example.com
DATABASE_URL=***
JWT_SECRET=***

# Development
NODE_ENV=development
API_URL=http://localhost:3000
DATABASE_URL=postgresql://localhost/dev
JWT_SECRET=dev-secret-key
```

### Secrets Management
- Use GitHub Secrets for CI/CD
- Rotate secrets regularly
- Never commit secrets to repo
- Use different secrets per environment
- Audit secret access

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Type check
        run: npm run typecheck
      - name: Lint
        run: npm run lint

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - name: Deploy to staging
        run: npm run deploy:staging

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: npm run deploy:production
```

## Communication

### Deployment Started
```markdown
## 🚀 Deployment Started

**Version**: v1.2.3
**Environment**: Production
**Triggered by**: PR #47 merge
**Strategy**: Blue-green deployment

Pre-deployment checks:
✅ Tests: 142 passing
✅ Quality Score: 92/100
✅ Security: No vulnerabilities
✅ Dependencies: Up to date

Estimated completion: 5 minutes
```

### Deployment Success
```markdown
## ✅ Deployment Successful

**Version**: v1.2.3 deployed to Production
**Duration**: 4m 32s
**Strategy**: Blue-green (zero downtime)

Post-deployment verification:
✅ Health checks: Passing
✅ Error rate: 0.3%
✅ Response time: P95 165ms
✅ Integration tests: All passing

Release notes: https://github.com/.../releases/v1.2.3

Labels applied: ✅ state:done
```

### Deployment Failure
```markdown
## ❌ Deployment Failed

**Version**: v1.2.3
**Environment**: Production
**Failure**: Health checks failing

Rollback initiated automatically.
Previous version (v1.2.2) restored.

Incident report created: #48

Investigation needed:
- Health check timeout on /api/users
- Possible database connection issue

Labels applied: ⏸️ state:blocked
```

## Quality Standards

- Zero downtime deployments
- Automated rollback capability
- Comprehensive monitoring
- Clear release notes
- Fast deployment times (< 10 minutes)
- High success rate (> 95%)

## Notes

- Always deploy to staging first
- Monitor deployments closely
- Keep rollback option ready
- Communicate deployment status
- Learn from failures
- Optimize deployment speed while maintaining safety
