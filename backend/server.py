from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
import os
import uuid
import json
import asyncio
from datetime import datetime, timedelta
import motor.motor_asyncio
from passlib.context import CryptContext
from jose import JWTError, jwt
import PyPDF2
import aiofiles
import io
import base64
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from decouple import config

# Import integrations
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, 
    CheckoutSessionResponse, 
    CheckoutStatusResponse, 
    CheckoutSessionRequest
)
from emergentintegrations.llm.chat import LlmChat, UserMessage

# Environment variables
MONGO_URL = config('MONGO_URL', default='mongodb://localhost:27017/dogbloodgpt')
JWT_SECRET_KEY = config('JWT_SECRET_KEY', default='your-super-secret-jwt-key-here')
STRIPE_API_KEY = config('STRIPE_API_KEY', default='')
OPENAI_API_KEY = config('OPENAI_API_KEY', default='')

# FastAPI app
app = FastAPI(title="DogBloodGPT API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client.dogbloodgpt

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Pydantic models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ChatMessage(BaseModel):
    message: str
    session_id: str

class PaymentRequest(BaseModel):
    credits: int
    success_url: str
    cancel_url: str

class User(BaseModel):
    id: str
    email: str
    full_name: str
    credits: int
    created_at: datetime
    is_active: bool = True

# Database collections
users_collection = db.users
payment_transactions_collection = db.payment_transactions
blood_tests_collection = db.blood_tests
chat_sessions_collection = db.chat_sessions

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user = await users_collection.find_one({"id": user_id})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

async def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error extracting text from PDF: {str(e)}")

async def analyze_blood_test_with_ai(blood_test_text: str, user_question: str = None) -> str:
    """Analyze blood test results using OpenAI"""
    try:
        # System message for blood test analysis
        system_message = """You are an expert veterinary pathologist specializing in canine blood work analysis. 
        Your role is to provide detailed, accurate interpretations of dog blood test results.
        
        When analyzing blood tests, always:
        1. Identify each parameter and its reference range
        2. Highlight any abnormal values (high/low)
        3. Explain the clinical significance of abnormal findings
        4. Suggest potential causes for abnormalities
        5. Recommend follow-up actions if needed
        6. Use clear, professional language that pet owners can understand
        
        Always include a disclaimer that this analysis is for educational purposes and should not replace professional veterinary consultation."""

        # Create chat instance
        chat = LlmChat(
            api_key=OPENAI_API_KEY,
            session_id=str(uuid.uuid4()),
            system_message=system_message
        ).with_model("openai", "gpt-4")

        # Create user message
        if user_question:
            prompt = f"Here are the blood test results:\n\n{blood_test_text}\n\nSpecific question: {user_question}"
        else:
            prompt = f"Please analyze these dog blood test results:\n\n{blood_test_text}"

        user_message = UserMessage(text=prompt)
        response = await chat.send_message(user_message)
        
        return response.content

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing blood test: {str(e)}")

async def generate_pdf_report(analysis_text: str, user_name: str, test_date: str) -> bytes:
    """Generate PDF report from analysis"""
    try:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []

        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.darkblue,
            alignment=1  # Center alignment
        )
        story.append(Paragraph("DogBloodGPT Analysis Report", title_style))
        story.append(Spacer(1, 20))

        # Metadata
        story.append(Paragraph(f"<b>Pet Owner:</b> {user_name}", styles['Normal']))
        story.append(Paragraph(f"<b>Analysis Date:</b> {test_date}", styles['Normal']))
        story.append(Spacer(1, 20))

        # Analysis content
        story.append(Paragraph("<b>Blood Test Analysis:</b>", styles['Heading2']))
        story.append(Spacer(1, 12))
        
        # Split analysis into paragraphs
        paragraphs = analysis_text.split('\n\n')
        for para in paragraphs:
            if para.strip():
                story.append(Paragraph(para, styles['Normal']))
                story.append(Spacer(1, 12))

        # Disclaimer
        disclaimer_style = ParagraphStyle(
            'Disclaimer',
            parent=styles['Normal'],
            fontSize=10,
            textColor=colors.red,
            leftIndent=20,
            rightIndent=20
        )
        story.append(Spacer(1, 20))
        story.append(Paragraph("<b>DISCLAIMER:</b> This analysis is for educational purposes only and should not replace professional veterinary consultation. Always consult with a qualified veterinarian for medical advice.", disclaimer_style))

        doc.build(story)
        buffer.seek(0)
        return buffer.read()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF report: {str(e)}")

