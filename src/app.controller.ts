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
  UseInterceptors,
  UploadedFiles,
  ParseFilePipeBuilder,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { User as UserModel, Todo as TodoModel } from '@prisma/client';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { SampleDto } from './sample.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
// import multer, { diskStorage } from 'multer';
// import { ApiConsumes } from '@nestjs/swagger';
// import express from 'express';

// const upload = multer({ dest: 'uploads/' });

// const app = express();
@Controller()
export class AppController {
  prisma: any;
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

  constructor(
    private readonly userService: UserService,
    private readonly todoService: TodoService,
    private authService: AuthService,
  ) {}

  @Get('todo/:id')
  async getTodoById(@Param('id') id: string): Promise<TodoModel> {
    return this.todoService.todo({ id: Number(id) });
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    return this.userService.user({ id: Number(id) });
  }

  @Get('feed')
  async getPublishedTodos(): Promise<TodoModel[]> {
    return this.todoService.todos({
      where: { status: 'completed' },
    });
  }

  @Get('nsfeed')
  async getNotStartedTodos(): Promise<TodoModel[]> {
    return this.todoService.todos({
      where: { status: 'not_started' },
    });
  }

  @Get('all')
  async getTodos() {
    return this.todoService.allTodo();
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

  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  @Post('todo')
  @UseInterceptors(
    FileInterceptor(
      'file',
      // , {
      //   storage: diskStorage({
      //     destination: './files',
      //     filename: (req, file, callback) => {
      //       // const uniqueSuffix = Date.now() + '=' + Math.round(Math.random() * 1e9);
      //       // const ext = extname(file.originalname);
      //       const filename = 'dsfds';
      //       callback(null, filename);
      //     },
      //   }),
      // }
    ),
  )
  async createTodo(
    @Body() body: SampleDto,
    @UploadedFiles()
    file,
    @Res() res,
    // : Express.Multer.File,
  ): Promise<TodoModel> {
    // return {
    //   body,
    //   file: file.buffer.toString(),
    // };
    console.log(file);

    // const upload = multer({ dest: 'uploads/' });
    // const upload = multer({ storage: storage });
    // upload.single('file'),
    //   function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    // const storage = multer.diskStorage({
    //   destination: function (req, file, cb) {
    //     cb(null, '/tmp/my-uploads');
    //   },
    //   filename: function (req, file, cb) {
    //     const uniqueSuffix =
    //       Date.now() + '-' + Math.round(Math.random() * 1e9);
    //     cb(null, file.fieldname + '-' + uniqueSuffix);
    //   },
    // });

    //   const upload = multer({ storage: storage });
    //   console.log(upload);
    // };
    // this.todoService.upload();
    return res;
    // return this.todoService.createTodo(body);
  }
  @UseInterceptors(FileInterceptor('file'))
  @Post('file/pass-validation')
  uploadFileAndPassValidation(
    @Body() body: SampleDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return {
      body,
      file: file?.buffer.toString(),
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/fail-validation')
  uploadFileAndFailValidation(
    @Body() body: SampleDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
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
