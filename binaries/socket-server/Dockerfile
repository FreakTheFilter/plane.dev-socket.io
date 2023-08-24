FROM node:17

WORKDIR /app
COPY src ./src
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

ENTRYPOINT [ "npm", "start" ]
