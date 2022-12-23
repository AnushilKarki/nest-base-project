import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
// import { Prisma , User } from '@prisma/client';
// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
      email: 'john@gmail.com',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
      email: 'maria@gmail.com',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    // return this.users.find((user) => user.email === username);
    return this.prisma.user.findUnique({
      where: {
        email: username,
      },
    });
  }
}
