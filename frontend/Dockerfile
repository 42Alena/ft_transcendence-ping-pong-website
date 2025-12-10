FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .

#  cd frontend | npm run serve | Available on:  http://127.0.0.1:8080
ENV PORT=8080
EXPOSE 8080

RUN npm run compile && \
	npm run bundle && \
	npm run compile-css

# now simple just builds—no command override there
CMD ["npm", "run", "serve"]
