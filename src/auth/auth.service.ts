
import { UsersRepository } from '@app/users/users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async signIn(name: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({ name });
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }
}
