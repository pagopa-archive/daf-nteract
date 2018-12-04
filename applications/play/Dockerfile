FROM node:8@sha256:dd2381fe1f68df03a058094097886cd96b24a47724ff5a588b90921f13e875b7
ADD . /playground
WORKDIR /playground
RUN npm install && npm run build

EXPOSE 3000

CMD ["/playground/node_modules/.bin/next", "start", "--host", "0.0.0.0"]
