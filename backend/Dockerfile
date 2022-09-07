FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN yarn && yarn build

CMD ["node", "dist/app.js"]