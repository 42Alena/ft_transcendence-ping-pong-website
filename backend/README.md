# Local development

1. Install latest `node` (24+)
2. Install dependencies:

```sh
# cd backend
npm i
```

3. Run server

```sh
npm run start
```

4. Compile only to check typescript type warnings

```sh
npm run tsc
```

## With docker

```sh
#Build images
docker compose build
# or
docker compose build backend

# run service
docker compose up backend

# run service in background
docker compose up -d backend
```
