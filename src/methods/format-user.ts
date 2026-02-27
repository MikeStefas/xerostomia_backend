import { User } from '@prisma/client';

export interface UserWithReportsCount extends User {
  _count?: {
    reports: number;
  };
}

export function formatUserResponse(user: UserWithReportsCount) {
  return {
    userID: user.userID,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
    institution: user.institution,
    password: '****',
    reportCount: user._count?.reports || 0,
  };
}
