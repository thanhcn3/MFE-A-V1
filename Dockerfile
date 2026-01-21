## Simple, generic Angular build + Nginx serve
## Works for any project via ARG PROJECT_NAME

# Minimal runtime-only image: expects local dist already built
FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
ARG PROJECT_NAME
COPY dist/${PROJECT_NAME} /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
