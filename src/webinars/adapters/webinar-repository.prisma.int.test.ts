import { PrismaClient } from '@prisma/client';
import { PrismaWebinarRepository } from './webinar-repository.prisma';
import { Webinar } from '../entities/webinar.entity';

describe('PrismaWebinarRepository', () => {
  const prisma = new PrismaClient();
  const repository = new PrismaWebinarRepository(prisma);

  beforeEach(async () => {
    await prisma.webinar.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a webinar', async () => {
    const webinar = new Webinar({
      id: 'webinar-id',
      organizerId: 'organizer-id',
      title: 'Test Webinar',
      startDate: new Date(),
      endDate: new Date(),
      seats: 50,
    });

    await repository.create(webinar);

    const dbWebinar = await prisma.webinar.findUnique({
      where: { id: 'webinar-id' },
    });

    expect(dbWebinar).toEqual({
      id: 'webinar-id',
      organizerId: 'organizer-id',
      title: 'Test Webinar',
      startDate: webinar.props.startDate,
      endDate: webinar.props.endDate,
      seats: 50,
    });
  });
});