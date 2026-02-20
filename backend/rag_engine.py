import os
import shutil
from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document

PERSIST_DIRECTORY = "./chroma_db"

def get_embedding_function():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable not set")
    return GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001", google_api_key=api_key)

def ingest_pdf(file_path: str) -> List[Document]:
    """Loads a PDF and splits it into chunks."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
        
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = text_splitter.split_documents(documents)
    return chunks

def store_in_chroma(chunks: List[Document]):
    """Stores document chunks in ChromaDB."""
    embedding_function = get_embedding_function()
    
    # Create or update the vector store
    db = Chroma.from_documents(
        documents=chunks,
        embedding=embedding_function,
        persist_directory=PERSIST_DIRECTORY
    )
    # db.persist() # Chroma 0.4+ persists automatically
    return db

def get_retriever():
    """Returns a retriever for the vector store."""
    embedding_function = get_embedding_function()
    db = Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embedding_function)
    return db.as_retriever(search_kwargs={"k": 5})

def clear_database():
    """Clears the existing vector database."""
    if os.path.exists(PERSIST_DIRECTORY):
        shutil.rmtree(PERSIST_DIRECTORY)
