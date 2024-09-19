# Base image
FROM quay.io/suhailtechinfo/suhail-v2

# Create the app directory with correct permissions
RUN mkdir -p /home/app && chown -R node:node /home/app

# Set the working directory
WORKDIR /home/app

# Copy the entire app directory into the container with the correct ownership
COPY --chown=node:node . .

# Install dependencies
RUN npm install || yarn install

# Create the start.sh script with the correct permissions
RUN echo '#!/bin/sh\nnpm start' > start.sh \
    && chmod +x start.sh \
    && chown node:node start.sh

# Switch to the 'node' user
USER node

# Expose the port
EXPOSE 7860

# Run the start.sh script
CMD ["sh", "start.sh"]
