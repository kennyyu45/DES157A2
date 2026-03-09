//initialize variables
let deck = [];
const suits = ["♠", "♦", "♥", "♣"];
let hand = [];
let winCon = 300;
let handLim = 8;
let selected = 0;
let discards = 3;
let hands = 4;
let playingHand = false;
//query selectors
const holding = document.querySelector(".hand");
const discardBtn = document.querySelector("#discard");
const playBtn = document.querySelector("#play");
const rules = document.querySelector("#rules");
const explanation = document.querySelector("#explanation");
const back = document.querySelector("#back");
const youLose = document.querySelector("#youLose");
const redo = document.querySelectorAll(".restart");
//scoring calculations
const scoring = {
    "fourOfAKind": [60, 7],
    "flush": [35, 4],
    "straight": [30, 4],
    "threeOfAKind": [30, 3],
    "pair": [10, 2],
    "single": [5, 1]
};

(function(){
    "use strict";
    console.log("reading js");

    startGame();

    //event listeners for restart buttons
    for (let i = 0; i < redo.length; i++){
        redo[i].addEventListener("click", function(){
            deck = [];
            hand = [];
            handLim = 8;
            selected = 0;
            discards = 3;
            hands = 4;
            playingHand = false;
            score.innerHTML = 0;
            youLose.classList.add("hidden");
            youWin.classList.add("hidden");
            
            startGame();
        });
        };
})();

function startGame(){
    displayStats();
    startDeck();
    draw();   
    makeCards(handLim);
}

function makeCards(handLim){
    //DOM hand
    holding.innerHTML = "";

    //create heart and diamond cards
    for (let i = 0; i<hand.length; i++){
        if (hand[i].suit === "♥" || hand[i].suit === "♦"){
            holding.innerHTML += 
            //make these cards red
            //add data values for future tracking
            `<div class = 'cards red' 
            data-value = ${hand[i].value}
            data-suit =  ${hand[i].suit}
            data-index = ${i}>
                ${hand[i].value}
                ${hand[i].suit}
            </div>`;
        }
        else{
            holding.innerHTML += 
            //make all these cards black
            `<div class = 'cards black' 
            data-value = ${hand[i].value}
            data-suit =  ${hand[i].suit}
            data-index = ${i}>
                ${hand[i].value}
                ${hand[i].suit}
            </div>`;
        }
    }

    const cards = document.querySelectorAll(".cards");
    
    for(let i = 0; i<cards.length; i++){
        cards[i].addEventListener("click", function(){
            const index = parseInt(this.dataset.index);

            if (this.classList.contains("chosen")){
                this.classList.remove("chosen");
                hand[index].selected = false;
                selected--;
            }
            else if(selected < 5){
                this.classList.add("chosen");
                hand[index].selected = true;
                selected++;
            };
        });
    };
};

function loseSequence(){
    //display lose screen
    youLose.classList.remove("hidden");
};

function winSequence(){
    //display win screen
    youWin.classList.remove("hidden");
};

function startDeck(){
    //loop through 52 cards
    //create cards based on counter and suits array
    for(let i = 0; i < 13; i++){
        for(let j = 0; j < suits.length; j++){
            const card = {
                value: i + 1,
                suit: suits[j],
                selected: false
            };
            deck.push(card);
        };
    };
    //randomly shuffles deck
    shuffle();
};

