# Base image with Node.js (Alpine = small)
FROM node:24-alpine

# (Luis) add sqlite dependency (needed by db init script)
#(Alena) added also bash (container  needs bash)
RUN apk add --no-cache sqlite bash

# Create a group and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Tell docker that all future commands should run as the appuser user
USER appuser

# (Alena) work inside /app (all paths below are relative to this)
WORKDIR /app

# copy only package json and npm i to optimize image build speed
COPY --chown=appuser:appgroup package*.json .
RUN npm i


# copy all sources now
COPY --chown=appuser:appgroup . . 

#(Alena) added chmod, was not building container
RUN chmod +x ./db/setup_db.sh


# application will listen to port 3000
EXPOSE 3000

# (Alena) on container start: run DB init (creates /data/pong.db if missing), then start the backend
CMD ["sh","-c","./db/setup_db.sh && npm run start"]
