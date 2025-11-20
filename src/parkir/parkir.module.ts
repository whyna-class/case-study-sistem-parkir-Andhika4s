import { Module } from '@nestjs/common';
import { ParkirService } from './parkir.service';
import { ParkirController } from './parkir.controller';

@Module({
  controllers: [ParkirController],
  providers: [ParkirService],
})
export class ParkirModule {}
