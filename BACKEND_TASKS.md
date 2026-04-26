# Backend Tasks - Next Steps

## Priority 1: Critical API Endpoints (Must Implement)

### 1. **User Profile Endpoints**
- **GET `/api/auth/me`** - Already exists, must return:
  - `user` object with: `_id`, `name`, `email`, `role`, `avatar`, `createdAt`
  - Verify token and return 401 if invalid
  
- **PUT `/api/auth/profile`** (NEW)
  - Authenticated endpoint (require Bearer token)
  - Update user profile fields: `name`, `email`
  - Return updated user object
  - Validate email uniqueness (except for current user)
  - Return 400 if validation fails

- **POST `/api/auth/change-password`** (NEW)
  - Authenticated endpoint
  - Body: `{ currentPassword, newPassword, confirmPassword }`
  - Verify current password using bcrypt
  - Hash and update new password
  - Return success message or 401 if current password is wrong
  - Return 400 if passwords don't match

### 2. **Order History Endpoints**
- **GET `/api/orders`** (NEW)
  - Authenticated endpoint
  - Return user's orders with pagination
  - Response: `{ orders: [...], total: number }`
  - Each order should include: `_id`, `orderNumber`, `date`, `items`, `total`, `status`, `deliveryDate`

- **GET `/api/orders/:orderId`** (NEW)
  - Get specific order details
  - Include: items list, shipping address, payment status, tracking info

### 3. **Wishlist Endpoints**
- **GET `/api/wishlist`** (NEW)
  - Return user's wishlist items
  - Response: `{ wishlistItems: [...] }`

- **POST `/api/wishlist`** (NEW)
  - Add product to wishlist
  - Body: `{ productId }`
  - Return 201 if successful

- **DELETE `/api/wishlist/:productId`** (NEW)
  - Remove from wishlist

### 4. **User Settings/Preferences**
- **GET `/api/users/preferences`** (NEW)
  - Return user preferences: email notifications, marketing emails, SMS notifications
  - Response: `{ emailNotifications: boolean, marketingEmails: boolean, smsNotifications: boolean }`

- **PUT `/api/users/preferences`** (NEW)
  - Update user preferences
  - Body: `{ emailNotifications?, marketingEmails?, smsNotifications? }`

### 5. **Addresses Endpoint**
- **GET `/api/users/addresses`** (NEW)
  - Return saved addresses for user

- **POST `/api/users/addresses`** (NEW)
  - Save new address
  - Body: `{ street, city, state, zipCode, phone }`

- **DELETE `/api/users/addresses/:addressId`** (NEW)
  - Remove saved address

---

## Priority 2: Features to Enable (Important)

### Admin Verification
- Ensure admin users have `role: 'admin'` in User model
- The frontend already has admin guard - backend just needs to verify role on protected endpoints
- Create seeded admin account in database for testing

### Inquiry Management
- The `/api/inquiries` endpoint exists
- Verify it returns proper inquiry data with:
  - Pagination support
  - Filters by status
  - Sorting options

### Product & Category APIs
- Verify existing endpoints work:
  - `GET /api/products` - pagination, filters, search
  - `GET /api/categories` - return all categories
  - `GET /api/products/:slug` - single product details

---

## Priority 3: Backend Security & Validation

### For All Authenticated Endpoints:
1. **Token Verification**
   - Middleware should verify JWT token from `Authorization: Bearer <token>` header
   - Return 401 for missing/invalid tokens
   - Return 403 for expired tokens

2. **User Ownership Validation**
   - When fetching user data (orders, wishlist, addresses), verify `userId` from token matches requested user
   - Return 403 if user tries to access other user's data

3. **Rate Limiting**
   - Consider implementing rate limiting on auth endpoints
   - Prevent brute force password change attempts

### Input Validation:
- Email format validation
- Password strength validation (min 6 chars)
- Trim and sanitize all string inputs
- Return 400 with clear error messages for validation failures

---

## Database Models to Update/Verify

### User Model - Already has these fields, verify:
```javascript
{
  name: String,
  email: String (unique),
  password: String,
  role: String ('admin' or 'user'),
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### NEW Models to Create:

**Order Model**
```javascript
{
  user: ObjectId (ref to User),
  orderNumber: String,
  items: [{ product, quantity, price }],
  total: Number,
  status: String ('pending', 'processing', 'shipped', 'delivered'),
  shippingAddress: String,
  paymentStatus: String,
  createdAt: Date,
  deliveredAt: Date
}
```

**Wishlist Model**
```javascript
{
  user: ObjectId (ref to User),
  products: [ObjectId] (refs to Product),
  createdAt: Date
}
```

**Address Model**
```javascript
{
  user: ObjectId (ref to User),
  street: String,
  city: String,
  state: String,
  zipCode: String,
  phone: String,
  isPrimary: Boolean,
  createdAt: Date
}
```

**UserPreferences Model**
```javascript
{
  user: ObjectId (ref to User),
  emailNotifications: Boolean (default: true),
  marketingEmails: Boolean (default: false),
  smsNotifications: Boolean (default: false),
  updatedAt: Date
}
```

---

## API Response Format Standards

### Success Responses:
```javascript
// Single resource
{ 
  success: true,
  user: { ...userData }
}

// List with pagination
{
  success: true,
  data: [...items],
  total: number,
  page: number,
  limit: number
}
```

### Error Responses:
```javascript
{
  success: false,
  message: "Descriptive error message",
  code: "ERROR_CODE"
}
```

---

## Testing Checklist for Backend Team

- [ ] Admin guard: Non-admin users cannot access `/admin` endpoints
- [ ] User can fetch own profile via `/api/auth/me`
- [ ] User can update profile info
- [ ] User can change password
- [ ] User can fetch order history
- [ ] User can manage wishlist
- [ ] User can save/manage addresses
- [ ] User can update preferences
- [ ] All authenticated endpoints require valid JWT
- [ ] Users cannot access other users' data
- [ ] Proper error codes and messages returned

---

## Frontend Usage (Reference for Backend)

The frontend is expecting:

1. **On Login/Register**: Return `{ token, user }` where user has at least `{ _id, name, email, role }`
2. **On `/me` page load**: Fetch from `/api/auth/me` to get current user data
3. **Admin routes**: Protected by frontend guard, but backend should verify role on admin endpoints
4. **All user data endpoints**: Must return 401 if token is missing/invalid

---

## Timeline Suggestions

1. **Week 1**: Implement all Priority 1 endpoints (Profile, Password, Orders)
2. **Week 2**: Implement Wishlist, Addresses, Preferences endpoints
3. **Week 3**: Add security, validation, rate limiting
4. **Week 4**: Testing and bug fixes

Let me know if you need clarification on any of these endpoints!
