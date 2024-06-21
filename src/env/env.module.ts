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
//     name: 'JWT_SECRET',
//     confidential: true,
//     critical: true,
//     nonProdDefaultValue: '__INSECURE__jwt_secret_dev',
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
  jwtSecret: string;
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
          // JWT_SECRET
          let jwtSecretError = false;
          let jwtSecret = process.env.JWT_SECRET;
          if (!jwtSecret) {
            if (nodeEnv === 'production') {
              logger.fatal('`JWT_SECRET` environment variable is missing.');
              jwtSecretError = true;
            } else {
              jwtSecret = '__INSECURE__jwt_secret_dev';
              if (nodeEnv !== 'development') {
                logger.warn(
                  '`JWT_SECRET` environment variable is missing so it was set to default value "__INSECURE__jwt_secret_dev". The environment variable should be assigned to a value explicitly.',
                );
              }
            }
          }
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
          if (jwtSecretError || portError) {
            throw new Error(
              'There have been issues with environment variables (see logs above).',
            );
          }
          return {
            jwtSecret,
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
