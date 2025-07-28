import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard'; // Adjust path if needed based on your actual file structure
import { ExecutionContext, CanActivate, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import { reportDto } from './report.dto'; // Import your DTOs
import { UserDataDto } from './userdata.dto'; // Import your DTOs

// Mock the UserService
const mockUserService = {
  uploadUserData: jest.fn(),
  uploadReport: jest.fn(),
  getReports: jest.fn(),
};

// Mock the JwtGuard
// This guard will always return true and set a mock user on the request
class MockJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    // Simulate the user object that would be attached by the real JwtGuard
    req.user = { userID: 1, email: 'test@example.com', role: 'USER' };
    return true; // Always allow access for testing purposes
  }
}

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService, // Provide our mock UserService
        },
      ],
    })
      .overrideGuard(JwtGuard) // Override the real JwtGuard
      .useClass(MockJwtGuard) // Use our mock guard instead
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService); // Get a reference to the mocked service

    // Clear all mock call counts and reset mock return values before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadUserData', () => {
    it('should call userService.uploadUserData with the correct user and body', async () => {
      const mockUserDataDto: UserDataDto = {
        yearOfBirth: 1990,
        gender: 'Male',
        // ... include all required properties for your UserDataDto
      };
      const expectedServiceResult = { success: true, message: 'User data uploaded' };
      // Configure the mock service to return a value
      mockUserService.uploadUserData.mockResolvedValueOnce(expectedServiceResult);

      // Simulate the request object that NestJS provides
      const mockRequest = { user: { userID: 1, email: 'test@example.com', role: 'USER' } };

      const result = await controller.uploadUserData(mockRequest, mockUserDataDto);

      // Assert that the userService method was called with the expected arguments
      expect(mockUserService.uploadUserData).toHaveBeenCalledWith(
        mockRequest.user,
        mockUserDataDto,
      );
      // Assert that the controller returns the result from the service
      expect(result).toEqual(expectedServiceResult);
    });
  });

  describe('uploadReport', () => {
    it('should call userService.uploadReport with the correct user and body', async () => {
      const mockReportDto: reportDto = {
        tongue: 'red',
        tonguePercentage: 70,
        teeth: 'white',
        teethPercentage: 90,
        saliva: 'normal',
        salivaPercentage: 80,
        pain: 'none',
        painPercentage: 0,
        // ... include all required properties for your reportDto
      };
      const expectedServiceResult = { success: true, message: 'Report uploaded' };
      mockUserService.uploadReport.mockResolvedValueOnce(expectedServiceResult);

      const mockRequest = { user: { userID: 1, email: 'test@example.com', role: 'USER' } };

      const result = await controller.uploadReport(mockRequest, mockReportDto);

      expect(mockUserService.uploadReport).toHaveBeenCalledWith(
        mockRequest.user,
        mockReportDto,
      );
      expect(result).toEqual(expectedServiceResult);
    });
  });

  describe('getReports', () => {
    it('should call userService.getReports with the correct user and return the reports', async () => {
      const expectedReports = [
        { id: 1, userID: 1, reportName: 'Daily Report' },
        { id: 2, userID: 1, reportName: 'Weekly Summary' },
      ];
      mockUserService.getReports.mockResolvedValueOnce(expectedReports);

      const mockRequest = { user: { userID: 1, email: 'test@example.com', role: 'USER' } };

      const result = await controller.getReports(mockRequest);

      expect(mockUserService.getReports).toHaveBeenCalledWith(mockRequest.user);
      expect(result).toEqual(expectedReports);
    });

    it('should return an empty array if no reports are found for the user', async () => {
      mockUserService.getReports.mockResolvedValueOnce([]);

      const mockRequest = { user: { userID: 2, email: 'another@example.com', role: 'USER' } };

      const result = await controller.getReports(mockRequest);

      expect(mockUserService.getReports).toHaveBeenCalledWith(mockRequest.user);
      expect(result).toEqual([]);
    });
  });
});