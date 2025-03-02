from GeminiAI import generate
import json
import re

bucket_name = "nth-segment-450320-i5.firebasestorage.app"
object_path = "users/pMFBLrDaWaObzYIJASGvy15DzTQ2/files/Truist10k-pages.pdf"

def remove_trailing_commas(json_string):
    """Removes trailing commas from a JSON string."""
    return re.sub(r',\s*([\]}])', r'\1', json_string)

def extract_json(text):
    """Extracts JSON content from a string containing code blocks."""
    match = re.search(r"```(?:python)?\s*({.*})\s*```", text, re.DOTALL)
    if match:
        return match.group(1)
    else:
        return None

def parse_json_string(generated_text):
    """Parses a JSON string from a potentially code-block-wrapped string."""
    json_string = extract_json(generated_text)
    if json_string:
        json_string = remove_trailing_commas(json_string)  # Remove trailing commas
        json_string = json_string.replace("None", "null")  # Replace None with null
        try:
            data_dict = json.loads(json_string)
            return data_dict
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e}")
            print(f"Error Line: {json_string.splitlines()[e.lineno - 1]}") #added line to print error line.
            return None
    else:
        print("No JSON content found.")
        return None
    
def get_nested_value(data, keys_list):
    """Tries to retrieve the value using multiple key structures."""
    for keys in keys_list:
        try:
            value = data
            for key in keys:
                value = value[key]
            return value  # Return the first successful value
        except (KeyError, TypeError):
            continue  # Try the next key structure
    return None  # Return None if all attempts fail

def extract_years_from_keys(keys):
    """Extract the 4-digit years from keys, whether they contain 'Dec 31, YYYY' or just 'YYYY'."""
    years = set()  # Use a set to avoid duplicates
    for key in keys:
        match = re.search(r'(\d{4})$', key)  # Match the last 4-digit number
        if match:
            years.add(int(match.group(1)))  # Convert to integer and add to set
    return sorted(years, reverse=True)  # Sort years in descending order

def get_latest_years(data):
    """Get the two most recent years from the dataset keys."""
    available_years = extract_years_from_keys(data.keys())
    return available_years[:2] if len(available_years) >= 2 else available_years

# def get_value(data, year, field):
#     """Retrieve the value from data, checking both 'Dec 31, YYYY' and 'YYYY' keys."""
#     return data.get(f'Dec 31, {year}', {}).get(field, None) or data.get(str(year), {}).get(field, None)

def get_value(data, year, key_prefix):
    """
    Retrieve the value from `data` for a given `year`, searching for a key that starts with `key_prefix`.
    It checks both 'Dec 31, YYYY' and 'YYYY' formats.
    """
    for key_format in [f'Dec 31, {year}', str(year)]:
        if key_format in data:
            for k, v in data[key_format].items():
                if k.startswith(key_prefix):  # Check if key starts with given prefix
                    return v
    return None  # Return None if no matching key is found


# Define possible key structures
keys_to_try_assets = [
    ['CONSOLIDATED BALANCE SHEETS', 'TRUIST FINANCIAL CORPORATION AND SUBSIDIARIES', 'Assets'],
    ['Consolidated Balance Sheet', 'Trust Financial Corporation And Subsidiaries', 'Assets'],
    ['Consolidated Balance Sheet', 'Assets']
]
keys_to_try_liabilities = [
    ['CONSOLIDATED BALANCE SHEETS', 'TRUIST FINANCIAL CORPORATION AND SUBSIDIARIES', 'Liabilities'],
    ['Consolidated Balance Sheet', 'Trust Financial Corporation And Subsidiaries','Liabilities'],
    ['Consolidated Balance Sheet', 'Liabilities']
]

keys_to_try_shareholders_equity = [
    ['CONSOLIDATED BALANCE SHEETS', 'TRUIST FINANCIAL CORPORATION AND SUBSIDIARIES', "Shareholders' Equity"],
    ['Consolidated Balance Sheet', 'Trust Financial Corporation And Subsidiaries', "Shareholders' Equity"],
    ['Consolidated Balance Sheet', "Shareholders' Equity"]
]

