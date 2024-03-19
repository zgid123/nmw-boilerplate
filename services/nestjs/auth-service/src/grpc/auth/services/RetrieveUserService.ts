import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import type { RetrieveUserDto } from '@data/dtos/schema';
import type { EntityRepository } from '@mikro-orm/postgresql';

import { User } from '~/db/models/User';

@Injectable()
export class RetrieveUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  public exec({ email }: RetrieveUserDto): Promise<User> {
    return this.userRepository.findOne({
      email,
    });
  }
}
