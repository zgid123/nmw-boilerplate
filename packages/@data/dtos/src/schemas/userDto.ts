import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

const BaseDto = z.object({
  id: z.number(),
  uid: z.string(),
  email: z.string(),
  password: z.string(),
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  role: z.enum(['user', 'admin']).optional().default('user'),
});

export class SignInDto extends createZodDto(
  BaseDto.pick({
    email: true,
    password: true,
  }),
) {}

export class RetrieveUserDto extends createZodDto(
  BaseDto.pick({
    email: true,
  }),
) {}
