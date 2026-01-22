FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY docker/remote-about/nginx.conf \
     /etc/nginx/conf.d/default.conf

COPY dist/remote-about/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
