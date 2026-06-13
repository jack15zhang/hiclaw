import { Controller, Get, Param } from '@nestjs/common';

@Controller('trust')
export class TrustController {
  @Get(':userId/unlocks')
  unlocks(@Param('userId') userId: string) {
    return {
      userId,
      trustLevel: 3,
      visibleFeatures: ['carpool', 'marketplace'],
      hiddenFeatures: [
        {
          key: 'dating',
          requiredLevel: 5,
          unlocked: false,
        },
      ],
    };
  }
}
