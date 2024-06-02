import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthInterceptor } from 'src/auth/auth.interceptor';
import UserId from 'src/auth/user-id.decorator';
import { TodoEntity } from './entities/todo.entity';
import todosFixture from './fixtures/todos';

// @UseInterceptors(AuthInterceptor)
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
  findAllByUserId(@UserId() userId: string) {
    // const todos = await this.todoService.findAllByUserId(userId);
    return this.todoService.findAll();
  }
  // async findAllByUserId(@UserId() userId: string): Promise<TodoEntity[]> {
  //   const todos = await this.todoService.findAllByUserId(userId);
  //   return todos.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  // }

  @ApiOkResponse({
    type: TodoEntity,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Patch(':id')
  async update(
    @UserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    const updatedTodo = await this.todoService.update(
      userId,
      id,
      updateTodoDto,
    );
    if (!updatedTodo) {
      throw new NotFoundException();
    }
    return updatedTodo;
  }

  @ApiOkResponse({
    type: TodoEntity,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Delete(':id')
  async remove(
    @UserId() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TodoEntity> {
    const deletedTodo = await this.todoService.remove(userId, id);
    if (!deletedTodo) {
      throw new NotFoundException();
    }
    return deletedTodo;
  }
}
