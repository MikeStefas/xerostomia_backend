import { Test, TestingModule } from '@nestjs/testing';
import { ClinicianService } from './clinician.service';
import { PrismaService } from '../prisma/prisma.service'; // Adjust path if needed

// Mock the PrismaService
// This mock will simulate the behavior of Prisma's client
const mockPrismaService = {
  // Assuming a 'report' model in Prisma
  report: {
    findMany: jest.fn(),
  },
  // Assuming a 'user' or 'patient' model in Prisma
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(), // For viewUserData
  },
  // If reports are linked to users directly
  // userReport: {
  //   findMany: jest.fn(),
  // }
};

describe('ClinicianService', () => {
  let service: ClinicianService;
  let prisma: PrismaService; // Keep a reference to the mock Prisma service for assertions

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClinicianService,
        {
          provide: PrismaService, // Provide the mock for PrismaService
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClinicianService>(ClinicianService);
    prisma = module.get<PrismaService>(PrismaService); // Get the mock instance

    // Clear all mocks before each test to ensure isolation
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('viewReports', () => {
    it('should return reports for the clinician', async () => {
      const mockRequest = { user: { userID: 1, role: 'CLINICIAN' } };
      const expectedReports = [
        { id: 1, clinicianId: 1, data: 'Report 1' },
        { id: 2, clinicianId: 1, data: 'Report 2' },
      ];
      // Configure the mock Prisma service to return expected data
      mockPrismaService.report.findMany.mockResolvedValueOnce(expectedReports);

      const result = await service.viewReports(mockRequest);

      // Assert that Prisma's findMany was called (e.g., filtered by clinicianId)
      // You'll need to adjust the 'where' clause based on your actual service implementation
      expect(mockPrismaService.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { clinicianId: mockRequest.user.userID }, // Assuming reports are linked by clinicianId
        }),
      );
      expect(result).toEqual(expectedReports);
    });

    it('should return an empty array if no reports are found', async () => {
      const mockRequest = { user: { userID: 2, role: 'CLINICIAN' } };
      mockPrismaService.report.findMany.mockResolvedValueOnce([]);

      const result = await service.viewReports(mockRequest);

      expect(mockPrismaService.report.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('viewPatients', () => {
    it('should return patients associated with the clinician', async () => {
      const mockRequest = { user: { userID: 1, role: 'CLINICIAN' } };
      const expectedPatients = [
        { id: 101, clinicianId: 1, name: 'Patient A' },
        { id: 102, clinicianId: 1, name: 'Patient B' },
      ];
      // Assuming 'user' table is used for patients and they are linked by 'clinicianId'
      mockPrismaService.user.findMany.mockResolvedValueOnce(expectedPatients);

      const result = await service.viewPatients(mockRequest);

      // Adjust the 'where' clause based on your actual service implementation
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { clinicianId: mockRequest.user.userID }, // Assuming patients are linked by clinicianId
        }),
      );
      expect(result).toEqual(expectedPatients);
    });

    it('should return an empty array if no patients are found', async () => {
      const mockRequest = { user: { userID: 2, role: 'CLINICIAN' } };
      mockPrismaService.user.findMany.mockResolvedValueOnce([]);

      const result = await service.viewPatients(mockRequest);

      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('viewUserData', () => {
    it('should return user data for a specific userID', async () => {
      const userID = 5;
      const expectedUserData = { id: userID, name: 'User Five', email: 'user5@example.com' };
      mockPrismaService.user.findUnique.mockResolvedValueOnce(expectedUserData);

      const result = await service.viewUserData(userID);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { userID: userID }, // Assuming Prisma looks up by 'userID'
      });
      expect(result).toEqual(expectedUserData);
    });

    it('should return null if user data is not found', async () => {
      const userID = 99;
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      const result = await service.viewUserData(userID);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { userID: userID },
      });
      expect(result).toBeNull();
    });
  });

  describe('viewUserReports', () => {
    it('should return reports for a specific userID', async () => {
      const userID = 10;
      const expectedUserReports = [
        { id: 201, userId: 10, content: 'User 10 Report A' },
        { id: 202, userId: 10, content: 'User 10 Report B' },
      ];
      // Assuming 'report' table has a 'userId' field
      mockPrismaService.report.findMany.mockResolvedValueOnce(expectedUserReports);

      const result = await service.viewUserReports(userID);

      expect(mockPrismaService.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: userID }, // Assuming reports are linked by userId
        }),
      );
      expect(result).toEqual(expectedUserReports);
    });

    it('should return an empty array if no reports are found for the user', async () => {
      const userID = 99;
      mockPrismaService.report.findMany.mockResolvedValueOnce([]);

      const result = await service.viewUserReports(userID);

      expect(mockPrismaService.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: userID },
        }),
      );
      expect(result).toEqual([]);
    });
  });
});