import {Injectable}   from '@nestjs/common';
import {PrismaClient} from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
    async onModuleInit(): Promise<void> {
        console.log('DatabaseService successfully connected')
        await this.$connect();
    }

    async onModuleDestroy(): Promise<void> {
        console.error('DatabaseService disconnect')
        await this.$disconnect();
    }
}
