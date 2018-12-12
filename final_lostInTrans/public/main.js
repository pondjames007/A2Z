// const runway = io.connect('http://10.17.198.219:33100/query');

const socket = io()

let imagesToChoose = []
let showImage = false;

// const wordVectors = ml5.word2vec('wordvecs10000.json', () => {console.log("model loaded")});

// Do sketchRNN
let model;
// Start by drawing
let previous_pen = 'down';
// Current location of drawing
let x, y;
// The current "stroke" of the drawing
let strokePath;

let objects
let sentence
let originalWords
let distance
let numObj = 0;
let count = 0;
let scroll = false;
let classArr = ["first", "second", "third"];

socket.on('connect', () =>{
    console.log('Server Connected');
})

function setup(){
    let canvas = createCanvas(1000, 560);
    background(220)
    document.getElementById('p5').appendChild(document.getElementById('defaultCanvas0'))
    // socket.on('category', (message)=>{
    //     console.log('VECTORS: ')
    //     console.log(message.vectors)
    // })
    
    socket.on('drawObj', (message) =>{
        objects = message.objects
        sentence = message.sentence
        originalWords = message.originalWords
        distance = message.distance
        console.log("now drawing: " + objects[0])
        stroke(random(255),random(255),random(255));
      
        model = ml5.SketchRNN(objects[0], modelready);

    })


    socket.on('chooseImg', (message)=>{
        imagesToChoose = message.images
        // console.log(imagesToChoose)
    })
    

    document.getElementById('start').addEventListener('click', ()=>{
        
        $( ".wrapper" ).slideUp( "slow", function() {
            // Animation complete.
        });
        $( "#p5" ).show();
        $( "#answer" ).show();
        $([document.documentElement, document.body]).animate({
            scrollTop: 180
        }, 800);
        
        socket.emit('start')
        numObj = 0;
        strokePath = null;
        document.getElementById('icon').innerText = ""
        document.getElementById('information').innerText = ""
        let images = document.querySelectorAll('img')
        for(image of images){
            image.src = ""
        }
        background(220)
    })

    document.getElementById('imgDiv').addEventListener('click', (e)=>{
        if(e.target && e.target.nodeName == "IMG"){
            console.log("clicked "+ e.target.id)
            console.log(imagesToChoose[e.target.id[e.target.id.length-1]].num)
            if(imagesToChoose[e.target.id[e.target.id.length-1]].num == 0){
                document.getElementById('icon').innerText = "Correct!"
                document.getElementById('icon').setAttribute('style', "color: green")
                document.getElementById('information').innerText = `Sentence Caption: ${sentence}\nWords: ${originalWords}\nObject Drawn: ${objects}`
            }
            else{
                document.getElementById('icon').innerText = "Wrong!"
                document.getElementById('icon').setAttribute('style', "color: red")
            }
            document.getElementById('icon').className = classArr[e.target.id[e.target.id.length-1]]
        }
    })

}



function draw(){
    // If something new to draw
  if (strokePath) {
    // If the pen is down, draw a line
    if (previous_pen == 'down') {
        strokeWeight(3.0);
        line(x, y, x + strokePath.dx*distance[numObj]*2, y + strokePath.dy*distance[numObj]*2);

    }
    // Move the pen
    x += strokePath.dx*distance[numObj]*2;
    y += strokePath.dy*distance[numObj]*2;
    // The pen state actually refers to the next stroke
    previous_pen = strokePath.pen;

    // If the drawing is complete
    if (strokePath.pen !== 'end') {
      strokePath = null;
      model.generate(gotStroke);
      
    }
    else if(strokePath.pen === 'end'){
      
      if(numObj < objects.length-1){
        numObj++;
        console.log("now drawing: " + objects[numObj])
        stroke(random(255),random(255),random(255));
        model = ml5.SketchRNN(objects[numObj], modelready);
        strokePath = null;
        scroll = true;
      }
      else if(numObj == objects.length-1){
        let images = document.querySelectorAll('img')
        for(let i = 0; i < images.length; i++){
            images[i].src = imagesToChoose[i].path
        }

        if(scroll == true){
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#answer").offset().top
            }, 800);

            scroll = false;
        }
        

      }
    //   console.log(numObj)
    }
  }
}

function modelready(){
    startDrawing()
}

function startDrawing(){
    // Start in a random point
    x = random(0.3*width, 0.7*width);
    y = random(0.4*height, 0.6*height);
    model.reset();
    // Generate the first stroke path
    model.generate(gotStroke);
    console.log("loaded!!!!")
}

function gotStroke(err, s) {
    strokePath = s;
}
