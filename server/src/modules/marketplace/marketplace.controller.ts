import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsArray, IsString } from 'class-validator';
import { MarketplaceService } from './marketplace.service';

class CreateMarketplaceItemDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  category!: string;

  @IsString()
  price!: string;

  @IsString()
  condition!: string;

  @IsString()
  area!: string;

  @IsArray()
  imageUrls!: string[];
}

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  browse() {
    return this.marketplaceService.browse();
  }

  @Post()
  create(@Body() body: CreateMarketplaceItemDto) {
    return this.marketplaceService.create(body);
  }
}
