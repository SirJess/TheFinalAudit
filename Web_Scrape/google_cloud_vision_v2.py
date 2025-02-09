from google.cloud import vision
from google.cloud import storage
from google.oauth2 import service_account
import json

def process_pdf_with_ocr(bucket_name, object_path):
    """
    Processes a PDF stored in Google Cloud Storage with Google Cloud Vision OCR and saves the extracted text.
    """
    # Path to your service account JSON credentials file
    SERVICE_ACCOUNT_FILE = 'nth-segment-450320-i5-4f36f7865449.json'  # Update with your GCP credentials
    
    # Load credentials
    credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE)
    
    # Initialize clients
    vision_client = vision.ImageAnnotatorClient(credentials=credentials)
    storage_client = storage.Client(credentials=credentials, project=credentials.project_id)
    
    # Configure GCS source and destination
    gcs_source_uri = f"gs://{bucket_name}/{object_path}"
    output_folder = "ocr_results/"
    gcs_destination_uri = f"gs://{bucket_name}/{output_folder}"
    
    input_config = vision.InputConfig(
        gcs_source=vision.GcsSource(uri=gcs_source_uri),
        mime_type="application/pdf"
    )
    output_config = vision.OutputConfig(
        gcs_destination=vision.GcsDestination(uri=gcs_destination_uri),
        batch_size=1  # Process pages one at a time
    )
    
    # Create and send the OCR request
    request = vision.AsyncAnnotateFileRequest(
        features=[vision.Feature(type=vision.Feature.Type.DOCUMENT_TEXT_DETECTION)],
        input_config=input_config,
        output_config=output_config
    )
    operation = vision_client.async_batch_annotate_files(requests=[request])
    operation.result(timeout=300)  # Wait for completion
    
    # Download and process OCR results
    blobs = storage_client.list_blobs(bucket_name, prefix=output_folder)
    extracted_text = ""

    for blob in blobs:
        if blob.name.endswith(".json"):
            blob.download_to_filename("temp_result.json")
            with open("temp_result.json", "r", encoding="utf-8") as f:
                data = json.load(f)
                extracted_text += "\n".join(
                    response["fullTextAnnotation"]["text"]
                    for response in data.get("responses", [])
                    if "fullTextAnnotation" in response
                )

    # Save extracted text to a local file
    output_txt_path = f"{object_path.split('/')[-1].replace('.pdf', '_processed.txt')}"
    with open(output_txt_path, "w", encoding="utf-8") as f:
        f.write(extracted_text)
    
    print(f"OCR text saved to {output_txt_path}")
    return output_txt_path

# Example Usage
bucket_name = "nth-segment-450320-i5.firebasestorage.app"
object_path = "users/qt1gelPXt3WoI3gTLCbsb1S7yM33/files/walmart_2024_annual_report.pdf"

process_pdf_with_ocr(bucket_name, object_path)
