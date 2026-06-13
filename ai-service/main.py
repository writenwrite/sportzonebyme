from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from typing import Optional, List

app = FastAPI(title="SportZone AI Service")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
AI_MODEL = os.getenv("AI_MODEL", "llama3.2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[str] = None


class StylingRequest(BaseModel):
    occasion: str = "casual"
    style: str = "sporty"
    budget: Optional[float] = None
    products: Optional[List[dict]] = None


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/chat")
async def chat(request: ChatRequest):
    system_prompt = """You are SportZone AI Assistant, a helpful AI for a sports fashion e-commerce store.
You help customers find products, recommend outfits, answer FAQs about shipping/returns/sizing.
Be friendly, professional, and knowledgeable about sports fashion.
Keep responses concise and helpful."""
    
    if request.context:
        system_prompt += f"\n\nContext: {request.context}"

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend([{"role": m.role, "content": m.content} for m in request.messages])

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": AI_MODEL,
                    "messages": messages,
                    "stream": False,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()
            return {"response": data.get("message", {}).get("content", "")}
    except Exception as e:
        return {"response": f"AI service error: {str(e)}"}


@app.post("/styling")
async def get_styling_advice(request: StylingRequest):
    product_context = ""
    if request.products:
        product_list = "\n".join([
            f"- {p.get('name', 'Unknown')} (${p.get('price', 0)}) - {p.get('category', '')}"
            for p in request.products[:20]
        ])
        product_context = f"\n\nAvailable products:\n{product_list}"

    prompt = f"""As a fashion advisor for SportZone, suggest 3 complete outfit combinations:

Occasion: {request.occasion}
Style: {request.style}
Budget: ${request.budget if request.budget else 'flexible'}
{product_context}

For each outfit, provide:
1. The items to combine
2. Why they work together
3. Total price

Be creative and fashion-forward."""

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": AI_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are a professional fashion stylist specializing in sports and athleisure wear."},
                        {"role": "user", "content": prompt},
                    ],
                    "stream": False,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()
            return {"advice": data.get("message", {}).get("content", "")}
    except Exception as e:
        return {"advice": f"AI service error: {str(e)}"}


@app.post("/faq")
async def answer_faq(request: ChatRequest):
    faq_context = """Common FAQ topics for SportZone:
- Shipping: Free shipping on orders over $100. Standard delivery 3-5 days, Express 1-2 days.
- Returns: 30-day return policy, items must be unworn with tags.
- Sizing: Use our size guide. Products run true to size unless noted.
- Payment: We accept Visa, Mastercard, PayPal, Apple Pay.
- Order tracking: Check your email for tracking info or log into your account."""

    messages = [
        {"role": "system", "content": f"You are a helpful FAQ assistant for SportZone.\n\n{faq_context}"}
    ]
    messages.extend([{"role": m.role, "content": m.content} for m in request.messages])

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json={
                    "model": AI_MODEL,
                    "messages": messages,
                    "stream": False,
                },
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()
            return {"response": data.get("message", {}).get("content", "")}
    except Exception as e:
        return {"response": f"AI service error: {str(e)}"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
