#!/bin/bash

API_URL="http://localhost:3000/api"

echo "== 1. Create admin user =="
curl -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"password123","role":"admin"}'

echo "== 2. Login as admin to get token =="
ADMIN_TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' | jq -r .token)

if [ "$ADMIN_TOKEN" == "null" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo "Admin login failed"
  exit 1
fi
echo "Admin Token: $ADMIN_TOKEN"

echo "== 3. Create partner user =="
curl -X POST "$API_URL/admin/user" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Partner","email":"partner@example.com","password":"password123","role":"partner"}'

echo "== 4. Create customer user =="
curl -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Customer","email":"customer@example.com","password":"password123","role":"customer"}'

echo "== 5. Create second customer user =="
curl -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Customer2","email":"customer2@example.com","password":"password123","role":"customer"}'

echo "== ✅ All users created! =="