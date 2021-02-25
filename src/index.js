
const express = require("express")
const { chromium } = require("playwright-chromium")
const { firefox } = require("playwright-firefox")
const app = express()
const fs = require('fs')
const { Server } = require('ws');
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
let allPhotos;
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

  var promise = new Promise((resolve, reject) => {
      _reject = reject;
      _resolve = resolve;
  });

  promise.resolve_ex = (value) => {
     _resolve(value);
  };

  promise.reject_ex = (value) => {
     _reject(value);
  };

  return promise;
}

async function contextClose(){
  return await context.close()
};


async function sendSpecialCharacter(page, selector, key) {
  const elementHandle = await page.$(selector);
  await elementHandle.press(key);  
};

async function nextDownloadWithProxy(from, to){
  try{
  for(let i=from;i<to;i++){
      await page.waitForTimeout(2000);
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
  }
}
catch(error) {//already downloaded all content
}
};

app.use(express.static("./public")) 
const port = process.env.PORT || 3000;
async function download(from, to) {
    if(!from) from=1;
    if(from == 0) from = 1;
    if(!to) to = allPhotos
    allPhotos = to - from + 1;
    wss.clients.forEach((client) => {
    client.send("amount "+allPhotos);
    });
    await input.fill(from.toString());
    await input.press("Enter")
    for(let i =0;i<allPhotos-1;i++) {    
      linkToDownload[i]= "https://www.familysearch.org"+ await load.getAttribute('href');
      await prawo.click()
    }      
    linkToDownload[allPhotos-1]= "https://www.familysearch.org"+ await load.getAttribute('href');
    allDownloadPromises = new getPromise();
    await downloadChainWithProxy(allPhotos);
    await allDownloadPromises.then(()=>{
      console.log("download done");
      partialDownloadPromises=[];
      j=-1;
      linkToDownload=[]
      id=0;
      wss.clients.forEach((client) => {
        client.send("downloadExecuted");
        });
        try{
      contextClose().then(()=>{
        closeBrowser().then(()=>{
          init();
        });
      });
        }catch(error) {}//already closed

    })
  }
  app.get("/cancel", async (req, res) => {
    console.log('Client download canceled')
    allDownloadPromises.resolve_ex();
    res.status(200).send("ok");
  });

  app.get("/hello", async (req, res) => {
    console.log('hehe')
    res.status(200).send("ok");
  });

  app.get("/download", async (req, res) => {

      const url = req.query.url;
      const from = parseInt(req.query.from);
      const to = parseInt(req.query.to);
      console.log(req.query);
      let err = false;
      let params = false;
      try {
        await page.goto(url);
        await page.waitForTimeout(15000);
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
      let ileZdjec = await ile.textContent();
      ileZdjec = ileZdjec.replace(/\D/g,'');
      allPhotos = ileZdjec;
      if(from>ileZdjec || to>ileZdjec || from>to || from < 0 ){
        params = true;
        throw error;
      }
       
    }
    catch(error){
      err = true;
    }
    if(err===false) {
    res.status(200).send("ok");
    for(let i =0; i<15;i++){
      partialDownloadPromises.push(new getPromise());
    }
    await download(from,to);
  }
  else {
    if(!params){
    res.status(500).send(`Invalid url`)
  }
    else { 
      res.status(501).send(`Invalid params`);
    }
  }
});

async function downloadChainWithProxy(ileZdjec) {
  contextClose().then(async ()=>{
    return await createNewContextwithProxy().then(async ()=>{
      i=-1;
      page.on('download', async download => {
        let downloadPath = path.join(__dirname,'/photos/')+getNextId() +download.suggestedFilename();
        await download.saveAs(downloadPath).then(()=>{
         i=i+1;
         j=j+1;
         readSendAndDeleteFile(downloadPath,i);
       }).then(async ()=>{
         if(i===14 && j != ileZdjec -1) {
          Promise.all(partialDownloadPromises).then(async()=>{
            partialDownloadPromises = [];
            for(let i =0; i<15;i++){
              partialDownloadPromises.push(new getPromise());
            }
            return await downloadChainWithProxy(ileZdjec)
           })
         }
         
       });
    });
    if(j<ileZdjec-1){
      await nextDownloadWithProxy(j+1,j+16);
    }
    })
  })

}
async function readSendAndDeleteFile(path,index) {
  let promise = getPromise();
  fs.readFile(path, 'base64', (err, data) => { 
    wss.clients.forEach((client) => {
      client.send("name");
      client.send(linkToDownload[j]);
      client.send("photo");
      client.send(data);
      client.send("sent");
      promise.resolve_ex();
    })
    promise.then(()=>{
      fs.unlink(path, (err) => {
        if (err) throw err;
        console.log(path+" was deleted");
        if(j===allPhotos-1) {
          allDownloadPromises.resolve_ex("done");
        }
        partialDownloadPromises[index].resolve_ex();
      });
    })
 }) 
}
process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
const wss = new Server({ server });
async function init() {
  wss.clients.forEach(client=>{
    client.send("init steps 12");
  })

  width = 1920; 
  height = 1080 
  browser = await chromium.launch({ //comment this to run on localhost
    chromiumSandbox: false,
  });
  //   browser = await chromium.launch({ //decomment this to run on localhost
  //   headless: false,
  // });
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
  await page.waitForTimeout(6000).then(
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
  wss.clients.forEach((client) => {
    client.send("init Done");
  });
}

async function closeBrowser() {
  await browser.close();
}
wss.on('connection', (ws) => {
  console.log('Client connected');
  init();
  ws.on('close', () =>{
   console.log('Client disconnected')
   linkToDownload = [];
   id=0;
   partialDownloadPromises=[]
   j=-1;
   allPhotos=0;
   contextClose().then(()=>{
    closeBrowser();
   });
  });
  ws.on('message', function incoming(message) {
    console.log("heartbeat");
  });
  // ws.addEventListener('message',()=>{
  //   console.log("ping");
  // })
  // function xD(){
  //   console.log("ping");
  // }


});
async function createNewContextwithProxy() {
  var credits = getNextProxy();
  // await context.close();
  context = await browser.newContext({ acceptDownloads: true});
  context.setDefaultTimeout(120000);
  page = await context.newPage({
    viewport: {
      width,
      height
    }
  })
  try{
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
  catch(error){ 
    wss.clients.forEach((client) => {
      client.send("proxy dead");
    });
  }
}

setInterval(() => {
  wss.clients.forEach((client) => {
    client.send("ping");
  });
}, 30000);
