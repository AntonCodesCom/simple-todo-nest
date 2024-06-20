import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class MeDto extends PickType(UserEntity, ['username']) {}
