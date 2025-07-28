import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path if needed
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';

// Mock the external modules/services
const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

const mockJwtService = {
  signAsync: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_SECRET') return 'test-jwt-secret';
    if (key === 'JWT_SECRET_REFRESH') return 'test-jwt-refresh-secret';
    return null;
  }),
};

// Mock argon2.verify to control password verification
jest.mock('argon2', () => ({
  verify: jest.fn(),
  hash: jest.fn(), // Mock hash as well for signup
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    const signUpDto = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should successfully sign up a user', async () => {
      (argon2.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockResolvedValueOnce({
        userID: 1,
        ...signUpDto,
        password: 'hashedPassword',
        role: 'USER',
      });

      const result = await service.signup(signUpDto);
      expect(result).toEqual({ signup: 'successful' });
      expect(argon2.hash).toHaveBeenCalledWith(signUpDto.password);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: signUpDto.email,
          password: 'hashedPassword',
          firstName: signUpDto.firstName,
          lastName: signUpDto.lastName,
          role: 'USER',
        },
      });
    });

    it('should throw an error if user creation fails (e.g., duplicate email)', async () => {
      (argon2.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrismaService.user.create.mockRejectedValueOnce(
        new Error('Duplicate email'),
      ); // Simulate Prisma error

      await expect(service.signup(signUpDto)).rejects.toThrow(
        'Duplicate email',
      );
    });
  });

  describe('signin', () => {
    const signInDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };
    const mockUser = {
      userID: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'USER',
    };
    const mockTokens = {
      access_token: 'mockAccessToken',
      refresh_token: 'mockRefreshToken',
    };

    it('should successfully sign in a user and return tokens', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true); // Password matches
      mockJwtService.signAsync
        .mockResolvedValueOnce(mockTokens.access_token)
        .mockResolvedValueOnce(mockTokens.refresh_token);

      const result = await service.signin(signInDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: signInDto.email },
      });
      expect(argon2.verify).toHaveBeenCalledWith(
        mockUser.password,
        signInDto.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockTokens);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.signin(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.signin(signInDto)).rejects.toThrow('User not found');
    });

    it('should throw UnauthorizedException if passwords do not match', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValueOnce(false); // Password does not match

      await expect(service.signin(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.signin(signInDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('deleteacc', () => {
    const signInDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };
    const mockUser = {
      userID: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'USER',
    };

    it('should successfully delete a user account', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true); // Password matches
      mockPrismaService.user.delete.mockResolvedValueOnce({
        message: 'User deleted',
      }); // What Prisma returns for a delete operation

      const result = await service.deleteacc(signInDto);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: signInDto.email },
      });
      expect(argon2.verify).toHaveBeenCalledWith(
        mockUser.password,
        signInDto.password,
      );
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { email: signInDto.email },
      });
      expect(result).toEqual({ message: 'User deleted' }); // Adjust if your delete returns something else
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.deleteacc(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.deleteacc(signInDto)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw UnauthorizedException if passwords do not match', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValueOnce(false); // Password does not match

      await expect(service.deleteacc(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.deleteacc(signInDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('signTokens', () => {
    const userId = 1;
    const email = 'test@example.com';
    const role = 'USER';
    const mockAccessToken = 'mockAccessToken';
    const mockRefreshToken = 'mockRefreshToken';

    it('should generate access and refresh tokens', async () => {
      mockJwtService.signAsync
        .mockResolvedValueOnce(mockAccessToken)
        .mockResolvedValueOnce(mockRefreshToken);

      const result = await service.signTokens(userId, email, role);

      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET_REFRESH');
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: userId, email, role },
        { expiresIn: '15m', secret: 'test-jwt-secret' },
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: userId, email, role },
        { expiresIn: '7d', secret: 'test-jwt-refresh-secret' },
      );
      expect(result).toEqual({
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
      });
    });
  });

  describe('refreshTokens', () => {
    const userId = 1;
    const email = 'test@example.com';
    const role = 'USER';
    const mockAccessToken = 'mockRefreshedAccessToken';

    it('should generate a new access token', async () => {
      mockJwtService.signAsync.mockResolvedValueOnce(mockAccessToken);

      const result = await service.refreshTokens(userId, email, role);

      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: userId, email, role },
        { expiresIn: '15m', secret: 'test-jwt-secret' },
      );
      expect(result).toEqual({
        access_token: mockAccessToken,
      });
    });
  });
});