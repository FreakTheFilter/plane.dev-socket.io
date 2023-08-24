FROM node:17

WORKDIR /app
COPY src ./src
COPY package.json .
COPY tsconfig.json .

RUN npm install

ENTRYPOINT [ "npm", "start" ]
