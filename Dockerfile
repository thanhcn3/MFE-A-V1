
FROM nginx:alpine

# Xoá config mặc định
RUN rm -rf /usr/share/nginx/html/* \
    && rm /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build output của 4 app
COPY dist/shell/ /usr/share/nginx/html/
COPY dist/remote-home/ /usr/share/nginx/html/remote-home/
COPY dist/remote-about/ /usr/share/nginx/html/remote-about/
COPY dist/remote-profile/ /usr/share/nginx/html/remote-profile/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
