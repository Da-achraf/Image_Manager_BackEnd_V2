#FROM node:19.0-buster-slim
#WORKDIR /app
#COPY . .
#RUN npm install
#EXPOSE 5000
#CMD [ "node", "app.js" ]


FROM node:15-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "app.js"]