import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'alice',
  })
  @Allow()
  // TODO: validation
  username: string;

  @ApiProperty({
    example: 'Alice1111$',
  })
  @Allow()
  // TODO: validation
  password: string;
}
