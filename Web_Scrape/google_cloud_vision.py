import os
from google.cloud import vision
from google.cloud import storage
from google.oauth2 import service_account
import json

# Path to your service account JSON credentials file
SERVICE_ACCOUNT_FILE = 'astral-charter-450316-c2-5990a3d829f0.json'

# Load the credentials from the JSON file
credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE)

# Set up Google Cloud clients
vision_client = vision.ImageAnnotatorClient(credentials=credentials)
print("Google Cloud Vision client created with credentials loaded from the file.")
storage_client = storage.Client()

# Define variables
bucket_name = "balance_sheet_10k"  # Change this to your GCS bucket name
pdf_filename = "Walmart_balance_sheet.pdf"
output_txt = "output.txt"

# Upload the PDF to Google Cloud Storage
bucket = storage_client.bucket(bucket_name)
blob = bucket.blob(pdf_filename)
blob.upload_from_filename(pdf_filename)

print(f"Uploaded {pdf_filename} to GCS bucket {bucket_name}")

# Configure Google Cloud Vision request
gcs_source_uri = f"gs://{bucket_name}/{pdf_filename}"
mime_type = "application/pdf"
input_config = vision.InputConfig(
    gcs_source=vision.GcsSource(uri=gcs_source_uri),
    mime_type=mime_type
)

# Output configuration
gcs_destination_uri = f"gs://{bucket_name}/ocr_results/"
output_config = vision.OutputConfig(
    gcs_destination=vision.GcsDestination(uri=gcs_destination_uri),
    batch_size=1
)

# Create AsyncAnnotateFileRequest for processing the document
request = vision.AsyncAnnotateFileRequest(
    features=[vision.Feature(type=vision.Feature.Type.DOCUMENT_TEXT_DETECTION)],
    input_config=input_config,
    output_config=output_config
)

# Create the list of requests
requests = [request]

# Process PDF using async_batch_annotate_files
operation = vision_client.async_batch_annotate_files(requests=requests)
operation.result(timeout=300)  # Wait for completion

# Download the OCR result JSON from GCS
output_blob = storage_client.bucket(bucket_name).blob("ocr_results/output-1-to-1.json")
output_blob.download_to_filename("ocr_results.json")

# Extract text from JSON and save it as output.txt
with open("ocr_results.json", "r", encoding="utf-8") as f:
    data = json.load(f)

text = ""
for response in data["responses"]:
    if "fullTextAnnotation" in response:
        text += response["fullTextAnnotation"]["text"] + "\n"

with open(output_txt, "w", encoding="utf-8") as f:
    f.write(text)

print(f"OCR text saved to {output_txt}")
