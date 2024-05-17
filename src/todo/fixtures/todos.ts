import { TodoEntity, initTodos } from '../entities/todo.entity';
import { aliceUserId, bobUserId } from './user-ids';

const todos: TodoEntity[] = initTodos([
  {
    id: 'ef1e68db-6e1d-42f0-8e31-574694236062',
    userId: aliceUserId,
    label: 'Initialize Remix frontend.',
    done: true,
    createdAt: new Date('2024-05-17T20:00:00.000Z'),
  },
  {
    userId: aliceUserId,
    label: 'Setup NestJS backend.',
    done: true,
    createdAt: new Date('2024-05-17T20:10:00.000Z'),
  },
  {
    userId: aliceUserId,
    label: 'Integrate frontend with backend.',
    done: false,
    createdAt: new Date('2024-05-17T20:20:00.000Z'),
  },
  {
    userId: bobUserId,
    label: 'Learn React & Node.js!',
    done: false,
  },
]);

export default todos;
