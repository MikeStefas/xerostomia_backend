import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    getProfile(user: any) {
        return {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role,
        
        };
    }
}
