from flask import Flask, request
import json
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from datetime import datetime
from openai import OpenAI
import requests
import time

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
HUME_API_KEY = os.getenv("HUME_API_KEY")
HUME_MCP_URL = os.getenv("HUME_MCP_URL")  # e.g. "https://api.hume.ai/v0/mcp"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
openai_client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)

# Example format for prompt
TEST_OBJECT = {
    "id": 1,
    "name": "aly",
    "suggested_color": "Yellow",
    "color_matches": {
        "Yellow": 60,
        "Blue": 20,
        "Red": 10,
        "Green": 10,
    },
    "pos_traits": ["Happiness", "Optimism", "Creativity"],
    "neg_traits": ["Impulsive", "Scattered"],
    "keywords": ["energy", "communication", "happiness"],
    "interactions": [
        {
            "date": "2025-04-01",
            "dominantColor": "Yellow",
            "wordCount": 100,
            "color_matches": {
                "Yellow": 60,
                "Blue": 20,
                "Red": 10,
                "Green": 10,
            },
        },
    ],
    "stats": {
        "totalInteractions": 1,
        "lastMessage": "2025-04-01",
        "avgWordsPerSession": 100,
        "colorShifts": 0,
        "colorTimeline": "Yellow",
    },
}

def get_hume_emotions(transcript_text):
    try:
        headers = {
            "Authorization": f"Bearer {HUME_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "data": {
                "text": transcript_text
            },
            "models": {
                "language": {}
            }
        }

        response = requests.post(HUME_MCP_URL, json=payload, headers=headers)
        response.raise_for_status()

        job = response.json()
        job_id = job["job_id"]

        # Poll for completion
        for _ in range(30):
            status_response = requests.get(f"{HUME_MCP_URL}/{job_id}", headers=headers)
            status_json = status_response.json()
            if status_json.get("status") == "done":
                return status_json.get("results", {})
            time.sleep(1)

        print("⚠️ Hume API timed out.")
        return {}

    except Exception as e:
        print("❌ Error calling Hume MCP:", e)
        return {}

def process_with_chatgpt(title: str, overview: str, transcript: str, hume_data: dict = None) -> dict:
    try:
        prompt = f"""
        Given this transcript, and optionally any emotional insights, can you extrapolate the speakers and then put them into this array of objects with the following format? Please only respond with the json file.

        Format: {TEST_OBJECT}
        Transcript: {transcript}
        Emotional Analysis (optional): {json.dumps(hume_data or {}, indent=2)}
        """

        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an AI that analyzes and formats conversations. Always respond in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1200
        )

        ai_analysis = json.loads(response.choices[0].message.content)
        print("✨ AI Analysis completed successfully")
        return ai_analysis

    except Exception as e:
        print("❌ Error in AI processing:", e)
        return {
            "summary": "Error processing with AI",
            "topics": [],
            "action_items": [],
            "sentiment": "unknown"
        }

def simplify_transcript(json_data):
    try:
        title = json_data.get("structured", {}).get("title", "")
        overview = json_data.get("structured", {}).get("overview", "")
        segments = json_data.get("transcript_segments", [])

        transcript_lines = []
        for segment in segments:
            speaker = f"SPEAKER_{segment.get('speaker_id', 'X')}"
            text = segment.get("text", "").strip()
            if text:
                transcript_lines.append(f"{speaker}: {text}")

        transcript = "\n".join(transcript_lines)

        if not any([title, overview, transcript]):
            print("⚠️ Simplified content is empty — skipping upload.")
            return {}

        # Get Hume emotion insights
        hume_results = get_hume_emotions(transcript)

        # Get AI analysis from OpenAI + Hume data
        ai_results = process_with_chatgpt(title, overview, transcript, hume_data=hume_results)

        return {
            "title": title,
            "overview": overview,
            "transcript": transcript,
            "created_at": datetime.utcnow().isoformat(),
            "ai_analysis": ai_results
        }

    except Exception as e:
        print("❌ Error simplifying transcript:", e)
        return None

@app.route('/webhook', methods=['POST'])
def webhook():
    try:
        data = request.get_json(force=True)
        print("✅ Raw JSON received.")

        simplified = simplify_transcript(data)
        if simplified:
            print("🧠 Simplified JSON with AI analysis:")
            print(json.dumps(simplified, indent=2))

            # Upload to Supabase
            response = supabase.table("transcripts").insert(simplified).execute()
            print("📤 Uploaded to Supabase:", response)
        else:
            print("⚠️ Could not simplify transcript.")
    except Exception as e:
        print("❌ Error handling webhook:", e)
        raw_data = request.data or request.form
        print("[RAW] Webhook received:", raw_data)

    return '', 200

if __name__ == '__main__':
    print("🚀 Webhook listener running on http://localhost:8000/webhook")
    app.run(host='0.0.0.0', port=8000)
