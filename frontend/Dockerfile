# FROM node:24-alpine

# (Alena) ROOTles - run  as user

# Create a group and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Tell docker that all future commands should run as the appuser user
USER appuser

# (Alena) work inside /app (all paths below are relative to this)
WORKDIR /app

COPY  --chown=appuser:appgroup package*.json ./
RUN npm ci 

COPY  --chown=appuser:appgroup . .

#  cd frontend | npm run serve | Available on:  http://127.0.0.1:8080
ENV PORT=8080
EXPOSE 8080

RUN npm run compile && \
	npm run bundle && \
	npm run compile-css

# now simple just builds—no command override there
CMD ["npm", "run", "serve"]
