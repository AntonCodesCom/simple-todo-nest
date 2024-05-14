import { Global, Logger, Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ConfigModule } from '@nestjs/config';
import { isPort } from 'class-validator';

// // reference
// const envVars = [
//   {
//     name: 'NODE_ENV',
//     confidential: false,
//     critical: false,
//     defaultValue: 'production',
//   },
//   {
//     name: 'PORT',
//     confidential: false,
//     critical: true,
//     devDefaultValue: 3000,
//     transform: (value: string) => +value,
//     validate: (value: number) => isPort(value),
//   }
// ];

interface Config {
  nodeEnv: string;
  port: number;
}

@Global() // environment configuration is global
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        (): Config => {
          const logger = new Logger('env-var-config');
          // NODE_ENV
          const nodeEnv: string = process.env.NODE_ENV || 'production';
          // PORT
          let portError = false;
          const _port = process.env.PORT;
          let port: number;
          if (_port) {
            if (isPort(_port)) {
              port = +_port;
            } else {
              logger.fatal('Invalid value of the `PORT` environment variable.');
              portError = true;
            }
          } else {
            if (nodeEnv === 'development') {
              port = 3000;
            } else {
              logger.fatal('`PORT` environment variable is missing.');
              portError = true;
            }
          }
          // omitting `DATABASE_URL` since it is handled by Prisma
          if (portError) {
            throw new Error(
              'There have been issues with environment variables (see logs above).',
            );
          }
          return {
            nodeEnv,
            port,
          };
        },
      ],
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
