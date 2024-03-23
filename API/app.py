from flask import Flask, request, jsonify, session
from flask_session import Session
import uuid
import secrets
from groq import Groq
from langchain.chains import ConversationChain
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os
from flask_cors import CORS
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

load_dotenv()

app = Flask(__name__)
CORS(app)
groq_api_key = "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"
app.config['SECRET_KEY'] = secrets.token_hex(16)  # Generates a 32-character hex string
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Initialize Groq Langchain chat object and conversation
groq_chat = ChatGroq(
    groq_api_key=groq_api_key,
    model_name='mixtral-8x7b-32768',  # Default model
)

# Initialize chat history
chat_history = ChatMessageHistory()

@app.route('/')
def index():
    # Generate a session ID if it doesn't exist
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())

    return 'Session ID: {}'.format(session['session_id'])

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_question = data.get('userQuestion')
    model = data.get('model')
    system = "You are a helpful assistant."
    human = data.get('userQuestion')
    prompt = ChatPromptTemplate.from_messages([
        ("system", system),
        MessagesPlaceholder(variable_name="chat_history"),  # Placeholder for chat history
        ("human", human)
    ])

    chain = prompt | groq_chat

    # Change model if provided in the request
    if model and model in ['mixtral-8x7b-32768', 'llama2-70b-4096']:
        groq_chat.model_name = model

    # Prepare the chain with message history
    chain_with_message_history = RunnableWithMessageHistory(
        chain,
        lambda session_id: chat_history,
        input_messages_key="input",
        history_messages_key="chat_history",
    )

    # Invoke the chain with the user question and session ID
    response = chain_with_message_history.invoke(
        {"text": user_question},
        {"configurable": {"session_id": session.get('session_id')}}  # Pass session ID here
    )
    response_data = {
        "content": response.content,
        # Add more fields if needed
    }

    # Add the user question to chat history
    chat_history.add_user_message(user_question)

    # Add the response to chat history
    chat_history.add_ai_message(response.content)

    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True, port=5002)
