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
  -v mongo-data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  mongo:latest
```

run with `npm run dev` ('@' alias points to 'src')

# Running Test Script.

### for dropping mongodb database if required.

```bash
❯ docker exec -it local-mongo sh
# mongosh -u root -p secret
test> show databases
test> use test
test> db.dropDatabase()
```

### **before_test.sh**

- Sets up initial test data:
  - Creates admin user
  - Creates partner user
  - Creates first customer user
  - Creates second customer user (who will later buy the returned item)

### **test.sh**

- Logs in as admin, partner, customer1, and customer2 to obtain tokens.
- Partner creates a new item.
- Customer1 places an order for that item.
- Partner ships the order.
- Customer1 requests a return.
- Partner approves the return and processes the refund.
- Partner claims the returned item.
- Customer1 lists claimed returned items.
- Customer2 buys the claimed returned item.

This flow tests the full lifecycle: user authentication, item creation, ordering, shipping, return request, approval/refund, partner claiming, and resale to another customer.

run `chmod +x before_test.sh && ./before_test.sh`
<br/>
run `chmod +x test.h && ./test.sh`
