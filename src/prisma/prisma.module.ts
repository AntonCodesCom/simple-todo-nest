import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // data access layer is global
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