keys_to_try_income_statement = [
    ['CONSOLIDATED STATEMENTS OF INCOME', 'TRUIST FINANCIAL CORPORATION AND SUBSIDIARIES', 'Year Ended December 31'],
    ['Consolidated Statements of Income', 'Trust Financial Corporation And Subsidiaries', 'Year Ended December 31'],
    ['Consolidated Statements of Income', 'Year Ended December 31']
]

max_retries = 3
retry_count = 0
total_assets_latest = None

while retry_count < max_retries:
    generated_text = generate(bucket_name, object_path)
    data_dict = parse_json_string(generated_text)
    print(data_dict)
    
    if not data_dict:
        retry_count += 1
        continue  # Skip the rest and retry

    assets = get_nested_value(data_dict, keys_to_try_assets)
    
    if not assets:
        retry_count += 1
        continue  # Retry if assets data is missing

    latest_years = get_latest_years(assets)

    if len(latest_years) >= 2:
        latest_year, prev_year = latest_years
    elif len(latest_years) == 1:
        latest_year, prev_year = latest_years[0], None
    else:
        latest_year, prev_year = None, None

    total_assets_latest = get_value(assets, latest_year, 'Total assets')

    if total_assets_latest is not None:
        break  # Successfully extracted, exit loop

    retry_count += 1

liabilities = get_nested_value(data_dict, keys_to_try_liabilities)
shareholders_equity = get_nested_value(data_dict, keys_to_try_shareholders_equity)
income_statement = get_nested_value(data_dict, keys_to_try_income_statement)


latest_years = get_latest_years(assets)

if len(latest_years) >= 2:
    latest_year, prev_year = latest_years
elif len(latest_years) == 1:
    latest_year, prev_year = latest_years[0], None
else:
    latest_year, prev_year = None, None


# Extract total assets
total_assets_latest = get_value(assets, latest_year, 'Total assets')
total_assets_prev = get_value(assets, prev_year, 'Total assets') if prev_year else None

# Extract total liabilities
total_liabilities_latest = get_value(liabilities, latest_year, 'Total liabilities')
total_liabilities_prev = get_value(liabilities, prev_year, 'Total liabilities') if prev_year else None

# Extract total shareholders' equity
total_shareholders_equity_latest = get_value(shareholders_equity, latest_year, "Total shareholders' equity")
total_shareholders_equity_prev = get_value(shareholders_equity, prev_year, "Total shareholders' equity") if prev_year else None

# Extract retained earnings
retained_earnings_latest = get_value(shareholders_equity, latest_year, 'Retained earnings')
retained_earnings_prev = get_value(shareholders_equity, prev_year, 'Retained earnings') if prev_year else None

# Extract loans and leases, net of ALLL
loans_leases_net_alll_latest = get_value(assets, latest_year, 'Loans and leases, net of ALLL')
loans_leases_net_alll_prev = get_value(assets, prev_year, 'Loans and leases, net of ALLL') if prev_year else None

# Extract AFS and HTM securities
afs_securities_latest = get_value(assets, latest_year, 'AFS securities at fair value')
afs_securities_prev = get_value(assets, prev_year, 'AFS securities at fair value') if prev_year else None

htm_securities_latest = get_value(assets, latest_year, 'HTM securities')
htm_securities_prev = get_value(assets, prev_year, 'HTM securities') if prev_year else None

# Extract goodwill
goodwill_latest = get_value(assets, latest_year, 'Goodwill')
goodwill_prev = get_value(assets, prev_year, 'Goodwill') if prev_year else None

# Extract CDI and other intangible assets
cdi_other_intangible_assets_latest = get_value(assets, latest_year, 'CDI and other intangible assets')
cdi_other_intangible_assets_prev = get_value(assets, prev_year, 'CDI and other intangible assets') if prev_year else None

# Calculate debt-to-equity ratio
debt_to_equity_ratio_latest = total_liabilities_latest / total_shareholders_equity_latest if total_shareholders_equity_latest else None
debt_to_equity_ratio_prev = total_liabilities_prev / total_shareholders_equity_prev if prev_year and total_shareholders_equity_prev else None

