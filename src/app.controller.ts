import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { User as UserModel, Todo as TodoModel } from '@prisma/client';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly userService: UserService,
    private readonly todoService: TodoService,
    private authService: AuthService,
  ) {}

  @Get('todo/:id')
  async getTodoById(@Param('id') id: string): Promise<TodoModel> {
    return this.todoService.todo({ id: Number(id) });
  }

  @Get('feed')
  async getPublishedTodos(): Promise<TodoModel[]> {
    return this.todoService.todos({
      where: { status: 'completed' },
    });
  }

  @Get('filtered-todos/:searchString')
  async getFilteredTodos(
    @Param('searchString') searchString: string,
  ): Promise<TodoModel[]> {
    return this.todoService.todos({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            description: { contains: searchString },
          },
        ],
      },
    });
  }

  @Post('todo')
  async createTodo(
    @Body() todoData: { title: string; description: string; status: string },
  ): Promise<TodoModel> {
    const { title, description, status } = todoData;
    return this.todoService.createTodo({
      title,
      description,
      status,
    });
  }

  @Post('user')
  async signupUser(
    @Body() userData: { username: string; email: string; password: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put('user/:id')
  async updateUser(
    @Body() userData: { name: string; email: string; password: string },
    @Param('id') id: string,
  ): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data: userData,
    });
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id: Number(id) });
  }

  @Put('todo/:id')
  async updateTodo(
    @Param('id') id: string,
    @Body() todoData: { title: string; description: string; status: string },
  ): Promise<TodoModel> {
    return this.todoService.updateTodo({
      where: { id: Number(id) },
      data: todoData,
    });
  }

  @Delete('todo/:id')
  async deleteTodo(@Param('id') id: string): Promise<TodoModel> {
    return this.todoService.deleteTodo({ id: Number(id) });
  }
}
