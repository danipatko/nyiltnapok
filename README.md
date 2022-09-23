# SZLG nyílt napok

## The stack

- database: postgresql with prisma ORM
- sveltekit framework

### Svelte

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

#### Building

To create a production version of your app:

```bash
npm run build
```

### Database

Use docker to create a new [postgres](https://hub.docker.com/_/postgres) database.

```bash
# Pull the image
docker pull postgres
# Create new instance
docker run -e "POSTGRES_PASSWORD=password" -e "POSTGRES_USER=default" -d -p 5432:5432 postgres
```

Configure the `DATABASE_URL` variable in _.env_ for prisma.

```env
# format: `postgresql://[username]:[password]@[host]:[port]/[username|database]?schema=public`
DATABASE_URL="postgresql://default:password@localhost:5432/default?schema=public"
```

Migrate database with:

```bash
npm run db:migrate [name]
# or
npx prisma migrate dev --name [name]
```

Reset database:

```bash
npm run db:reset
# or
prisma migrate reset dev
```
