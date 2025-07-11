import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './authdto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(body: AuthDto) {
    const hashedPassword = await argon2.hash(body.password);
    const user =  await this.prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        role: "USER",
      },
    });
    
    return this.signTokens(user.id, user.email, user.role);
  }

  async deleteacc(body: AuthDto) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const pwMatches = await argon2.verify(
      user.password, //hashed password from the database
      body.password,
    );
    if (!pwMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.prisma.user.delete({
    where: {
    email: body.email,
    },
  });
  }

  async signin(body: AuthDto) {
    // find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const pwMatches = await argon2.verify(
      user.password, //hashed password from the database
      body.password,
    );
    if (!pwMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signTokens(user.id, user.email, user.role);
  }
  
  async signTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<{ access_token: string , refresh_token: string }> {
    const payload = {
      sub: userId,
      email,
      role,
    };
    const secret = this.config.get('JWT_SECRET');
    const secretRefresh = this.config.get('JWT_SECRET_REFRESH');

    const accessToken = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: secret,
      },
    );

    const refreshToken = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '7d',
        secret: secretRefresh,
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken, 
    };
  }
  async refreshTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<{ access_token: string}> {
    const payload = {
      sub: userId,
      email,
      role,
    };
    const secret = this.config.get('JWT_SECRET');
    const accessToken = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: secret,
      },
    );

    

    return {
      access_token: accessToken,
    };
  }
}