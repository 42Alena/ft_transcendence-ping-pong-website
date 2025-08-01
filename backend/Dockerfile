FROM node:24-alpine

# copy only package json and npm i to optimize image build speed
COPY package*.json .
RUN npm install

# copy all sources now
COPY . . 

# application will listen to port 3000
EXPOSE 3000

CMD ["npm", "run", "start"]