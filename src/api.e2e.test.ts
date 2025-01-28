import supertest from 'supertest';
import { TestServerFixture } from './tests/fixtures';

describe('Webinar Routes E2E', () => {
  let fixture: TestServerFixture;

  beforeAll(async () => {
    fixture = new TestServerFixture();
    await fixture.init();
  });

  beforeEach(async () => {
    await fixture.reset();
  });

  afterAll(async () => {
    await fixture.stop();
  });

  it('should update webinar seats through API', async () => {
    const prisma = fixture.getPrismaClient();
    const server = fixture.getServer();

    const webinar = await prisma.webinar.create({
      data: {
        id: 'test-webinar',
        organizerId: 'organizer-id',
        title: 'Test Webinar',
        startDate: new Date(),
        endDate: new Date(),
        seats: 50,
      },
    });

    const response = await supertest(server)
      .post(`/webinars/${webinar.id}/seats`)
      .send({ seats: 100 })
      .expect(200);

    expect(response.body).toEqual({ message: 'Seats updated' });

    const updatedWebinar = await prisma.webinar.findUnique({
      where: { id: webinar.id },
    });

    expect(updatedWebinar?.seats).toBe(100);
  });

  it('should return 404 when webinar does not exist', async () => {
    const server = fixture.getServer();

    await supertest(server)
      .post('/webinars/non-existent-id/seats')
      .send({ seats: 100 })
      .expect(404);
  });
});
