// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

app.use(express.static('public'));

// Create socket connection
const io = require('socket.io').listen(server);
const puppeteer = require('puppeteer')
let loaded = false;

// Listen for individual clients to connect
io.sockets.on('connection',
  // Callback function on connection
  // Comes back with a socket object
  function (socket) {
    
    socket.on('loaded', (message) => {loaded = message})
    
    socket.on('generate', (message) => {
      if(message && loaded == true){
        scrape().then((value) =>{
          console.log(value)
          for(headline of value){
            socket.emit('paragraph', headline)
              
          }
        })
      }
    })

    // Listen for this client to disconnect
    socket.on('disconnect', function () {
      console.log("Client has disconnected " + socket.id);
    });
  }
);

async function scrape(){
  const browser = await puppeteer.launch({headless: true})
  const page = await browser.newPage()

  await page.goto('https://news.google.com/?hl=en-US&gl=US&ceid=US:en')
  await page.waitFor(1000)
  const result = await page.evaluate(() => {
      let paragraph = document.querySelectorAll('p')
 
      let title = []
      for(let i = 0; i < 10; i++){
          console.log(paragraph[i].innerHTML)
          title.push(paragraph[i].innerHTML.replace('...',''))
      }
      // let price = document.querySelector('.price_color').innerText()
      // title
      // return title.splice(10, title.length)
      return title
  })

  browser.close()
  return result
}


