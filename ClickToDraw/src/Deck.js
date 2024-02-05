import React, {useState, useEffect, useRef } from "react";
import Card from "./Card";
import axios from "axios";

const DECK_URL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"

function Deck(){

    const [deck, setDeck] = useState(null);
    const [shuffle, setShuffle] = useState(false);
    const drawRef = useRef();

    useEffect(function fetchDeck(){
        async function deckRequest(){
            const deckResult = await axios.get(DECK_URL);
            setDeck(deckResult.data);
        }
        deckRequest();
    }, [shuffle]);

    const [card, setCard] = useState(null);

    const [drawing, setDrawing] = useState(false);

    useEffect(function startDraw(){
            async function fetchNewCard(){
            const cardResult = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`);
            setCard(cardResult.data)
            }

    
            if(drawing && !drawRef.current){
                drawRef.current = setInterval(fetchNewCard, 1000);
            } else if (!drawing && drawRef.current){
                stopDraw()
            }

            const stopDraw = () => {
                clearInterval(drawRef.current)
                drawRef.current = false
            }

            return stopDraw
            }, [drawing, deck]);

    function reshuffle(){
        setShuffle(!shuffle)
        setCard(null)
        setDrawing(false)
    }

    function toggleDraw() {
        setDrawing(!drawing)
    }
    
    const shuffleBtn = card ? <button onClick={reshuffle}>Shuffle Deck</button> : <button onClick={reshuffle} disabled>Shuffle Deck</button>
    return (
        <>
        <p>Click button to draw a card!</p>
        {card && card.remaining !== 0 ? <Card value={card.cards[0].value} suit={card.cards[0].suit} /> : null}
        {card && card.remaining === 0 ? <p>Error: No more cards left!</p> : null}
        <button onClick={toggleDraw}>{drawing ? "Stop" : "Start"}Draw</button>
        {shuffleBtn}
        </>
    )
    }

export default Deck;