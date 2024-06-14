import { TodoEntity, initTodos } from '../entities/todo.entity';
import { aliceUserId, bobUserId } from './user-ids';

/**
 * Todo items fixture.
 *
 * This fixture MUST contain at least 3 elements with
 * `userId = aliceUserId` in order for end-to-end tests
 * to function correctly.
 */
const todosFixture: TodoEntity[] = initTodos([
  {
    id: 'ef1e68db-6e1d-42f0-8e31-574694236062',
    userId: aliceUserId,
    label: 'Initialize Remix frontend.',
    done: true,
    createdAt: new Date('2024-05-17T20:00:00.000Z'),
  },
  {
    id: '32d9ff44-0e18-468c-a9e4-23b1e3994b4f',
    userId: aliceUserId,
    label: 'Setup NestJS backend.',
    done: true,
    createdAt: new Date('2024-05-17T20:10:00.000Z'),
  },
  {
    id: 'c65f0b92-9cab-4a17-a043-17087beb6897',
    userId: aliceUserId,
    label: 'Integrate frontend with backend.',
    done: false,
    createdAt: new Date('2024-05-17T20:20:00.000Z'),
  },
  {
    id: 'd382a0ab-e34a-478a-9900-fb5b561f3ce0',
    userId: bobUserId,
    label: 'Learn React & Node.js!',
    done: false,
  },
]);

export default todosFixture;
