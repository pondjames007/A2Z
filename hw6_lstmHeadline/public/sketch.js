
const socket = io()
let loaded = false

const lstm = ml5.LSTMGenerator('models/nike/', ()=>{
    console.log("model loaded")
    loaded = true
    socket.emit('loaded', loaded)
});

const length_slider = document.getElementById('length_slider')
length_slider.addEventListener('input', ()=>{
    document.getElementById('length').innerText = document.getElementById('length_slider').value
})

const temp_slider = document.getElementById('temp_slider')
temp_slider.addEventListener('input', ()=>{
    document.getElementById('temp').innerText = document.getElementById('temp_slider').value
})



const generate = document.getElementById('generate')
generate.addEventListener('click', ()=>{
    document.getElementById('output').innerHTML = ''
    socket.emit('generate', true)
})


socket.on('paragraph', (message) => {
    console.log(message)
    lstm.generate({ 
        seed: message,
        length: document.getElementById('length_slider').value,
        temperature: document.getElementById('temp_slider').value 
    }, (err, result) => {
        console.log(result);
        let title = document.createElement('p')
        title.innerHTML = message + '\n' + result
        document.getElementById('output').appendChild(title)
    });
    
})



