# MedFund: Hopeful Funds Platform

A decentralized medical crowdfunding platform built on Cardano blockchain and Stripe payment integration. MedFund connects patients in need with donors to fund healthcare costs through transparent and secure donations.

## 🌟 Features

- **Medical Fundraising Campaigns**: Create and manage healthcare funding campaigns
- **Dual Payment Options**: Support with traditional payments (Stripe) or cryptocurrency (Cardano)
- **Transparent Fund Management**: Track all donations and disbursements on the blockchain
- **Secure Medical Verification**: Confidential verification of medical needs
- **User-friendly Dashboard**: Intuitive interface for campaign creators and donors

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI**: TailwindCSS, shadcn/ui components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Privy
- **Storage**: Supabase Storage for images and documents
- **Payments**: 
  - Fiat: Stripe API integration
  - Crypto: Cardano blockchain integration
- **Deployment**: [Lovable](https://lovable.dev/projects/d971f8ae-777b-4866-80f3-878d4cdf49b6)

## 💻 Development Setup

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- PostgreSQL database
- Supabase account (for file storage)
- Stripe account (for testing payments)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd hopeful-funds-platform

# Install dependencies (using pnpm)
pnpm install

# Copy environment variables and configure
cp .env.example .env
# Update .env with your credentials

# Start development server
pnpm dev
```

### Database Setup

This project uses Drizzle ORM with PostgreSQL for database management.

1. Create a PostgreSQL database
```sh
# Using psql
createdb medfund

# Or inside PostgreSQL
CREATE DATABASE medfund;
```

2. Generate and apply migrations
```sh
# Generate migration files
pnpm db:generate

# Apply migrations to your database
pnpm db:migrate

# View and manage your database with Drizzle Studio
pnpm db:studio
```

### Supabase Storage Setup

The application uses Supabase for storing campaign images and medical documents:

1. Create a [Supabase](https://supabase.com/) account and project
2. Set up the required storage buckets and security policies
3. Refer to the [Supabase Setup Guide](./docs/supabase-setup.md) for detailed instructions

### Docker Setup

Alternatively, you can use Docker to run the PostgreSQL database:

1. Start the PostgreSQL database and pgAdmin:
```sh
# Start containers in detached mode
docker-compose up -d

# View container logs
docker-compose logs -f
```

2. Access the database:
   - PostgreSQL is available at `localhost:5432`
   - Default credentials: `postgres:postgres`
   - Database name: `medfund`

3. Access pgAdmin (optional):
   - Open `http://localhost:5050` in your browser
   - Login with: `admin@medfund.com` / `admin`
   - Connect to the PostgreSQL server using:
     - Host: `postgres`
     - Username: `postgres`
     - Password: `postgres`

4. Stop the containers:
```sh
docker-compose down
```

## 💳 Payment Integration

### Stripe Integration (Fiat Currency)

The platform uses Stripe for processing traditional currency payments:

- Test mode enabled for development with test API keys
- Real credit card processing in test environment
- API endpoints for payment intents, confirmations, and status checks

### Cardano Integration (Cryptocurrency)

Future implementation will support Cardano blockchain for:

- Cryptocurrency donations
- Transparent fund tracking
- Smart contract disbursements

## 📊 Database Schema

The database schema consists of the following tables:

- `users` - Platform users (patients, donors, etc.)
- `campaigns` - Medical fundraising campaigns
- `donations` - Donations made to campaigns
- `medical_records` - Medical documentation and history
- `payment_methods` - User payment information

See the [Database Schema](./src/lib/db/schema/) directory for detailed table definitions.

## 🚢 Deployment

The project can be deployed through the Lovable platform:

1. Visit [Lovable Project](https://lovable.dev/projects/d971f8ae-777b-4866-80f3-878d4cdf49b6)
2. Click on Share -> Publish
3. For custom domains, navigate to Project > Settings > Domains

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
