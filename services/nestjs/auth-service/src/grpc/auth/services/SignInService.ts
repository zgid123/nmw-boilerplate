import { compare } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import type { SignInDto } from '@data/dtos/schema';
import type { EntityRepository } from '@mikro-orm/postgresql';

import { User } from '~/db/models/User';

@Injectable()
export class SignInService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  public async exec({ email, password }: SignInDto): Promise<User> {
    const user = await this.userRepository.findOne({
      email,
    });

    if (!user) {
      return null;
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      return null;
    }

    return user;
  }
}
