import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy} from './../../strategies/jwt.strategy';
import { RefreshStrategy } from './../../strategies/refresh.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminJwtStrategy } from '../../strategies/admin.strategy';

@Module({
  imports : [PrismaModule,JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,RefreshStrategy, AdminJwtStrategy]
})
export class AuthModule {}
