import { Migration } from '@mikro-orm/migrations';

export class Migration20240507193422_CreateAllowedTokens extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "allowed_tokens" ("id" bigserial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "aud" varchar(255) not null, "exp" timestamptz not null, "jti" text not null, "user_id" bigint not null);',
    );

    this.addSql(
      'alter table "allowed_tokens" add constraint "allowed_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "allowed_tokens" cascade;');
  }
}
