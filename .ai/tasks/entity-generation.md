# Entity Generation Rules

## Entity Structure

Entities must:
- use @Schema
- extend TimestampSchema when applicable
- use explicit @Prop definitions

---

## Example

```ts
@Schema({ timestamps: true })
export class User extends TimestampSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: true })
  active: boolean;
}
```

---

## Rules

Always:
- use explicit required/default values
- prefer primitive fields
- prefer explicit indexes
- keep schemas small

Avoid:
- nested schemas unless necessary
- mixed types
- dynamic schemas
- schema methods

---

## Naming

Files:
- user.schema.ts

Classes:
- User

Types:
- UserDocument

Schema export:
- UserSchema
