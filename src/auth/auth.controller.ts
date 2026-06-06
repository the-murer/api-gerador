import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { SignInHandler } from './handlers/sign-in.handler';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '@app/utils/public.decorator';
import { ForgotPasswordHandler } from './handlers/forgot-password.handler';
import { RecoverPasswordHandler } from './handlers/recover-password.handler';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { WhoAmIHandler } from './handlers/who-am-i.handler';
import { ChangeWorkspaceHandler } from './handlers/change-workspace.handler';

@Controller('auth')
export class AuthController {
  constructor(
    private signInHandler: SignInHandler,
    private recoveryPasswordHandler: RecoverPasswordHandler,
    private forgotPasswordHandler: ForgotPasswordHandler,
    private whoAmIHandler: WhoAmIHandler,
    private changeWorkspaceHandler: ChangeWorkspaceHandler,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  async signIn(@Body() signInDto: SignInDto, @Req() req) {
    const user = await this.signInHandler.execute({
      email: signInDto.email,
      pass: signInDto.password,
    });

    req.session.user = user;

    return user;
  }

  @Get('me')
  async whoAmI(@Req() req) {
    const sessionUser = req.session.user!;

    return this.whoAmIHandler.execute({
      userId: sessionUser._id,
      workspaceId: sessionUser.workspaceId,
    });
  }

  @Patch('change-workspace/:workspaceId')
  async changeWorkspace(
    @Req() req,
    @Param('workspaceId') workspaceId: string,
  ) {
    
    const sessionUser = req.session.user!;
    console.log("🚀 ~ AuthController ~ changeWorkspace ~ sessionUser:", sessionUser)

    const user = await this.changeWorkspaceHandler.execute({
      userId: sessionUser._id,
      workspaceId,
    });

    req.session.user = user;

    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @Public()
  async logout(@Req() req) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) reject(err);
        else resolve({ success: true });
      });
    });
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
