import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains.summarize import load_summarize_chain
from langchain.docstore.document import Document

def get_llm():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable not set")
    return ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=api_key, temperature=0.3)

import requests

def generate_summary(text: str) -> str:
    """Generates a concise summary of the provided text using the Scaledown API."""
    api_key = os.getenv("SCALEDOWN_API_KEY")
    if not api_key:
        raise ValueError("SCALEDOWN_API_KEY environment variable not set. Please add it to your .env file.")
    
    url = "https://api.scaledown.xyz/compress/raw/"
    headers = {
        'x-api-key': api_key,
        'Content-Type': 'application/json'
    }
    payload = {
        "context": "Compress the following educational content into a high-yield summary.",
        "prompt": text,
        "scaledown": {
            "rate": "auto"
        }
    }
    
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"Scaledown API error: {response.status_code} - {response.text}")
        
    result = response.json()
    if not result.get("successful"):
        raise Exception("Scaledown API compression failed.")
        
    return result.get("compressed_prompt", "")

def generate_quiz(text: str, num_questions: int = 5) -> str:
    """Generates a quiz based on the provided text."""
    llm = get_llm()
    
    template = f"""
    Based on the following exact context, generate a fast, precise quiz with {num_questions} multiple-choice questions.
    Return ONLY a raw JSON array of objects. DO NOT include any markdown formatting, no code blocks, no backticks, and no conversational text.
    Each object must strictly have these exact keys: 'question' (string), 'options' (array of exactly 4 strings), 'correct' (integer index 0-3 of the correct option).

    Context:
    "{{text}}"
    """
    
    prompt = PromptTemplate(template=template, input_variables=["text"])
    chain = prompt | llm
    
    response = chain.invoke({"text": text})
    return response.content
