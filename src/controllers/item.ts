import { RequestHandler, Request, Response } from 'express';
import Item from '@/models/item';

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

  try {
    const item = new Item({ name, description, price, qty, partnerId });
    await item.save();
    res.status(201).json(item);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
    return;
  }
};

// Read all items
export const listItems: RequestHandler = async (_req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
    return;
  }
};

export const getItem: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json(item);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item' });
    return;
  }
};

// Update item
export const updateItem: RequestHandler<{ id: string }, {}, UpdateItemDto> = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.qty; // qty should only change through order logic
    const item = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json(item);
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
    return;
  }
};

// Delete item
export const deleteItem: RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Item deleted' });
    return;
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
    return;
  }
};
