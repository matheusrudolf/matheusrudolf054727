# =========================
# Stage 1 - Build Angular
# =========================
FROM node:20-alpine AS build

WORKDIR /app

# Copia apenas arquivos necessários para instalar dependências
COPY package.json package-lock.json ./

RUN npm ci

# Copia o restante do projeto
COPY . .

# Build produção
RUN npm run build -- --configuration production

# =========================
# Stage 2 - Nginx
# =========================
FROM nginx:alpine

# Remove config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia config customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build do Angular
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
