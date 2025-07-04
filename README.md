same as my .env (try not to change)

```
MONGO_URI=mongodb://root:secret@localhost:27017
JWT_SECRET=your_jwt_secret
PORT=3000
```

# Docker Mongodb setup

```bash
docker run -d \
  --name local-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  mongo:latest
```

run with `npm run dev` ('@' alias points to 'src')

# Running Test Script.

### **before_test.sh**

- Sets up initial test data in the database, such as creating admin, partner, and customer users with known credentials.

### **test.sh**

- Logs in as admin, partner, and customer to obtain tokens.
- Partner creates a new item.
- Customer places an order for that item.
- Partner ships the order.
- Customer requests a return for the order.
- Partner approves the return and processes the refund.

this flow tests the full lifecycle: user authentication, item creation, ordering, shipping, return request, and return approval/refund.

run `chmod +x before_test.sh && ./before_test.sh`
<br/>
run `chmod +x test.h && ./test.sh`
