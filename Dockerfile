FROM node:22-alpine3.18 AS builder
# Install dependencies

WORKDIR /app
COPY ./ ./

RUN npm install

# Build the application
RUN npm run build

FROM node:22-alpine3.18
# Copy the built application from the builder stage
COPY ./package.json ./
COPY ./package-lock.json ./
COPY --from=builder /app /app
WORKDIR /app
# Install production dependencies
RUN npm install --only=production
# Expose the port the app runs on
EXPOSE 3000
# Start the application
CMD ["node", "dist/main.js"]