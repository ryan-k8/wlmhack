import User from '@/models/user';

interface IMatchingService {
  findPartnersNearby(
    location: { coordinates: [number, number] },
    maxDistanceKm?: number,
  ): Promise<Array<{ partnerId: string; distance: number }>>;
}

class MatchingService implements IMatchingService {
  async findPartnersNearby(
    location: { coordinates: [number, number] },
    maxDistanceKm = 10,
  ): Promise<Array<{ partnerId: string; distance: number }>> {
    const partners = await User.find({
      role: 'partner',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: location.coordinates },
          $maxDistance: maxDistanceKm * 1000,
        },
      },
    }).select('_id');

    return partners.map((p, index) => ({
      partnerId: p._id.toString(),
      distance: (index + 1) * 1.2, // dummy distance
    }));
  }
}

const matchingService = new MatchingService();
export { matchingService };
