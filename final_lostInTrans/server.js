// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function() {
    console.log('Server listening at port: ', port);
});

app.use(express.static('public'));

// Create socket connection
const io = require('socket.io').listen(server);
const ioClient = require('socket.io-client')
const math = require('mathjs')
const wordVec = require('./wordvecs10000')
const fs = require('fs')
const path = require('path')
const es = require('event-stream')
const imgDir = './img2txt'

const shuffle = require('shuffle-array')
const sketchCategories = require("./categories.json")
const rita = require("./rita-full.min.js")
let sketchCategories_Vec = []

// let wordVectors = new Array(1917496)
// for(let i = 0; i < wordVectors.length; i++)
//     wordVectors[i] = new Array(300)
// let wordArr = []
// let word
// let vector = []
// let wordVectors = {}
// let count = 0
// s = fs.createReadStream('glove.42B.300d.txt')
//     .pipe(es.split())
//     .pipe(es.map((line, callback)=>{
//         // s.pause()
//         let wordArr = line.split(" ")
//         let word = wordArr[0]
//         let vector = wordArr.slice(1, wordArr.length).map(Number)
//         wordVectors[word] = vector
//         // wordVectors[count] = {word: word, vector: vector}
//         // let word = wordArr.shift()
//         // console.log(wordArr)
//         // wordVectors.push({word: wordArr[0], vector: wordArr.slice(1, wordArr.length).map(Number)})
//         // wordVectors.push(wordArr)
//         count++
//         callback(null, line)
//         // s.resume()
//     })
//     .on('error', (err)=>{console.log(err)})
//     .on('end', ()=>{
//         console.log("Finish reading file")
//         console.log(count)
//     })
//     )

// Runway Connection
const runway = ioClient.connect('http://10.17.198.219:33100/query');
runway.on('connect', () => {
    console.log('Runway Connected');
});


io.sockets.on('connection', 
    function(socket){
        sketchCategories_Vec = []
        loadSketchCategoryVec(socket);

        socket.on('start', ()=>{
            let imagePath = []
            fs.readdir(imgDir, (err, files)=>{
                console.log(files)
                let imgFiles = shuffle(files, {copy:true})
                for(let i = 0; i < 3; i++){
                    let chosenImg = imgDir + "/" + imgFiles[i]
                
                    let data = fs.readFileSync(chosenImg)
                    let extensionName = path.extname(chosenImg)
                    let base64Image = new Buffer(data, 'binary').toString('base64');
                    let imgSrcString = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
                    
                    imagePath.push({path: imgSrcString, num: i})
        
                }
                
                // console.log(imagePath[0])
                runway.emit('update_request', {
                    data: imagePath[0].path
                });
                shuffle(imagePath)
                socket.emit('chooseImg', {images: imagePath})

            })
            
        })

        // Listen for this client to disconnect
        socket.on('disconnect', function () {
            console.log("Client has disconnected " + socket.id);
        });


        runway.on('update_response', (data) => {
            // console.log(data);
            let sentence = data.results[0].caption;
         
            let tags = rita.getPosTags(sentence);
            let nouns = [];
            console.log(sentence)
            // console.log(tags)
            for(let idx in tags){
                if(tags[idx] == 'nn' || tags[idx] == 'nns'){
                    // console.log(sentence[idx]);
                    nouns.push(sentence.split(" ")[idx]);
                }
            }
            console.log(nouns);
        
            let objects_to_draw = []
            let distance = []
            for(let noun of nouns){
                let queryWordVec = wordVec.vectors[noun]
                if(queryWordVec != null){
                    let dist = sketchCategories_Vec.map(vec => wordDist(queryWordVec, vec.vector))
                    let nearest = dist.reduce((emo1, emo2) => {return emo1 >= emo2? emo1:emo2})
                    objects_to_draw.push(sketchCategories_Vec[dist.indexOf(nearest)].name)
                    distance.push(nearest)
                }
            
            }


            console.log(objects_to_draw)
            console.log(distance)
            let objects = {
                objects: objects_to_draw,
                distance: distance,
                sentence: sentence,
                originalWords: nouns
            }
            socket.emit('drawObj', objects)
        
        });

    }
)


function loadSketchCategoryVec(socket){
    // console.log(sketchCategories)
    for(category of sketchCategories.models){
        if(wordVec.vectors[category] != null){
            let vec = {
                name: category,
                vector: wordVec.vectors[category]
            }
            sketchCategories_Vec.push(vec)
        }
        
    }

    // socket.emit('category', {vectors: sketchCategories_Vec})
}

function wordDist(w1, w2){
    if(math.norm(w1) > 0 && math.norm(w2) > 0){
      return math.dot(w1, w2)/(math.norm(w1) * math.norm(w2))
    }
    else{
      return 0
    }
}

