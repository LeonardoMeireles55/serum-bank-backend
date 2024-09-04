FROM node:20-alpine

COPY package*.json ./

RUN npm install pm2 -g

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

# CMD ["npm", "run", "start:prod"]
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--name", "soroteca-app"]