# Usando uma imagem oficial do Node.js como base
FROM node:20-alpine

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o código do backend para o contêiner
COPY . .

# Expor a porta onde o backend será executado
EXPOSE 8080

# Comando para rodar a aplicação
CMD ["node", "server.js"]