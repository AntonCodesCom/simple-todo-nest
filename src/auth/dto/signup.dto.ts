import { ApiProperty } from '@nestjs/swagger';
import {
  IsLowercase,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'alice',
    description:
      'Lowercase Latin letters, digits and underscores, starting from a letter.',
  })
  @IsLowercase()
  @Matches(/^[a-z]+[a-z0-9_]*$/)
  @MinLength(4)
  @MaxLength(64)
  username: string;

  @ApiProperty({
    example: 'Alice1111$',
    description:
      'Minimum 8 characters, at least 1 uppercase, at least 1 lowercase, at least 1 digit, at least 1 special character.',
  })
  @IsStrongPassword()
  @MaxLength(256)
  password: string;
}
