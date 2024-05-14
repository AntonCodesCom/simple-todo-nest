import {
  Controller,
  Post,
  Delete,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { SeedService } from './seed.service';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EnvService } from 'src/env/env.service';

@ApiTags('seed')
@ApiForbiddenResponse()
@ApiInternalServerErrorResponse()
@Controller('seed')
export class SeedController {
  constructor(
    private readonly envService: EnvService,
    private readonly seedService: SeedService,
  ) {}

  @ApiNoContentResponse()
  @HttpCode(204)
  @Delete()
  clear(): Promise<void> {
    if (this.envService.isProd) {
      throw new ForbiddenException();
    }
    return this.seedService.clear();
  }

  @ApiCreatedResponse()
  @Post()
  seed(): Promise<void> {
    if (this.envService.isProd) {
      throw new ForbiddenException();
    }
    return this.seedService.seed();
  }
}
