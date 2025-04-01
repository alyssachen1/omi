from flask import Flask, request
import json
from supabase import create_client, Client
from dotenv import load_dotenv
import os
from datetime import datetime

# 🔄 Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)

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

        return {
            "title": title,
            "overview": overview,
            "transcript": transcript,
            "created_at": datetime.utcnow().isoformat()
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
            print("🧠 Simplified JSON:")
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
