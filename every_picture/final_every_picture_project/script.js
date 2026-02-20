(function(){
    "use strict";
    console.log("running js");

    //initialize variables
    const holes = document.querySelectorAll(".hole");
    const text = document.querySelector("#info");
    //create an array to replace text in the moving textbox along with images
    const info = [`a really big rhino smashed <br> into my wall <br><img src=images/rhino.png alt=rhino pic>`,
    `this piece of tape holds this <br> half of the house together <br><img src=images/house.png alt=broken house pic>`, 
    `a friendly worm used to live here <br> but he moved out <br> and they filled in the hold <br><img src=images/worm.png alt=worm pic>`,
    `somone glued a white skittle <br> to the wall <br><img src=images/skittle.png alt=skittle pic>`,
    `california? <br><img src=images/cali.png alt=cali pic>`,
    `a drawing of two snakes that <br> got messed up <br><img src=images/snake.png alt=snake pic>`]

    for (let i = 0; i<holes.length; i++){
        holes[i].addEventListener("mouseover", function(){
            //logic to replace text with array element
            text.innerHTML = info[i];
            //logic to switch classes
            text.classList.remove("animate-in");
            text.classList.add("animate-out");
        })
        holes[i].addEventListener("mouseout", function(){
            //logic to switch classes again
            text.classList.remove("animate-out");
            text.classList.add("animate-in");
        })
    };
})();