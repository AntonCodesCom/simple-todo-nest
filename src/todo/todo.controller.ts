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

// @UseInterceptors(AuthInterceptor)
@ApiBearerAuth()
@ApiTags('todo')
@ApiUnauthorizedResponse()
@ApiInternalServerErrorResponse()
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseInterceptors(AuthInterceptor) // TODO: remove after completing writing tests
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

  @UseInterceptors(AuthInterceptor) // TODO: remove after completing writing tests
  @ApiOkResponse({
    type: TodoEntity,
    isArray: true,
  })
  @Get()
  findAll(@UserId() userId: string): Promise<TodoEntity[]> {
    return this.todoService.findAll(userId);
  }

  @UseInterceptors(AuthInterceptor) // TODO: remove after completing writing tests
  @ApiOkResponse({
    type: TodoEntity,
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Patch(':id')
  async update(
    @UserId() userId: string,
    // @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) /*: Promise<TodoEntity>*/ {
    // const updatedTodo = await this.todoService.update(
    //   userId,
    //   id,
    //   updateTodoDto,
    // );
    // if (!updatedTodo) {
    //   throw new NotFoundException();
    // }
    // return updatedTodo;
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
