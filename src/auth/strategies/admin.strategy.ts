import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(
  Strategy,
  'admin-jwt', 
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = config.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new UnauthorizedException('JWT_SECRET is not defined in configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: {
        userID: payload.sub,
      },
    });

    if (!user) {
        throw new UnauthorizedException('User doesnt exist');
    }
    if (user.role !== 'ADMIN') {
        throw new UnauthorizedException('Unauthorized: User is not an admin');
        }
    user.password = '';
    return user;
    }
}