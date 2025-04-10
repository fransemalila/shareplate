# SharePlate Mobile App Release Process

## Release Cycle

SharePlate mobile app follows a bi-weekly release cycle:

1. Development Sprint (10 days)
2. QA & Testing (2 days)
3. Beta Release (2 days)
4. Production Release

## Release Preparation

### 1. Code Freeze

- Feature freeze 2 days before planned release
- Only bug fixes allowed during freeze
- All PRs must be reviewed and merged

### 2. Version Update

- Update version numbers in:
  - `ios/SharePlate.xcodeproj/project.pbxproj`
  - `android/app/build.gradle`
  - `package.json`

### 3. Pre-release Checklist

- [ ] All tests passing
- [ ] No critical bugs open
- [ ] Analytics tracking verified
- [ ] Performance metrics within acceptable range
- [ ] Security scan completed
- [ ] Release notes prepared
- [ ] Translation files updated
- [ ] App store screenshots updated (if needed)

## Beta Release

### 1. Internal Testing

```bash
# Deploy to internal testers
fastlane ios beta
fastlane android beta
```

- Duration: 1 day
- Internal team testing
- Smoke test critical paths
- Monitor crash reports

### 2. External Beta

- TestFlight external testers
- Play Store beta track
- Duration: 1-2 days
- Monitor feedback and crashes

## Production Release

### 1. Release Approval

Obtain approval from:
- Product Owner
- QA Lead
- Security Team
- DevOps Lead

### 2. Release Deployment

```bash
# Deploy to production
fastlane ios release
fastlane android release
```

### 3. Post-release Monitoring

Monitor for 24 hours:
- Crash reports
- Performance metrics
- User feedback
- App store ratings
- Server logs

## Hotfix Process

For critical production issues:

1. Create hotfix branch from `main`
2. Fix and test the issue
3. Deploy using fastlane:
   ```bash
   fastlane ios release
   fastlane android release
   ```
4. Merge hotfix back to `main` and `develop`

## Release Notes Template

```markdown
# Version X.Y.Z

## New Features
- Feature 1: Description
- Feature 2: Description

## Improvements
- Improvement 1: Description
- Improvement 2: Description

## Bug Fixes
- Fix 1: Description
- Fix 2: Description

## Security Updates
- Update 1: Description
- Update 2: Description
```

## Rollback Procedure

If critical issues are found:

1. Identify the issue severity
2. Notify stakeholders
3. Revert to previous version:
   ```bash
   fastlane ios deploy version:"X.Y.Z"
   fastlane android deploy version:"X.Y.Z"
   ```
4. Monitor metrics
5. Plan new release

## Version Naming Convention

- Format: `X.Y.Z`
  - X: Major version (breaking changes)
  - Y: Minor version (new features)
  - Z: Patch version (bug fixes)

## Support Policy

- Support latest 2 major versions
- Critical security updates for latest 3 versions
- Minimum OS versions:
  - iOS: 13.0
  - Android: API 24 (7.0) 