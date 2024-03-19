import { AutoMap } from '@nest/interceptors/automapper';
import { Entity, ManyToOne, Property } from '@cjs/mikro/core';

import { Base } from './Base';

import type { User } from './User';

@Entity()
export class AllowedToken extends Base {
  @AutoMap()
  @Property()
  aud?: string;

  @AutoMap()
  @Property()
  exp: Date;

  @AutoMap()
  @Property({
    type: 'text',
  })
  jti: string;

  @ManyToOne('User')
  user: User;
}
