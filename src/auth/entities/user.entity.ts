import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';
import { hash } from 'argon2';

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

export async function initUser(
  partial: Partial<UserEntity>,
  password = 'User1111$',
): Promise<UserEntity> {
  return {
    id: partial.id ?? faker.string.uuid(),
    username: partial.username ?? faker.person.firstName().toLowerCase(),
    passwordHash: await hash(password),
  };
}
