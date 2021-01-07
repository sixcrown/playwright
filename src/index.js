
const express = require("express")
const { chromium } = require("playwright-chromium")
const { firefox } = require("playwright-firefox")
const app = express()
const fs = require('fs')
const { Server } = require('ws');
const { FORMERR } = require("dns")
const path = require('path');
let width;
let id=0;
let height;
let browser;
let context;
let page;
let input;
let prawo;
let lewo;
let load;
let ile;
let linkToDownload = [];
let i;
let j=-1;
let partialDownloadPromises=[];
let allDownloadPromises;
let proxy = ['eu1','eu2','eu3','eu4','eu5','eu6','eu7','eu8','eu9','eu10','eu11','eu12','eu13','eu14','eu15'];
let userNames = ['testowyZiomek1', 'testowyZiomek2','testowyZiomek3','testowyZiomek4', 'testowyZiomek5','testowyZiomek6',
'testowyZiomek7', 'testowyZiomek8','testowyZiomek9','testowyZiomek10', 'testowyZiomek11','testowyZiomek12','testowyZiomek13', 'testowyZiomek14','testowyZiomek15'];
let passwords = ['superSest1','superSest2', 'superSest3','superSest4','superSest5', 'superSest6', 'superSest7','superSest8',
 'superSest9','superSest10','superSest11', 'superSest12','superSest13','superSest14', 'superSest15'];
let proxyId=-1
function getNextProxy(){
  proxyId=proxyId+1;
  if(proxyId===15) {
    proxyId=0;
  }
  return { proxy: proxy[proxyId],
     username: userNames[proxyId],
      password: passwords[proxyId] };
}

function getNextId() {
  return id=id+1;
}
function getPromise() {

  var _resolve, _reject;
  // var resolved = false;

  var promise = new Promise((resolve, reject) => {
      _reject = reject;
      _resolve = resolve;
  });

  promise.resolve_ex = (value) => {
    // resolved = true;
     _resolve(value);
  };

  promise.reject_ex = (value) => {
     _reject(value);
  };
  // promise.isResolved = () =>{
  //   return resolved;
  // }

  return promise;
}
function MakeQuerablePromise(promise) {
  // Don't modify any promise that has been already modified.
  if (promise.isResolved) return promise;

  // Set initial state
  var isPending = true;
  var isRejected = false;
  var isFulfilled = false;

  // Observe the promise, saving the fulfillment in a closure scope.
  var result = promise.then(
      function(v) {
          isFulfilled = true;
          isPending = false;
          return v; 
      }, 
      function(e) {
          isRejected = true;
          isPending = false;
          throw e; 
      }
  );

  result.isFulfilled = function() { return isFulfilled; };
  result.isPending = function() { return isPending; };
  result.isRejected = function() { return isRejected; };
  return result;
}

async function contextClose(){
  return await context.close()
};

async function allPromisesDone(promises)  {
  return await Promise.all(promises);
};

async function sendSpecialCharacter(page, selector, key) {
  const elementHandle = await page.$(selector);
  await elementHandle.press(key);  
};

async function nextDownload(from, to){
  for(let i=from;i<to;i++){
    try { 
      await page.goto(linkToDownload[i]);
     }
    catch(error) {
      console.log("Its ok");
    }
    finally {
      await page.waitForTimeout(1000);
    }
  }
};
async function nextDownloadWithProxy(from, to){
  for(let i=from;i<to;i++){
    // try { 
      await page.waitForTimeout(1000);
      await page.click("[name='d']");
      for(let g=0;g<200;g++){
        await page.keyboard.press('Backspace');
      }
      for(let g=0;g<200;g++){
        await page.keyboard.press('Delete');
      }
      await page.click("[name='d']");
      await page.type("[name='d']", linkToDownload[i]);
      await sendSpecialCharacter(page, "[name='d']", 'Enter');
    //  }
    // catch(error) {
    //   console.log("Its ok");
    // }
    // finally {
    //   await page.waitForTimeout(1000);
    // }
  }
};

