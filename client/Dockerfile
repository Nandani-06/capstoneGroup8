FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci
RUN npm rebuild lightningcss


COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
