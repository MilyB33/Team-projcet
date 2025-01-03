import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(createGroupDto: CreateGroupDto) {
    return this.prisma.group.create({ data: createGroupDto });
  }

  async createGroups(
    projectId: number,
    createGroupDto: Pick<CreateGroupDto, 'name'>[],
  ) {
    const mappedData = createGroupDto.map((group) => ({ ...group, projectId }));

    return this.prisma.group.createManyAndReturn({ data: mappedData });
  }

  async remove(id: number) {
    return this.prisma.group.delete({ where: { id } });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    return this.prisma.group.update({ where: { id }, data: updateGroupDto });
  }

  async findAll(projectId: number) {
    const groups = await this.prisma.group.findMany({ where: { projectId } });

    return groups;
  }

  async findOne(id: number) {
    const group = await this.prisma.group.findUnique({ where: { id } });

    return group;
  }
}
