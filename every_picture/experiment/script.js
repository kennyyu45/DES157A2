(function(){
    "use strict";
    console.log("running js")

    const inner = document.querySelector("#inner");
    const outer = document.querySelector("#outer");

    outer.addEventListener("mouseover", function(){
        inner.classList.remove("animate-in");
        inner.classList.add("animate-out")
    })
    outer.addEventListener("mouseout", function(){
        inner.classList.remove("animate-out");
        inner.classList.add("animate-in")
    })
})();