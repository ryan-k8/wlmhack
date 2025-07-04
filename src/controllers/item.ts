import { RequestHandler, Request, Response } from 'express';
import Item from '@/models/item';

// Create item
export const createItem = async (req: Request, res: Response) => {
  const partnerId = req.user?.id; // get from token
  const { name, description, price, qty } = req.body;

  try {
    const item = new Item({ name, description, price, qty, partnerId });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
};

// Read all items
export const listItems = async (_req: Request, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

export const getItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
};

// Update item
export const updateItem = async (req: Request, res: Response) => {
  try {
    const updateData = { ...req.body };
    delete updateData.qty; // qty should only change through order logic
    const item = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
};

// Delete item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
};
