# BACKEND
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
_________________
___________________
# FRONTEND

## run locally

```sh
# cd frontend

npm install

# compile typescript -> js
npm run compile

# run http server
npm run serve
```

## How it was created

```sh
#create new project(node package):
npm init -y

#install typescript and http-server
# https://github.com/http-party/http-server
npm install --dev typescript http-server

# add "compile" script to package.json to invoke tsc
# "scripts": {
#    "compile": "tsc",
# ...

# now can run compile script
npm run compile
```