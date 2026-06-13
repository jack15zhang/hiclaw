import { Body, Controller, Post } from '@nestjs/common';
import { IsString } from 'class-validator';

class AgentMessageDto {
  @IsString()
  message!: string;
}

@Controller('agent')
export class AgentController {
  @Post('message')
  message(@Body() body: AgentMessageDto) {
    const text = body.message.toLowerCase();

    if (text.includes('ride') || text.includes('carpool')) {
      return {
        intent: 'carpool.search',
        reply: 'I can search nearby carpool posts while keeping exact pickup hidden.',
      };
    }

    if (text.includes('sell') || text.includes('buy') || text.includes('market')) {
      return {
        intent: 'marketplace.search',
        reply: 'I can browse second-hand listings or help draft a post.',
      };
    }

    return {
      intent: 'general.help',
      reply: 'I can help with carpool, second-hand trading, and unlocked local features.',
    };
  }
}
