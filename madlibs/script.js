(function(){
    "use strict";
    console.log("running js");

    // capturing page and button
    const pageTwo = document.querySelector("#pageTwo");
    const btn = document.querySelector("#btn");
    
    btn.addEventListener("click", function(event){
        event.preventDefault();

        // capturing madlib terms
        const animal = document.querySelector("#animal").value;
        const potion = document.querySelector("#potion").value;
        const loco = document.querySelector("#loco").value;
        const adj = document.querySelector("#adj").value;
        const artifact = document.querySelector("#artifact").value;
        const adverb = document.querySelector("#adverb").value;
        const spell = document.querySelector("#spell").value;
        const salesman = document.querySelector("#salesman").value;

        // capturing error message and results
        let error = document.querySelector("#error");
        let result = document.querySelector("#result");

        //initializing displayed messages
        let myText;
        let final;

        //else if loop to find an error or display final message
        if(animal == ""){
            myText = "please provide a animal";
        }
        else if(potion == ""){
            myText = "please provide a noun";
        }
        else if(loco == ""){
            myText = "please provide a location";
        }
        else if(adj == ""){
            myText = "please provide a adjective";
        }
        else if(artifact == ""){
            myText = "please provide a noun";
        }
        else if(spell == ""){
            myText = "please provide a adj";
        }
        else if(salesman == ""){
            myText = "please provide a noun";
        }
        if (myText){
            error.innerHTML = myText;
            return;
        }

        //filling in result
        final = `Twas a dark and stormy night, not even the ${animal} made a peep. Three witches flew out into the night to gather ingredients for a potion of ${potion}. The first witch went to ${loco} to gather ingredients. The second witch traversed the ${adj} forests to collect the legendary ${artifact}. The last sorrcerific sister cast a spell of ${spell}ening  and bartered with a travelling ${salesman} salesman to obtain the final ingredient. Finally, the spell of ${spell} was casted and the three witches celebrated.`

        //removing transparency on pageTwo
        //displaying results
        pageTwo.classList.add("show");
        result.innerHTML = final;
    });

})();

