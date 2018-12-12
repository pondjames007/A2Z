# Lost in Translation

## Inspiration
After learning the project of [im2txt](https://github.com/tensorflow/models/tree/master/research/im2txt#getting-started), it seems that making computer interpret images is pretty promising. Moreover, in the project of [Quick, Draw!](https://quickdraw.withgoogle.com/), it asks us to interpret an object by drawing a simple sketch. Accordingly, I want to make a project that can make computer interpret an image as a sketch and to see how different is the outcome after the process of “translation”.

## Process
I randomly pick an image and do *im2txt* through [Runway](https://runwayml.com), and it gives me a sentence caption. 

<p align=“left”>
	<img src=“https://github.com/pondjames007/A2Z/final_lostInTranslation/blob/master/img/flow3.png”>
</p>

Then I use [RiTa](https://rednoise.org/rita/index.php) to get nouns from the sentence, and take the nouns to find out the nearest categories I got in *sketchRNN* dataset by *word2vec*. The whole process is worked in *node.js server*. 

<p align=“left”>
	<img src=“https://github.com/pondjames007/A2Z/final_lostInTranslation/blob/master/img/flow4.png”>
</p>

## UI Flow
To present my project, I reverse the process. I show the sketch first, and make users to choose which image is the base to create the sketch.
<p align=“left”>
	<img src=“https://github.com/pondjames007/A2Z/final_lostInTranslation/blob/master/img/flow0.png”>
</p>
<p align=“left”>
	<img src=“https://github.com/pondjames007/A2Z/final_lostInTranslation/blob/master/img/flow1.png”>
</p>
<p align=“left”>
	<img src=“https://github.com/pondjames007/A2Z/final_lostInTranslation/blob/master/img/flow2.png”>
</p>

At the end, when you choose the correct answer, it will show the sentence captioned, nouns in the sentence, and the categories drawn in the sketch.

## Future Steps
	* Do the reverse process/ feedback loop: make users draw the sketch and see how the computer will choose the image. Or take the generated sketch as an input and make a loop.
	* Larger word2vec database and larger sketch categories
