import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query} from '@nestjs/common';
import { ParkirService } from './parkir.service';
import { CreateParkirDto } from './dto/create-parkir.dto';
import { UpdateParkirDto } from './dto/update-parkir.dto';
import { FindParkirDto } from './dto/find-parkir.dto';

@Controller('parkir')
export class ParkirController {
  constructor(private readonly parkirService: ParkirService) {}

  // CREATE
  @Post()
  create(@Body() dto: CreateParkirDto) {
    return this.parkirService.create(dto);
  }

  //GET ALL
  @Get()
    findAll(@Query() query: FindParkirDto) {
    return this.parkirService.findAll(query);
  }
  // TOTAL PENDAPATAN
  @Get('total')
  totalPendapatan() {
    return this.parkirService.total();
  }

  // GET BY ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.parkirService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateParkirDto,
  ) {
    return this.parkirService.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.parkirService.remove(id);
  }
}
