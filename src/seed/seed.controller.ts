import { Controller, Post, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Delete()
  clear(): Promise<void> {
    // TODO: non-prod only
    return this.seedService.clear();
  }

  @Post()
  seed(): Promise<void> {
    // TODO: non-prod only
    return this.seedService.seed();
  }
}
