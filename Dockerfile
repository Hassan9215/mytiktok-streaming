# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# 🔽 Install mime-types directly (in case it's missing from package.json)
RUN npm install mime-types

# Copy rest of the app
COPY . .

# Run the app
CMD ["node", "index.js"]


