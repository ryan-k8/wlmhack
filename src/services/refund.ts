interface IRefundService {
  createRefund(
    userId: string,
    amount: number,
  ): Promise<{ refundId: string; status: string }>;
}

class RefundService implements IRefundService {
  async createRefund(
    userId: string,
    amount: number,
  ): Promise<{ refundId: string; status: string }> {
    // Dummy: generate fake refundId, optionally save to DB later
    return {
      refundId: `refund_${Date.now()}`,
      status: 'processed',
    };
  }
}

const refundService = new RefundService();
export { refundService };
