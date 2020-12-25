const express = require("express")
const { chromium } = require("playwright-chromium")
const { firefox } = require("playwright-firefox")

const app = express()
app.use(express.static("./public"))
const port = process.env.PORT || 3000;

app.get("/browser/:name", async (req, res) => {
  const browserName = req.params["name"] || "chromium"
  if (!["chromium", "firefox"].includes(browserName)) {
    return res.status(500).send(`invalid browser name (${browserName})!`)
  }
  const url = req.query.url || "https://microsoft.com"
  const waitUntil = req.query.waitUntil || "load"
  const width = req.query.width ? parseInt(req.query.width, 10) : 1920
  const height = req.query.height ? parseInt(req.query.height, 10) : 1080
  console.log(`Incoming request for browser '${browserName}' and URL '${url}'`)
  try {
    /** @type {import('playwright-chromium').Browser} */
    const browser = await { chromium, firefox }[browserName].launch({
      chromiumSandbox: false
    })
    const page = await browser.newPage({
      viewport: {
        width,
        height
      }
    })
    await page.goto(url, {
      timeout: 10 * 1000,
      waitUntil
    })
    if (req.query.timeout) {
      await page.waitForTimeout(parseInt(req.query.timeout, 10))
    }
    const data = await page.screenshot({
      type: "png"
    })
    await browser.close()
    res.contentType("image/png")
    res.set("Content-Disposition", "inline;");
    res.send(data)
  } catch (err) {
    res.status(500).send(`Something went wrong: ${err}`)
  }
});
app.get("/my/:syf", async (req, res) => {
async function sendSpecialCharacter(page, selector, key) {
  const elementHandle = await page.$(selector);
  await elementHandle.press(key);
  
}
  const width = req.query.width ? parseInt(req.query.width, 10) : 1920
  const height = req.query.height ? parseInt(req.query.height, 10) : 1080
  const browser = await chromium.launch({
    chromiumSandbox: false
  });
  const context = await browser.newContext();
  const page = await context.newPage({
    viewport: {
      width,
      height
    }
  });
  await page.goto("https://www.familysearch.org/en/");
  await page.waitForTimeout(5000);
  console.log("0 step");
  selector = await page.waitForSelector('"Agree and Proceed"');
  await page.click(selector);
  console.log("1 step");
  await page.click("#signInLink");
  console.log("2 step");
  await page.click("#userName");
  console.log("3 step");
  await page.type("#userName", 'sixcrown');
  console.log("4 step");
  await sendSpecialCharacter(page, "#userName", 'Tab');
  console.log("5 step");
  await page.type("#password", 'Troj@n!3');
  console.log("6 step");
  await page.click("#login");
  console.log("7 step");
  await page.click("[aria-controls='search']");
  console.log("8 step");
  await page.click("#search > li:nth-child(1) > a");
  console.log("9 step");
  await page.click("#surname");
  console.log("10 step");
  await page.click("#surname");
  console.log("11 step");
  await page.type("#surname", 'kawalkiewicz');
  console.log("12 step");
  await sendSpecialCharacter(page, "#surname", 'Enter');
  console.log("13 step");
  await page.click("[image-url='/ark:/61903/3:1:3QSQ-G9MB-PVK9?personaUrl=%2Fark%3A%2F61903%2F1%3A1%3AKW16-NPN'] .image-button");
  console.log("14 step");
  try{
      const data = await page.screenshot({
      type: "png"
    })
    await browser.close()
    res.contentType("image/png")
    res.set("Content-Disposition", "inline;");
    res.send(data)
  await browser.close(); }
  catch { 
    res.status(500).send(`Something went wrong: ${err}`)
  }
});

// move to utils.js


app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});////