import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoggedInDto } from './dto/logged-in.dto';
import { InvalidCredentialsException } from './exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { verify } from 'argon2';
import { EnvService } from 'src/env/env.service';
import { sign } from 'jsonwebtoken';

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
      accessToken: sign({ sub: id }, this.envService.jwtSecret, {
        expiresIn: '4w',
      }),
      username,
    };
  }

  private generateAccessToken0(userId: string): string {
    // const { jwtSecret } = this.envService;
    // return sign({ sub: userId }, jwtSecret);
    return userId; // TODO: jwt
  }
}
