# Feature Generation Rules

## Standard Feature Structure

Every feature module should contain:

```txt
feature/
  dto/
  handlers/
  feature.controller.ts
  feature.repository.ts
  feature.schema.ts
  feature.module.ts
```

---

# Required CRUD Handlers

When applicable generate:

- create
- update
- delete
- find-by-id
- find-paginated

---

# Repository Strategy

Always:
- reuse BaseRepository
- create explicit methods only when necessary

Avoid:
- duplicated query logic
- generic repositories
- query builders without need

---

# Endpoint Strategy

Controllers should expose:
- explicit routes
- explicit params
- explicit DTOs

Avoid:
- dynamic routes
- overloaded endpoints
- generic handlers

---

# Validation Strategy

Use:
- class-validator
- DTO validation
- handler validation for DB-dependent rules

Avoid:
- validation inside repositories
