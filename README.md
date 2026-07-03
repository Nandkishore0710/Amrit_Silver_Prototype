# Silverkaari + SilverIne Monorepo

## 🏗️ Architecture

```
silverkaari/
├── backend/           # Silverkaari API (Node.js + Express, port 5000)
├── frontend/          # Silverkaari React app (Vite, port 3000)
├── silverine/
│   ├── backend/       # SilverIne API (port 5001, db: silverine)
│   └── frontend/      # SilverIne React app (Vite, port 8080)
├── nginx/             # Shared API gateway + static serving
├── scripts/           # MongoDB init scripts
└── docker-compose.yml # Full production stack
```

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 20+
- MongoDB 6+ running locally (or Docker)
- Redis 7+ running locally (or Docker)

### 1. Environment Setup

```bash
cp .env.example .env
# Fill in your keys: MongoDB, Redis, JWT, Stripe, Cloudinary, SMTP, Google OAuth
```

### 2. Backend Setup (Silverkaari)

```bash
cd backend
npm install
npm run dev        # Starts on port 5000
```

### 3. Frontend Setup (Silverkaari)

```bash
cd frontend
npm install
npm run dev        # Starts on port 3000 with Vite proxy to backend
```

### 4. SilverIne (optional)

```bash
cd silverine/backend && npm install && npm run dev   # port 5001
cd silverine/frontend && npm install && npm run dev  # port 8080
```

## 🐳 Docker Deployment

```bash
# Build and start everything
docker compose up -d --build

# View logs
docker compose logs -f silverkaari-backend

# With dev tools (mongo-express on :8081)
docker compose --profile dev up -d
```

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 + Tailwind CSS v3 |
| State | Redux Toolkit + TanStack Query v5 |
| Backend | Node.js + Express.js (ESM) |
| Database | MongoDB 6 (Mongoose 8) |
| Cache | Redis 7 (ioredis + Bull queues) |
| Auth | JWT + Passport.js + Google OAuth 2.0 |
| Payments | Stripe (card + webhooks) |
| Email | Nodemailer + Bull email queue |
| Uploads | Multer + Cloudinary |
| Real-time | Socket.io |
| Gateway | Nginx 1.25 |
| Container | Docker + Docker Compose |

## 🔑 Key Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_ROOT_PASS` | ✅ | MongoDB root password |
| `JWT_SECRET` | ✅ | Min 32-char secret |
| `STRIPE_SECRET_KEY` | ✅ | Stripe sk_test/sk_live |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook signing secret |
| `CLOUDINARY_*` | ✅ | Image upload credentials |
| `SMTP_*` | ✅ | Email credentials |
| `GOOGLE_CLIENT_*` | ✅ | Google OAuth app |

## 🧪 Tests

```bash
cd backend
npm test           # Jest integration tests (auth + products)
```

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` — Register (email + password)
- `POST /api/auth/login` — Login
- `GET  /api/auth/google` — Google OAuth
- `GET  /api/auth/me` — Profile (JWT protected)

### Products
- `GET  /api/products` — List (filter: category, price, sort, search)
- `GET  /api/products/featured`
- `GET  /api/products/:slug`
- `POST /api/products` — Create (artisan/admin)
- `POST /api/products/:id/reviews` — Review

### Orders
- `POST /api/orders` — Create order
- `GET  /api/orders` — My orders
- `PUT  /api/orders/:id/cancel` — Cancel

### Payments
- `POST /api/payments/create-payment-intent`
- `POST /api/payments/webhook` — Stripe webhook

### Admin
- `GET  /api/admin/stats` — Dashboard stats
- `GET  /api/admin/stats/revenue` — Revenue chart
- `GET  /api/admin/orders` — All orders
- `PUT  /api/admin/orders/:id/status` — Update status

## 🎨 Design System

- **Colors**: Gold (`#f59e0b`), Silver, Dark backgrounds
- **Fonts**: Playfair Display (headings), Inter (body), Cormorant Garamond (display)
- **Animations**: Framer Motion + Tailwind animations (shimmer, float, glow)
- **Components**: Glassmorphism cards, gold border accents, skeleton loaders

# Amrit_Silver_Prototype
