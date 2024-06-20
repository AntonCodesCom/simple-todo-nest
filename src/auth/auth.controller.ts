import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoggedInDto } from './dto/logged-in.dto';
import { AuthService } from './auth.service';
import { InvalidCredentialsException } from './exceptions';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  me() {
    return {};
  }

  @ApiBody({
    type: LoginDto,
  })
  @ApiOkResponse({ type: LoggedInDto })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoggedInDto> {
    // if (!isStrongPassword(loginDto.password)) {
    //   throw new UnauthorizedException(); // invalid password will obviously fail
    // }
    try {
      return await this.authService.login(loginDto);
    } catch (err) {
      if (err instanceof InvalidCredentialsException) {
        throw new UnauthorizedException();
      }
      throw err;
    }
  }
}
