# Canonical Examples

## Create Feature

Structure:

```txt
users/
  dto/
    create-user.dto.ts
    find-users.dto.ts

  handlers/
    create-user.handler.ts
    update-user.handler.ts
    find-users.handler.ts
    find-user-by-id.handler.ts

  users.controller.ts
  users.repository.ts
  user.schema.ts
  users.module.ts
```

---

## Create Entity Example

```ts
@Schema({ timestamps: true })
export class User extends TimestampSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;
}
```

---

## Create DTO Example

```ts
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
```

---

## Create Handler Example

```ts
interface CreateUserHandlerInput extends CreateUserDto {}

type CreateUserHandlerOutput = User;

@Injectable()
export class CreateUserHandler
  implements
    CommandHandler<
      CreateUserHandlerInput,
      CreateUserHandlerOutput
    >
{
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  public async execute(input: CreateUserHandlerInput) {
    const existing = await this.usersRepository.findUserByEmail(
      input.email,
    );

    if (existing) {
      throw new ConflictException('User already exists');
    }

    return this.usersRepository.create(input);
  }
}
```

---

## Create Repository Method Example

```ts
public async findUserByEmail(email: string) {
  return this.model.findOne({ email }).lean();
}
```

---

## Pagination Example

```ts
const { data, metadata } =
  await this.usersRepository.findPaginated(
    page,
    limit,
    sort,
    sortOrder,
  );

return {
  data,
  metadata,
};
```

---

## Transaction Example

```ts
const session = await this.model.startSession();

session.startTransaction();

try {
  await this.model.create([data], { session });

  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

## Service Example

Correct:

```ts
await this.emailService.sendMail(
  email,
  subject,
  html,
);
```

Incorrect:

```ts
await this.userService.createUserAndSendEmail();
```

---

## Controller Example

```ts
@Post()
async create(
  @Body() createDto: CreateUserDto,
) {
  return this.createUserHandler.execute(createDto);
}
```
