# Usando uma imagem oficial do Node.js para compilar o frontend
FROM node:20-alpine as build

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o código do frontend para o contêiner
COPY . .

# Compilar a aplicação React
RUN npm run build

# Usar um servidor web simples para servir o build
FROM nginx:alpine

# Copiar os arquivos compilados do React para o diretório público do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expor a porta 80 para o serviço Nginx
EXPOSE 80

# Comando padrão do Nginx para rodar o servidor
CMD ["nginx", "-g", "daemon off;"]