import { Module } from '@nestjs/common';
import { HubSpotController } from './modules/hubspot/hubspot.controller';
import { HubSpotService } from './modules/hubspot/hubspot.service';
import { AnnaController } from './modules/anna/anna.controller';
import { AnnaService } from './modules/anna/anna.service';

@Module({
  imports: [],
  controllers: [HubSpotController, AnnaController],
  providers: [HubSpotService, AnnaService],
})
export class AppModule {}
