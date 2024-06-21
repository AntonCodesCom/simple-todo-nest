import { ApiProperty } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';

/**
 * User entity.
 */
export class UserEntity implements UserModel {
  id: string;

  @ApiProperty({
    example: 'alice',
  })
  username: string;

  passwordHash: string;
}
