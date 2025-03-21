import google.generativeai as genai

# Add your Gemini Pro API key here
GEMINI_API_KEY = "AIzaSyCiOA-56lcon9qfnzEf5NSP5_VoJoxMF9I"

# Configure the API
genai.configure(api_key=GEMINI_API_KEY)

def generate_description(input_text):
    """Generates a multi-paragraph product description using Gemini Pro."""
    model = genai.GenerativeModel("gemini-2.0-flash-001")

    prompt = (
        "As a Product Description Generator, create a multi-paragraph, rich-text product "
        "description with emojis based on the provided details.\n\n"
        f"{input_text}"
    )

    try:
        response = model.generate_content(prompt)
        return response.text.strip() if response.text else "Error: No response from Gemini."
    except Exception as e:
        return f"Error: {str(e)}"

while True:
    u =input("you:")
    ai=generate_description(u)
    print(ai)