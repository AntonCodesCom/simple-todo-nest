import { Injectable } from '@nestjs/common';
import { EnvService } from 'src/env/env.service';
import { PrismaService } from 'src/prisma/prisma.service';
import usersFixture from './fixtures/users.fixture';
import { MeDto } from './dto/me.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly envService: EnvService,
    private readonly prismaService: PrismaService,
  ) {}

  async getMe(id: string): Promise<MeDto | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) {
      return null;
    }
    const { username } = user;
    return { username };
  }

  async clear(): Promise<void> {
    if (this.envService.isProd) {
      throw new Error('Data seeding is not allowed in production mode.');
    }
    await this.prismaService.user.deleteMany({});
  }

  async seed(): Promise<void> {
    if (this.envService.isProd) {
      throw new Error('Data seeding is not allowed in production mode.');
    }
    await this.prismaService.user.createMany({
      data: usersFixture,
    });
  }
}
