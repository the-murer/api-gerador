import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Post,
} from '@nestjs/common';
import { SignInHandler } from './handlers/sing-in.handler';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '@app/utils/public.decorator';
import { ForgotPasswordHandler } from './handlers/forgot-password.handler';
import { RecoverPasswordHandler } from './handlers/recover-password.handler';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private signInHandler: SignInHandler,
    private recoveryPasswordHandler: RecoverPasswordHandler,
    private forgotPasswordHandler: ForgotPasswordHandler,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  async signIn(@Body() signInDto: SignInDto) {
    const response = await this.signInHandler.execute({
      email: signInDto.email,
      pass: signInDto.password,
    });

    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Patch('recover-password/:hash')
  @Public()
  async recoveryPassword(
    @Body() recoverPasswordDto: RecoverPasswordDto,
    @Param('hash') hash: string,
  ) {
    const response = await this.recoveryPasswordHandler.execute({
      hash,
      password: recoverPasswordDto.password,
    });

    return response;
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const response = await this.forgotPasswordHandler.execute({
      email: forgotPasswordDto.email,
    });

    return response;
  }
}
