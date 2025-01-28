// Import puppeteer and fs modules
const puppeteer = require("puppeteer");
const fs = require("fs");

async function getCategoryItems(page) {
  // Create an empty array to store the category items
  const categoryItems = [];

  let page_url = "https://www.ikea.com.tr/en/start-shopping";
  await page.goto(page_url);

  // Get all the div elements with the class name "category-item"
  const divs = await page.$$("div.col-md-3 div ul li");

  // Loop through each div element
  for (let div of divs) {
    // Get the href attribute of the anchor element inside the div
    const href = await div.$eval("a", (element) => element.href);

    // Get the text content of the span element inside the div
    const name = await div.$eval("a", (element) => element.textContent.trim());

    // Add a condition to skip "Shop All"
    if (name !== "Shop All") {
      // Create an object to store the href and name of the category
      const category = { href, name };

      // Push the category object to the categoryItems array
      categoryItems.push(category);
    }
  }

  // Return the categoryItems array
  return categoryItems;
}

async function scrollUntilNoMoreDivs(page) {
  // Scroll to the bottom of the page
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
}

async function scrollUp(page) {
  await page.evaluate(() => {
    window.scrollBy(0, -4000);
  });
}

async function scrapeWebsite() {
    const browser = await puppeteer.launch({
    headless: true, // Set to true for headless mode
    executablePath: 'C:/Program Files/Google/Chrome/Application/Chrome.exe', // Path to Google Chrome
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-features=IsolateOrigins,site-per-process',
      '--window-size=1920,1080',
      '--start-maximized', // To start maximized
      '--incognito', // Launch Chrome in incognito mode
    ],
    ignoreDefaultArgs: ['--disable-extensions'] // In case you want to keep extensions
  });
  const page = await browser.newPage();
  const categoryItems = await getCategoryItems(page);

  try {
    const scrapedData = [];

    const dataCodes = new Set();
    for (let category of categoryItems) {
      let page_url = category.href;
      await page.goto(page_url + "?sellable=true");
      await scrollUntilNoMoreDivs(page);
      await new Promise((r) => setTimeout(r, 10000));
      await scrollUp(page);
      const products = await page.$$(".row > .col-xs-6");

      for (let product of products) {
        let productInfo,
          productSize,
          productPrice,
          productUrl,
          productImageSrcset;

        try {
          productInfo = {
            title: await product.$eval(".product-item-text .title", (element) =>
              element.textContent.trim()
            ),
            desc: await product.$eval(".product-item-text .desc", (element) =>
              element.textContent.trim()
            ),
            unitColor: await product.$eval(
              ".product-item-text .unit-color",
              (element) => element.textContent.trim()
            ),
          };
        } catch (error) {
          productInfo = null;
        }

        try {
          productPrice = await product.$eval(
            ".price", // Replace with the correct class name for price
            (element) => element.textContent.trim()
          );
        } catch (error) {
          productPrice = null;
        }

        try {
          productUrl = await product.$eval(
            ".product-link", // Replace with the correct class name for URL
            (element) => element.href
          );
        } catch (error) {
          productUrl = null;
        }

        try {
          productImageSrcset = await product.$eval(
            ".product-item-img img:nth-child(2)", // Replace with the correct class name for image
            (source) => source.getAttribute("src")
          );
        } catch (error) {
          productImageSrcset = null;
        }

        let ProductCategory = category.name;
        console.log(
          productInfo,
          productPrice,
          productUrl,
          productImageSrcset,
          ProductCategory
        );

        // Declare an object to store the product details
        const productDetails = {};

        // Assign the product name, price, url, image srcset, and category to the productDetails object
        productDetails.productTitle = productInfo;
        productDetails.productSize = productSize;
        productDetails.price = productPrice;
        productDetails.productUrl = productUrl;
        productDetails.imageSrcset = productImageSrcset;
        productDetails.imageSrcset = productImageSrcset;
        productDetails.ProductCategory = ProductCategory;

        // Push the productDetails object to the scrapedData array
        scrapedData.push(productDetails);

        const jsonData = JSON.stringify(scrapedData, null, 2);
        fs.writeFileSync("scraped_data.json", jsonData, "utf-8");
      }
    }
  } catch (error) {
    console.error("Scraping failed:", error);
  } finally {
    await browser.close();
  }
}

scrapeWebsite().then(() => {
  console.log("Scraping completed.");
});
