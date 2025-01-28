import { ChangeSeats } from './change-seats';
import { InMemoryWebinarRepository } from '../adapters/webinar-repository.in-memory';
import { testUser } from '../../users/tests/user-seeds';
import { Webinar } from '../entities/webinar.entity';
import { WebinarNotOrganizerException } from '../../webinars/exceptions/webinar-not-organizer';
import { WebinarReduceSeatsException } from '../../webinars/exceptions/webinar-reduce-seats';



describe('Feature : Change seats', () => {
  let repository: InMemoryWebinarRepository;
  let useCase: ChangeSeats;

  const webinar = new Webinar({
    id: 'webinar-id',
    organizerId: testUser.alice.props.id,
    title: 'Test Webinar',
    startDate: new Date(),
    endDate: new Date(),
    seats: 50,
  });

  beforeEach(() => {
    repository = new InMemoryWebinarRepository([webinar]);
    useCase = new ChangeSeats(repository);
  });

  describe('Scenario: Happy path', () => {
    it('should change the number of seats for a webinar', async () => {
      const payload = {
        user: testUser.alice,
        webinarId: 'webinar-id',
        seats: 100,
      };

      await useCase.execute(payload);

      const updatedWebinar = await repository.findById('webinar-id');
      expect(updatedWebinar?.props.seats).toBe(100);
    });
  });

  describe('Scenario: Webinar not organized by the user', () => {
    it('should throw WebinarNotOrganizerException', async () => {
      const payload = {
        user: testUser.bob,
        webinarId: 'webinar-id',
        seats: 100,
      };

      await expect(useCase.execute(payload)).rejects.toThrow(WebinarNotOrganizerException);
    });
  });

  describe('Scenario: Seats decreased', () => {
    it('should throw WebinarReduceSeatsException', async () => {
      const payload = {
        user: testUser.alice,
        webinarId: 'webinar-id',
        seats: 30,
      };

      await expect(useCase.execute(payload)).rejects.toThrow(WebinarReduceSeatsException);
    });
  });
});
