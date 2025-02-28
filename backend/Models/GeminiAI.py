from google import genai
from google.genai import types
import base64
import json
from collections import Counter
from OCR_processing import process_pdf_with_ocr

def generate(bucket_name, object_path):
    client = genai.Client(
        vertexai=True,
        project="nth-segment-450320-i5",
        location="us-central1",
    )

    # Get the balance sheet data from OCR processing
    balance_sheet_data = process_pdf_with_ocr(bucket_name, object_path)

    text1 = types.Part.from_text(text=f"""Convert this to JSON format:{balance_sheet_data}""")

    model = "gemini-2.0-flash-001"
    contents = [
        types.Content(
            role="user",
            parts=[
                text1
            ]
        )
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=8192,
        response_modalities=["TEXT"],
        safety_settings=[types.SafetySetting(
            category="HARM_CATEGORY_HATE_SPEECH",
            threshold="OFF"
        ), types.SafetySetting(
            category="HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold="OFF"
        ), types.SafetySetting(
            category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold="OFF"
        ), types.SafetySetting(
            category="HARM_CATEGORY_HARASSMENT",
            threshold="OFF"
        )],
        system_instruction=[types.Part.from_text(text="""You are Accountant and you want to make a data structure of the file, perhaps in dictionary of balance sheet for the client""")],
    )

    generated_text = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        generated_text += chunk.text
        # print(chunk.text, end="")

    # Count words
    # word_counts = Counter(generated_text.split())

    return generated_text

# Example Usage
bucket_name = "nth-segment-450320-i5.firebasestorage.app"
object_path = "users/qt1gelPXt3WoI3gTLCbsb1S7yM33/files/walmart_2024_annual_report.pdf"
print(generate(bucket_name, object_path))