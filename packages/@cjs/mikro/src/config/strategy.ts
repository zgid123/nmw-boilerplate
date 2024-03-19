import { plural } from 'pluralize';
import { UnderscoreNamingStrategy } from '@mikro-orm/core';

export class MikroNamingStrategy extends UnderscoreNamingStrategy {
  classToTableName(entityName: string, isPlural = true): string {
    return this.toTableName(entityName, isPlural);
  }

  joinKeyColumnName(entityName: string, referencedColumnName?: string): string {
    return `${this.classToTableName(entityName, false)}_${
      referencedColumnName || this.referenceColumnName()
    }`;
  }

  protected toTableName(entityName: string, isPlural = true): string {
    const tableName = entityName
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase();

    if (!isPlural) {
      return tableName;
    }

    return plural(tableName);
  }
}
