import { PickType } from '@nestjs/swagger';
import { SignupDto } from './signup.dto';
import { LoginDto } from './login.dto';

/**
 * Login DTO for in-controller validation.
 *
 * We don't want to enforce SignupDto's validation rules to LoginDto as well,
 * but we still want to apply these rules for login with the only difference of
 * responding with 401 rather than 400 on invalid data. This way we will also
 * be able to skip login database request on invalid login request data.
 */
export class LoginValidationDto
  extends PickType(SignupDto, ['username', 'password'])
  implements LoginDto {}