# # Calculate total deposits
# total_deposits_latest = (
#     get_value(liabilities, latest_year, 'Noninterest-bearing deposits') or 0 +
#     get_value(liabilities, latest_year, 'Interest-bearing deposits') or 0
# )

# total_deposits_prev = (
#     get_value(liabilities, prev_year, 'Noninterest-bearing deposits') or 0 +
#     get_value(liabilities, prev_year, 'Interest-bearing deposits') or 0
# ) if prev_year else None

# # Calculate loan to deposit ratio
# loan_to_deposit_ratio_latest = loans_leases_net_alll_latest / total_deposits_latest if total_deposits_latest else None
# loan_to_deposit_ratio_prev = loans_leases_net_alll_prev / total_deposits_prev if total_deposits_prev else None


# print(f"Total assets (2024): {total_assets_latest}")
# print(f"Total assets (2023): {total_assets_prev}")
# print(f"Total liabilities (2024): {total_liabilities_latest}")
# print(f"Total liabilities (2023): {total_liabilities_prev}")
# print(f"Total shareholders' equity (2024): {total_shareholders_equity_latest}")
# print(f"Total shareholders' equity (2023): {total_shareholders_equity_prev}")
# print(f"Retained earnings (2024): {retained_earnings_latest}")
# print(f"Retained earnings (2023): {retained_earnings_prev}")
# print(f"Loans and leases, net of ALLL (2024): {loans_leases_net_alll_latest}")
# print(f"Loans and leases, net of ALLL (2023): {loans_leases_net_alll_prev}")
# print(f"AFS securities (2024): {afs_securities_latest}")
# print(f"AFS securities (2023): {afs_securities_prev}")
# print(f"HTM securities (2024): {htm_securities_latest}")
# print(f"HTM securities (2023): {htm_securities_prev}")
# print(f"Goodwill (2024): {goodwill_latest}")
# print(f"Goodwill (2023): {goodwill_prev}")
# print(f"CDI and other intangible assets (2024): {cdi_other_intangible_assets_latest}")
# print(f"CDI and other intangible assets (2023): {cdi_other_intangible_assets_prev}")
# print(f"Debt-to-equity ratio (2024): {debt_to_equity_ratio_latest}")
# print(f"Debt-to-equity ratio (2023): {debt_to_equity_ratio_prev}")
# print(f"Total deposits (2024): {total_deposits_latest}")
# print(f"Total deposits (2023): {total_deposits_prev}")
# print(f"Loan to deposit ratio (2024): {loan_to_deposit_ratio_latest}")
# print(f"Loan to deposit ratio (2023): {loan_to_deposit_ratio_prev}")

financial_data = {
    "Total Assets": {
        "year_latest": total_assets_latest,
        "year_prev": total_assets_prev
    },
    "Total Liabilities": {
        "year_latest": total_liabilities_latest,
        "year_prev": total_liabilities_prev
    },
    "Total Shareholders' Equity": {
        "year_latest": total_shareholders_equity_latest,
        "year_prev": total_shareholders_equity_prev
    },
    "Retained Earnings": {
        "year_latest": retained_earnings_latest,
        "year_prev": retained_earnings_prev
    },
    "Loans and Leases, Net of ALLL": {
        "year_latest": loans_leases_net_alll_latest,
        "year_prev": loans_leases_net_alll_prev
    },
    "AFS Securities": {
        "year_latest": afs_securities_latest,
        "year_prev": afs_securities_prev
    },
    "HTM Securities": {
        "year_latest": htm_securities_latest,
        "year_prev": htm_securities_prev
    },
    "Goodwill": {
        "year_latest": goodwill_latest,
        "year_prev": goodwill_prev
    },
    "CDI and Other Intangible Assets": {
        "year_latest": cdi_other_intangible_assets_latest,
        "year_prev": cdi_other_intangible_assets_prev
    },
    "Debt-to-Equity Ratio": {
        "year_latest": debt_to_equity_ratio_latest,
        "year_prev": debt_to_equity_ratio_prev
    }
}

# Convert to JSON string and print
json_finance = json.dumps(financial_data, indent=4)
print(json_finance)