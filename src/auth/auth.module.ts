import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [UserService],
  exports: [UserService],
})
export class AuthModule {}
