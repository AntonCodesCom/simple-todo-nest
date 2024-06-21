import { UserEntity } from '../entities/user.entity';

/**
 * Users fixture.
 *
 * This fixture MUST contain a user with username `alice` and password `Alice1111$`
 * in order for end-to-end tests to function correctly.
 */
const usersFixture: UserEntity[] = [
  {
    id: '878664be-1926-44ab-9c77-eb5d803369be',
    username: 'alice',
    passwordHash: 'Alice1111$', // TODO: argon2
  },
  {
    id: '5db73b24-bbc4-49a3-b6a5-ec36a240a7d5',
    username: 'bob',
    passwordHash: 'Bob2222$', // TODO: argon2
  },
];

export default usersFixture;
