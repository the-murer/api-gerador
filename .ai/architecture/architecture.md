# Backend Architecture Rules

## Core Architecture

The project follows a strict slice-based architecture.

Request flow:

Interceptor
→ DTO
→ Controller
→ Handler
→ Repository
→ Database

Services are NOT part of business logic flow.

Services exist ONLY for:
- external integrations
- reusable infrastructure logic
- communication providers
- SDK wrappers

Examples:
- EmailService
- S3Service
- FirebaseService
- StripeService

Handlers are the main business logic layer.

---

## Responsibilities

### DTO
Responsible for:
- request validation
- typing request payloads

DTOs must:
- use class-validator
- contain only validation logic
- never contain business logic

---

### Controller

Controllers:
- receive request data
- merge params/query/body/user
- call handlers
- return response

Controllers MAY:
- call multiple handlers
- perform small payload transformations

Controllers MUST NOT:
- access repositories
- contain business logic
- access database directly
- contain integration logic

---

### Handler

Handlers are the business layer.

Handlers:
- orchestrate application flow
- apply business rules
- call repositories
- call services
- call other handlers when necessary

Handlers MUST:
- have a single responsibility
- remain small and readable
- use explicit input/output types

Handlers MUST NOT:
- access mongoose directly
- contain HTTP logic
- manipulate Express response objects

---

### Repository

Repositories are the ONLY database layer.

Repositories:
- encapsulate database access
- contain queries
- contain aggregation pipelines
- contain populate logic
- contain transactions

Repositories MUST NOT:
- contain business logic
- call services
- call handlers
- perform validation logic

---

### Service

Services are infrastructure utilities only.

Allowed:
- email
- cloud storage
- third-party SDKs
- notifications
- payment providers

Forbidden:
- business rules
- entity orchestration
- domain logic
- feature logic

Never create:
- UserService
- WorkspaceService
- BillingService

Business flow belongs in handlers.
