import { RequestHandler } from 'express';
import ReturnRequest from '@/models/returns';
import Order from '@/models/order';
import Item from '@/models/item';
import User from '@/models/user';
import { ApiError } from '@/utils/error';

import { matchingService } from '@/services/matching';
import { pricingService } from '@/services/pricing';
import ReturnedItem from '@/models/returnItem'; // Import the ReturnedItem model

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

  // 1. Mark the return as approved in the database
  const rr = await ReturnRequest.findByIdAndUpdate(
    req.params.id,
    { status: 'approved', refundAmount },
    { new: true },
  );
  if (!rr) {
    throw new ApiError(404, 'Return request not found');
  }

  // 2. Use PricingService to get the resale price
  const resalePrice = await pricingService.suggestResalePrice(rr.itemId, rr.condition);
  if (!resalePrice) {
    throw new ApiError(500, 'Failed to calculate resale price');
  }

  const { refundId } = await pricingService.createRefund(rr.userId, refundAmount);

  // 3. Use MatchingService to find nearby partners
  const nearbyPartners = await matchingService.findPartnersNearby(
    { coordinates: [0, 0] }, // Replace with actual location if available
    10, // Max distance in km
  );

  // Notify nearby partners if any are found
  if (nearbyPartners && nearbyPartners.length > 0) {
    for (const partner of nearbyPartners) {
      const partnerUser = await User.findById(partner.partnerId);
      if (partnerUser) {
        partnerUser.notifications.push({
          message: `A returned item is available for resale. Item ID: ${rr.itemId}`,
          read: false,
        });
        await partnerUser.save();
      }
    }
  }

  // 4. Create a ReturnedItem record with resale price and matching data
  const returnedItem = new ReturnedItem({
    returnRequestId: rr._id,
    approvedResalePrice: resalePrice,
    status: 'available',
    location: {
      type: 'Point',
      coordinates: [0, 0], // Replace with actual location if available
    },
  });
  await returnedItem.save();

  // Respond with the updated return request and additional details
  res.json({
    returnRequest: rr,
    resalePrice,
    nearbyPartners: nearbyPartners || [], // Return an empty array if no partners are found
    refundId: refundId,
    returnedItemId: returnedItem._id,
  });
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
