# Use Node.js 18 as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment variables (you can override these when running)
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["npm", "start"]
