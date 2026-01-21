# Stage 1: Build tất cả các ứng dụng MFE
FROM node:20-bullseye AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies và Angular CLI global
RUN npm install

# Copy source code
COPY . .

# Build tất cả các projects
RUN npx ng build shell \
 && npx ng build remote-home \
 && npx ng build remote-about \
 && npx ng build remote-profile

# Stage 2: Production với Nginx
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built apps từ build stage
COPY --from=build /app/dist/shell/browser /usr/share/nginx/html/shell
COPY --from=build /app/dist/remote-home/browser /usr/share/nginx/html/remote-home
COPY --from=build /app/dist/remote-about/browser /usr/share/nginx/html/remote-about
COPY --from=build /app/dist/remote-profile/browser /usr/share/nginx/html/remote-profile

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
