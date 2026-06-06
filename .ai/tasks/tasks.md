# Task Execution Rules

## Goal

Tasks must be:
- isolated
- explicit
- implementation-oriented
- low ambiguity

Cursor should execute tasks with minimal interpretation.

---

# Task Structure

Every task should follow this format:

```md
# Objective

Describe the feature goal.

# Context

Relevant business or technical context.

# Implement

List exactly what must be implemented.

# Files

List expected files to create/update.

# Rules

Specific implementation constraints.

# Acceptance Criteria

How to validate completion.
```

---

# Example

```md
# Objective

Create workspace invitation endpoint.

# Context

Authenticated users should invite members by email.

# Implement

- Create invite endpoint
- Validate email uniqueness
- Generate invite token
- Send invite email

# Files

- workspace-invites.controller.ts
- create-workspace-invite.handler.ts
- workspace-invites.repository.ts

# Rules

- Email sending must use EmailService
- Token generation belongs in handler
- Database access only in repository

# Acceptance Criteria

- Endpoint creates invite
- Duplicate invites blocked
- Email sent successfully
```

---

# Feature Development Rules

When creating a feature:

1. Create schema first
2. Create DTOs
3. Create repository methods
4. Create handlers
5. Create controller endpoints
6. Register module dependencies
7. Validate imports
8. Validate typing

---

# Code Generation Rules

Always:
- generate complete implementations
- generate imports
- generate typings
- generate explicit methods

Never:
- omit code
- leave TODOs
- generate placeholders
- create pseudo implementations
