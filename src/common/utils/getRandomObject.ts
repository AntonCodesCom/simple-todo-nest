import { faker } from '@faker-js/faker';

/**
 * For usage where exact object structure doesn't matter.
 *
 * @returns an object with 1 random key-value field
 */
export default function getRandomObject(): object {
  return {
    [faker.string.sample()]: faker.string.sample(),
  };
}
