import { faker } from '@faker-js/faker';
import { Todo as TodoModel } from '@prisma/client';
import { aliceUserId } from '../fixtures/user-ids';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Todo entity.
 */
export class TodoEntity implements TodoModel {
  @ApiProperty({
    type: 'uuid',
  })
  id: string;

  @ApiProperty()
  label: string;

  @ApiProperty({
    type: 'uuid',
  })
  userId: string;
}

function initTodo(partial: Partial<TodoEntity>): TodoEntity {
  return {
    id: partial.id || faker.string.uuid(),
    label: partial.label ?? faker.lorem.sentence(),
    userId: partial.userId || aliceUserId,
  };
}

// for data seeding
export function initTodos(partials: Partial<TodoEntity>[]): TodoEntity[] {
  return partials.map(initTodo);
}
