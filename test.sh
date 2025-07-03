#!/bin/bash

API_URL="http://localhost:3000/api"
ADMIN_EMAIL="alice@example.com"
ADMIN_PASS="password123"

echo "1. Logging in as admin..."
TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" | jq -r .token)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed"
  exit 1
fi
echo "Token: $TOKEN"

echo "2. Adding item..."
ITEM_ID=$(curl -s -X POST "$API_URL/items" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","price":19.99,"stock":10}' | jq -r ._id)

if [ "$ITEM_ID" == "null" ] || [ -z "$ITEM_ID" ]; then
  echo "Add item failed"
  exit 1
fi
echo "Item ID: $ITEM_ID"


echo "3. Placing order..."
ORDER_ID=$(curl -s -X POST "$API_URL/orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"items\":[{\"itemId\":\"$ITEM_ID\",\"qty\":1,\"priceAtPurchase\":19.99}]}" | jq -r ._id)

if [ "$ORDER_ID" == "null" ] || [ -z "$ORDER_ID" ]; then
  echo "Place order failed"
  exit 1
fi
echo "Order ID: $ORDER_ID"

echo "4. Shipping order..."
SHIP_STATUS=$(curl -s -X PUT "$API_URL/orders/$ORDER_ID/ship" \
  -H "Authorization: Bearer $TOKEN" | jq -r .status)
echo "Ship status: $SHIP_STATUS"

# echo "Waiting for 5 seconds to simulate shipping delay..."
# sleep 5

echo "5. Requesting return..."
RETURN_ID=$(curl -s -X POST "$API_URL/returns" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"orderId\":\"$ORDER_ID\",\"itemId\":\"$ITEM_ID\",\"reason\":\"Changed mind\",\"condition\":\"new\"}" | jq -r ._id)

if [ "$RETURN_ID" == "null" ] || [ -z "$RETURN_ID" ]; then
  echo "Request return failed"
  exit 1
fi
echo "Return ID: $RETURN_ID"

echo "6. Approving return..."
APPROVE_STATUS=$(curl -s -X PUT "$API_URL/returns/$RETURN_ID/approve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refundAmount":19.99}' | jq -r .status)
echo "Approve status: $APPROVE_STATUS"

# If a refund endpoint, add it here. If not, skip this step.
# echo "7. Refunding order..."
# REFUND_STATUS=$(curl -s -X PATCH "$API_URL/returns/$RETURN_ID/refund" \
#   -H "Authorization: Bearer $TOKEN" | jq -r .status)
# echo "Refund status: $REFUND_STATUS"

echo "Done."
