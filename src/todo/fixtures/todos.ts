import { TodoEntity } from '../entities/todo.entity';

const aliceUserId = '878664be-1926-44ab-9c77-eb5d803369be';
const bobUserId = '5db73b24-bbc4-49a3-b6a5-ec36a240a7d5';

const todos: TodoEntity[] = [
  {
    id: '1',
    label: 'Initialize Remix frontend.',
    userId: aliceUserId,
  },
  {
    id: '2',
    label: 'Setup NestJS backend.',
    userId: aliceUserId,
  },
  {
    id: '3',
    label: 'Integrate frontend with backend.',
    userId: aliceUserId,
  },
  {
    id: '4',
    label: 'Learn React & Node.js!',
    userId: bobUserId,
  },
];

export default todos;
