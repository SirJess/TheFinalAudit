import json

# Load the JSON file data
file_path = 'output_balance_sheet.json'
with open(file_path, 'r') as file:
    data = json.load(file)

# Extract relevant data for EBITDA calculation
statements = data["Walmart Inc."]["Consolidated Statements of Cash Flows"]
years = ["2024", "2023", "2022"]
ebitda_values = {}

for year in years:
    # Extract values for the specified year
    try:
        year_data = statements[f"Fiscal Years Ended January 31, {year}"]["Cash flows from operating activities"]
        net_income = year_data["Consolidated net income"]
        depreciation_amortization = year_data["Adjustments to reconcile consolidated net income to net cash provided by operating activities"]["Depreciation and amortization"]
        
        # Fetch interest paid and income taxes from the supplemental disclosure
        supplemental_info = statements[f"Fiscal Years Ended January 31, {year}"]["Supplemental disclosure of cash flow information"]
        interest_paid = supplemental_info["Interest paid"]
        taxes_paid = supplemental_info["Income taxes paid"]

        # Calculate EBITDA
        ebitda = net_income + depreciation_amortization + interest_paid + taxes_paid
        ebitda_values[year] = ebitda
    except KeyError:
        ebitda_values[year] = None  # Handle missing data gracefully

print(ebitda_values)
