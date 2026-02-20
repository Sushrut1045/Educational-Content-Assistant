from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import shutil
from dotenv import load_dotenv
from pydantic import BaseModel
from rag_engine import ingest_pdf, store_in_chroma, get_retriever, clear_database
from scaledown import generate_summary, generate_quiz
from langchain.chains import RetrievalQA
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

app = FastAPI(title="Educational Content Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

class SummaryRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the Educational Content Assistant API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Save file temporarily
        upload_dir = "temp_uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Ingest and Store
        chunks = ingest_pdf(file_path)
        store_in_chroma(chunks)
        
        # Cleanup
        os.remove(file_path)
        
        return {"message": "Document processed and stored successfully", "chunks_count": len(chunks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query")
async def query_document(request: QueryRequest):
    try:
        retriever = get_retriever()
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=os.getenv("GOOGLE_API_KEY"))
        
        from langchain_core.prompts import PromptTemplate
        prompt_template = """Use the following pieces of context to answer the question at the end. 
        If you don't know the answer, just say that you don't know, don't try to make up an answer.
        Respond in a direct, conversational tone. Do not use markdown headers, bold text, or raw list formatting unless necessary for clarity. Keep the response concise and to the point.
        
        {context}
        
        Question: {question}
        Helpful Answer:"""
        PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
        
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm, 
            chain_type="stuff", 
            retriever=retriever,
            chain_type_kwargs={"prompt": PROMPT}
        )
        response = qa_chain.invoke(request.question)
        return {"answer": response['result']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/summary")
async def get_summary(request: SummaryRequest):
    try:
        summary = generate_summary(request.text)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/reset")
def reset_database():
    clear_database()
    return {"message": "Database cleared"}
