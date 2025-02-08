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

openai.api_key = "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"

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
