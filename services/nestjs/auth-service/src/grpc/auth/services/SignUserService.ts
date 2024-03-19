import { nanoid } from 'nanoid';
import { Injectable } from '@nestjs/common';
import { addYears } from '@core/utils/dateUtils';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import { genToken } from '~/utils/jwt';
import { AllowedToken } from '~/db/models/AllowedToken';

import type { User } from '~/db/models/User';

interface ISignUserDto {
  user: User;
  aud?: string;
}

interface IReturnProps {
  authToken: string;
  refreshToken: string;
}

@Injectable()
export class SignUserService {
  constructor(
    @InjectRepository(AllowedToken)
    private readonly allowedTokenRepository: EntityRepository<AllowedToken>,
    private readonly em: EntityManager,
  ) {}

  public async exec({
    user,
    aud = 'grpc',
  }: ISignUserDto): Promise<IReturnProps> {
    const { id, email } = user;
    const jti = nanoid(20);

    const authToken = genToken({
      exp: '1h',
      payload: {
        sub: email,
      },
    });

    const refreshToken = genToken({
      jti,
      exp: '1y',
      payload: {
        sub: email,
      },
    });

    this.allowedTokenRepository.create({
      aud,
      jti,
      user: id,
      exp: addYears(new Date(), 1),
    });

    await this.em.flush();

    return {
      authToken,
      refreshToken,
    };
  }
}
