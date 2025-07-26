import { Test, TestingModule } from '@nestjs/testing';
import { ClinicianService } from './clinician.service';

describe('ClinicianService', () => {
  let service: ClinicianService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicianService],
    }).compile();

    service = module.get<ClinicianService>(ClinicianService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
