import { Migration } from '@mikro-orm/migrations';

export class Migration20240310073410_CreateUsers extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "users" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "email" varchar(255) not null, "uid" text not null, "password" varchar(255) not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "role" text check ("role" in (\'user\', \'admin\')) not null default \'user\');',
    );
    this.addSql(
      'alter table "users" add constraint "users_email_unique" unique ("email");',
    );
    this.addSql(
      'alter table "users" add constraint "users_uid_unique" unique ("uid");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "users" cascade;');
  }
}
