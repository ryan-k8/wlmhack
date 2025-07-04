import { Request, Response } from 'express';
import ReturnRequest from '@/models/returns';
import Order from '@/models/order';
import Item from '@/models/item';

// Create new return request (customer)
export const createReturn = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { orderId, itemId, reason, condition } = req.body;

  try {
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res
        .status(404)
        .json({ error: 'Order not found or does not belong to user' });
    }

    const orderItem = order.items.find((item) => item.itemId.toString() === itemId);
    if (!orderItem) {
      return res.status(400).json({ error: 'Item not found in order' });
    }

    // fetch item to get partnerId
    const item = await Item.findById(itemId);
    console.log('Item found:', item);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in DB' });
    }

    const rr = new ReturnRequest({
      userId,
      orderId,
      itemId,
      partnerId: item.partnerId,
      reason,
      condition,
      status: 'pending',
    });
    await rr.save();
    res.status(201).json(rr);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to create return request' });
  }
};

// List own return requests (customer)
export const listReturns = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    const returns = await ReturnRequest.find({ userId });
    res.json(returns);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch return requests' });
  }
};

// List all pending return requests (partner/admin)
export const listPendingReturns = async (_req: Request, res: Response) => {
  try {
    const pending = await ReturnRequest.find({ status: 'pending' });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending return requests' });
  }
};

// Approve return request (partner/admin)
export const approveReturn = async (req: Request, res: Response) => {
  const { refundAmount } = req.body;
  try {
    const rr = await ReturnRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', refundAmount },
      { new: true },
    );
    if (!rr) return res.status(404).json({ error: 'Return request not found' });

    // Increase item qty back
    const item = await Item.findById(rr.itemId);
    if (item) {
      item.qty += 1;
      await item.save();
    }

    res.json(rr);
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve return request' });
  }
};

// Reject return request (partner/admin)
export const rejectReturn = async (req: Request, res: Response) => {
  try {
    const rr = await ReturnRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true },
    );
    if (!rr) return res.status(404).json({ error: 'Return request not found' });
    res.json(rr);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject return request' });
  }
};
