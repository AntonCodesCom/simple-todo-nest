import { ApiProperty } from '@nestjs/swagger';

export class LoggedInDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzODgy...3MTMyNjg3MTF9.iKTfxe23gzHVUezSsC9wTO7dQ0dOhq3kCCEIl',
  })
  accessToken: string;

  @ApiProperty({
    example: 'alice',
  })
  username: string;
}
