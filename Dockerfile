FROM node:10-alpine

WORKDIR /home/workspace/yellow_card

COPY package*.json ./
ENV PYTHON /usr/lib/python2.7/ 
 
RUN npm install

COPY . .
EXPOSE 3000

CMD [ "node", "app.js" ]
