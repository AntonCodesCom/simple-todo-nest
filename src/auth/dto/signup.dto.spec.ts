import { faker } from '@faker-js/faker';
import { SignupDto } from './signup.dto';
import { validate } from 'class-validator';

//
// unit test
//
describe('SignupDto', () => {
  const validUsername = faker.person.firstName().toLowerCase();
  const validPassword = 'User1111$' + faker.string.sample();

  test('valid data', async () => {
    const dto = new SignupDto();
    dto.username = validUsername;
    dto.password = validPassword;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('username', () => {
    test.todo('not a string');
    test.todo('empty');
    test.todo('invalid characters (uppercase)');
    test.todo('no digits');
    test.todo('no letters');
    test.todo('starting from a digit');
  });

  describe('password', () => {
    test.todo('not a string');
    test.todo('less than 8 characters long');
    test.todo('no lowercase letters');
    test.todo('no uppercase letters');
    test.todo('no digits');
    test.todo('no special charaters');
  });
});
