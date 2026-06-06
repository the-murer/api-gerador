# Handler Rules

## Standard Structure

Every handler MUST follow this structure:

```ts
interface Input {}

type Output = {}

@Injectable()
export class ExampleHandler
  implements CommandHandler<Input, Output>
{
  constructor(
    @Inject(Repository)
    private readonly repository: Repository,
  ) {}

  public async execute(input: Input): Promise<Output> {}
}
```

---

## Naming

Files:
- create-user.handler.ts
- update-user.handler.ts
- find-user-by-id.handler.ts

Class names:
- CreateUserHandler
- UpdateUserHandler

Methods:
- execute()

---

## Responsibilities

Handlers are responsible for:
- business rules
- orchestration
- validations requiring database access
- calling repositories
- calling services
- calling other handlers when necessary

---

## Forbidden

Handlers MUST NOT:
- contain HTTP decorators
- access mongoose models directly
- contain raw database queries
- create generic abstractions
- contain utility/helper functions unrelated to feature

---

## Error Handling

Repositories return:
- entity
- null

Handlers are responsible for:
- throwing exceptions
- validating existence
- returning proper application errors

Example:

```ts
const user = await this.usersRepository.findById(id);

if (!user) {
  throw new NotFoundException('User not found');
}
```

---

## Limits

Preferred limits:
- <= 300 lines
- <= 5 dependencies
- <= 3 nesting levels

If complexity grows:
- split feature
- create helper utility
- create reusable infrastructure service

Never create abstractions prematurely.
