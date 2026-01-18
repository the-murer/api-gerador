import { UserRoles } from '../src/users/users.schema';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.MONGO_DB_URI;
async function generateAdminUser() {
  const mongoose = require('mongoose');
  mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true });

  const UserSchema = new mongoose.Schema({
    name: String,
    active: Boolean,
    email: String,
    password: String,
    roles: [String],
  });

  const User = mongoose.model('User', UserSchema);


  const passwordToHash = '123456';
  const password = await bcrypt.hash(passwordToHash, 10);

  const user = new User({
    name: 'Adminilson',
    roles: [UserRoles.ADMIN],
    active: true,
    password: password,
    email: 'admin@example.com',
  });

  user.save().then(() => {
    console.log("Usuário criado:", user);
  }).catch((error) => {
    console.error("Falha ao criar usuário:", error);
  });
}

generateAdminUser();