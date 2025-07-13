#!/bin/bash

API_URL="http://localhost:3000/api"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASS="password123"
PARTNER_EMAIL="partner@example.com"
PARTNER_PASS="password123"
CUSTOMER_EMAIL="customer@example.com"
CUSTOMER_PASS="password123"
CUSTOMER2_EMAIL="customer2@example.com"
CUSTOMER2_PASS="password123"

echo "== 1. Login as admin =="
ADMIN_TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
 -H "Content-Type: application/json" \
 -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" | jq -r .token)

if [ "$ADMIN_TOKEN" == "null" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo "Admin login failed"
  exit 1
fi
echo "Admin Token: $ADMIN_TOKEN"

echo "== 2. Login as partner =="
PARTNER_TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
 -H "Content-Type: application/json" \
 -d "{\"email\":\"$PARTNER_EMAIL\",\"password\":\"$PARTNER_PASS\"}" | jq -r .token)

if [ "$PARTNER_TOKEN" == "null" ] || [ -z "$PARTNER_TOKEN" ]; then
  echo "Partner login failed"
  exit 1
fi
echo "Partner Token: $PARTNER_TOKEN"

echo "== 3. Login as customer =="
CUSTOMER_TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
 -H "Content-Type: application/json" \
 -d "{\"email\":\"$CUSTOMER_EMAIL\",\"password\":\"$CUSTOMER_PASS\"}" | jq -r .token)

if [ "$CUSTOMER_TOKEN" == "null" ] || [ -z "$CUSTOMER_TOKEN" ]; then
  echo "Customer login failed"
  exit 1
fi
echo "Customer Token: $CUSTOMER_TOKEN"

echo "== 3b. Login as second customer (customer2) =="
CUSTOMER2_TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
 -H "Content-Type: application/json" \
 -d "{\"email\":\"$CUSTOMER2_EMAIL\",\"password\":\"$CUSTOMER2_PASS\"}" | jq -r .token)

if [ "$CUSTOMER2_TOKEN" == "null" ] || [ -z "$CUSTOMER2_TOKEN" ]; then
  echo "Customer2 login failed"
  exit 1
fi
echo "Customer2 Token: $CUSTOMER2_TOKEN"

echo "== 4. Partner creates an item =="
ITEM_ID=$(curl -s -X POST "$API_URL/items" \
 -H "Authorization: Bearer $PARTNER_TOKEN" \
 -H "Content-Type: application/json" \
 -d '{"name":"Demo Item","description":"For testing","price":100,"qty":10}' | jq -r ._id)

if [ "$ITEM_ID" == "null" ] || [ -z "$ITEM_ID" ]; then
  echo "Item creation failed"
  exit 1
fi
echo "Item ID: $ITEM_ID"

echo "== 5. Customer places order =="
ORDER_ID=$(curl -s -X POST "$API_URL/orders" \
 -H "Authorization: Bearer $CUSTOMER_TOKEN" \
 -H "Content-Type: application/json" \
 -d "{\"items\":[{\"itemId\":\"$ITEM_ID\",\"qty\":1}]}" | jq -r ._id)

if [ "$ORDER_ID" == "null" ] || [ -z "$ORDER_ID" ]; then
  echo "Order creation failed"
  exit 1
fi
echo "Order ID: $ORDER_ID"

echo "== 6. Partner ships order =="
SHIP_STATUS=$(curl -s -X PUT "$API_URL/orders/$ORDER_ID/ship" \
 -H "Authorization: Bearer $PARTNER_TOKEN" | jq -r .status)

if [ "$SHIP_STATUS" == "null" ] || [ -z "$SHIP_STATUS" ]; then
  echo "Shipping failed"
  exit 1
fi
echo "Ship status: $SHIP_STATUS"

echo "== 7. Customer requests return =="
RETURN=$(curl -s -X POST "$API_URL/returns" \
 -H "Authorization: Bearer $CUSTOMER_TOKEN" \
 -H "Content-Type: application/json" \
 -d "{\"orderId\":\"$ORDER_ID\",\"itemId\":\"$ITEM_ID\",\"reason\":\"Changed mind\",\"condition\":\"new\"}")

RETURN_ID=$(echo "$RETURN" | jq -r ._id)

if [ "$RETURN_ID" == "null" ] || [ -z "$RETURN_ID" ]; then
  echo "Return request failed"
  exit 1
fi
echo "Return ID: $RETURN_ID"

echo "== 8. Partner approves return =="
APPROVE=$(curl -s -X PUT "$API_URL/returns/$RETURN_ID/approve" \
 -H "Authorization: Bearer $PARTNER_TOKEN" \
 -H "Content-Type: application/json" \
 -d '{"refundAmount":100}')

APPROVE_STATUS=$(echo "$APPROVE" | jq -r .returnRequest.status)

if [ "$APPROVE_STATUS" == "null" ] || [ -z "$APPROVE_STATUS" ]; then
  echo "Approve failed"
  exit 1
fi
echo "Approve status: $APPROVE_STATUS"

echo "== 9. Partner claims the returned item =="
RETURNED_ITEM_ID=$(echo "$APPROVE" | jq -r .returnedItemId)

if [ "$RETURNED_ITEM_ID" == "null" ] || [ -z "$RETURNED_ITEM_ID" ]; then
  echo "ReturnedItemId not found in approve response"
  exit 1
fi
echo "Returned Item ID: $RETURNED_ITEM_ID"

CLAIMED_ITEM=$(curl -s -X PUT "$API_URL/return-items/$RETURNED_ITEM_ID/claim" \
 -H "Authorization: Bearer $PARTNER_TOKEN")

CLAIMED_STATUS=$(echo "$CLAIMED_ITEM" | jq -r .status)
if [ "$CLAIMED_STATUS" != "claimed" ]; then
  echo "Claiming returned item failed"
  exit 1
fi
echo "Claimed item status: $CLAIMED_STATUS"

echo "== 10. Customer lists claimed returned items =="
CLAIMED_LIST=$(curl -s -X GET "$API_URL/return-items/claimed")
CLAIMED_LIST_ID=$(echo "$CLAIMED_LIST" | jq -r '.[0]._id')

if [ "$CLAIMED_LIST_ID" == "null" ] || [ -z "$CLAIMED_LIST_ID" ]; then
  echo "No claimed returned items found"
  exit 1
fi
echo "Customer sees claimed returned item: $CLAIMED_LIST_ID"

echo "== 11. Customer2 buys the claimed returned item =="
ORDER_RETURNED=$(curl -s -X POST "$API_URL/orders" \
 -H "Authorization: Bearer $CUSTOMER2_TOKEN" \
 -H "Content-Type: application/json" \
 -d "{\"items\":[{\"itemId\":\"$CLAIMED_LIST_ID\",\"qty\":1}]}")

ORDER_RETURNED_ID=$(echo "$ORDER_RETURNED" | jq -r ._id)
if [ "$ORDER_RETURNED_ID" == "null" ] || [ -z "$ORDER_RETURNED_ID" ]; then
  echo "Customer2 failed to buy claimed returned item"
  exit 1
fi
echo "Customer2 bought returned item, order ID: $ORDER_RETURNED_ID"

echo "== ALL RETURN FLOW TESTS PASSED ✅ =="