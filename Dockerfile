FROM node:16
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --production
COPY backend ./
EXPOSE 4000
CMD ["node", "index.js"]