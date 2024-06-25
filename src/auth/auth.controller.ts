import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { LoggedInDto } from './dto/logged-in.dto';
import { AuthService } from './auth.service';
import {
  InvalidCredentialsException,
  UsernameTakenException,
} from './exceptions';
import { MeDto } from './dto/me.dto';
import UserId from './user-id.decorator';
import { UserService } from './user.service';
import { AuthInterceptor } from './auth.interceptor';
import { SignupDto } from './dto/signup.dto';
import { LoginValidationDto } from './dto/login-validation.dto';
import { validateOrReject } from 'class-validator';

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
  @ApiUnauthorizedResponse()
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoggedInDto> {
    const { username, password } = loginDto;
    const loginValidationDto = new LoginValidationDto();
    loginValidationDto.username = username;
    loginValidationDto.password = password;
    try {
      await validateOrReject(loginValidationDto);
    } catch (err) {
      throw new UnauthorizedException();
    }
    try {
      return await this.authService.login(loginDto);
    } catch (err) {
      if (err instanceof InvalidCredentialsException) {
        throw new UnauthorizedException();
      }
      throw err;
    }
  }

  @ApiBody({
    type: SignupDto,
  })
  @ApiCreatedResponse({ type: LoggedInDto })
  @ApiBadRequestResponse()
  @ApiConflictResponse({
    description: 'When the username is already taken.',
  })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<LoggedInDto> {
    try {
      return await this.authService.signup(signupDto);
    } catch (err) {
      if (err instanceof UsernameTakenException) {
        throw new ConflictException('Username taken.');
      }
      throw err;
    }
  }
}
