# from openai import OpenAI

# client = OpenAI(
#   api_key=
# )

# completion = client.chat.completions.create(
#   model="gpt-4o-mini",
#   store=True,
#   messages=[
#     {"role": "user", "content": "write a haiku about ai"}
#   ]
# )

# print(completion.choices[0].message)

import openai
import json

from dotenv import load_dotenv

# Load environment variables from .env.local file
load_dotenv('.env.local')

# Retrieve OpenAI API key from the environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")
with open("output.txt", "r") as file:
    data = file.read()

response = openai.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "Format the following balance sheet data into JSON."},
        {"role": "user", "content": data}
    ],
    temperature=0
)

json_output = response.choices[0].message.content
parsed_json = json.loads(json_output)

with open("output.json", "w") as json_file:
    json.dump(parsed_json, json_file, indent=4)

print(json.dumps(parsed_json, indent=4))
