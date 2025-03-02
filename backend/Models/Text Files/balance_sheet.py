import re

def format_balance_sheet(text):
    # Remove dollar signs
    text = text.replace("$", "")
    
    # Extract values using regex
    pattern = re.compile(r"(.*?)\s+(\d{1,3}(?:,\d{3})*)\s+(\d{1,3}(?:,\d{3})*)")
    matches = pattern.findall(text)
    
    structured_data = []
    for match in matches:
        label, value_2024, value_2023 = match
        label = label.strip()
        structured_data.append(f"- {label}: {value_2024} | {value_2023}")
    
    # Define sections
    sections = [
        ("ASSETS", [
            "Current assets:", "Total current assets", "Property and equipment, net", 
            "Operating lease right-of-use assets", "Finance lease right-of-use assets, net",
            "Goodwill", "Other long-term assets", "Total assets"
        ]),
        ("LIABILITIES, REDEEMABLE NONCONTROLLING INTEREST, AND EQUITY", [
            "Current liabilities:", "Total current liabilities", "Long-term debt", 
            "Long-term operating lease obligations", "Long-term finance lease obligations",
            "Deferred income taxes and other", "Commitments and contingencies",
            "Redeemable noncontrolling interest", "Equity:", "Total Walmart shareholders' equity", 
            "Noncontrolling interest", "Total equity", "Total liabilities, redeemable noncontrolling interest, and equity"
        ])
    ]
    
    output = "**Walmart Inc.**\n**Consolidated Balance Sheets**\n(Amounts in millions)\n\n"
    
    index = 0
    for section_title, section_headers in sections:
        output += f"### **{section_title}**\n\n"
        for header in section_headers:
            if index < len(structured_data) and structured_data[index].startswith(f"- {header}"):
                output += f"**{header}**\n" if ":" in header else ""
                output += f"{structured_data[index]}\n"
                index += 1
        output += "\n"
    
    return output

# Read input text from file
with open("output.txt", "r") as file:
    unstructured_text = file.read()

# Format and print the structured balance sheet
print(format_balance_sheet(unstructured_text))

# # Regular expressions to extract values from the balance sheet
# assets_regex = r"Total current assets: (\d+).*Property and equipment, net: (\d+).*Operating lease right-of-use assets: (\d+).*Finance lease right-of-use assets, net: (\d+).*Goodwill: (\d+).*Other long-term assets: (\d+)"
# liabilities_regex = r"Total current liabilities: (\d+).*Long-term debt: (\d+).*Long-term operating lease obligations: (\d+).*Long-term finance lease obligations: (\d+).*Deferred income taxes and other: (\d+)"
# equity_regex = r"Total Walmart shareholders' equity: (\d+).*Noncontrolling interest: (\d+).*Total equity: (\d+)"

# # Extract values using regex
# assets = re.findall(assets_regex, balance_sheet_text, re.DOTALL)
# liabilities = re.findall(liabilities_regex, balance_sheet_text, re.DOTALL)
# equity = re.findall(equity_regex, balance_sheet_text, re.DOTALL)

# # Calculate totals
# if assets:
#     total_assets = sum(map(int, assets[0]))
# if liabilities:
#     total_liabilities = sum(map(int, liabilities[0]))
# if equity:
#     total_equity = sum(map(int, equity[0]))

# # Print the results
# print(f"Total Assets: {total_assets}")
# print(f"Total Liabilities: {total_liabilities}")
# print(f"Total Equity: {total_equity}")
