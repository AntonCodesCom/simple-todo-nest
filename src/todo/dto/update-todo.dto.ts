import { PartialType } from '@nestjs/mapped-types';
import { PickType } from '@nestjs/swagger';
import { TodoEntity } from '../entities/todo.entity';

export class UpdateTodoDto extends PartialType(
  PickType(TodoEntity, ['label', 'done']),
) {}
