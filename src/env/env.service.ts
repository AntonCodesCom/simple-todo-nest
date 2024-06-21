import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  get isProd() {
    return this.configService.get('nodeEnv') === 'production';
  }

  get jwtSecret() {
    return this.configService.get<string>('jwtSecret');
  }

  get port() {
    return this.configService.get<number>('port');
  }
}
