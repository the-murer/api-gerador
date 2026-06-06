# Controller Rules

## Responsibilities

Controllers:
- receive requests
- validate payloads through DTOs
- merge request data
- call handlers
- return responses

Controllers should remain thin.

---

## Allowed

Controllers MAY:
- call multiple handlers
- transform payloads
- combine params/query/body

---

## Forbidden

Controllers MUST NOT:
- access repositories
- contain business rules
- contain database logic
- contain integration logic

---

## Patterns

Use:
- @Body
- @Query
- @Param
- @Roles
- @HttpCode

Prefer explicit routes.

---

## Response

Return handler output directly.

Avoid:
- response wrappers
- custom response builders
- Express response manipulation

---

## Limits

Preferred:
- <= 150 lines
- <= 5 endpoints per controller

Split controllers if complexity grows.
