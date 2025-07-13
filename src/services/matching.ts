import User from '@/models/user';

interface IMatchingService {
  /**
   * Finds nearby partner users within a max distance.
   * @param location - GeoJSON coordinates [lng, lat].
   * @param maxDistanceKm - Max distance in kilometers (default: 10km).
   * @returns Array of partner IDs with dummy distances.
   */
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
    // Find partner users near the given location (dummy logic)
    const partners = await User.find({
      role: 'partner',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: location.coordinates },
          $maxDistance: maxDistanceKm * 1000,
        },
      },
    }).select('_id');

    // Map to partnerId + dummy distance
    return partners.map((p, index) => ({
      partnerId: p._id.toString(),
      distance: (index + 1) * 1.2, // simulate distance
    }));
  }
}

const matchingService = new MatchingService();
export { matchingService };
