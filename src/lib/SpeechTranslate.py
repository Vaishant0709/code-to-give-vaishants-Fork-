import speech_recognition as spr
from googletrans import Translator
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

def recognize_speech_from_file(audio_path):
    recog = spr.Recognizer()
    with spr.AudioFile(audio_path) as source:
        audio = recog.record(source)  # Record the entire audio file
        try:
            recognized_text = recog.recognize_google(audio)  # Recognize using Google API
            return recognized_text.lower()
        except spr.UnknownValueError:
            return "Google Speech Recognition could not understand the audio."
        except spr.RequestError as e:
            return f"Could not request results from Google Speech Recognition service: {e}"

@app.route("/translate", methods=["POST"])
def translate_audio():
    if "file" not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    file = request.files["file"]
    language = request.form.get("language", "en")  # Default language: English
    file_path = os.path.join("uploads", file.filename)
    file.save(file_path)

    # Transcribe speech
    recognized_text = recognize_speech_from_file(file_path)
    
    # Delete the file after processing
    os.remove(file_path)

    if recognized_text.startswith("Google Speech Recognition could not understand"):
        return jsonify({"error": recognized_text}), 400

    # Translate the text
    translator = Translator()
    try:
        translated_text = translator.translate(recognized_text, dest=language).text
    except Exception as e:
        return jsonify({"error": f"Translation failed: {e}"}), 500

    return jsonify({
        "transcription": recognized_text,
        "translated_text": translated_text
    })

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(host="0.0.0.0", port=5000, debug=True)