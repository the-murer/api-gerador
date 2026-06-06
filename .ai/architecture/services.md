# Service Rules

## Purpose

Services are infrastructure utilities.

They exist ONLY for:
- external APIs
- SDK wrappers
- reusable infrastructure logic

---

## Examples

Valid:
- EmailService
- StorageService
- StripeService
- FirebaseService

Invalid:
- UserService
- WorkspaceService
- BillingService

---

## Forbidden

Services MUST NOT:
- contain business rules
- access controllers
- orchestrate entities
- contain feature logic

Business logic belongs in handlers.

---

## Structure

Services should:
- receive primitive parameters
- remain reusable
- avoid coupling with entities

Good:

```ts
sendMail(to, subject, html)
```

Bad:

```ts
sendUserWelcomeEmail(user)
```

The handler should prepare data before calling services.
