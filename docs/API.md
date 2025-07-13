# BACKEND API INFO

---

### **Auth**

- `POST   /api/auth/register` — Register a new user
- `POST   /api/auth/login` — Login

---

### **Admin** (ADMIN ONLY)

- `POST   /api/admin/user` — Create a user
- `GET    /api/admin/user` — List all users
- `PUT    /api/admin/user/:id` — Update user by ID
- `DELETE /api/admin/user/:id` — Delete user by ID

---

### **Items**

- `POST   /api/items` — Create item (admin/partner)
- `GET    /api/items` — List all items
- `GET    /api/items/:id` — Get item by ID
- `PUT    /api/items/:id` — Update item (admin/partner)
- `DELETE /api/items/:id` — Delete item (admin/partner)

---

### **Orders**

- `POST   /api/orders` — Place order (any logged-in user)
- `GET    /api/orders` — List own orders
- `GET    /api/orders/:id` — Get single order by ID
- `PUT    /api/orders/:id/cancel` — Cancel order
- `PUT    /api/orders/:id` — Update order
- `PUT    /api/orders/:id/ship` — Ship order (admin/partner)
- `PUT    /api/orders/:id/deliver` — Deliver order (admin/partner)
- `PUT    /api/orders/:id/returned` — Mark as returned (admin/partner)

---

### **Returns**

- `POST   /api/returns` — Create return request (customer/admin)
- `GET    /api/returns` — List own return requests (customer)
- `GET    /api/returns/pending` — List pending returns (admin/partner)
- `PUT    /api/returns/:id/approve` — Approve return (admin/partner)
- `PUT    /api/returns/:id/reject` — Reject return (admin/partner)

Possible Breaking change: `PUT /api/returns/:id/approve` now returns:

```
{
  "returnRequest": { "_id": "...", "status": "approved" },
  "returnedItemId": "..."
}
```

instead of

```
{
  "status": "approved",
  ...
}
```

---

### **Return Items**

- `GET    /api/return-items/available` — List available returned items (partners/admin)
- `GET    /api/return-items/claimed` — List claimed returned items (customers can buy)
- `GET    /api/return-items/:id` — Get single returned item by ID (partners/admin)
- `PUT    /api/return-items/:id/claim` — Claim a returned item (partners/admin)

---
