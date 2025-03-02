import re

data_dict  = {'CONSOLIDATED BALANCE SHEETS': {'TRUIST FINANCIAL CORPORATION AND SUBSIDIARIES': {'Assets': {'Dec 31, 2024': {'Cash and due from banks': 5793, 'Interest-bearing deposits with banks': 33975, 'Securities borrowed or purchased under agreements to resell': 2550, 'Trading assets at fair value': 5100, 'AFS securities at fair value': 67464, 'HTM securities (fair value of $40,286 and $44,630, respectively)': 50640, 'LHFS (including $1,233 and $852 at fair value, respectively)': 1388, 'Loans and leases (including $13 and $15 at fair value, respectively)': 306383, 'ALLL': -4857, 'Loans and leases, net of ALLL': 301526, 'Premises and equipment': 3225, 'Goodwill': 17125, 'CDI and other intangible assets': 1550, 'Loan servicing rights at fair value': 3708, 'Other assets (including $1,271 and $1,311 at fair value, respectively)': 37132, 'Assets of discontinued operations': None, 'Total assets': 531176}, 'Dec 31, 2023': {'Cash and due from banks': 5000, 'Interest-bearing deposits with banks': 25230, 'Securities borrowed or purchased under agreements to resell': 2378, 'Trading assets at fair value': 4332, 'AFS securities at fair value': 67366, 'HTM securities (fair value of $40,286 and $44,630, respectively)': 54107, 'LHFS (including $1,233 and $852 at fair value, respectively)': 1280, 'Loans and leases (including $13 and $15 at fair value, respectively)': 312061, 'ALLL': -4798, 'Loans and leases, net of ALLL': 307263, 'Premises and equipment': 3298, 'Goodwill': 17156, 'CDI and other intangible assets': 1909, 'Loan servicing rights at fair value': 3378, 'Other assets (including $1,271 and $1,311 at fair value, respectively)': 34997, 'Assets of discontinued operations': 7655, 'Total assets': 535349}}, 'Liabilities': {'Dec 31, 2024': {'Noninterest-bearing deposits': 107451, 'Interest-bearing deposits (including $192 and $- at fair value, respectively)': 283073, 'Short-term borrowings (including $1,896 and $1,625 at fair value, respectively)': 29205, 'Long-term debt': 34956, 'Other liabilities (including $2,286 and $2,597 at fair value, respectively)': 12812, 'Liabilities of discontinued operations': 3539, 'Total liabilities': 467497}, 'Dec 31, 2023': {'Noninterest-bearing deposits': 111624, 'Interest-bearing deposits (including $192 and $- at fair value, respectively)': 284241, 'Short-term borrowings (including $1,896 and $1,625 at fair value, respectively)': 24828, 'Long-term debt': 38918, 'Other liabilities (including $2,286 and $2,597 at fair value, respectively)': 12946, 'Liabilities of discontinued operations': None, 'Total liabilities': 476096}}, "Shareholders' Equity": {'Dec 31, 2024': {'Preferred stock': 5907, 'Common stock, $5 par value': 6580, 'Additional paid-in capital': 35628, 'Retained earnings': 23777, 'AOCI, net of deferred income taxes': -8213, 'Noncontrolling interests': None, "Total shareholders' equity": 63679}, 'Dec 31, 2023': {'Preferred stock': 6673, 'Common stock, $5 par value': 6669, 'Additional paid-in capital': 36177, 'Retained earnings': 22088, 'AOCI, net of deferred income taxes': -12506, 'Noncontrolling interests': 152, "Total shareholders' equity": 59253}}, 'Other': {'Dec 31, 2024': {"Total liabilities and shareholders' equity": 531176, 'Common shares outstanding': 1315936, 'Common shares authorized': 2000000, 'Preferred shares outstanding': 216, 'Preferred shares authorized': 5000}, 'Dec 31, 2023': {"Total liabilities and shareholders' equity": 535349, 'Common shares outstanding': 1333743, 'Common shares authorized': 2000000, 'Preferred shares outstanding': 223, 'Preferred shares authorized': 5000}}}}, 'CONSOLIDATED STATEMENTS OF INCOME': {'TRUIST FINANCIAL CORPORATION AND SUBSIDIARIES': {'Year Ended December 31': {'2024': {'Interest Income': {'Interest and fees on loans and leases': 19230, 'Interest on securities': 3506, 'Interest on other earning assets': 2330, 'Total interest income': 25066}, 'Interest Expense': {'Interest on deposits': 7849, 'Interest on long-term debt': 1813, 'Interest on other borrowings': 1313, 'Total interest expense': 10975}, 'Net Interest Income': 14091, 'Provision for credit losses': 1870, 'Net Interest Income After Provision for Credit Losses': 12221, 'Noninterest Income': {'Wealth management income': 1412, 'Investment banking and trading income': 1203, 'Card and payment related fees': 907, 'Service charges on deposits': 915, 'Mortgage banking income': 432, 'Lending related fees': 366, 'Operating lease income': 205, 'Securities gains (losses)': -6651, 'Other income': 398, 'Total noninterest income': -813}, 'Noninterest Expense': {'Personnel expense': 6506, 'Professional fees and outside processing': 1337, 'Software expense': 896, 'Net occupancy expense': 656, 'Equipment expense': 373, 'Amortization of intangibles': 345, 'Marketing and customer development': 268, 'Operating lease depreciation': 144, 'Regulatory costs': 344, 'Restructuring charges': 183, 'Goodwill impairment': 120, 'Other expense': 1020, 'Total noninterest expense': 12009}, 'Earnings': {'Income (loss) before income taxes': -601, 'Provision (benefit) for income taxes': -556, 'Net income (loss) from continuing operations': -45, 'Net income from discontinued operations': 488, 'Net income (loss)': 44, 'Noncontrolling interests from discontinued operations': None, 'Preferred stock dividends and other': 349, 'Net income (loss) available to common shareholders': -30}, 'Earnings Per Share': {'Basic earnings from continuing operations': -0.3, 'Diluted earnings from continuing operations': -0.3}, 'Weighted Average Shares Outstanding': {'Basic weighted average shares outstanding': 1331087, 'Diluted weighted average shares outstanding': 1331087}}, '2023': {'Interest Income': {'Interest and fees on loans and leases': 19518, 'Interest on securities': 3066, 'Interest on other earning assets': 1868, 'Total interest income': 24452}, 'Interest Expense': {'Interest on deposits': 6427, 'Interest on long-term debt': 2215, 'Interest on other borrowings': 1286, 'Total interest expense': 9928}, 'Net Interest Income': 14524, 'Provision for credit losses': 2109, 'Net Interest Income After Provision for Credit Losses': 12415, 'Noninterest Income': {'Wealth management income': 1358, 'Investment banking and trading income': 822, 'Card and payment related fees': 936, 'Service charges on deposits': 873, 'Mortgage banking income': 437, 'Lending related fees': 447, 'Operating lease income': 254, 'Securities gains (losses)': -71, 'Other income': 371, 'Total noninterest income': 5498}, 'Noninterest Expense': {'Personnel expense': 6516, 'Professional fees and outside processing': 1192, 'Software expense': 868, 'Net occupancy expense': 658, 'Equipment expense': 381, 'Amortization of intangibles': 395, 'Marketing and customer development': 260, 'Operating lease depreciation': 175, 'Regulatory costs': 824, 'Restructuring charges': 320, 'Goodwill impairment': 466, 'Other expense': 1020, 'Total noninterest expense': 18678}, 'Earnings': {'Income (loss) before income taxes': -765, 'Provision (benefit) for income taxes': 738, 'Net income (loss) from continuing operations': -1503, 'Net income from discontinued operations': None, 'Net income (loss)': -1452, 'Noncontrolling interests from discontinued operations': None, 'Preferred stock dividends and other': 361, 'Net income (loss) available to common shareholders': -1047}, 'Earnings Per Share': {'Basic earnings from continuing operations': -1.4, 'Diluted earnings from continuing operations': -1.4}, 'Weighted Average Shares Outstanding': {'Basic weighted average shares outstanding': 1331963, 'Diluted weighted average shares outstanding': 1331963}}, '2022': {'Interest Income': {'Interest and fees on loans and leases': 13252, 'Interest on securities': 2763, 'Interest on other earning assets': 619, 'Total interest income': 16634}, 'Interest Expense': {'Interest on deposits': 1145, 'Interest on long-term debt': 791, 'Interest on other borrowings': 385, 'Total interest expense': 2321}, 'Net Interest Income': 14313, 'Provision for credit losses': 777, 'Net Interest Income After Provision for Credit Losses': 13536, 'Noninterest Income': {'Wealth management income': 1338, 'Investment banking and trading income': 995, 'Card and payment related fees': 944, 'Service charges on deposits': 1028, 'Mortgage banking income': 460, 'Lending related fees': 375, 'Operating lease income': 258, 'Securities gains (losses)': None, 'Other income': 333, 'Total noninterest income': 5660}, 'Noninterest Expense': {'Personnel expense': 6558, 'Professional fees and outside processing': 1322, 'Software expense': 887, 'Net occupancy expense': 690, 'Equipment expense': 449, 'Amortization of intangibles': 455, 'Marketing and customer development': 321, 'Operating lease depreciation': 184, 'Regulatory costs': 1011, 'Restructuring charges': None, 'Goodwill impairment': None, 'Other expense': 652, 'Total noninterest expense': 12167}, 'Earnings': {'Income (loss) before income taxes': 7029, 'Provision (benefit) for income taxes': 1250, 'Net income (loss) from continuing operations': 5779, 'Net income from discontinued operations': None, 'Net income (loss)': 5927, 'Noncontrolling interests from discontinued operations': None, 'Preferred stock dividends and other': None, 'Net income (loss) available to common shareholders': 6267}, 'Earnings Per Share': {'Basic earnings from continuing operations': 4.1, 'Diluted earnings from continuing operations': 4.07}, 'Weighted Average Shares Outstanding': {'Basic weighted average shares outstanding': 1328120, 'Diluted weighted average shares outstanding': 1338462}}}}}, "CONSOLIDATED STATEMENTS OF CHANGES IN SHAREHOLDERS' EQUITY": {'TRUIST FINANCIAL CORPORATION AND SUBSIDIARIES': {'Balance, January 1, 2022': {'Shares of Common Stock': 1327818, 'Preferred Stock': 6673, 'Common Stock': 6639, 'Additional Paid-In Capital': 34565, 'Retained Earnings': 22998, 'AOCI': -1604, 'Noncontrolling Interests': None, "Total Shareholders' Equity": 69271}, 'Net income': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': None, 'Additional Paid-In Capital': None, 'Retained Earnings': 4818, 'AOCI': None, 'Noncontrolling Interests': 22, "Total Shareholders' Equity": 4840}, 'OCI': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': None, 'Additional Paid-In Capital': None, 'Retained Earnings': None, 'AOCI': 4293, 'Noncontrolling Interests': None, "Total Shareholders' Equity": 4293}, 'Issued in connection with equity awards, net': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': 28, 'Additional Paid-In Capital': 6914, 'Retained Earnings': None, 'AOCI': None, 'Noncontrolling Interests': None, "Total Shareholders' Equity": 6942}, 'Repurchase of common stock': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': -26, 'Additional Paid-In Capital': -5108, 'Retained Earnings': None, 'AOCI': None, 'Noncontrolling Interests': None, "Total Shareholders' Equity": -5134}, 'Cash dividends declared on common stock': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': None, 'Additional Paid-In Capital': None, 'Retained Earnings': -2770, 'AOCI': None, 'Noncontrolling Interests': None, "Total Shareholders' Equity": -2770}, 'Cash dividends declared on preferred stock': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': None, 'Additional Paid-In Capital': None, 'Retained Earnings': -365, 'AOCI': None, 'Noncontrolling Interests': None, "Total Shareholders' Equity": -365}, 'Equity-based compensation expense': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': None, 'Additional Paid-In Capital': 292, 'Retained Earnings': None, 'AOCI': None, 'Noncontrolling Interests': None, "Total Shareholders' Equity": 292}, 'Other, net': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': None, 'Additional Paid-In Capital': None, 'Retained Earnings': None, 'AOCI': None, 'Noncontrolling Interests': -190, "Total Shareholders' Equity": -190}, 'Balance, December 31, 2022': {'Shares of Common Stock': 1326829, 'Preferred Stock': 6673, 'Common Stock': 6634, 'Additional Paid-In Capital': 34544, 'Retained Earnings': 26264, 'AOCI': -1091, 'Noncontrolling Interests': 23, "Total Shareholders' Equity": 60537}, 'Net income (loss)': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': None, 'Additional Paid-In Capital': None, 'Retained Earnings': -1047, 'AOCI': None, 'Noncontrolling Interests': 44, "Total Shareholders' Equity": -1003}, 'Received in connection with TIH minority stake sale, net': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': None, 'Additional Paid-In Capital': None, 'Retained Earnings': 1095, 'AOCI': None, 'Noncontrolling Interests': None, "Total Shareholders' Equity": 1095}, 'Balance, December 31, 2023': {'Shares of Common Stock': 1333743, 'Preferred Stock': 6673, 'Common Stock': 6669, 'Additional Paid-In Capital': 36177, 'Retained Earnings': 22088, 'AOCI': -12506, 'Noncontrolling Interests': 152, "Total Shareholders' Equity": 59253}, 'Repurchase of common stock, including excise tax': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': -27, 'Additional Paid-In Capital': -23397, 'Retained Earnings': None, 'AOCI': None, 'Noncontrolling Interests': None, "Total Shareholders' Equity": -23424}, 'Redemption of preferred stock': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': None, 'Additional Paid-In Capital': -10, 'Retained Earnings': None, 'AOCI': None, 'Noncontrolling Interests': None, "Total Shareholders' Equity": -10}, 'Sale of remaining stake in TIH': {'Shares of Common Stock': None, 'Preferred Stock': None, 'Common Stock': None, 'Additional Paid-In Capital': None, 'Retained Earnings': None, 'AOCI': None, 'Noncontrolling Interests': 77, "Total Shareholders' Equity": 77}, 'Balance, December 31, 2024': {'Shares of Common Stock': 1333743, 'Preferred Stock': 5590, 'Common Stock': 6914, 'Additional Paid-In Capital': 35628, 'Retained Earnings': 23777, 'AOCI': -8213, 'Noncontrolling Interests': 93, "Total Shareholders' Equity": 63679}}}}

