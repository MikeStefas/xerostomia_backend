import { Module } from '@nestjs/common';
import { ReportsService } from './reports-service';
import { ReportsController } from './reports-controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma-module';
import { PrismaController } from 'src/prisma/prisma-controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [PrismaModule, JwtModule.register({}),MulterModule.register({
    storage: diskStorage({
      destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
      },
    }),
  })],
  providers: [ReportsService],
  controllers: [ReportsController, PrismaController],
})
export class ReportsModule {}
