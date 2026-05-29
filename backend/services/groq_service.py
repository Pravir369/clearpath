import httpx
import json
from dotenv import load_dotenv
import os

load_dotenv()


def call_groq(system_prompt: str, user_message: str) -> str:
    api_key = os.getenv("GROQ_API_KEY", "placeholder")
    if not api_key or api_key == "placeholder":
        raise RuntimeError("Groq API key not configured")

    try:
        with httpx.Client() as client:
            response = client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message},
                    ],
                    "max_tokens": 500,
                    "temperature": 0.3,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        raise RuntimeError(f"Groq API error: {str(e)}")