# Routes
@app.get("/")
async def root():
    return {"message": "DogBloodGPT API is running"}

@app.post("/api/auth/register")
async def register(user: UserRegister):
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = hash_password(user.password)
    
    new_user = {
        "id": user_id,
        "email": user.email,
        "full_name": user.full_name,
        "password": hashed_password,
        "credits": 0,
        "created_at": datetime.utcnow(),
        "is_active": True
    }
    
    await users_collection.insert_one(new_user)
    
    # Create JWT token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user.email,
            "full_name": user.full_name,
            "credits": 0
        }
    }

@app.post("/api/auth/login")
async def login(user: UserLogin):
    # Find user
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token
    access_token = create_access_token(data={"sub": db_user["id"]})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": db_user["id"],
            "email": db_user["email"],
            "full_name": db_user["full_name"],
            "credits": db_user["credits"]
        }
    }

@app.get("/api/user/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "credits": current_user["credits"]
    }

@app.post("/api/payments/create-checkout")
async def create_checkout(request: Request, credits: int = Form(...), host_url: str = Form(...)):
    """Create Stripe checkout session for credits"""
    try:
        # Fixed price: $97 per credit
        amount = float(credits * 97)
        
        # Initialize Stripe checkout
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        # Create success and cancel URLs
        success_url = f"{host_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{host_url}/payment-cancel"
        
        # Create checkout session
        checkout_request = CheckoutSessionRequest(
            amount=amount,
            currency="usd",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"credits": str(credits), "source": "dogbloodgpt"}
        )
        
        session = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Store payment transaction
        transaction = {
            "session_id": session.session_id,
            "amount": amount,
            "currency": "usd",
            "credits": credits,
            "payment_status": "pending",
            "created_at": datetime.utcnow(),
            "metadata": {"credits": str(credits), "source": "dogbloodgpt"}
        }
        
        await payment_transactions_collection.insert_one(transaction)
        
        return {"url": session.url, "session_id": session.session_id}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating checkout session: {str(e)}")

