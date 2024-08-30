# Use a imagem Node.js mais recente como base
FROM node:latest

# Copie os arquivos de configuração do npm
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código do projeto
COPY . .

# Execute o build do projeto
RUN npm run build

# Exponha a porta que o app irá usar
EXPOSE 3000

# Defina o comando para executar o app quando o contêiner iniciar
CMD ["npm", "run", "start:prod"]
