# Use the official Node.js LTS image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY src/package*.json ./
RUN npm install --only=production

# Copy the source code
COPY src/ .

# Create a directory for storing order records
RUN mkdir -p db && touch db/orders.json

# Set environment variables
ENV PORT=5002
ENV CATALOG_URL=http://localhost:5001

# Expose port 5002
EXPOSE 5002

# Run the application
CMD ["node", "app.js"]
