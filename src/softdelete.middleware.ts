import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({});

export async function main() {
  prisma.$use(async (params, next) => {
    // Check incoming query type
    if (params.model == 'Todo') {
      if (params.action == 'delete') {
        // Delete queries
        // Change action to an update
        params.action = 'update';
        params.args['data'] = { deleted: true };
      }
    }
    return next(params);
  });
}