app.use(express.static("./public")) //potem do dekomenta
// app.use(express.static("A:/playwright/public"));
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
  async function download() {
    let ileZdjec = await ile.textContent();
    ileZdjec = ileZdjec.replace(/\D/g,'');
    console.log(ileZdjec);
    await input.fill("1");
    await input.press("Enter")
    
    for(let i =0;i<ileZdjec-1;i++) {    
      linkToDownload[i]= "https://www.familysearch.org"+ await load.getAttribute('href');
      await prawo.click()
    }      
    linkToDownload[ileZdjec-1]= "https://www.familysearch.org"+ await load.getAttribute('href');
    //await createNewContext('testowyZiomek1', 'superSest1', context);

    // for(i =0; i<5;i++){
    //   partialDownloadPromises[i] = new getPromise();
    // }
    allDownloadPromises = new getPromise();
    // await downloadChain(ileZdjec);
    // await allDownloadPromises.then(()=>{
    //   console.log("PRZESZŁO XD");
    //   contextClose();
    // })
    await downloadChainWithProxy(ileZdjec);
      await allDownloadPromises.then(()=>{
      console.log("PRZESZŁO XD");
      contextClose();
      init();
    })
  }
  app.get("/download", async (req, res) => {

      const url = req.query.url 
      try {
      await page.goto(url);
      await page.waitForTimeout(10000);
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
    }
    catch(error){
      res.status(500).send(`Invalid url`)
    }
    res.status(200).send("ok");
    await download();
      // let ileZdjec = await ile.textContent();
      // ileZdjec = ileZdjec.replace(/\D/g,'');
      // console.log(ileZdjec);
      // await input.fill("1");
      // await input.press("Enter")
      
      // for(let i =0;i<ileZdjec-1;i++) {    
      //   linkToDownload[i]= "https://www.familysearch.org"+ await load.getAttribute('href');
      //   await prawo.click()
      // }      
      // linkToDownload[ileZdjec-1]= "https://www.familysearch.org"+ await load.getAttribute('href');
      // //await createNewContext('testowyZiomek1', 'superSest1', context);

      // // for(i =0; i<5;i++){
      // //   partialDownloadPromises[i] = new getPromise();
      // // }
      // allDownloadPromises = new getPromise();
      // // await downloadChain(ileZdjec);
      // // await allDownloadPromises.then(()=>{
      // //   console.log("PRZESZŁO XD");
      // //   contextClose();
      // // })
      // await downloadChainWithProxy(ileZdjec);
      //   await allDownloadPromises.then(()=>{
      //   console.log("PRZESZŁO XD");
      //   contextClose();
      // })


      // allPromisesDone(allDownloadPromises).then(()=>{
      //   console.log("PRZESZŁO XD");
      //   contextClose();
      // })
      // allPromisesDone(partialDownloadPromises).then(()=>{
      //   contextClose(context).then(async ()=>{
      //     return await createNewContext('testowyZiomek1', 'superSest1',context).then(async ()=>{
      //       for(i =0; i<5;i++){
      //         partialDownloadPromises[i] = new getPromise();
      //       }
      //       let tmp = i;
      //       i=-1;
      //       page.on('download', async download => {
      //         await download.saveAs('A:/playwright/zdjecia/'+getNextId() +download.suggestedFilename()).then(()=>{
      //          console.log("zapisanko");
      //          i=i+1;
      //          j=j+1;
      //          console.log(i);
      //          console.log("jot rowna sie " + j);
      //        }).then(()=>{
      //          if(j===ileZdjec) {
      //            allDownloadPromises.resolve_ex("done");
      //          }
      //          partialDownloadPromises[i].resolve_ex("whoa");
               
      //        });
      //     });
      //       await nextDownload(j+1,2*j+1);
      //     })
      //   })
      // })

    //   i=-1;
    //   j=-1;
    //   page.on('download', async download => {
    //      await download.saveAs('A:/playwright/zdjecia/'+Math.round(Math.random() * 10) +download.suggestedFilename()).then(()=>{
    //       console.log("zapisanko");
    //       i=i+1;
    //       j=j+1;
    //       console.log(i);
    //       console.log("jot rowna sie " + j);
    //     }).then(()=>{
    //       partialDownloadPromises[i].resolve_ex("whoa");
    //       allDownloadPromises[j].resolve_ex("WHOA");
    //     });
    //  });
    //   for(let i=0;i<5;i++){
    //     try { 
    //       await page.goto(linkToDownload[i]);
    //      }
    //     catch(error) {
    //       console.log("Its ok");
    //     }
    //     finally {
    //       await page.waitForTimeout(1000);
    //     }
    //   }
      
      // try{
      //     const data = await page.screenshot({
      //     type: "png"
      //   })
      //   // await browser.close()
      //   res.contentType("image/png")
      //   res.set("Content-Disposition", "inline;");
      //   res.send(data);
      // }
      // catch { 
      //   res.status(500).send(`Something went wrong: ${err}`)
      // }
});
async function downloadChain(ileZdjec) {
    contextClose().then(async ()=>{
      return await createNewContext('testowyZiomek1', 'superSest1').then(async ()=>{
        for(i =0; i<5;i++){
          partialDownloadPromises[i] = new getPromise();
        }
        i=-1;
        page.on('download', async download => {
          await download.saveAs('A:/playwright/zdjecia/'+getNextId() +download.suggestedFilename()).then(()=>{
           console.log("zapisanko");
           i=i+1;
           j=j+1;
           console.log(i);
           console.log("jot rowna sie " + j);
         }).then(async ()=>{
           if(j===ileZdjec-1) {
             allDownloadPromises.resolve_ex("done");
           }
           if(i===4) {
             return await downloadChain(ileZdjec)
           }
           partialDownloadPromises[i].resolve_ex("whoa");
           
         });
      });
        await nextDownload(j+1,j+6);
      })
    })
}
/*
  await page.click("[name='d']");
  await page.type("[name='d']", 'https://www.familysearch.org/');
  await sendSpecialCharacter(page, "[name='d']", 'Enter');
*/
// async function downloadChainWithProxy(ileZdjec) {
//   contextClose().then(async ()=>{
//     return await createNewContextwithProxy().then(async ()=>{
//       i=-1;
//       page.on('download', async download => {
//         await download.saveAs('A:/playwright/zdjecia/'+getNextId() +download.suggestedFilename()).then(()=>{
//          console.log("zapisanko");
//          i=i+1;
//          j=j+1;
//          console.log(i);
//          console.log("jot rowna sie " + j);
//        }).then(async ()=>{
//         if(j===ileZdjec-1) {
//            allDownloadPromises.resolve_ex("done");
//          }
//          if(i===14) {
//            return await downloadChainWithProxy(ileZdjec)
//          }
         
