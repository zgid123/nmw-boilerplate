import { config } from 'dotenv';

config({
  path: '.env',
});

config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production.local'
      : '.env.local',
});
