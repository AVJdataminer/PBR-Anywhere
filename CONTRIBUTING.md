# Contributing to PBR Anywhere

Thank you for your interest in contributing to PBR Anywhere! 🐂

This document provides guidelines and information for contributors to help make the contribution process smooth and effective.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)
- [Questions and Discussions](#questions-and-discussions)

## Code of Conduct

This project is committed to providing a welcoming and inclusive environment for all contributors. By participating, you agree to abide by our Code of Conduct.

## Getting Started

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Docker & Docker Compose** - [Install here](https://docs.docker.com/get-docker/)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/PBR-Anywhere.git
   cd PBR-Anywhere
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/AVJdataminer/PBR-Anywhere.git
   ```

## Development Setup

### Quick Setup

Run the automated setup script:
```bash
./setup.sh
```

### Manual Setup

1. **Install dependencies**:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   cd backend && npm install && cd ..
   cd scraper && npm install && cd ..
   cd recorder && npm install && cd ..
   cd infrastructure && npm install && cd ..
   ```

2. **Environment configuration**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start services**:
   ```bash
   docker-compose up -d postgres redis
   ```

4. **Run migrations**:
   ```bash
   cd backend && npm run migrate && cd ..
   ```

5. **Start development servers**:
   ```bash
   npm run dev
   ```

## Contributing Guidelines

### What We're Looking For

- **Bug fixes** - Help us squash bugs and improve stability
- **Feature enhancements** - Add new functionality to make PBR Anywhere better
- **Documentation** - Improve our docs, add examples, fix typos
- **Testing** - Add tests, improve test coverage
- **Performance improvements** - Optimize code and reduce resource usage
- **UI/UX improvements** - Enhance the user interface and experience

### What We're NOT Looking For

- **Breaking changes** without proper discussion and planning
- **Major architectural changes** without prior approval
- **Features that don't align with the project's goals**
- **Code that doesn't follow our style guidelines**

## Code Style

### General Guidelines

- **Write clean, readable code** - Code is read more often than it's written
- **Follow existing patterns** - Maintain consistency with the codebase
- **Add comments** - Explain complex logic and business rules
- **Use meaningful names** - Variables, functions, and classes should be self-documenting

### JavaScript/TypeScript

- **Use ES6+ features** - Arrow functions, destructuring, template literals
- **Prefer const over let** - Use let only when reassignment is necessary
- **Use async/await** - Prefer over Promises when possible
- **Add type annotations** - Use TypeScript types for better code quality

### React

- **Use functional components** - Prefer hooks over class components
- **Follow naming conventions** - PascalCase for components, camelCase for functions
- **Extract reusable logic** - Use custom hooks for shared functionality
- **Optimize performance** - Use React.memo, useMemo, useCallback when appropriate

### Database

- **Use migrations** - Never modify the database schema directly
- **Write efficient queries** - Use indexes and avoid N+1 queries
- **Validate data** - Always validate input before database operations

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:frontend
npm run test:backend

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- **Test the happy path** - Ensure normal operations work correctly
- **Test edge cases** - Handle error conditions and boundary cases
- **Mock external dependencies** - Don't rely on external services in tests
- **Use descriptive test names** - Test names should explain what's being tested

### Test Structure

```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Arrange
      const userData = { name: 'John Doe', email: 'john@example.com' };
      
      // Act
      const result = await userService.createUser(userData);
      
      // Assert
      expect(result).toHaveProperty('id');
      expect(result.name).toBe(userData.name);
    });

    it('should throw error for invalid email', async () => {
      // Arrange
      const userData = { name: 'John Doe', email: 'invalid-email' };
      
      // Act & Assert
      await expect(userService.createUser(userData))
        .rejects.toThrow('Invalid email format');
    });
  });
});
```

## Pull Request Process

### Before Submitting

1. **Ensure tests pass** - Run the full test suite locally
2. **Check code style** - Run linting and fix any issues
3. **Update documentation** - Add or update relevant documentation
4. **Test your changes** - Verify functionality works as expected

### Creating a Pull Request

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit them:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what was changed and why
   - Link to any related issues
   - Screenshots for UI changes

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(auth): add user registration endpoint
fix(scraper): resolve timeout issues with PBR website
docs(readme): update installation instructions
style(frontend): fix indentation in Header component
```

### Review Process

1. **Automated checks** - CI/CD pipeline runs tests and linting
2. **Code review** - At least one maintainer must approve
3. **Address feedback** - Make requested changes and push updates
4. **Merge** - Once approved, your PR will be merged

## Reporting Bugs

### Before Reporting

1. **Check existing issues** - Search for similar problems
2. **Try to reproduce** - Ensure the bug is consistent
3. **Check documentation** - Verify it's not a configuration issue

### Bug Report Template

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:

- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (OS, browser, versions)
- **Screenshots or logs** if applicable

## Feature Requests

### Before Requesting

1. **Check existing features** - Ensure it's not already implemented
2. **Consider alternatives** - Think about different approaches
3. **Evaluate impact** - Consider the scope and complexity

### Feature Request Template

Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:

- **Problem description** - What issue does this solve?
- **Proposed solution** - How should it work?
- **Use cases** - Who would benefit and how?
- **Alternatives considered** - What other approaches were evaluated?

## Questions and Discussions

### Getting Help

- **GitHub Discussions** - Use the Discussions tab for questions
- **GitHub Issues** - For bugs and feature requests
- **Documentation** - Check README.md and other docs first

### Best Practices

- **Be specific** - Provide clear, detailed information
- **Include context** - Share relevant code, logs, or screenshots
- **Be patient** - Maintainers are volunteers with limited time
- **Follow up** - Respond to questions and provide additional info

## Development Workflow

### Daily Workflow

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "type(scope): description"
   ```

4. **Push and create PR**:
   ```bash
   git push origin feature/your-feature
   # Create PR on GitHub
   ```

### Keeping Branches Updated

```bash
# Update your feature branch with latest main
git checkout main
git pull upstream main
git checkout feature/your-feature
git merge main
```

## Code Review Guidelines

### As a Reviewer

- **Be constructive** - Provide helpful, actionable feedback
- **Focus on code** - Avoid personal criticism
- **Ask questions** - Clarify unclear code or decisions
- **Suggest alternatives** - Offer different approaches when appropriate

### As a Contributor

- **Respond promptly** - Address review comments quickly
- **Be open to feedback** - Consider suggestions and alternative approaches
- **Ask questions** - Clarify feedback you don't understand
- **Thank reviewers** - Show appreciation for their time and feedback

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **Major** - Breaking changes
- **Minor** - New features (backward compatible)
- **Patch** - Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Changelog is updated
- [ ] Version numbers are updated
- [ ] Release notes are written
- [ ] GitHub release is created

## Getting Help

### Resources

- **Project Documentation** - README.md, QUICKSTART.md
- **Code Comments** - Inline documentation in the codebase
- **GitHub Issues** - Search existing issues and discussions
- **GitHub Discussions** - Community Q&A and discussions

### Contact

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and general discussion
- **Pull Requests** - For code contributions

## Recognition

Contributors are recognized in several ways:

- **GitHub Contributors** - Your commits appear in the contributors graph
- **Release Notes** - Significant contributions are mentioned in releases
- **Project Documentation** - Contributors may be listed in docs
- **Community Appreciation** - Recognition from maintainers and users

---

Thank you for contributing to PBR Anywhere! Your contributions help make bull riding events accessible to fans everywhere. 🐂

**Happy coding!**
