import { UserEntity, initUser } from '../entities/user.entity';

export const aliceUserId = '878664be-1926-44ab-9c77-eb5d803369be';
export const bobUserId = '5db73b24-bbc4-49a3-b6a5-ec36a240a7d5';

/**
 * Users fixture factory.
 *
 * This fixture MUST contain a user with username `alice` and password `Alice1111$`
 * in order for end-to-end tests to function correctly.
 */
export function getUsersFixture(): Promise<UserEntity[]> {
  return Promise.all([
    initUser({ id: aliceUserId, username: 'alice' }, 'Alice1111$'),
    initUser({ id: bobUserId, username: 'bob' }, 'Bob2222$'),
  ]);
}
