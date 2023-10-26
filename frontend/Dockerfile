# Base image
FROM node:16.13.1

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Legacy imports are installed separately
RUN npm install @codemirror/legacy-modes

# Copy all files
COPY . .

# Start the app in development mode
CMD ["npm", "run", "dev"]
