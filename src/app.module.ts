import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { main } from './softdelete.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { TodoService } from './todo.service';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, UserService, TodoService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(main)
      .forRoutes({ path: 'todo', method: RequestMethod.DELETE });
  }
}
