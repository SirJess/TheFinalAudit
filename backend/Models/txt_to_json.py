import os

def clean_and_rename_txt_file(txt_file_path):
    # Define the new file name with .json extension
    json_file_path = os.path.splitext(txt_file_path)[0] + ".json"

    # Read the file and remove unnecessary parts
    with open(txt_file_path, "r", encoding="utf-8") as file:
        lines = file.readlines()

    # Remove `json``` from the beginning and ````json` from the end
    cleaned_lines = [line for line in lines if not line.strip().startswith("```")]

    # Write to a new JSON file
    with open(json_file_path, "w", encoding="utf-8") as file:
        file.writelines(cleaned_lines)

    # Remove the old text file
    os.remove(txt_file_path)

    print(f"File has been cleaned and renamed to: {json_file_path}")

# Example usage
clean_and_rename_txt_file("your_file.txt")  # Replace with your actual file name
