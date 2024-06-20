import { User as UserModel } from '@prisma/client';

/**
 * User entity.
 */
export class UserEntity implements UserModel {
  id: string;
  username: string;
  passwordHash: string;
}
