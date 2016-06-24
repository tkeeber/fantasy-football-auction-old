FROM docker-registry.prod.williamhill.plc/retail/ssbt-nginx:0.2.0
COPY dist /usr/share/nginx/html
RUN chown -Rf nginx: /usr/share/nginx
RUN chmod -Rf 755 /usr/share/nginx
