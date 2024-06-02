import { faker } from '@faker-js/faker';

/**
 * @todo replace deprecated `faker.datatype.json()`
 */
export default function getRandomObjectArray(): object[] {
  return faker.helpers.multiple(
    () => JSON.parse(faker.datatype.json()) as object,
    { count: { min: 1, max: 10 } },
  );
}
