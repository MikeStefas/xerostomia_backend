import { AuthGuard } from '@nestjs/passport';

export class ClinicianJwtGuard extends AuthGuard('clinician-jwt') {
  constructor() {
    super();
  }
}