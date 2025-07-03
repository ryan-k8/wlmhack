import { Request, Response } from 'express';
import ReturnRequest from '@/models/returns';

// Create new return request (customer)
export const createReturn = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { orderId, itemId, reason, condition } = req.body;

  try {
    const rr = new ReturnRequest({
      userId,
      orderId,
      itemId,
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
