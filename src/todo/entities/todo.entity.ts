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
    example: 'Learn NestJS.',
  })
  label: string;

  @ApiProperty({
    format: 'uuid',
    example: aliceUserId,
  })
  userId: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;
}

function initTodo(partial: Partial<TodoEntity>): TodoEntity {
  return {
    id: partial.id || faker.string.uuid(),
    label: partial.label ?? faker.lorem.sentence(),
    userId: partial.userId || aliceUserId,
    createdAt: partial.createdAt || new Date(),
  };
}

// for data seeding
export function initTodos(partials: Partial<TodoEntity>[]): TodoEntity[] {
  return partials.map(initTodo);
}
