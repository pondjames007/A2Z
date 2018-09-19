class Word {
    constructor(s) {
      this.word = s;
      this.tag = RiTa.getPosTags(s)[0];
    }
  
    init(time) {
      setTimeout(() => {
        this.span = document.createElement('span');
        this.span.innerHTML = this.word + " ";
        document.body.querySelector("div").appendChild(this.span);
            //   createSpan(' ');
        this.span.addEventListener("mouseover", () => this.span.style.backgroundColor = '#AAA');
        this.span.addEventListener("mouseout", () => this.span.style.backgroundColor = '#FFF');
        this.span.addEventListener("click", ()=> {
            let newWord = RiTa.randomWord(this.tag);
            if( newWord != ""){
                this.span.innerHTML = newWord + " ";
                this.span.style.color = "#ff0000";
            }
            
            console.log(this.tag)
            console.log(RiTa.randomWord(this.tag))
        });
        
      }, time);
    }
  
   
  }