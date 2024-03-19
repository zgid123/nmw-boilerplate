import { nanoid } from 'nanoid';
import { Seeder } from '@cjs/mikro/core';

import type { EntityManager } from '@mikro-orm/postgresql';

import { User } from '../models/User';
import { bcryptHash } from '../../utils/hash';

export class CreateAdminUserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const repo = em.getRepository(User);
    const email = process.env.ADMIN_EMAIL;

    const admin = await repo.findOne({
      email,
    });

    if (!admin) {
      const { hash } = await bcryptHash({
        source: process.env.ADMIN_PASSWORD,
      });

      repo.create({
        email,
        uid: nanoid(),
        role: 'admin',
        password: hash,
        firstName: 'Alpha',
        lastName: 'Lucifer',
      });

      await em.flush();
    }
  }
}
