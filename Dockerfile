# Production image with Nginx - Sử dụng pre-built files từ máy server
FROM nginx:alpine

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy pre-built applications từ dist folder (đã build sẵn trên máy)
COPY dist/shell /usr/share/nginx/html/shell
COPY dist/remote-home /usr/share/nginx/html/remote-home
COPY dist/remote-about /usr/share/nginx/html/remote-about
COPY dist/remote-profile /usr/share/nginx/html/remote-profile

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
