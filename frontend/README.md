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
