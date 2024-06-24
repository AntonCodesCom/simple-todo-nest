import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    example: 'alice',
  })
  // @IsNotEmpty()
  @Allow()
  // TODO: validation
  username: string;

  @ApiProperty({
    example: 'Alice1111$',
    description:
      'Minimum 8 characters, at least 1 uppercase, at least 1 lowercase, at least 1 number, at least 1 special character.',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  // TODO: validation
  password: string;
}
