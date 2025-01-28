# IKEA Web Scraper

This is a Node.js web scraping application that extracts product information from IKEA's Turkish website using Puppeteer.

## Features

- Scrapes product information from all categories (except "Shop All")
- Captures product details including:
  - Title
  - Description
  - Color/Unit
  - Price
  - Product URL
  - Product Image URL
  - Category
- Automatically scrolls through pages to load all products
- Saves data to JSON file
- Handles errors gracefully
- Uses Chrome in headless mode

## Prerequisites

- Node.js (v12 or higher)
- Google Chrome browser installed
- Internet connection

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd webscrape
```

2. Install dependencies:
```bash
npm install puppeteer
```

3. Update Chrome executable path:
Open `ikea.js` and modify the `executablePath` to match your Chrome installation:
```javascript
executablePath: 'C:/Program Files/Google/Chrome/Application/Chrome.exe'
```

## Usage

1. Run the scraper:
```bash
node ikea.js
```

2. The script will:
   - Launch Chrome in headless mode
   - Navigate through IKEA categories
   - Scroll through product listings
   - Extract product information
   - Save data to `scraped_data.json`

## Output Format

The scraped data is saved in JSON format with the following structure:

```json
[
  {
    "productTitle": {
      "title": "Product Name",
      "desc": "Product Description",
      "unitColor": "Color/Unit"
    },
    "price": "Price",
    "productUrl": "Product URL",
    "imageSrcset": "Image URL",
    "ProductCategory": "Category Name"
  }
]
```

## Configuration

Key configurations in `ikea.js`:

```javascript
const browser = await puppeteer.launch({
  headless: true,              // Set to false for visible browser
  executablePath: '...',       // Path to Chrome executable
  args: [                      // Browser launch arguments
    '--no-sandbox',
    '--disable-setuid-sandbox',
    // ...other args
  ]
});
```

## Error Handling

- The script handles missing product information gracefully by setting values to `null`
- Network errors and page loading issues are caught and logged
- The browser is properly closed even if errors occur

## Limitations

- The scraper is designed for IKEA Turkey's website structure
- Rate limiting or IP blocking might occur with frequent use
- Page load times may vary based on internet connection
- Some products might not have all information available

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for educational purposes only. Make sure to check and comply with IKEA's terms of service and robots.txt before using this scraper.
