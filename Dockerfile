FROM node:18-alpine
WORKDIR /opt/app
COPY package*.json ./
RUN ls -al
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production
CMD ["node", "dist/main.js"]
