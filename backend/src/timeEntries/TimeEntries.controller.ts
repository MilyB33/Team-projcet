import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TimeEntriesService } from './timeEntries.service';
import { User } from 'src/common/decorators/user.decorator';
import { User as PrismaUser } from '@prisma/client';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { TimeEntryEntity } from './entities/time-entry.entity';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { EndTimeEntryDto } from './dto/end-time-entry.dto';

@ApiBearerAuth()
@Controller('time_entries')
@ApiTags('time_entries')
@UseGuards(JwtAuthGuard)
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Get()
  @ApiOkResponse({ type: TimeEntryEntity, isArray: true })
  async getTimeEntries(@User() user: PrismaUser) {
    const timeEntries = await this.timeEntriesService.findUserEntries(user.id);

    return timeEntries.map((timeEntry) => new TimeEntryEntity(timeEntry));
  }

  @Post()
  @ApiCreatedResponse({ type: TimeEntryEntity })
  async create(@Body() data: CreateTimeEntryDto) {
    const timeEntry = await this.timeEntriesService.create(data);

    return new TimeEntryEntity(timeEntry);
  }

  @Post(':id/end')
  @ApiOkResponse({ type: TimeEntryEntity })
  async end(
    @Body() data: EndTimeEntryDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const timeEntry = await this.timeEntriesService.update(data, id);

    return new TimeEntryEntity(timeEntry);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TimeEntryEntity })
  async update(
    @Body() data: UpdateTimeEntryDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const timeEntry = await this.timeEntriesService.update(data, id);

    return new TimeEntryEntity(timeEntry);
  }

  @Delete(':id')
  @ApiOkResponse()
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.timeEntriesService.delete(id);

    return { message: 'Time entry deleted.' };
  }
}
