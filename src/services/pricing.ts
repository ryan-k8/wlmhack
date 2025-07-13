import Item from '@/models/item';

interface IPricingService {
  /**
   * Creates a refund for the user.
   * @param userId - The ID of the user requesting the refund.
   * @param amount - The amount to be refunded.
   * @returns A promise that resolves to an object containing the refund ID.
   */
  createRefund(userId: string, amount: number): Promise<{ refundId: string }>;

  /**
   * Suggests a resale price for an item.
   * @param itemId - The ID of the item (from returnRequest).
   * @param condition - The condition of the item ('new', 'used', 'damaged').
   * @returns A promise that resolves to the suggested resale price.
   */
  suggestResalePrice(itemId: string, condition: string): Promise<number>;
}

class PricingService implements IPricingService {
  async createRefund(userId: string, amount: number): Promise<{ refundId: string }> {
    // Dummy logic: simulate refund creation
    console.log(`Issuing refund of ${amount} to user ${userId}`);
    return {
      refundId: `refund_${Date.now()}`,
    };
  }

  async suggestResalePrice(itemId: string, condition: string): Promise<number> {
    // Fetch original item data
    const item = await Item.findById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    const basePrice = item.price;
    let multiplier = 1;

    // Dummy: adjust price based on condition
    switch (condition) {
      case 'new':
        multiplier = 0.9;
        break;
      case 'used':
        multiplier = 0.6;
        break;
      case 'damaged':
        multiplier = 0.3;
        break;
      default:
        multiplier = 0.5;
    }

    const resalePrice = Math.round(basePrice * multiplier);
    console.log(
      `Suggested resale price for item ${itemId} (${condition}): ${resalePrice}`,
    );
    return resalePrice;
  }
}

const pricingService = new PricingService();
export { pricingService };
