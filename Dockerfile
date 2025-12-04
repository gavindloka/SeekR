FROM node:20-alpine

#buat folder app
WORKDIR /app

#copy package.json and package-lock.json, then install
COPY package* .
RUN npm i

#pindahin semua ke workdir
COPY . . 

CMD ["npm","run","dev"]