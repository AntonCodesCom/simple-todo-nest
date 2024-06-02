import { faker } from '@faker-js/faker';
import getRandomObject from './getRandomObject';

export default function getRandomObjectArray(): object[] {
  return faker.helpers.multiple(getRandomObject, {
    count: { min: 1, max: 10 },
  });
}
