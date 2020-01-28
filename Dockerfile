FROM ubuntu:18.04

RUN mkdir /crc-bpmn
WORKDIR /crc-bpmn

ADD package.json /crc-bpmn/

COPY . /crc-bpmn/
RUN apt-get -y update
RUN apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
#RUN sudo apt-get install -y nodejs
RUN apt-get -y update
RUN apt-get -y  install nodejs build-essential

#RUN npm cache verify
RUN npm install
RUN npm run build:staging
#RUN npm run build

#FROM nginx:alpine

#COPY --from=builder /crc-bpmn/dist/* /usr/share/nginx/html/

CMD ["npm", "run", "start"]
