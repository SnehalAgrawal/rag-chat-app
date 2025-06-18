# RAG AI Chat

## Overview

This project implements a Retrieval-Augmented Generation (RAG) AI agent with PDF upload, vector storage in Weaviate, and a chat interface.

## Tech Stack

- Node.js, Express
- Weaviate vector database
- OpenAI APIs (Embeddings & GPT-4)
- PDF parsing with pdf-parse
- Frontend: Next.js, React
- Docker & Docker Compose

## Setup

1. Start Weaviate:

   ```bash
   docker-compose up -d
   ```

2. Install and run the backend:

   Copy `.env.example` to `.env` and fill in your credentials.

   ```bash
   cd backend
   npm install
   npm start
   ```

3. Install and run the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Open http://localhost:3000 in your browser.

## Architecture

- **backend/**: Express API with upload and chat routes, embedding & Weaviate services, PDF parsing utils.
- **frontend/**: Next.js app with file upload and chat UI.
- **weaviate**: Vector DB for chunk storage.

## Usage

1. Upload a PDF file via the UI.
2. Ask questions about the PDF content.
3. The AI retrieves relevant chunks and answers your questions.
