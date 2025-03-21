from fastapi import FastAPI, Form
from  pydantic import BaseModel
import google.generativeai as genai
import sqlite3
import os 

app = FastAPI()
generation_config = genai.GenerationConfig(
    temperature=0.2,
    top_p=0.95,
    top_k=40,
    max_output_tokens=2048,
    response_mime_type="text/plain"
)

GENAI_API_KEY ="AIzaSyCiOA-56lcon9qfnzEf5NSP5_VoJoxMF9I"
genai.configure(api_key= GENAI_API_KEY)

DB_FILE ="feedback.db"
def init_db():
    conn= sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_name TEXT,
            subject TEXT,
            content TEXT,
            feedback TEXT
        )
    """)
    conn.commit()
    conn.close()
    
init_db()
def get_feedback(student_word : str):
    try :
        prompt="give detailed feeback on this student's work ! THE WAY IT IS WRITTEN, THE STRUCTURE OF THE CONTENT, THE RESEARCH CAPACITY !! "
        model = genai.GenerativeModel(
        model_name='gemini-2.0-flash',  
        # safety_settings=safety_settings,
        generation_config=generation_config)
        
        response = model.generate_content(
        prompt,
        generation_config=generation_config
)
        return response.text
    except Exception as e:
        return f"error generating feedback : {str(e)}"

@app.post("/submit/")
async def submit_work(student_name: str = Form(...), subject:str=Form(...), content:str= Form(...)):
    feedback= get_feedback(content)
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO submissions (student_name, subject, content, feedback) VALUES (?, ?, ?, ?)",
                   (student_name, subject, content, feedback))
    conn.commit()
    conn.close()

    return {"message": "Submission received", "feedback": feedback}
# Fetch all submissions
@app.get("/submissions/")
async def get_submissions():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT id, student_name, subject, content, feedback FROM submissions")
    data = cursor.fetchall()
    conn.close()

    return [{"id": row[0], "student_name": row[1], "subject": row[2], "content": row[3], "feedback": row[4]} for row in data]

# Fetch specific submission
@app.get("/submission/{submission_id}")
async def get_submission(submission_id: int):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT student_name, subject, content, feedback FROM submissions WHERE id=?", (submission_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return {"student_name": row[0], "subject": row[1], "content": row[2], "feedback": row[3]}
    return {"error": "Submission not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=7000)