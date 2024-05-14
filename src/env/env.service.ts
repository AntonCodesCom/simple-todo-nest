import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  // // for future use
  // get isProd() {
  //   return this.configService.get('nodeEnv') === 'production';
  // }

  get port() {
    return this.configService.get<number>('port');
  }
}
