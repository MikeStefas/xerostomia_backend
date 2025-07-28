import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './authdto'; // Assuming authdto.ts exists
import { RefreshGuard } from './guard/refresh.guard'; // Assuming refresh.guard.ts exists

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  // Mock implementation for AuthService
  const mockAuthService = {
    signup: jest.fn(),
    deleteacc: jest.fn(),
    signin: jest.fn(),
    refreshTokens: jest.fn(),
  };

  // Mock implementation for RefreshGuard
  // In unit tests, guards are often mocked to just return true
  const mockRefreshGuard = {
    canActivate: jest.fn(() => true), // Mock canActivate to always return true
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService, // Provide the mock service
        },
      ],
    })
      .overrideGuard(RefreshGuard) // Override the actual guard with our mock
      .useValue(mockRefreshGuard)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  // Test Case 1: Ensure controller is defined
  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  // Test Case 2: signup method
  describe('signup', () => {
    it('should call authService.signup with the correct body and return its result', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      const expectedResult = { message: 'User signed up successfully' };
      mockAuthService.signup.mockResolvedValue(expectedResult); // Mock the service method's return value

      const result = await authController.signup(signUpDto);

      expect(authService.signup).toHaveBeenCalledWith(signUpDto); // Check if service method was called
      expect(result).toEqual(expectedResult); // Check the returned value
    });
  });

  // Test Case 3: deleteacc method
  describe('deleteacc', () => {
    it('should call authService.deleteacc with the correct body and return its result', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResult = { message: 'Account deleted successfully' };
      mockAuthService.deleteacc.mockResolvedValue(expectedResult);

      const result = await authController.deleteacc(signInDto);

      expect(authService.deleteacc).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(expectedResult);
    });
  });

  // Test Case 4: signin method
  describe('signin', () => {
    it('should call authService.signin with the correct body and return tokens', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedTokens = { accessToken: 'mockAccessToken', refreshToken: 'mockRefreshToken' };
      mockAuthService.signin.mockResolvedValue(expectedTokens);

      const result = await authController.signin(signInDto);

      expect(authService.signin).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(expectedTokens);
    });
  });

  // Test Case 5: refreshTokens method
  describe('refreshTokens', () => {
    it('should call authService.refreshTokens with user info from request and return new tokens', async () => {
      // Mimic the structure of req.user that RefreshGuard would attach
      const mockRequest = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          role: 'user',
        },
      };
      const expectedNewTokens = { accessToken: 'newAccessToken', refreshToken: 'newRefreshToken' };
      mockAuthService.refreshTokens.mockResolvedValue(expectedNewTokens);

      const result = await authController.refreshTokens(mockRequest as any); // Cast as any for simplicity in test

      expect(authService.refreshTokens).toHaveBeenCalledWith(
        mockRequest.user.id,
        mockRequest.user.email,
        mockRequest.user.role
      );
      expect(result).toEqual(expectedNewTokens);
    });

    it('should use RefreshGuard for the refresh endpoint', () => {
      // This test primarily checks if the guard is "applied" at the testing module level.
      // The actual Guard logic (canActivate) is mocked.
      const guards = Reflect.getMetadata('__guards__', authController.refreshTokens);
      expect(guards).toBeDefined();
      expect(guards.length).toBeGreaterThan(0);
      expect(new guards[0]()).toBeInstanceOf(RefreshGuard); // Checks if the guard type is correct
    });
  });
});