import { RequestHandler } from 'express';
import ReturnRequest from '@/models/returns';
import Order from '@/models/order';
import Item from '@/models/item';

type CreateReturnDto = {
  orderId: string;
  itemId: string;
  reason?: string;
  condition: 'new' | 'used' | 'damaged';
};

type ApproveReturnDto = {
  refundAmount: number;
};

// Create new return request (customer)
export const createReturn: RequestHandler<{}, {}, CreateReturnDto> = async (req, res) => {
  const userId = req.user?.id;
  const { orderId, itemId, reason, condition } = req.body;

  try {
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      res.status(404).json({ error: 'Order not found or does not belong to user' });
      return;
    }

    const orderItem = order.items.find((item) => item.itemId.toString() === itemId);
    if (!orderItem) {
      res.status(400).json({ error: 'Item not found in order' });
      return;
    }

    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404).json({ error: 'Item not found in DB' });
      return;
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
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to create return request' });
    return;
  }
};

// List own return requests (customer)
export const listReturns: RequestHandler = async (req, res) => {
  const userId = req.user?.id;
  try {
    const returns = await ReturnRequest.find({ userId });
    res.json(returns);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch return requests' });
    return;
  }
};

// List all pending return requests (partner/admin)
export const listPendingReturns: RequestHandler = async (_req, res) => {
  try {
    const pending = await ReturnRequest.find({ status: 'pending' });
    res.json(pending);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending return requests' });
    return;
  }
};

// Approve return request (partner/admin)
export const approveReturn: RequestHandler<{ id: string }, {}, ApproveReturnDto> = async (
  req,
  res,
) => {
  const { refundAmount } = req.body;
  try {
    const rr = await ReturnRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', refundAmount },
      { new: true },
    );
    if (!rr) {
      res.status(404).json({ error: 'Return request not found' });
      return;
    }

    // Increase item qty back
    const item = await Item.findById(rr.itemId);
    if (item) {
      item.qty += 1; // Assuming 1 item is returned
      await item.save();
    }

    res.json(rr);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve return request' });
    return;
  }
};

// Reject return request (partner/admin)
export const rejectReturn: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const rr = await ReturnRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true },
    );
    if (!rr) {
      res.status(404).json({ error: 'Return request not found' });
      return;
    }
    res.json(rr);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject return request' });
    return;
  }
};
