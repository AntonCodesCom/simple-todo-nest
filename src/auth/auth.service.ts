import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoggedInDto } from './dto/logged-in.dto';
import {
  InvalidCredentialsException,
  UsernameTakenException,
} from './exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { EnvService } from 'src/env/env.service';
import { sign } from 'jsonwebtoken';
import { SignupDto } from './dto/signup.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { validateOrReject } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly envService: EnvService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * Login.
   *
   * @param {LoginDto} loginDto
   * @returns {LoggedInDto}
   * @throws `InvalidCredentialsException`
   */
  async login(loginDto: LoginDto): Promise<LoggedInDto> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginDto.username,
      },
    });
    if (!user) {
      throw new InvalidCredentialsException();
    }
    const { id, username, passwordHash } = user;
    const passwordMatch = await verify(passwordHash, loginDto.password);
    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }
    return {
      accessToken: this.generateAccessToken(id),
      username,
    };
  }

  private generateAccessToken(userId: string): string {
    return sign({ sub: userId }, this.envService.jwtSecret, {
      expiresIn: '7d',
    });
  }

  /**
   * Signup.
   *
   * @param {SignupDto} signupDto
   * @returns {LoggedInDto}
   * @throws `UsernameTakenException`
   * @throws `ValidationError[]` - see `class-validator`
   * @throws `Error`
   */
  async signup(signupDto: SignupDto): Promise<LoggedInDto> {
    const dtoToValidate = new SignupDto();
    dtoToValidate.username = signupDto.username;
    dtoToValidate.password = signupDto.password;
    await validateOrReject(dtoToValidate);
    const passwordHash = await hash(signupDto.password);
    try {
      const { id, username } = await this.prismaService.user.create({
        data: {
          username: signupDto.username,
          passwordHash,
        },
      });
      return {
        accessToken: this.generateAccessToken(id),
        username,
      };
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new UsernameTakenException();
      }
      throw err;
    }
  }
}
