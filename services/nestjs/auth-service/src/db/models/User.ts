import { AutoMap } from '@nest/interceptors/automapper';
import { Collection, Entity, Enum, OneToMany, Property } from '@cjs/mikro/core';

import { Base } from './Base';
import { AllowedToken } from './AllowedToken';

export const roles = {
  user: 'user',
  admin: 'admin',
} as const;

export type TRole = keyof typeof roles;

@Entity()
export class User extends Base {
  @AutoMap()
  @Property({
    unique: true,
  })
  email: string;

  @AutoMap()
  @Property({
    type: 'text',
    unique: true,
  })
  uid: string;

  @Property({
    hidden: true,
  })
  password: string;

  @AutoMap()
  @Property({
    nullable: true,
  })
  firstName?: string;

  @AutoMap()
  @Property({
    nullable: true,
  })
  lastName?: string;

  @AutoMap()
  @Enum({
    items: () => roles,
    default: roles.user,
  })
  role: keyof typeof roles;

  @OneToMany(() => AllowedToken, (allowedToken) => allowedToken.user)
  allowedTokens = new Collection<AllowedToken>(this);
}
