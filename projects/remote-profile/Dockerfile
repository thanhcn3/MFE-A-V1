FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/remote-profile/nginx.conf \
     /etc/nginx/conf.d/default.conf

COPY dist/remote-profile/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
