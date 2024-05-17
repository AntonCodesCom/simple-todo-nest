import { PickType } from '@nestjs/swagger';
import { TodoEntity } from '../entities/todo.entity';

export class CreateTodoDto extends PickType(TodoEntity, ['label']) {}
