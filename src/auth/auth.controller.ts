import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInHandler } from './handlers/sing-in.handler';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '@app/utils/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private signInHandler: SignInHandler) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  async signIn(@Body() signInDto: SignInDto) {
    const response = await this.signInHandler.execute({
      email: signInDto.email,
      pass: signInDto.password
    });

    return response
  }
}
