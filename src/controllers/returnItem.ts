import { RequestHandler } from 'express';
import ReturnedItem from '@/models/returnItem';
import { ApiError } from '@/utils/error';
import { USER_ROLE } from '@/middlewares/auth';

// List all available returned items (for partners/admin)
export const listAvailableReturnedItems: RequestHandler = async (req, res) => {
  const items = await ReturnedItem.find({ status: 'available' });
  res.json(items);
};

// List all claimed returned items (for customers to buy)
export const listClaimedReturnedItems: RequestHandler = async (req, res) => {
  const items = await ReturnedItem.find({ status: 'claimed' });
  res.json(items);
};

// Get single returned item (for partners/admin)
export const getReturnedItem: RequestHandler<{ id: string }> = async (req, res) => {
  const item = await ReturnedItem.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Returned item not found');
  res.json(item);
};

// Partner/admin claims an available returned item
export const claimReturnedItem: RequestHandler<{ id: string }> = async (req, res) => {
  const userId = req.user?.id;
  const item = await ReturnedItem.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Returned item not found');
  if (item.status !== 'available') throw new ApiError(400, 'Item already claimed');
  item.status = 'claimed';
  item.claimedBy = userId;
  console.log(`Claiming returned item ${item._id} by user ${userId} (${req.user?.role})`);
  await item.save();
  res.json(item);
};
