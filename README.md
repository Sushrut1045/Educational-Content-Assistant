# Educational-Content-Assistant
# 📚 Educational Content Assistant (RAG-Based AI)

![Python](https://img.shields.io/badge/Python-3.10-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-blue)
![FAISS](https://img.shields.io/badge/FAISS-VectorDB-orange)
![Gemini](https://img.shields.io/badge/Gemini-LLM-purple)

An AI-powered personalized learning companion built using Retrieval-Augmented Generation (RAG).

Upload your study material, ask questions, generate quizzes, and create personalized learning paths.

---

## 🚀 Overview

This project is a prototype AI Educational System that:

- 📄 Accepts PDF uploads
- 🤖 Answers questions using RAG
- 📚 Suggests learning resources
- 🗺️ Generates personalized learning paths
- 📝 Creates quizzes dynamically

---

## ✨ Features

- Document-based Question Answering (RAG)
- Semantic Search with FAISS
- Gemini-powered Answer Generation
- Learning Path Generator
- Quiz Generation Engine
- Resource Recommendation System
- Modern SaaS-style Dashboard

---

## 🧠 How It Works (RAG Pipeline)

1. User uploads a PDF
2. Text is extracted and chunked
3. Embeddings are generated
4. Stored in FAISS vector database
5. User question embedding created
6. Top relevant chunks retrieved
7. Gemini generates context-based answer

---

## 🏗️ System Architecture

Frontend (React)
        ↓
FastAPI Backend
        ↓
PDF Processing
        ↓
Embedding Model (Gemini)
        ↓
FAISS Vector Store
        ↓
Answer Generation

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- TailwindCSS

### Backend
- FastAPI
- FAISS
- Google Gemini API
- Python

---

## 📂 Project Structure

frontend/
backend/
│
├── app/
│ ├── main.py
│ ├── rag.py
│ ├── utils.py
│
├── requirements.txt
├── .env

🧪 API Endpoints

POST /upload

POST /ask

POST /generate-learning-path

POST /generate-quiz

🔮 Future Improvements

Multi-user authentication

Persistent database

Adaptive difficulty

Analytics dashboard

Knowledge graph integration
