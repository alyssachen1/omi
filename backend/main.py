from flask import Flask, request
import json
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from datetime import datetime
from openai import OpenAI

# 🔄 Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
openai_client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)

def process_with_chatgpt(title: str, overview: str, transcript: str) -> dict:
    """Process the transcript with ChatGPT to get AI insights."""
    try:
        prompt = f"""

        Please analyze this transcript and identify the names and people who are talking and then 

        Title: {title}
        Overview: {overview}
        Transcript: {transcript}
        """

        response = openai_client.chat.completions.create(
            model="gpt-4",  # or "gpt-3.5-turbo" for a more economical option
            messages=[
                {"role": "system", "content": "You are an AI assistant that analyzes conversation transcripts and provides structured insights. Always respond in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        # Parse the JSON response
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

        # Get AI analysis
        ai_results = process_with_chatgpt(title, overview, transcript)

        return {
            "title": title,
            "overview": overview,
            "transcript": transcript,
            "created_at": datetime.utcnow().isoformat(),
            "ai_analysis": ai_results  # Add AI analysis to the object
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

            # 🔼 Upload to Supabase
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
