import { RequestHandler } from 'express';
import ReturnRequest from '@/models/returns';
import Order from '@/models/order';
import Item from '@/models/item';
import { ApiError } from '@/utils/error';

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

  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) throw new ApiError(404, 'Order not found or does not belong to user');

  const orderItem = order.items.find((item) => item.itemId.toString() === itemId);
  if (!orderItem) throw new ApiError(400, 'Item not found in order');

  const item = await Item.findById(itemId);
  if (!item) throw new ApiError(404, 'Item not found in DB');

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
};

// List own return requests (customer)
export const listReturns: RequestHandler = async (req, res) => {
  const userId = req.user?.id;
  const returns = await ReturnRequest.find({ userId });
  res.json(returns);
};

// List all pending return requests (partner/admin)
export const listPendingReturns: RequestHandler = async (_req, res) => {
  const pending = await ReturnRequest.find({ status: 'pending' });
  res.json(pending);
};

// Approve return request (partner/admin)
export const approveReturn: RequestHandler<{ id: string }, {}, ApproveReturnDto> = async (
  req,
  res,
) => {
  const { refundAmount } = req.body;
  const rr = await ReturnRequest.findByIdAndUpdate(
    req.params.id,
    { status: 'approved', refundAmount },
    { new: true },
  );
  if (!rr) throw new ApiError(404, 'Return request not found');

  const item = await Item.findById(rr.itemId);
  if (item) {
    item.qty += 1; // Assuming 1 item is returned
    await item.save();
  }

  res.json(rr);
};

// Reject return request (partner/admin)
export const rejectReturn: RequestHandler<{ id: string }> = async (req, res) => {
  const rr = await ReturnRequest.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected' },
    { new: true },
  );
  if (!rr) throw new ApiError(404, 'Return request not found');
  res.json(rr);
};