function shuffle(){
    //Fisher-Yates shuffle algorithim
    for (let i = deck.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
};

function sortHand(){
    //sorts hand from smallest to biggest
    hand.sort(function(a,b){
        return a.value -  b.value;
    });
};

function draw(){
    //loops based on hand size (variable)
    //removes said cards from the top of the deck
    //adds cards to hand
    while(handLim > hand.length){
        let newCard = deck.pop();
        newCard.selected = false;
        hand.push(newCard);
    };
    //ensures things that aren't selected stay unselected (bug fixing)
    for (let i = 0; i < hand.length; i++){
        if (hand[i].selected === undefined){
            hand[i].selected = false;
        }
    }
    sortHand();
};

function discard(){
    //only discards if you have discards remaiining and you have a card selected
    if (selected > 0){
        if(discards > 0 || playingHand === true){
        
        //targets only cards you chose
        const chosenCards = document.querySelectorAll(".cards.chosen");

        for(let i = 0; i < chosenCards.length; i++){
            //define an index for each card based on its position in the hand
            const index = parseInt(chosenCards[i].dataset.index);
            //redefines selected
            hand[index].selected = true;
            //animation for discards
            chosenCards[i].classList.add("flyAway");
        };

        //adds a slight delay (ptherwise its too jarring)
        setTimeout( function(){
            //remove all cards from the deck with selected = true
            hand = hand.filter(card => !card.selected);
        
            //draw new cards from deck based on hand size limit
            draw();
            makeCards();

            //resets the number of cards you can select
            selected = 0;

            //updates number of discards
            displayStats();
        }, 500);

        //logic to ensure playing a hand doesn't also use a discard
        if (playingHand === false){
            discards--;
        }
    }
        
    };
};

function displayStats(){
    //update the number of hands in stats
    document.querySelector("#hands").innerHTML = hands;
    //updates the number of discards in stats
    document.querySelector("#discardDisplay").innerHTML = discards;
};

function playHand(){
    const chosenCards = document.querySelectorAll(".cards.chosen");
    const last = document.querySelector("#lastPlayedHand");
    const score = document.querySelector("#score");
    let cardVals = [];
    let cardSuits = [];
    let mult = 0;
    let chips = 0;

    //makes sure when discard() is called later it doesn't update the discards stat
    playingHand = true;

    if(selected > 0){

        for (let i = 0; i < chosenCards.length ; i++){
            //add all of the card values to a array
            cardVals.push(chosenCards[i].dataset.value)
            //add all of the card suits to a array
            cardSuits.push(chosenCards[i].dataset.suit)
        }

        console.log(cardVals)

        //uses a function to determine the amount of cards in hand that actually score
        numOfScoringCards = scoreValCalc(cardVals)[0];

        //uses a function to determine the value of the most common card in hand
        valOfScoringCards = scoreValCalc(cardVals)[1];
        
        //four of a kind scoring
        if (numOfScoringCards === 4){
            //pulls from the socring object to update mult and chips (option to update scoring)
            mult = scoring.fourOfAKind[1]
            //adds all of the values of the scoring cards to the chips
            chips = scoring.fourOfAKind[0] + (numOfScoringCards * valOfScoringCards)
            last.innerHTML = "<p>Four of a Kind</p>";
        }
        // flush scoring
        //only works if all suits are the same and five cards are selected
        else if (scoreSuitCalc(cardSuits, cardVals)[0] && selected === 5){
            mult = scoring.flush[1];
            chips = scoring.flush[0] + scoreSuitCalc(cardSuits, cardVals)[1];
            last.innerHTML = "<p>Flush</p>"
        }
        //straight socring
        else if(straightScoring(cardVals)[0] && selected === 5){
            mult = scoring.straight[1];
            chips = scoring.straight[0] + straightScoring(cardVals)[1];
            last.innerHTML = "<p>Straight</p>"
        }
        //three of a kind scoring
        else if (numOfScoringCards === 3){
            mult = scoring.threeOfAKind[1]
            chips = scoring.threeOfAKind[0] + (numOfScoringCards * valOfScoringCards)
            last.innerHTML = "<p>Three of a Kind</p>"
        }
        //pair scoring
        else if (numOfScoringCards === 2){
            mult = scoring.pair[1]
            chips = scoring.pair[0] + (numOfScoringCards * valOfScoringCards)
            last.innerHTML = "<p>Pair</p>"
        }
        //single card scoring
        else{
            mult = scoring.single[1]
            chips = scoring.single[0] + valOfScoringCards
            last.innerHTML = "<p>Single</p>"
        }

        //reduce number of hands by 1
        hands--;
        
        //add mult * chips to your current score
        let currentScore = Number(score.textContent);
        currentScore += mult * chips;
        score.innerHTML = currentScore

        //removes selected cards from hand and draws new ones from deck
        discard();

        //resets variable so next discard will update the discards stat
        playingHand = false;

        //checks to see if you win or lose
        if (currentScore >= winCon){
            setTimeout( function(){
                winSequence();
            }, 1000);
        }
        else if (hands === 0){
            setTimeout( function(){
                loseSequence();
            }, 1000);
        }
    }
};

function scoreValCalc(value){
//used to determine how many card values in a hand are the same and what value those cards have
    const counts = {};
    maxCount = 0;
    let common;

    for (let val of value) {
        counts[val] = (counts[val] || 0) + 1;
    }
    for (let val in counts){
        if (counts[val] > maxCount){
            maxCount = counts[val];
            common = val;
        }
    }
    return([maxCount, parseInt(common)])
};

function scoreSuitCalc(value, nums){
//returns a true or false if the hand is a flush and an integer which adds all the values in the selected hand
    let suitTracker = value[0];
    let flush = 1;
    let adder = 0;

    for (let i = 0; i  < nums.length; i++){
        adder += parseInt(nums[i])
    }

    for (let i = 1; i < value.length; i++){
        if (suitTracker === value[i]){
            flush++;
        }
    }
    if(flush == 5){
        return [true, adder];
    } else {
        return [false, adder];
    }
};

function straightScoring(cardVals){
    //converts array of strings into integers
    cardVals = cardVals.map(Number);
    let adder = 0;

    //adds value of cards to add to chips
    for (let i = 0; i<5; i++){
        adder += cardVals[i];
    }

    //straight logic
    for (let i = 0; i < 4; i++){
        if (cardVals[i] + 1 !== cardVals[i + 1]){
            return false
        }
        else{
            return [true, adder]
        }
    }
};

//event listener for discard button
discardBtn.addEventListener("click", discard);

//event listener for play button
playBtn.addEventListener("click", playHand);

//event listener for opening rules
rules.addEventListener("click", function(){
    explanation.classList.remove("yeet");
});

//event listener for closing rules
back.addEventListener("click", function(){
    explanation.classList.add("yeet");
})












