import { RequestHandler } from 'express';
import Item from '@/models/item';
import { ApiError } from '@/utils/error';

type CreateItemDto = {
  name: string;
  description?: string;
  price: number;
  qty: number;
};

type UpdateItemDto = Partial<CreateItemDto>;

// Create item
export const createItem: RequestHandler<{}, {}, CreateItemDto> = async (req, res) => {
  const partnerId = req.user?.id;
  const { name, description, price, qty } = req.body;

  const item = new Item({ name, description, price, qty, partnerId });
  await item.save();
  res.status(201).json(item);
};

// Read all items
export const listItems: RequestHandler = async (_req, res) => {
  const items = await Item.find();
  res.json(items);
};

// Read single item
export const getItem: RequestHandler<{ id: string }> = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Item not found');
  res.json(item);
};

// Update item (except qty)
export const updateItem: RequestHandler<{ id: string }, {}, UpdateItemDto> = async (
  req,
  res,
) => {
  const updateData = { ...req.body };
  delete updateData.qty; // qty should only change through order logic

  const item = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!item) throw new ApiError(404, 'Item not found');
  res.json(item);
};

// Delete item
export const deleteItem: RequestHandler<{ id: string }> = async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Item not found');
  res.json({ message: 'Item deleted' });
};
