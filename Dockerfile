# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3000 for the application
EXPOSE 3000

# Set environment variables from .env file
# Ensure that the dotenv package is used in your application
RUN apk add --no-cache bash
COPY .env .env

# Command to run the application
CMD ["node", "server.js"]