assets = data_dict['CONSOLIDATED BALANCE SHEETS']['TRUIST FINANCIAL CORPORATION AND SUBSIDIARIES']['Assets']
liabilities =  data_dict['CONSOLIDATED BALANCE SHEETS']['TRUIST FINANCIAL CORPORATION AND SUBSIDIARIES']['Liabilities']
shareholders_equity = data_dict['CONSOLIDATED BALANCE SHEETS']['TRUIST FINANCIAL CORPORATION AND SUBSIDIARIES']["Shareholders' Equity"]
income_statement = data_dict['CONSOLIDATED STATEMENTS OF INCOME']['TRUIST FINANCIAL CORPORATION AND SUBSIDIARIES']['Year Ended December 31']

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


latest_years = get_latest_years(assets)

if len(latest_years) >= 2:
    latest_year, prev_year = latest_years
elif len(latest_years) == 1:
    latest_year, prev_year = latest_years[0], None
else:
    latest_year, prev_year = None, None

print(latest_year, prev_year)

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

# Calculate total deposits
total_deposits_latest = (
    get_value(liabilities, latest_year, 'Noninterest-bearing deposits') or 0 +
    get_value(liabilities, latest_year, 'Interest-bearing deposits') or 0
)

total_deposits_prev = (
    get_value(liabilities, prev_year, 'Noninterest-bearing deposits') or 0 +
    get_value(liabilities, prev_year, 'Interest-bearing deposits') or 0
) if prev_year else None


