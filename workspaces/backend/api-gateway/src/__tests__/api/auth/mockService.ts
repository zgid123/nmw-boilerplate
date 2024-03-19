import type { IAuthService, ISignInResponse } from '@data/grpc/auth';

export const mockUser: ISignInResponse = {
  profile: {
    firstName: 'Alpha',
    lastName: 'Lucifer',
    email: 'alphanolucifer@gmail.com',
    uid: '9vjno1ySqKa5R41Y1WBKY',
    role: 0,
  },
  authToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbHBoYW5vbHVjaWZlckBnbWFpbC5jb20iLCJqdGkiOiJLSDFfNWttQmRFN2ROWm1OeTRXWCIsImlhdCI6MTcxMDcwMDY3OCwiZXhwIjoxNzEwNzA0Mjc4fQ.VlbCDwr2k3MCjsvI2_pPOiPcEKy5Y_cfKEj96HAu0PQ',
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbHBoYW5vbHVjaWZlckBnbWFpbC5jb20iLCJqdGkiOiJGNGZsQ0gzZm9FeERwQXJrVXdkZCIsImlhdCI6MTcxMDcwMDY3OCwiZXhwIjoxNzQyMjU4Mjc4fQ.PZSxEXWqZAA2tyj3mcsBXlzXszzi5733DooUS6xe0-4',
} as const;

export const mockAuthService: Pick<IAuthService, 'signIn' | 'getProfile'> = {
  signIn: async (params) => {
    const { email, password } = params;

    if (email !== 'test@gmail.com' || password !== '123123') {
      return null;
    }

    return mockUser;
  },
  getProfile: async (_params, metadata) => {
    const authToken = metadata.get('authToken');

    if (authToken[0] !== mockUser.authToken) {
      return null;
    }

    return {
      profile: mockUser.profile,
    };
  },
};
