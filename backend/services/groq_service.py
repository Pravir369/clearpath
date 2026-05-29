from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

_client = None


def _get_client():
    global _client
    if _client is None:
        try:
            _client = OpenAI(
                api_key=os.getenv("GROQ_API_KEY", "placeholder"),
                base_url="https://api.groq.com/openai/v1",
            )
        except Exception:
            return None
    return _client


def call_groq(system_prompt: str, user_message: str) -> str:
    client = _get_client()
    if not client:
        raise RuntimeError("Groq client failed to initialize")
    response = client.chat.completions.create(
        model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        max_tokens=500,
        temperature=0.3,
    )
    return response.choices[0].message.content
