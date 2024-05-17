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
    example: 'ef1e68db-6e1d-42f0-8e31-574694236062',
  })
  id: string;

  @ApiProperty({
    type: 'uuid',
    example: aliceUserId,
  })
  userId: string;

  @ApiProperty({
    example: 'Learn NestJS.',
  })
  label: string;

  @ApiProperty({
    type: 'boolean',
  })
  done: boolean;
}

function initTodo(partial: Partial<TodoEntity>): TodoEntity {
  return {
    id: partial.id || faker.string.uuid(),
    userId: partial.userId || aliceUserId,
    label: partial.label ?? faker.lorem.sentence(),
    done: partial.done ?? faker.datatype.boolean(),
  };
}

// for data seeding
export function initTodos(partials: Partial<TodoEntity>[]): TodoEntity[] {
  return partials.map(initTodo);
}
