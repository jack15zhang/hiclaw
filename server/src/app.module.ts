import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AgentModule } from './modules/agent/agent.module';
import { AuthModule } from './modules/auth/auth.module';
import { CarpoolModule } from './modules/carpool/carpool.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { TrustModule } from './modules/trust/trust.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    CarpoolModule,
    MarketplaceModule,
    AgentModule,
    TrustModule,
  ],
})
export class AppModule {}
