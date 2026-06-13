import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':id')
  getUser(@Param('id') id: string) {
    return {
      id,
      displayName: 'hiclaw member',
      trustLevel: 3,
      unlockedFeatures: [],
      stats: {
        carpoolPosts: 2,
        marketplacePosts: 1,
        completedTransactions: 0,
      },
    };
  }
}
