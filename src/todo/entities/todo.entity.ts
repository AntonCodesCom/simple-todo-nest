import { faker } from '@faker-js/faker';
import { Todo as TodoModel } from '@prisma/client';
import { aliceUserId } from '../fixtures/user-ids';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    type: 'uuid',
    example: aliceUserId,
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
