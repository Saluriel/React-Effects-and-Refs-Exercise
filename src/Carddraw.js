import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";

const CreateDeck = () => {
    const [deck, setDeck] = useState(null);
    const [card, setCard] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timer = useRef(null);

    // create the deck id when the page first loads
    useEffect(() => {
        async function makeDeck() {
            // get the id of the deck and set it as the deck state
            let res = await axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            setDeck(res.data.deck_id)
        }
        // make the deck when the page loads
        makeDeck()
    }, [])

    // draw a card
    useEffect(() => {
        async function drawCard() {
            // set the deckId
            let deckId = deck;
            try {
                // draw a card
                let res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw`)
                // if there's none left turn off auto draw and alert that there aren't anymore cards
                if (res.data.remaining === 0) {
                    setAutoDraw(false);
                    alert("no more cards!")
                }
                // set card to the first card drawn
                const card = res.data.cards[0]
                // set the card in state, get the ID name and image src to pass to the Card.js
                setCard(c => [...c, {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    src: card.image
                }])
                // catch errors
            } catch (e) {
                alert(e)
            }
        }

        // if autodraw is on and there's not already a timer going...
        if (autoDraw && !timer.current) {
            // every second draw a card
            timer.current = setInterval(async () => {
                await drawCard();
            }, 1000)
        }

        return () => {
            // cancel the timer
            clearInterval(timer.current);
            // set the current time to null
            timer.current = null;
        };
        // updates when the deck updates, or the state of autoDraw changes at all
    }, [deck, setAutoDraw, autoDraw])

    // set the auto draw up so when you click the button it draws every second, or stops drawing every second
    const clickDrawButton = () => {
        setAutoDraw(auto => !auto)
    }

    // render cards as they're drawn
    // map over each card and pull the id, name, image src to send to Card.
    const allCards = card.map(c => (
        <Card key={c.id} name={c.name} src={c.src} />
    ))


    // return the HTML to show the button and cards
    return (
        <div className="Deck">
            {deck ?
                <button
                    className="deckButton"
                    onClick={clickDrawButton}>
                    {autoDraw ? "AAAAAA STOP" : "GOGOGOGOGOGO!!!!!!!!"}
                </button> : "Loading..."
            }
            <div className="deckCards">{allCards}</div>


        </div >
    )

}

export default CreateDeck;