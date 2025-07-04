import Item from '@/models/item';

interface IPricingService {
  calculateRefund(itemId: string, condition: string): Promise<number>;
  suggestResalePrice(itemId: string, condition: string): Promise<number>;
}

class PricingService implements IPricingService {
  async calculateRefund(itemId: string, condition: string): Promise<number> {
    const item = await Item.findById(itemId);
    if (!item) return 0;
    const price = item.price;
    if (condition === 'new') return price;
    if (condition === 'used') return price * 0.6;
    return price * 0.3;
  }

  async suggestResalePrice(itemId: string, condition: string): Promise<number> {
    const item = await Item.findById(itemId);
    if (!item) return 0;
    return condition === 'new' ? item.price * 0.9 : item.price * 0.5;
  }
}

const pricingService = new PricingService();
export { pricingService };
