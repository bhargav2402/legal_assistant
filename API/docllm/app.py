# LangChain components to use
from langchain.vectorstores.cassandra import Cassandra
from langchain.indexes.vectorstore import VectorStoreIndexWrapper
from langchain.llms import OpenAI
from langchain.embeddings import OpenAIEmbeddings

# Support for dataset retrieval with Hugging Face
from datasets import load_dataset

# With CassIO, the engine powering the Astra DB integration in LangChain,
# you will also initialize the DB connection:
import cassio
from PyPDF2 import PdfReader
from typing_extensions import Concatenate
from langchain.text_splitter import CharacterTextSplitter

ASTRA_DB_APPLICATION_TOKEN = "YOUR_ASTRA_DB_TOKEN_HERE" # enter the "AstraCS:..." string found in in your Token JSON file
ASTRA_DB_ID = "9935c2ce-3c5b-494f-8d72-736bd5d5bc82" # enter your Database ID
OPENAI_API_KEY = "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" # enter your OpenAI key

pdfreader = PdfReader('./book_1.pdf')
raw_text = ''
for i, page in enumerate(pdfreader.pages):
    content = page.extract_text()
    if content:
        raw_text += content

cassio.init(token=ASTRA_DB_APPLICATION_TOKEN, database_id=ASTRA_DB_ID)

llm = OpenAI(openai_api_key=OPENAI_API_KEY)
embedding = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)

astra_vector_store = Cassandra(
    embedding=embedding,
    table_name="qa_mini_demo",
    session=None,
    keyspace=None,
)

# We need to split the text using Character Text Split such that it should not increase token size
text_splitter = CharacterTextSplitter(
    separator="\n",
    chunk_size=800,
    chunk_overlap=200,
    length_function=len,
)
texts = text_splitter.split_text(raw_text)

astra_vector_store.add_texts(texts[:50])
print("Inserted %i headlines." % len(texts[:50]))

astra_vector_index = VectorStoreIndexWrapper(vectorstore=astra_vector_store)

def inference(query_text):
    answer = astra_vector_index.query(query_text, llm=llm).strip()
    return answer

# Flask app setup
from flask import Flask, request, jsonify

app = Flask(__name__)

# Define endpoint for asking questions
@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    query_text = data.get('question')

    if not query_text:
        return jsonify({'error': 'Question not provided'}), 400

    answer = inference(query_text)
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run()
