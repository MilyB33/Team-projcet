import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const roundsOfHashing = 10;
const NUM_USERS = 10;
const NUM_WORKSPACES = 5;
const NUM_PROJECTS = 10;
const NUM_TIME_ENTRIES = 30;

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/seed.json'), 'utf-8'),
);

const createUsers = async () => {
  const usersData = [...data.users];

  for (let i = 0; i < NUM_USERS; i++) {
    usersData.push({
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      company: faker.company.name(),
      password: 'test1234',
      typeId: faker.helpers.arrayElement([1, 2]), // Randomly pick account type
    });
  }

  const type1 = await prisma.accountType.create({ data: { name: 'standard' } });
  const type2 = await prisma.accountType.create({ data: { name: 'employer' } });

  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash(user.password, roundsOfHashing);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { password: hashedPassword },
      create: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        company: user.company,
        password: hashedPassword,
        typeId: user.typeId === 1 ? type1.id : type2.id,
      },
    });
  }

  console.log(`✅ Created ${usersData.length} users`);
};

const createWorkspaces = async () => {
  const workspacesData = [...data.workspaces];

  for (let i = 0; i < NUM_WORKSPACES; i++) {
    workspacesData.push({
      name: faker.company.name(),
      created_by: faker.number.int({ min: 1, max: NUM_USERS }),
    });
  }

  for (const workspace of workspacesData) {
    await prisma.workspace.create({ data: workspace });
  }

  console.log(`✅ Created ${workspacesData.length} workspaces`);
};

const createProjects = async () => {
  const projectsData = [...data.projects];

  for (let i = 0; i < NUM_PROJECTS; i++) {
    const workspaceId = faker.number.int({ min: 1, max: NUM_WORKSPACES });
    const createdBy = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { created_by: true },
    });

    projectsData.push({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      workspaceId: workspaceId,
      createdBy: createdBy.created_by, // Set createdBy to the user who created the workspace
      accessCode: faker.string.alphanumeric(6),
      groups: [],
    });
  }

  for (const project of projectsData) {
    const { groups, ...rest } = project;
    await prisma.project.create({
      data: {
        ...rest,
        members: { create: { userId: project.createdBy } },
        groups: { createMany: { data: groups || [] } },
      },
    });
  }

  console.log(`✅ Created ${projectsData.length} projects`);
};

const addStandardMembers = async () => {
  const membersData = [...data.members];

  for (let i = 0; i < NUM_USERS * 2; i++) {
    const projectId = faker.number.int({ min: 1, max: NUM_PROJECTS });
    const userId = faker.number.int({ min: 1, max: NUM_USERS });

    membersData.push({ projectId, userId });
  }

  for (const member of membersData) {
    await prisma.projectUser.upsert({
      where: {
        projectId_userId: {
          projectId: member.projectId,
          userId: member.userId,
        },
      },
      update: {},
      create: { projectId: member.projectId, userId: member.userId },
    });
  }

  console.log(`✅ Successfully added ${membersData.length} project members.`);
};

const createTimeEntries = async () => {
  const entriesData = [];

  for (let i = 0; i < NUM_TIME_ENTRIES; i++) {
    const startTime = faker.date.recent({ days: 30 });

    const endTime = faker.datatype.boolean()
      ? new Date(
          startTime.getFullYear(),
          startTime.getMonth(),
          startTime.getDate(),
          faker.number.int({ min: startTime.getHours(), max: 23 }),
          faker.number.int({ min: startTime.getMinutes(), max: 59 }),
          faker.number.int({ min: startTime.getSeconds(), max: 59 }),
        )
      : null;

    // Fetch a random projectUser
    const projectUser = await prisma.projectUser.findFirst({
      orderBy: { id: 'asc' },
      skip: faker.number.int({ min: 0, max: NUM_USERS * 2 - 1 }),
    });

    if (!projectUser) continue; // Skip if no projectUser found

    entriesData.push({
      projectUserId: projectUser.id, // Use projectUserId instead of userId & projectId
      description: faker.hacker.phrase(),
      startTime,
      endTime,
      createdAt: faker.date.past({ years: 1 }),
    });
  }

  for (const entry of entriesData) {
    await prisma.timeEntry.create({ data: entry });
  }

  console.log(`✅ Created ${entriesData.length} time entries`);
};

async function main() {
  await createUsers();
  await createWorkspaces();
  await createProjects();
  await addStandardMembers();
  await createTimeEntries();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
