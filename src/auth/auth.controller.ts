import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  me() {
    return {};
  }

  @Post('login')
  login() {}
}