@app.get("/api/payments/status/{session_id}")
async def get_payment_status(session_id: str):
    """Get payment status for a session"""
    try:
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
        status = await stripe_checkout.get_checkout_status(session_id)
        
        # Update transaction in database
        transaction = await payment_transactions_collection.find_one({"session_id": session_id})
        if transaction:
            await payment_transactions_collection.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": status.payment_status, "updated_at": datetime.utcnow()}}
            )
            
            # If payment is successful and credits haven't been added yet
            if status.payment_status == "paid" and transaction.get("credits_added") != True:
                # Add credits to user (you'll need to implement user association)
                credits_to_add = int(transaction["credits"])
                await payment_transactions_collection.update_one(
                    {"session_id": session_id},
                    {"$set": {"credits_added": True}}
                )
                
                # Note: You'll need to implement user association with payments
                # For now, returning success
        
        return {
            "status": status.status,
            "payment_status": status.payment_status,
            "amount_total": status.amount_total,
            "currency": status.currency
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting payment status: {str(e)}")

@app.post("/api/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    try:
        body = await request.body()
        stripe_signature = request.headers.get("Stripe-Signature")
        
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
        webhook_response = await stripe_checkout.handle_webhook(body, stripe_signature)
        
        # Update transaction status
        if webhook_response.session_id:
            await payment_transactions_collection.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {
                    "payment_status": webhook_response.payment_status,
                    "webhook_processed": True,
                    "updated_at": datetime.utcnow()
                }}
            )
        
        return {"status": "success"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook error: {str(e)}")

@app.post("/api/blood-test/upload")
async def upload_blood_test(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload and analyze blood test PDF"""
    try:
        # Check if user has credits
        if current_user["credits"] < 1:
            raise HTTPException(status_code=400, detail="Insufficient credits")
        
        # Read and validate file
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        file_content = await file.read()
        
        # Extract text from PDF
        extracted_text = await extract_text_from_pdf(file_content)
        
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the PDF")
        
        # Analyze with AI
        analysis = await analyze_blood_test_with_ai(extracted_text)
        
        # Generate PDF report
        pdf_report = await generate_pdf_report(
            analysis, 
            current_user["full_name"], 
            datetime.now().strftime("%Y-%m-%d")
        )
        
        # Save to database
        test_id = str(uuid.uuid4())
        blood_test = {
            "id": test_id,
            "user_id": current_user["id"],
            "filename": file.filename,
            "extracted_text": extracted_text,
            "analysis": analysis,
            "pdf_report": base64.b64encode(pdf_report).decode('utf-8'),
            "created_at": datetime.utcnow(),
            "status": "completed"
        }
        
        await blood_tests_collection.insert_one(blood_test)
        
        # Deduct credit
        await users_collection.update_one(
            {"id": current_user["id"]},
            {"$inc": {"credits": -1}}
        )
        
        return {
            "test_id": test_id,
            "analysis": analysis,
            "status": "completed",
            "credits_remaining": current_user["credits"] - 1
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing blood test: {str(e)}")

@app.get("/api/blood-test/{test_id}")
async def get_blood_test(test_id: str, current_user: dict = Depends(get_current_user)):
    """Get blood test results"""
    test = await blood_tests_collection.find_one({"id": test_id, "user_id": current_user["id"]})
    if not test:
        raise HTTPException(status_code=404, detail="Blood test not found")
    
    return {
        "id": test["id"],
        "filename": test["filename"],
        "analysis": test["analysis"],
        "created_at": test["created_at"],
        "status": test["status"]
    }

@app.get("/api/blood-test/{test_id}/download")
async def download_report(test_id: str, current_user: dict = Depends(get_current_user)):
    """Download PDF report"""
    test = await blood_tests_collection.find_one({"id": test_id, "user_id": current_user["id"]})
    if not test:
        raise HTTPException(status_code=404, detail="Blood test not found")
    
    # Decode PDF report
    pdf_bytes = base64.b64decode(test["pdf_report"])
    
    # Save to temporary file
    temp_filename = f"report_{test_id}.pdf"
    temp_path = f"/tmp/{temp_filename}"
    
    async with aiofiles.open(temp_path, "wb") as f:
        await f.write(pdf_bytes)
    
    return FileResponse(
        temp_path,
        filename=f"blood_test_report_{test['filename'].replace('.pdf', '')}.pdf",
        media_type="application/pdf"
    )

@app.post("/api/chat/ask")
async def chat_with_results(
    message: ChatMessage,
    current_user: dict = Depends(get_current_user)
):
    """Chat about blood test results"""
    try:
        # Get blood test from session_id (assuming session_id is test_id)
        test = await blood_tests_collection.find_one({"id": message.session_id, "user_id": current_user["id"]})
        if not test:
            raise HTTPException(status_code=404, detail="Blood test not found")
        
        # Get existing chat session or create new one
        chat_session = await chat_sessions_collection.find_one({"session_id": message.session_id})
        if not chat_session:
            chat_session = {
                "session_id": message.session_id,
                "user_id": current_user["id"],
                "test_id": message.session_id,
                "messages": [],
                "created_at": datetime.utcnow()
            }
            await chat_sessions_collection.insert_one(chat_session)
        
        # Analyze with AI including user question
        response = await analyze_blood_test_with_ai(test["extracted_text"], message.message)
        
        # Save chat messages
        await chat_sessions_collection.update_one(
            {"session_id": message.session_id},
            {"$push": {
                "messages": {
                    "$each": [
                        {"role": "user", "content": message.message, "timestamp": datetime.utcnow()},
                        {"role": "assistant", "content": response, "timestamp": datetime.utcnow()}
                    ]
                }
            }}
        )
        
        return {"response": response}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chat: {str(e)}")

@app.get("/api/user/blood-tests")
async def get_user_blood_tests(current_user: dict = Depends(get_current_user)):
    """Get all blood tests for current user"""
    tests = await blood_tests_collection.find({"user_id": current_user["id"]}).sort("created_at", -1).to_list(length=100)
    
    return [{
        "id": test["id"],
        "filename": test["filename"],
        "created_at": test["created_at"],
        "status": test["status"]
    } for test in tests]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)