//        });
//     });
//       await nextDownloadWithProxy(j+1,j+16);
//     })
//   })
// }

async function downloadChainWithProxy(ileZdjec) {
  contextClose().then(async ()=>{
    return await createNewContextwithProxy().then(async ()=>{
      i=-1;
      page.on('download', async download => {
        let tmp = path.join(__dirname,'/photos/')+getNextId() +download.suggestedFilename();
        // let tmp = 'A:/playwright/zdjecia/'+getNextId() +download.suggestedFilename();
        await download.saveAs(tmp).then(()=>{
         console.log(tmp);
         readSendAndDeleteFile(tmp);
         console.log("zapisanko");
         i=i+1;
         j=j+1;
         console.log(i);
         console.log("jot rowna sie " + j);
       }).then(async ()=>{
        if(j===ilezdjec-1) {
           allDownloadPromises.resolve_ex("done");
         }
         if(i===14) {
           return await downloadChainWithProxy(ileZdjec)
         }
         
       });
    });
      await nextDownloadWithProxy(j+1,j+16);
    })
  })
}
async function readSendAndDeleteFile(path) {
  let promise = getPromise();
  fs.readFile(path, 'base64', (err, data) => { 
    wss.clients.forEach((client) => {
      client.send("photo");
      client.send(data);
      console.log("idzie fota");
      promise.resolve_ex();
    })
    promise.then(()=>{
      fs.unlink(path, (err) => {
        if (err) throw err;
        console.log(path+" was deleted");
      });
    })
 }) 
}
async function isFinalPromiseResolved(promise){
  return promise.isResolved ? contextClose() : downloadChain(partialDownloadPromises,context,allDownloadPromises) 
}
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
  width = 1920; 
  height = 1080 
  browser = await chromium.launch({
    chromiumSandbox: false,
  });
  //   browser = await chromium.launch({
  //   headless: false,
  // });
  //console.log(browser)
 // console.log(browser.proxy);
  context = await browser.newContext( {acceptDownloads: true}).then(
    wss.clients.forEach((client) => {
      client.send("init step 1");
    })
  );
  page = await context.newPage({
    viewport: {
      width,
      height
    }
  }).then(
    wss.clients.forEach((client) => {
      client.send("init step 2");
    })
  );
  await page.goto("https://www.familysearch.org/en/").then(
    wss.clients.forEach((client) => {
      client.send("init step 3");
    })
  );
  await page.waitForTimeout(4000).then(
    wss.clients.forEach((client) => {
      client.send("init step 4");
    })
  );
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
            wss.clients.forEach((client) => {
              client.send("init step 5");
            });
            break;
        }
    }    
    await page.waitForTimeout(100);
    await cookies.click().then(
      wss.clients.forEach((client) => {
        client.send("init step 6");
      })
    );
    await page.waitForTimeout(100);
    await page.click("#signInLink").then(
      wss.clients.forEach((client) => {
        client.send("init step 7");
      })
    );
    await page.waitForTimeout(100);
    await page.click("#userName").then(
      wss.clients.forEach((client) => {
        client.send("init step 8");
      })
    );
    await page.waitForTimeout(100);
    await page.type("#userName", 'sixcrown').then(
      wss.clients.forEach((client) => {
        client.send("init step 9");
      })
    );
    await page.waitForTimeout(100);
    await sendSpecialCharacter(page, "#userName", 'Tab').then(
      wss.clients.forEach((client) => {
        client.send("init step 10");
      })
    );
    await page.waitForTimeout(100);
    await page.type("#password", 'Troj@n!3').then(
      wss.clients.forEach((client) => {
        client.send("init step 11");
      })
    );
    await page.waitForTimeout(100);
    await sendSpecialCharacter(page, "#password", 'Enter').then(
      wss.clients.forEach((client) => {
        client.send("init step 12");
      })
    );
    // await page.waitForTimeout(100);
    // await page.goto("https://www.familysearch.org/ark:/61903/3:1:3QSQ-G9MB-PVK9?i=7&personaUrl=%2Fark%3A%2F61903%2F1%3A1%3AKW16-NPN").then(
    //   wss.clients.forEach((client) => {
    //     client.send("init step 13");
    //   })
    // );
    // await page.waitForTimeout(3000).then(
    //   wss.clients.forEach((client) => {
    //     client.send("init step 14");
    //   })
    // );;
    // for(let frame of page.frames())
    // {
    //    input = await frame.$('#openSDPagerInputContainer2 > input[type=text]')
    //    lewo = await frame.$('div.openSDToolbar.zoomer-default-position > div.open-sd-actions-wrapper.toolbar-position > div.openSDPager > span.previous.pager-icon.fs-civ-circle-chevron-left.enabled');
    //    prawo = await frame.$('div.openSDToolbar.zoomer-default-position > div.open-sd-actions-wrapper.toolbar-position > div.openSDPager > span.next.pager-icon.fs-civ-circle-chevron-right.enabled');
    //    load = await frame.$('#saveLi > a');
    //    ile = await frame.$('.afterInput');
    //     if(ile&&input&&lewo&&prawo&&load)
    //     {
    //       wss.clients.forEach((client) => {
    //         client.send("init step 15");
    //       })
    //         break;
    //     }
    // }    
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
  ws.send("init steps 12");
  init();
  ws.on('close', () =>{
   console.log('Client disconnected')
   closeBrowser();
  });
  ws.on('message', function incoming(data) {
    ws.send("pong");
    console.log("ping");
  });
});
async function createNewContext(username,password) {
  await context.close();
  context = await browser.newContext({ acceptDownloads: true, proxy: {server: "http://104.154.182.187:80"}});
  page = await context.newPage({
    viewport: {
      width,
      height
    }
  })
  await page.goto("https://www.familysearch.org/en/")
  await page.waitForTimeout(4000)
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
    await page.waitForTimeout(100);
    await cookies.click()
    await page.waitForTimeout(100);
    await page.click("#signInLink")
    await page.waitForTimeout(100);
    await page.click("#userName")
    await page.waitForTimeout(100);
    await page.type("#userName", username)
    await page.waitForTimeout(100);
    await sendSpecialCharacter(page, "#userName", 'Tab')
    await page.waitForTimeout(100);
    await page.type("#password", password)
    await page.waitForTimeout(100);
    await sendSpecialCharacter(page, "#password", 'Enter');
    await page.waitForTimeout(100);
}
async function createNewContextwithProxy() {
  var credits = getNextProxy();
  await context.close();
  context = await browser.newContext({ acceptDownloads: true});
  page = await context.newPage({
    viewport: {
      width,
      height
    }
  })
  await page.goto("https://www.proxysite.com/");
  await page.click(".server-option");
  await page.selectOption(".server-option", credits.proxy);
  await page.click(".server-option", {button: undefined});
  await page.click(".visual [placeholder='Enter Url']");
  await page.type(".visual [placeholder='Enter Url']", 'https://www.familysearch.org/en/');
  await sendSpecialCharacter(page, ".visual [placeholder='Enter Url']", 'Enter');
  await page.waitForTimeout(2000);
  await page.click("#signInLink")
  await page.waitForTimeout(100);
  await page.click("#userName")
  await page.waitForTimeout(100);
  await page.type("#userName", credits.username)
  await page.waitForTimeout(100);
  await sendSpecialCharacter(page, "#userName", 'Tab')
  await page.waitForTimeout(100);
  await page.type("#password", credits.password)
  await page.waitForTimeout(100);
  await sendSpecialCharacter(page, "#password", 'Enter');
  await page.waitForTimeout(100);

}
async function getPageSelectors() {
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
}

// setInterval(() => {
//   wss.clients.forEach((client) => {
//     client.send(new Date().toTimeString());
//   });
// }, 1000);
