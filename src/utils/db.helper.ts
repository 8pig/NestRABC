import { SelectQueryBuilder } from 'typeorm';

export const conditionUtils = <T>(
  qb: SelectQueryBuilder<T>,
  obj: Record<string, unknown>,
) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      qb.andWhere(`${key} = :${key}`, { [key]: obj[key] });
    }
  });

  return qb;
};