# # Calculate loan to deposit ratio
loan_to_deposit_ratio_latest = loans_leases_net_alll_latest / total_deposits_latest if total_deposits_latest else None
loan_to_deposit_ratio_prev = loans_leases_net_alll_prev / total_deposits_prev if total_deposits_prev else None

# # Extract net income
# net_income_latest = get_value(income_statement, latest_year, 'Net income (loss)')
# net_income_prev = get_value(income_statement, prev_year, 'Net income (loss)') if prev_year else None

# # Calculate ROA (Return on Assets)
# roa_latest = net_income_latest / total_assets_latest if total_assets_latest else None
# roa_prev = net_income_prev / total_assets_prev if total_assets_prev else None

# # Calculate ROE (Return on Equity)
# roe_latest = net_income_latest / total_shareholders_equity_latest if total_shareholders_equity_latest else None
# roe_prev = net_income_prev / total_shareholders_equity_prev if total_shareholders_equity_prev else None

# Print out the results
print(f"Total assets (2024): {total_assets_latest}")
print(f"Total assets (2023): {total_assets_prev}")
print(f"Total liabilities (2024): {total_liabilities_latest}")
print(f"Total liabilities (2023): {total_liabilities_prev}")
print(f"Total shareholders' equity (2024): {total_shareholders_equity_latest}")
print(f"Total shareholders' equity (2023): {total_shareholders_equity_prev}")
print(f"Retained earnings (2024): {retained_earnings_latest}")
print(f"Retained earnings (2023): {retained_earnings_prev}")
print(f"Loans and leases, net of ALLL (2024): {loans_leases_net_alll_latest}")
print(f"Loans and leases, net of ALLL (2023): {loans_leases_net_alll_prev}")
print(f"AFS securities (2024): {afs_securities_latest}")
print(f"AFS securities (2023): {afs_securities_prev}")
print(f"HTM securities (2024): {htm_securities_latest}")
print(f"HTM securities (2023): {htm_securities_prev}")
print(f"Goodwill (2024): {goodwill_latest}")
print(f"Goodwill (2023): {goodwill_prev}")
print(f"CDI and other intangible assets (2024): {cdi_other_intangible_assets_latest}")
print(f"CDI and other intangible assets (2023): {cdi_other_intangible_assets_prev}")
print(f"Debt-to-equity ratio (2024): {debt_to_equity_ratio_latest}")
print(f"Debt-to-equity ratio (2023): {debt_to_equity_ratio_prev}")
print(f"Total deposits (2024): {total_deposits_latest}")
print(f"Total deposits (2023): {total_deposits_prev}")
print(f"Loan to deposit ratio (2024): {loan_to_deposit_ratio_latest}")
print(f"Loan to deposit ratio (2023): {loan_to_deposit_ratio_prev}")
# print(f"Net income (2024): {net_income_latest}")
# print(f"Net income (2023): {net_income_prev}")
# print(f"ROA (2024): {roa_latest}")
# print(f"ROA (2023): {roa_prev}")
# print(f"ROE (2024): {roe_latest}")
# print(f"ROE (2023): {roe_prev}")
