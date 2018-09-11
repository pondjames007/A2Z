let txt;
let alltxt;
let words;
let count = 0;

function preload(){
	txt = loadStrings('news.txt');
}

function setup() {
	noCanvas();
	
	alltxt = join(txt, " ");
	console.log(alltxt);
	let textArea = select("#textinput");
	textArea.value(alltxt);
	// createDiv(alltxt);
	let dlt = select("#delete")
	dlt.mouseClicked(deletion);


}

function deletion(){
	alltxt = alltxt.replace(/e/gi, "");
	let output = createDiv(alltxt);
	output.style('margin', '10px');
	output.style('width', '600px');
}
