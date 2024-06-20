import { UserEntity } from '../entities/user.entity';

const usersFixture: UserEntity[] = [
  {
    id: '878664be-1926-44ab-9c77-eb5d803369be',
    username: 'alice',
    passwordHash: 'User1111$', // TODO: argon2
  },
  {
    id: '5db73b24-bbc4-49a3-b6a5-ec36a240a7d5',
    username: 'bob',
    passwordHash: 'User2222$', // TODO: argon2
  },
];

export default usersFixture;
