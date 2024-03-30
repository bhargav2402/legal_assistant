from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import requests
import io
from flask_cors import CORS 

load_dotenv()
GOOGLE_API_KEY = "AIzaSyAk1QWMnpwBQ-TljMMXaR6oKLpzak67hKQ"
os.getenv(GOOGLE_API_KEY)
genai.configure(api_key=os.getenv(GOOGLE_API_KEY))

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:5173/qna", "http://127.0.0.1:5000", "http://127.0.0.1:5000/qna"]}})

def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings , allow_dangerous_deserialization=True)
    vector_store.save_local("faiss_index")

def get_conversational_chain():
    prompt_template = """Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n Context:\n {context}?\n Question: \n{question}\n Answer: """
    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

def user_input(user_question):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    new_db = FAISS.load_local("faiss_index",embeddings , allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)
    chain = get_conversational_chain()
    response = chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)
    return response["output_text"]

@app.route('/upload_pdf', methods=['POST'])
def upload_pdf():
    if 'pdf_file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    pdf_file = request.files['pdf_file']
    pdf_text = get_pdf_text([pdf_file])
    text_chunks = get_text_chunks(pdf_text)
    get_vector_store(text_chunks)
    return jsonify({'message': 'PDF uploaded and processed successfully'}), 200

@app.route('/ask', methods=['POST'])
def ask_question():
    user_question = request.json['question']
    response = user_input(user_question)
    return jsonify({'answer': response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)