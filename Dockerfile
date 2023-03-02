FROM node:16-alpine
WORKDIR /oppabear-engine 
COPY package.json ./
#  add libraries; sudo so non-root user added downstream can get sudo
RUN apk add --no-cache \
        sudo \
        curl \
        build-base \
        g++ \
        libpng \                                                                                                                                                                                                                                                            
        libpng-dev \
        jpeg-dev \
        pango-dev \
        cairo-dev \
        giflib-dev \
        python3
#  add glibc and install canvas (remove no-cache for dev only)
# RUN apk --no-cache add ca-certificates wget  && \
RUN apk add ca-certificates wget  && \
        wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
        wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.29-r0/glibc-2.29-r0.apk && \
        apk add --force-overwrite glibc-2.29-r0.apk && \
        npm install canvas@2.8.0
RUN yarn install
COPY . .
CMD [ "npm", "run", "generate" ]