from google import genai
from google.genai import types
import base64
import json

def generate():
  client = genai.Client(
      vertexai=True,
      project="PROJECT_ID",
      location="us-central1",
  )

  try:
        with open("walmart_2024_annual_report_processed.txt", "r") as f:
            balance_sheet_data = f.read()
  except FileNotFoundError:
        print("Error: output.txt not found. Please create the file and add the balance sheet data.")
        return  # Exit the function if the file is not found

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
    temperature = 1,
    top_p = 0.95,
    max_output_tokens = 8192,
    response_modalities = ["TEXT"],
    safety_settings = [types.SafetySetting(
      category="HARM_CATEGORY_HATE_SPEECH",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold="OFF"
    ),types.SafetySetting(
      category="HARM_CATEGORY_HARASSMENT",
      threshold="OFF"
    )],
    system_instruction=[types.Part.from_text(text="""You are Accountant and you want to make a json format file of balance sheet for the client""")],
  )
  generated_text = ""
  for chunk in client.models.generate_content_stream(
    model = model,
    contents = contents,
    config = generate_content_config,
    ):
    generated_text += chunk.text
    print(chunk.text, end="")  
    try:
        # Attempt to parse the generated text as JSON
        json_data = json.loads(generated_text)  # This will raise a JSONDecodeError if parsing fails

        with open("output_balance_sheet.json", "w") as outfile:
            json.dump(json_data, outfile, indent=4)  # Save the JSON data to the file with indentation for readability
        print("Balance sheet saved to output_balance_sheet.json")

    except json.JSONDecodeError as e:
        print(f"Error: Could not convert generated text to JSON: {e}")
        print("Generated Text (for debugging):")  # Print the generated text for debugging
        print(generated_text)
        try:
            # If the generated text isn't perfect JSON, try to clean it up a bit before saving.
            # This is a basic attempt and may need refinement based on the specific errors.
            cleaned_text = generated_text.replace('\n', '').replace('\t', '') # Remove newlines and tabs
            cleaned_text = cleaned_text.replace("'", "\"") # Replace single quotes with double quotes
            # Attempt to fix other common JSON errors like missing commas or brackets.
            # ... (add more cleaning/fixing logic here as needed)
            json_data = json.loads(cleaned_text) # Try to parse again after cleaning
            with open("output_balance_sheet.json", "w") as outfile:
                json.dump(json_data, outfile, indent=4)
            print("Balance sheet saved to output_balance_sheet.json (with cleaning)")
        except json.JSONDecodeError as e2:
            print(f"Error: Could not convert cleaned generated text to JSON: {e2}")
            print("Cleaned Text (for debugging):")
            print(cleaned_text)
            with open("output_balance_sheet.txt", "w") as outfile: # Save even if it is not valid JSON
                outfile.write(generated_text)
            #with open("output_balance_sheet.json", "w") as outfile: # Save even if it is not valid JSON
                #outfile.write(generated_text)
            print("Generated text saved to output_balance_sheet.txt (as plain text)")



generate()

generate()