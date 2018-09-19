let txt;
let allTxt;
let words = [];
let elts = [];
let tags = [];


function preload(){
	txt = loadStrings("news.txt");
}

function setup() {
	noCanvas();

	let buttons = document.body.querySelectorAll("button");

	for(let button of buttons){
		button.addEventListener("click", ()=>{changeWords(button.id)});
	}

	allTxt = join(txt, " ");
	// console.log(allTxt);

	words = RiTa.tokenize(allTxt);
	// console.log(words);
	for (let i = 0; i < words.length; i++) {
		elts[i] = new Word(words[i]);
		elts[i].init(i);
	}

	// console.log(elts);



}

function changeWords(id){
	// console.log(id);
	// console.log(elts);
	let color = '#' + (Math.random()*0xFFFFFF<<0).toString(16);
	for(let el of elts){
		if(el.tag.match(id) != null){
			let newWord = RiTa.randomWord(el.tag);
			// console.log(id+" "+el.span.innerHTML+" "+newWord)
			if( newWord != ""){
				el.span.innerHTML = newWord + " ";
				el.span.style.color = color;
			}
		}
	}
}