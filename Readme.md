# Code Setup

1. Initialize the project

   ```bash
   pnpm init
   ```

2. Initialize TypeScript configuration

   ```bash
   tsc --init
   ```

3. Generate `.gitignore`

   ```bash
   pnpm dlx gitignore Node
   ```

   Or

   ```bash
   npx gitignore Node
   ```

4. Install tsc-watch

   ```bash
   pnpm add -D tsc-watch
   ```

# Express setup

1. pnpm i express

2. pnpm i @types/express

3. pnpm i @types/node

# Docker set up for postgres

1. docker ps -> Shows running containers only

2. docker ps -a -> Shows all containers (running + stopped)

3. docker images -> Shows all downloaded/built Docker images on your machine

4. docker compose up -> to start all services defined in a docker-compose.yml file.

4. docker compose up -d -> to start all services defined in a docker-compose.yml file but in Detached mode (run containers in the background)