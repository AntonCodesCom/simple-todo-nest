import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthInterceptor } from 'src/auth/auth.interceptor';
import UserId from 'src/auth/user-id.decorator';
import { TodoEntity } from './entities/todo.entity';

@UseInterceptors(AuthInterceptor)
@ApiBearerAuth()
@ApiTags('todo')
@ApiUnauthorizedResponse()
@ApiInternalServerErrorResponse()
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiCreatedResponse({
    type: TodoEntity,
  })
  @ApiBadRequestResponse()
  @Post()
  create(
    @Body() createTodoDto: CreateTodoDto,
    @UserId() userId: string,
  ): Promise<TodoEntity> {
    return this.todoService.create(createTodoDto, userId);
  }

  @ApiOkResponse({
    type: TodoEntity,
    isArray: true,
  })
  @Get()
  async findAllByUserId(@UserId() userId: string): Promise<TodoEntity[]> {
    const todos = await this.todoService.findAllByUserId(userId);
    return todos.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  @ApiOkResponse({
    type: TodoEntity,
  })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @Patch(':id')
  update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    // TODO: id IsUUID check
    return this.todoService.update(userId, id, updateTodoDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.todoService.remove(+id);
  // }
}
