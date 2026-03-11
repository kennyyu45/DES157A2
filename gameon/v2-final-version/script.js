//initialize variables
let deck = [];
const suits = ["♠", "♦", "♥", "♣"];
let hand = [];
let winCon = [300, 450];
let handLim = 8;
let selected = 0;
let discards = 3;
let hands = 4;
let playingHand = false;
let jokerIndex = [1, 2, 3, 4, 5];
let round = 0;
//query selectors
const holding = document.querySelector(".hand");
const discardBtn = document.querySelector("#discard");
const playBtn = document.querySelector("#play");
const rules = document.querySelector("#rules");
const explanation = document.querySelector("#explanation");
const scoringRules = document.querySelector("#scoringRules");
const back = document.querySelector("#back");
const youLose = document.querySelector("#youLose");
const redo = document.querySelectorAll(".restart");
const score = document.querySelector("#score");
const target = document.querySelector("#target");
const jokers = document.querySelectorAll(".jokers");
const shop = document.querySelector("#shop");
const ding = new Audio("sounds/ding.mp3");
const lose = new Audio("sounds/fail.mp3");
const last = document.querySelector("#lastPlayedHand");
//scoring calculations
let scoring = {
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

    //start playing!
    startGame();
})();

function startGame(){
    //reinitialize all the variables
    deck = [];
    hand = [];
    handLim = 8;
    selected = 0;
    discards = 3;
    hands = 4;
    playingHand = false;

    //fix some inner HTML
    //make sure stuff thats hidden stays hidden
    score.innerHTML = 0;
    last.innerHTML = "";
    target.innerHTML = winCon[round];
    youLose.classList.add("hidden");
    youWin.classList.add("hidden");

    //display stats
    //create cards, hand, and deck
    //initialize shop
    displayStats();
    startDeck();
    draw();   
    makeCards(handLim);
    generateShop();
};

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
    shuffle(deck);
};

function shuffle(deck){
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
            };
        };
    };
};

function displayStats(){
    //update the number of hands in stats
    document.querySelector("#hands").innerHTML = hands;
    //updates the number of discards in stats
    document.querySelector("#discardDisplay").innerHTML = discards;
    //update scoring in the rules with the changes made
    scoringRules.innerHTML = 
    `<p>Four of a Kind: <span class="chips">${scoring.fourOfAKind[0]} chips</span>, <span class="mult">${scoring.fourOfAKind[1]} mult</span> <br>
    Flush: <span class="chips">${scoring.flush[0]} chips</span>, <span class="mult">${scoring.flush[1]} mult</span> <br>
    Straight: <span class="chips">${scoring.straight[0]} chips</span>, <span class="mult">${scoring.straight[1]} mult</span> <br>
    Three of a Kind: <span class="chips">${scoring.threeOfAKind[0]} chips</span>, <span class="mult">${scoring.threeOfAKind[1]} mult</span> <br>
    Pair: <span class="chips">${scoring.pair[0]} chips</span>, <span class="mult">${scoring.pair[1]} mult</span> <br>
    Single: <span class="chips">${scoring.single[0]} chips</span>, <span class="mult">${scoring.single[1]} mult</span> <br></p>`;
};

function playHand(){
    const chosenCards = document.querySelectorAll(".cards.chosen");
    const score = document.querySelector("#score");
    let cardVals = [];
    let cardSuits = [];
    let mult = 0;
    let chips = 0;

    console.log("hand")

    //makes sure when discard() is called later it doesn't update the discards stat
    playingHand = true;

    if(selected > 0){

        for (let i = 0; i < chosenCards.length ; i++){
            //add all of the card values to a array
            cardVals.push(chosenCards[i].dataset.value)
            //add all of the card suits to a array
            cardSuits.push(chosenCards[i].dataset.suit)
        }

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

        //checks to see if you win
        //resets scoring
        if (currentScore >= winCon[round] && round === 1){      
            ding.play();
            setTimeout( function(){
                round = 0;
                scoring = {
                    "fourOfAKind": [60, 7],
                    "flush": [35, 4],
                    "straight": [30, 4],
                    "threeOfAKind": [30, 3],
                    "pair": [10, 2],
                    "single": [5, 1]
                };
                winSequence();
            }, 1000);
            }
        //see if you move to next round
        //bring up shop
        else if (currentScore >= winCon[round]){
            setTimeout( function(){
                round += 1;
                score.innerHTML = 0;
                ding.play();
                shop.classList.remove("shopGoAway")
            }, 1000);
        }
        //see if you lose
        else if (hands === 0){
            setTimeout( function(){
                lose.play();
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
    let suitTracker = value[0];
    let flush = 1;
    let adder = 0;

    //tracks total of all values in hand
    for (let i = 0; i  < nums.length; i++){
        adder += parseInt(nums[i])
    }

    //checks if all suits are the same as the first
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
    }
    return [true, adder]
};

function generateShop(){
    //randomizes jokers
    shuffle(jokerIndex);

    //pulls three jokers from array
    //places description of joker effects  
    for (let i = 0; i < 3; i++){
        switch (jokerIndex[i]){
            case 1:
                jokers[i].innerHTML = "<h2>+5 Mult to Singles</h2>";
                break;
            case 2:
                jokers[i].innerHTML = "<h2>+10 Mult to Straights</h2>";
                break;
            case 3:
                jokers[i].innerHTML = "<h2>+5 Mult to Pairs</h2>";
                break;
            case 4:
                jokers[i].innerHTML = "<h2>+20 chips to Flushes</h2>";
                break;
            case 5:
                jokers[i].innerHTML = "<h2>+20 all to Three of a Kind</h2>";   
        };
    };
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

//event listeners for jokers in shop
for (let i = 0; i < jokers.length; i++){
    jokers[i].addEventListener("click", function(){

        const effect = Number(this.dataset.joker);

        //updates scoring hands based on joker chosen
        switch(effect){
            case 1:
                scoring.single[1] += 5;
                break;
            case 2:
                scoring.straight[1] += 10;
                break;
            case 3:
                scoring.pair[1] += 5;
                break;
            case 4:
                scoring.flush[0] += 20;
                break;
            case 5:
                scoring.threeOfAKind[0] += 20;
                scoring.threeOfAKind[1] += 20;
        }

        //removes shop and starts next round
        shop.classList.add("shopGoAway");
        startGame();
    });
}

//add restart buttons
for (let i = 0; i < redo.length; i++){
    redo[i].addEventListener("click", function(){
        startGame();
    }
)};













