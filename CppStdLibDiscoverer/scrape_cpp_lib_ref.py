import requests
from bs4 import BeautifulSoup

# Base URL for cppreference
base_url = "https://en.cppreference.com"

# URL of the main symbol index
url = f"{base_url}/w/cpp/symbol_index"

# Send a GET request to fetch the main symbol index page
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
response = requests.get(url, headers=headers)
response.raise_for_status()  # Raise an error if the request fails

# Parse the main symbol index page
soup = BeautifulSoup(response.text, 'html.parser')

# List to store the symbols with names, URLs, and namespaces
symbol_links = []

def scrape_secondary_symbol_page(symbol_url, sub_namespace):
    """Scrape a secondary symbol page for links with <tt> tags only and add to symbol_links."""
    secondary_response = requests.get(symbol_url, headers=headers)
    secondary_response.raise_for_status()
    secondary_soup = BeautifulSoup(secondary_response.text, 'html.parser')
    
    # Find all <a> tags on the secondary page that contain <tt> tags and /w/cpp/ in href
    for secondary_link in secondary_soup.select('#mw-content-text a[href^="/w/cpp/"]'):
        tt_tag = secondary_link.find('tt')
        if tt_tag:
            sub_symbol_name = tt_tag.text.strip()
            sub_symbol_url = base_url + secondary_link['href']
            sub_symbol_namespace = f"std::{sub_namespace}"  # Define namespace
            symbol_links.append({
                'name': sub_symbol_name,
                'url': sub_symbol_url,
                'namespace': sub_symbol_namespace
            })
            print(f"Nested symbol: {sub_symbol_name} - {sub_symbol_url} - Namespace: {sub_symbol_namespace}")

# Scrape the main index page
for link in soup.select('#mw-content-text a[href^="/w/cpp/"]'):
    symbol_url = base_url + link.get('href')
    
    # If the link contains a <tt> tag, treat it as a primary symbol
    tt_tag = link.find('tt')
    if tt_tag:
        symbol_name = tt_tag.text
        # Assign the standard namespace for primary symbols
        symbol_links.append({
            'name': symbol_name,
            'url': symbol_url,
            'namespace': "std"
        })
        print(f"Primary symbol: {symbol_name} - {symbol_url} - Namespace: std")

    # # Only scrape the secondary page if it contains "/w/cpp/symbol_index/"
    # if "/w/cpp/symbol_index/" in symbol_url:
    #     # Extract the sub-namespace from the URL
    #     sub_namespace = symbol_url.split("/w/cpp/symbol_index/")[1]
    #     scrape_secondary_symbol_page(symbol_url, sub_namespace)
    


# Check if we collected any links
if not symbol_links:
    print("No links were found. The HTML structure might have changed.")
else:
    print(f"Found {len(symbol_links)} symbols in total.")

# Optional: Save to a file in JavaScript format for direct use
with open("symbol_links.js", "w") as js_file:
    js_file.write("const symbolLinks = [\n")
    for symbol in symbol_links:
        js_file.write(f'    {{ name: "{symbol["name"]}", url: "{symbol["url"]}", namespace: "{symbol["namespace"]}" }},\n')
    js_file.write("];\n")

print("Symbol links have been saved to symbol_links.js")
