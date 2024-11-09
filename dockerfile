# Usar a imagem base do Node.js
FROM node:16

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta na qual sua API será executada (por exemplo, 3000)
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "index.js"]  # Substitua "index.js" pelo seu arquivo principal