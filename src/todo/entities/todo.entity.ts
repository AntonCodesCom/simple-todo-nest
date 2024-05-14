import { Todo as TodoModel } from '@prisma/client';

export class TodoEntity implements TodoModel {
  id: string;
  label: string;
  userId: string;
}
