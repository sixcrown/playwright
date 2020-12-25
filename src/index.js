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
  await page.waitForTimeout(4000);
  let temp;
  for(let frame of await page.frames())
  {
      temp = await frame.$('.call');
      if(temp)
      {
          break;
      }
  }    
  await temp.click();
  await page.click("#signInLink");
  await page.click("#userName");
  await page.type("#userName", 'sixcrown');
  await sendSpecialCharacter(page, "#userName", 'Tab');
  await page.type("#password", 'Troj@n!3');

  await sendSpecialCharacter(page, "#password", 'Enter');
  await page.waitForTimeout(2000);
  console.log("PRZESZŁO XD");
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