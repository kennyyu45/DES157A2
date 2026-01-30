(function(){
    "use strict";
    console.log("running js");

    const pageTwo = document.querySelector("#pageTwo");
    const btn = document.querySelector("#btn");

    btn.addEventListener("click", function(event){
        console.log("btn");
        pageTwo.classList.add("show");
        event.preventDefault();
    })
})();