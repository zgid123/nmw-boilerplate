import { AutoMap } from '@nest/interceptors/automapper';
import { Entity, PrimaryKey, Property } from '@cjs/mikro/core';

@Entity({ abstract: true })
export abstract class Base {
  @AutoMap()
  @PrimaryKey({
    type: 'bigint',
  })
  id: number;

  @AutoMap()
  @Property()
  createdAt: Date = new Date();

  @AutoMap()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
