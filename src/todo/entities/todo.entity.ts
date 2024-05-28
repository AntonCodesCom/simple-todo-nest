import { faker } from '@faker-js/faker';
import { Todo as TodoModel } from '@prisma/client';
import { aliceUserId } from '../fixtures/user-ids';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
    format: 'uuid',
    example: aliceUserId,
  })
  userId: string;

  @ApiProperty({
    example: 'Learn NestJS.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  label: string;

  @ApiProperty({
    type: 'boolean',
  })
  @IsBoolean()
  done: boolean;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;
}

function initTodo(partial: Partial<TodoEntity>): TodoEntity {
  return {
    id: partial.id || faker.string.uuid(),
    userId: partial.userId || aliceUserId,
    label: partial.label ?? faker.lorem.sentence(),
    done: partial.done ?? faker.datatype.boolean(),
    createdAt: partial.createdAt || new Date(),
  };
}

// for data seeding
export function initTodos(partials: Partial<TodoEntity>[]): TodoEntity[] {
  return partials.map(initTodo);
}
