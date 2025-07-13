# FRONTEND.md

## Flow of Logic & UI Pages

### 1. Admin user is created and logs in to get a token

- UI: Admin login page, dashboard

### 2. Admin creates a partner user using /admin/user

- UI: Admin → “Manage Users” page (create, edit, delete users)

### 3. Customer registers using /auth/register

- UI: Customer signup page

### 4. Partner logs in and creates an item

- UI: Partner login page, “Manage Items” page (add, edit, delete items)

### 5. Customer logs in and browses items

- UI: “Browse Items / Shop” page (list of new items)

### 6. Customer places an order for an item

- UI: Cart & checkout flow, “My Orders” page

### 7. Partner ships the order

- UI: Partner dashboard → “Orders to Ship” page

### 8. Customer receives order and requests return

- UI: “My Orders” page → button to request return → “Request Return” form

### 9. Partner approves the return

- Backend triggers:
  - Dummy PricingService (generates resale price)
  - Dummy MatchingService (finds local resale opportunity)
  - Creates a ReturnedItem record
- UI: Partner dashboard → “Pending Returns” page → approve/reject action

### 10. Returned items become visible in resale feed

- UI:
  - Partner → “Returned Items to Claim” page
  - Customer → “Open Box Deals Near You” page

### 11. Partner (or customer) claims/buys returned item for resale

- UI: Claim / buy button on returned items feed

---

## Frontend pages summary

**Admin:**

- Login page
- Dashboard
- User management page

**Partner:**

- Login page
- Manage items page
- Orders to ship page
- Pending returns approval page
- Returned items marketplace / claim page

**Customer:**

- Signup / login page
- Browse shop / view new items
- Cart & checkout
- My Orders page (track orders & request returns)
- Open box / returned deals page
