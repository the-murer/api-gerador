# Repository Rules

## Database Boundary

Repositories are the ONLY layer allowed to communicate directly with the database.

All:
- queries
- updates
- aggregations
- transactions
- populate logic

must exist inside repositories.

---

## Naming

Prefer explicit names.

Good:
- findUserByEmail
- updateWorkspaceById
- findActiveSubscriptions

Avoid:
- get()
- query()
- execute()

---

## Allowed

Repositories MAY contain:
- aggregation pipelines
- populate
- transactions
- filters
- pagination
- sorting

---

## Forbidden

Repositories MUST NOT:
- contain business logic
- call services
- call handlers
- contain HTTP logic
- validate DTOs

---

## Base Repository

Always reuse BaseRepository methods before creating custom queries.

Available:
- create
- update
- updateById
- delete
- findOne
- find
- findById
- findPaginated

Only create new methods when necessary.

---

## Pagination

All paginated responses MUST follow:

```ts
{
  data,
  metadata
}
```

Never return custom pagination structures.

---

## Filters

Use buildFilter when applicable.

Avoid duplicating filtering logic.
