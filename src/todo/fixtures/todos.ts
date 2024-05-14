import { TodoEntity, initTodos } from '../entities/todo.entity';
import { aliceUserId, bobUserId } from './user-ids';

const todos: TodoEntity[] = initTodos([
  {
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
