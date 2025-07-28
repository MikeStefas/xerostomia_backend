import { Test, TestingModule } from '@nestjs/testing';
import { ClinicianController } from './clinician.controller';
import { ClinicianService } from './clinician.service';
import { ClinicianJwtGuard } from './guard'; // Assuming this guard exists and is exported
import { ExecutionContext, CanActivate } from '@nestjs/common';
import { Observable } from 'rxjs';

// Mock the ClinicianService
const mockClinicianService = {
  viewReports: jest.fn(),
  viewPatients: jest.fn(),
  viewUserData: jest.fn(),
  viewUserReports: jest.fn(),
};

// Mock the ClinicianJwtGuard
// We'll create a mock guard that always returns true, simulating a successful authentication
class MockClinicianJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true; // Always allow access for testing purposes
  }
}

describe('ClinicianController', () => {
  let controller: ClinicianController;
  let service: ClinicianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicianController],
      providers: [
        {
          provide: ClinicianService,
          useValue: mockClinicianService,
        },
      ],
    })
      .overrideGuard(ClinicianJwtGuard) // Override the actual guard with our mock
      .useClass(MockClinicianJwtGuard)
      .compile();

    controller = module.get<ClinicianController>(ClinicianController);
    service = module.get<ClinicianService>(ClinicianService);

    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('viewReports', () => {
    it('should call clinicianService.viewReports and return its result', async () => {
      const mockRequest = { user: { userID: 1, role: 'CLINICIAN' } };
      const expectedReports = [{ id: 1, data: 'report1' }];
      mockClinicianService.viewReports.mockResolvedValueOnce(expectedReports);

      const result = await controller.viewReports(mockRequest);

      expect(mockClinicianService.viewReports).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(expectedReports);
    });
  });

  describe('viewPatients', () => {
    it('should call clinicianService.viewPatients and return its result', async () => {
      const mockRequest = { user: { userID: 1, role: 'CLINICIAN' } };
      const expectedPatients = [{ id: 101, name: 'Patient A' }];
      mockClinicianService.viewPatients.mockResolvedValueOnce(expectedPatients);

      const result = await controller.viewPatients(mockRequest);

      expect(mockClinicianService.viewPatients).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(expectedPatients);
    });
  });

  describe('viewUserData', () => {
    it('should call clinicianService.viewUserData with the provided userID', async () => {
      const mockRequest = { user: { userID: 1, role: 'CLINICIAN' } };
      const userID = 5;
      const expectedUserData = { id: userID, name: 'User Five' };
      mockClinicianService.viewUserData.mockResolvedValueOnce(expectedUserData);

      const result = await controller.viewUserData(mockRequest, { userID });

      expect(mockClinicianService.viewUserData).toHaveBeenCalledWith(userID);
      expect(result).toEqual(expectedUserData);
    });
  });

  describe('viewUserReports', () => {
    it('should call clinicianService.viewUserReports with the provided userID', async () => {
      const mockRequest = { user: { userID: 1, role: 'CLINICIAN' } };
      const userID = 10;
      const expectedUserReports = [{ id: 201, content: 'User 10 Report' }];
      mockClinicianService.viewUserReports.mockResolvedValueOnce(expectedUserReports);

      const result = await controller.viewUserReports(mockRequest, { userID });

      expect(mockClinicianService.viewUserReports).toHaveBeenCalledWith(userID);
      expect(result).toEqual(expectedUserReports);
    });
  });
});