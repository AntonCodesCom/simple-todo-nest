import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoggedInDto } from './dto/logged-in.dto';
import { InvalidCredentialsException } from './exceptions';
import { EnvService } from 'src/env/env.service';
import { PrismaService } from 'src/prisma/prisma.service';

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
    // const passwordMatch = await verify(passwordHash, loginDto.password);
    const passwordMatch = passwordHash === loginDto.password; // TODO: argon2
    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }
    return {
      accessToken: this.generateAccessToken(id),
      username,
    };
  }

  private generateAccessToken(userId: string): string {
    // const { jwtSecret } = this.envService;
    // return sign({ sub: userId }, jwtSecret);
    return userId; // TODO: jwt
  }
}
