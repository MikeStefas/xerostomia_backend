import { Test, TestingModule } from '@nestjs/testing';
import { ClinicianController } from './clinician.controller';

describe('ClinicianController', () => {
  let controller: ClinicianController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicianController],
    }).compile();

    controller = module.get<ClinicianController>(ClinicianController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
