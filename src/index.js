const express = require("express")
const { chromium } = require("playwright-chromium")
const { firefox } = require("playwright-firefox")
const app = express()
const fs = require('fs')
const { Server } = require('ws');
let width;
let height;
let browser;
let context;
let page;
let input;
let prawo;
let lewo;
let load;
app.use(express.static("./public")) //potem do dekomenta
//app.use(express.static("A:/playwright/public"));
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
  await page.waitForTimeout(4000);
  //https://www.familysearch.org/ark:/61903/3:1:3QSQ-G9MB-PVK9?i=7&personaUrl=%2Fark%3A%2F61903%2F1%3A1%3AKW16-NPN
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

app.get("/getDownload", async (req, res) => {
  async function sendSpecialCharacter(page, selector, key) {
    const elementHandle = await page.$(selector);
    await elementHandle.press(key);
    
  }
    const width = req.query.width ? parseInt(req.query.width, 10) : 1920
    const height = req.query.height ? parseInt(req.query.height, 10) : 1080
    const browser = await chromium.launch({
      chromiumSandbox: false,
      
    });
    const context = await browser.newContext( {acceptDownloads: true});
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
    await page.goto("https://www.familysearch.org/ark:/61903/3:1:3QSQ-G9MB-PVK9?i=7&personaUrl=%2Fark%3A%2F61903%2F1%3A1%3AKW16-NPN");
    await page.waitForTimeout(3000);
    let ile;
    let ramkaKtorejPotrzebuje;
    let input;
    let prawo;
    let lewo;
    let load;
    for(let frame of page.frames())
    {
       ile = await frame.$('.afterInput');
       input = await frame.$('#openSDPagerInputContainer2 > input[type=text]')
       lewo = await frame.$('div.openSDToolbar.zoomer-default-position > div.open-sd-actions-wrapper.toolbar-position > div.openSDPager > span.previous.pager-icon.fs-civ-circle-chevron-left.enabled');
       prawo = await frame.$('div.openSDToolbar.zoomer-default-position > div.open-sd-actions-wrapper.toolbar-position > div.openSDPager > span.next.pager-icon.fs-civ-circle-chevron-right.enabled');
       load = await frame.$('#saveLi > a');
        if(ile&&input&&lewo&&prawo&&load)
        {
            break;
        }
    }    
    await prawo.click();
    await prawo.click();
    await prawo.click();
    await prawo.click();
    await prawo.click();
    await prawo.click();
    await prawo.click();
    await prawo.click();
    await input.fill("1");
    const [ download ] = await Promise.all([
      page.waitForEvent('download'), // wait for download to start
      load.click()
    ]);
    const pathh = await download.path();
    console.log(pathh);

  //   fs.writeFile('Output.txt', DATA, (err) => { 
      
  //     // In case of a error throw err. 
  //     if (err) throw err; 
  // }) 
    let ileZdjec = await ile.textContent();
    ileZdjec = ileZdjec.replace(/\D/g,'');
    console.log(ileZdjec);
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

  app.get("/newApproach", async (req, res) => {
      let ile;
      for(let frame of page.frames())
      {
         ile = await frame.$('.afterInput');
          if(ile)
          {
              break;
          }
      } 
      await input.fill("1");
      let ileZdjec = await ile.textContent();
      ileZdjec = ileZdjec.replace(/\D/g,'');
      console.log(ileZdjec);
      for(let i =0;i<ileZdjec-1;i++) {
        await prawo.click();
      }
      // const [ download ] = await Promise.all([
      //   page.waitForEvent('download'), // wait for download to start
      //   load.click()
      // ]);
      // const pathh = await download.path();
      // console.log(pathh);


      console.log("PRZESZŁO XD");
      try{
          const data = await page.screenshot({
          type: "png"
        })
        await browser.close()
        res.contentType("image/png")
        res.set("Content-Disposition", "inline;");
        res.send(data);
      }
      catch { 
        res.status(500).send(`Something went wrong: ${err}`)
      }
    });


// move to utils.js
process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here
  process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
async function init() {
  width = 1920
  height = 1080
  browser = await chromium.launch({
    chromiumSandbox: false,
  });
  context = await browser.newContext( {acceptDownloads: true});
  page = await context.newPage({
    viewport: {
      width,
      height
    }
  });
  await page.goto("https://www.familysearch.org/en/");
  await page.waitForTimeout(4000);
  async function sendSpecialCharacter(page, selector, key) {
    const elementHandle = await page.$(selector);
    await elementHandle.press(key);
  }
    let cookies;
    for(let frame of await page.frames())
    {
        cookies = await frame.$('.call');
        if(cookies)
        {
            break;
        }
    }    
    await cookies.click();
    await page.click("#signInLink");
    await page.click("#userName");
    await page.type("#userName", 'sixcrown');
    await sendSpecialCharacter(page, "#userName", 'Tab');
    await page.type("#password", 'Troj@n!3');
    await sendSpecialCharacter(page, "#password", 'Enter');
    await page.goto("https://www.familysearch.org/ark:/61903/3:1:3QSQ-G9MB-PVK9?i=7&personaUrl=%2Fark%3A%2F61903%2F1%3A1%3AKW16-NPN");
    await page.waitForTimeout(3000);
    for(let frame of page.frames())
    {
       input = await frame.$('#openSDPagerInputContainer2 > input[type=text]')
       lewo = await frame.$('div.openSDToolbar.zoomer-default-position > div.open-sd-actions-wrapper.toolbar-position > div.openSDPager > span.previous.pager-icon.fs-civ-circle-chevron-left.enabled');
       prawo = await frame.$('div.openSDToolbar.zoomer-default-position > div.open-sd-actions-wrapper.toolbar-position > div.openSDPager > span.next.pager-icon.fs-civ-circle-chevron-right.enabled');
       load = await frame.$('#saveLi > a');
        if(input&&lewo&&prawo&&load)
        {
            break;
        }
    }    
  wss.clients.forEach((client) => {
    client.send("init Done");
  });
}
async function closeBrowser() {
  await browser.close();
}
const wss = new Server({ server });
wss.on('connection', (ws) => {
  console.log('Client connected');
  init();
  ws.on('close', () =>{
   console.log('Client disconnected')
   closeBrowser();
  });
});

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send(new Date().toTimeString());
  });
}, 1000);
