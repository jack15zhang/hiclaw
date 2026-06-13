import { Body, Controller, Get, Post } from '@nestjs/common';
import { IsIn, IsInt, IsString, Min } from 'class-validator';
import { CarpoolService } from './carpool.service';

class CreateCarpoolDto {
  @IsIn(['offer', 'request'])
  type!: 'offer' | 'request';

  @IsString()
  fromArea!: string;

  @IsString()
  toArea!: string;

  @IsString()
  departureTime!: string;

  @IsInt()
  @Min(1)
  seats!: number;

  @IsString()
  price!: string;
}

@Controller('carpool')
export class CarpoolController {
  constructor(private readonly carpoolService: CarpoolService) {}

  @Get()
  browse() {
    return this.carpoolService.browse();
  }

  @Post()
  create(@Body() body: CreateCarpoolDto) {
    return this.carpoolService.create(body);
  }
}
