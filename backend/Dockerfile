FROM node:24-alpine

# copy only package json and npm i to optimize image build speed
COPY package*.json .
RUN npm install
# (Luis) add sqlite dependency
RUN apk add --no-cache sqlite

# copy all sources now
COPY . . 

# (Luis) create a volume for persistent DB storage
VOLUME /data

# (Luis) initialize the database if it doesn't exist
ENV DB_PATH=/data/pong.db
RUN sh src/db/setup_db.sh

# application will listen to port 3000
EXPOSE 3000

CMD ["npm", "run", "start"]