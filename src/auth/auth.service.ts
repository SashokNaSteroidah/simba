import {Injectable}      from '@nestjs/common';
import {DatabaseService} from "../database/database.service";

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService) {
    }

    loginUser(): unknown {
        return this.databaseService.users.findMany({})
    }

    registerUser(): string {
        return 'reg'
    }
}
