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
    const dto = new SignupDto();
    dto.password = validPassword;

    test('not a string', async () => {
      // @ts-ignore: for testing
      dto.username = 5;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('uppercase characters', async () => {
      dto.username = 'User1111';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('invalid characters', async () => {
      dto.username = 'user1111$';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('starting from a digit', async () => {
      dto.username = '1user111';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('less than 4 characters long', async () => {
      dto.username = 'abc';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('more than 64 characters long', async () => {
      dto.username = faker.string.alpha(65).toLowerCase();
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('password', () => {
    const dto = new SignupDto();
    dto.username = validUsername;

    test('not a string', async () => {
      // @ts-ignore: for testing
      dto.password = 5;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('less than 8 characters long', async () => {
      dto.password = 'User11$';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('no lowercase letters', async () => {
      dto.password = 'USER1111$';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('no uppercase letters', async () => {
      dto.password = 'user1111$';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('no digits', async () => {
      dto.password = 'UserUser$';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('no special charaters', async () => {
      dto.password = 'User1111';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('more than 256 characters long', async () => {
      dto.password = faker.string.sample(257);
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
