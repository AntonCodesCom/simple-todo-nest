import { TodoEntity, initTodos } from '../entities/todo.entity';
import { aliceUserId, bobUserId } from './user-ids';

const todos: TodoEntity[] = initTodos([
  {
    id: 'ef1e68db-6e1d-42f0-8e31-574694236062',
    label: 'Initialize Remix frontend.',
    userId: aliceUserId,
  },
  {
    label: 'Setup NestJS backend.',
    userId: aliceUserId,
  },
  {
    label: 'Integrate frontend with backend.',
    userId: aliceUserId,
  },
  {
    label: 'Learn React & Node.js!',
    userId: bobUserId,
  },
]);

export default todos;
