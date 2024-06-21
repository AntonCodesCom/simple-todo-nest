import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoggedInDto } from './dto/logged-in.dto';
import { AuthService } from './auth.service';
import { InvalidCredentialsException } from './exceptions';
import { MeDto } from './dto/me.dto';
import UserId from './user-id.decorator';
import { UserService } from './user.service';
import { AuthInterceptor } from './auth.interceptor';

@ApiTags('auth')
@ApiInternalServerErrorResponse()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('me')
  @UseInterceptors(AuthInterceptor)
  @ApiBearerAuth()
  @ApiOkResponse({ type: MeDto })
  @ApiUnauthorizedResponse()
  async me(@UserId() userId: string): Promise<MeDto> {
    const meDto = await this.userService.getMe(userId);
    if (!meDto) {
      throw new Error('Unexpected error occurred while fetching the user.');
    }
    return meDto;
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
    // // if (!isStrongPassword(loginDto.password)) {
    // //   throw new UnauthorizedException(); // invalid password will obviously fail
    // // }
    try {
      return await this.authService.login(loginDto);
    } catch (err) {
      if (err instanceof InvalidCredentialsException) {
        throw new UnauthorizedException();
      }
      throw new InternalServerErrorException();
    }
  }
}
