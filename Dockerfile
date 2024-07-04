FROM node:21-alpine

ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

WORKDIR /usr/app

COPY package.json ./

RUN npm install --legacy-peer-deps

COPY ./ ./

EXPOSE 8000

CMD [ "npm", "run", "dev" ]