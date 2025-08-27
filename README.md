# db-seeder

A Node.js + Prisma project with a simple database seeder for creating user records (patients and labs).

## Project Overview

- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Language:** TypeScript (ESM module)
- **Seeder:** Generates patients and labs in the database.
- **Status:** Seeder is working (unoptimized for now) – see commit `90d0933`.

---

## Features

```
- Prisma schema and migrations setup.
- Seeder creates two user roles:
  - **Patients**
  - **Labs**
- Seed count can be specified via CLI argument.
```

Example:
- `npm run db:seed 20` → Creates **40 users** (20 patients + 20 labs).

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9 (or yarn/pnpm)
- **PostgreSQL/MySQL/SQLite** depending on your Prisma schema (configure in `.env`).

Install dependencies:  
`npm install`

## Environment Setup

1. Create a `.env` file in the project root with the following:  
`DATABASE_URL="your_database_connection_url"`

2. Push the Prisma schema to your database:  
`npm run db:push`  

or run migrations (if using migrations):  
`npm run db:migrate`

## Running the Seeder

The seeder accepts an optional numeric argument that determines how many of each user role to create.

`npm run db:seed <count>`

- `<count>` is optional. Defaults to `1`.  
- Example: `npm run db:seed 10` → 10 patients + 10 labs (20 users total).

Alternatively, run:  
`npx prisma db seed`

**Note:** `prisma.config.ts` has the seeder configured. Ensure your seed script is executable with `ts-node --esm`.

## Project Structure

```
├── prisma.config.ts    # Prisma configuration file  
├── prisma/  
|   ├── schema.prisma   # Prisma schema  
|   ├── migrations/     # Migration files  
|   ├── seed.ts         # Seeder script  
|   └── helper.ts       # Helper script  
├── package.json  
└── README.md
```

## Development

- Run Prisma Studio to explore the database:  
`npx prisma studio`

- Run Jest tests (placeholder, not configured yet):  
`npm test`

## Commits Overview

- **`69b01e8`** – Initial commit with basic project setup.  
- **`aba4c1e`** – Initial commit (duplicate, pre-cleanup).  
- **`90d0933`** – Added working (unoptimized) seeder logic.

## Next Steps / Improvements
```
- Optimize seeder logic (bulk insert instead of multiple calls).  
- Add role-based seed configuration (choose patients, labs, or both).  
- Improve error handling and logging.  
- Add automated tests for seeding logic.
```
## License
```bash
See the [LICENSE](LICENSE) file for details.
```
