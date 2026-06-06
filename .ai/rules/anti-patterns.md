# Forbidden Patterns

## Forbidden Architecture

Do NOT create:
- facades
- adapters
- factories
- use-case layers
- presenters
- transformers
- response builders
- CQRS abstractions
- event systems without explicit requirement

---

## Forbidden Code

Do NOT:
- use any
- create TODO implementations
- create fake mocks as final implementation
- create dead code
- duplicate repository logic
- move files unnecessarily
- refactor unrelated modules

---

## Forbidden Services

Never create services for:
- CRUD
- entities
- business flow

Business logic belongs in handlers.

---

## Forbidden Complexity

Avoid:
- deep inheritance
- over-abstraction
- generic hell
- utility explosion

Prefer:
- explicit code
- direct code
- readable code

---

## Forbidden Database Access

Only repositories may:
- access mongoose
- run queries
- execute aggregations
- start transactions
