import { RequestHandler } from 'express';
import Order from '@/models/order';
import Item from '@/models/item';
import { ApiError } from '@/utils/error';

type OrderItemDto = {
  itemId: string;
  qty: number;
};

type PlaceOrderDto = {
  items: OrderItemDto[];
};

// Place new order
export const placeOrder: RequestHandler<{}, {}, PlaceOrderDto> = async (req, res) => {
  const userId = req.user?.id;
  const { items } = req.body;

  const orderItems = [];
  for (const reqItem of items) {
    const itemDoc = await Item.findById(reqItem.itemId);
    if (!itemDoc) {
      throw new ApiError(404, `Item not found: ${reqItem.itemId}`);
    }
    if (itemDoc.qty < reqItem.qty) {
      throw new ApiError(400, `Not enough stock for item: ${itemDoc.name}`);
    }
    itemDoc.qty -= reqItem.qty;
    await itemDoc.save();
    orderItems.push({
      itemId: itemDoc._id,
      partnerId: itemDoc.partnerId,
      qty: reqItem.qty,
      priceAtPurchase: itemDoc.price,
    });
  }
  const order = new Order({ userId, items: orderItems, status: 'placed' });
  await order.save();
  res.status(201).json(order);
};

// List all orders of current user
export const listOrders: RequestHandler = async (req, res) => {
  const userId = req.user?.id;
  const orders = await Order.find({ userId });
  res.json(orders);
};

// Get single order (must belong to user)
export const getOrder: RequestHandler<{ id: string }> = async (req, res) => {
  const userId = req.user?.id;
  const order = await Order.findOne({ _id: req.params.id, userId });
  if (!order) throw new ApiError(404, 'Order not found');
  res.json(order);
};

// Cancel order (only if status is placed)
export const cancelOrder: RequestHandler<{ id: string }> = async (req, res) => {
  const userId = req.user?.id;
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, userId, status: 'placed' },
    { status: 'cancelled' },
    { new: true },
  );
  if (!order) throw new ApiError(404, 'Order not found or cannot be cancelled');
  res.json(order);
};

// Update order (only if status is placed)
export const updateOrder: RequestHandler<
  { id: string },
  {},
  Partial<PlaceOrderDto>
> = async (req, res) => {
  const userId = req.user?.id;
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, userId, status: 'placed' },
    req.body,
    { new: true },
  );
  if (!order) throw new ApiError(404, 'Order not found or cannot be updated');
  res.json(order);
};

// Mark order as shipped (partner/admin)
export const shipOrder: RequestHandler<{ id: string }> = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: 'shipped' },
    { new: true },
  );
  if (!order) throw new ApiError(404, 'Order not found');
  res.json(order);
};

// Mark order as delivered (partner/admin)
export const deliverOrder: RequestHandler<{ id: string }> = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: 'delivered' },
    { new: true },
  );
  if (!order) throw new ApiError(404, 'Order not found');
  res.json(order);
};

// Mark order as returned (partner/admin)
export const markReturnedOrder: RequestHandler<{ id: string }> = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: 'returned' },
    { new: true },
  );
  if (!order) throw new ApiError(404, 'Order not found');
  res.json(order);
};
