FROM node:20-alpine

ARG web=/opt/workspace/aelf-website
ARG NEXT_PUBLIC_APP_ENV=production
ARG STRAPI_API_URL
ARG STRAPI_MEDIA_ORIGIN
ARG BLOG_CANONICAL_ORIGIN=https://blog.aelf.com
ARG NPM_CONFIG_REGISTRY=https://registry.npmjs.org/

ENV NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV}
ENV STRAPI_API_URL=${STRAPI_API_URL}
ENV STRAPI_MEDIA_ORIGIN=${STRAPI_MEDIA_ORIGIN}
ENV BLOG_CANONICAL_ORIGIN=${BLOG_CANONICAL_ORIGIN}
ENV NPM_CONFIG_REGISTRY=${NPM_CONFIG_REGISTRY}
ENV NODE_ENV=production

WORKDIR ${web}

COPY package.json yarn.lock ./
RUN npm install -g "yarn@1.22.22" --force --registry "${NPM_CONFIG_REGISTRY}" \
    && yarn config set registry "${NPM_CONFIG_REGISTRY}" \
    && yarn install --frozen-lockfile --network-timeout 600000

COPY . .
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
