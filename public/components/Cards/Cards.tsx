"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "./Cards.module.css";

interface Card {
  image: string;
  value: string;
  suit: string;
}

const Card = () => {
  const [deckId, setDeckId] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isDealing, setIsDealing] = useState(false); // For the card dealing animation
  const [card, setCard] = useState<Card | null>(null);

  // Set up deck on component mount
  useEffect(() => {
    const createDeck = async () => {
      try {
        const response = await axios.get("/api/cards?action=new");
        setDeckId(response.data.deck_id);
      } catch (error) {
        console.error("Error creating deck:", error);
      }
    };

    createDeck();
  }, []);

  // Shuffle the deck
  const shuffleDeck = async () => {
    if (!deckId) return;
    setIsShuffling(true);
    setIsDealing(false); // Reset dealing animation during shuffle

    try {
      await axios.get(`/api/cards?action=shuffle&deckId=${deckId}`);
      setTimeout(() => {
        setIsShuffling(false); // End shuffle animation after 2s
      }, 2000);
    } catch (error) {
      console.error("Error shuffling deck:", error);
      setIsShuffling(false);
    }
  };

  // Draw a card after shuffling
  const drawCard = async () => {
    if (!deckId) return;
    setIsDealing(true); // Trigger card dealing animation
    try {
      const response = await axios.get(
        `/api/cards?action=draw&deckId=${deckId}`
      );
      const drawnCard = response.data.cards[0];
      setCard(drawnCard);

      // Reset the animation after the deal is complete
      setTimeout(() => {
        setIsDealing(false); // End the card dealing animation after 1s (duration of throw)
      }, 1000);
    } catch (error) {
      console.error("Error drawing card:", error);
      setIsDealing(false);
    }
  };

  return (
    <div className={classes.cardContainer}>
      <div
        className={`${classes.card} ${isShuffling ? classes.shuffling : ""} ${
          isDealing ? classes.dealing : ""
        }`}
      >
        {card ? (
          <div className={classes.cardFront}>
            <img src={card.image} alt={`${card.value} of ${card.suit}`} />
          </div>
        ) : (
          <div className={classes.cardBack}>
            <img
              src="https://deckofcardsapi.com/static/img/back.png"
              alt="Card Back"
            />
          </div>
        )}
      </div>
      <div className={classes.buttons}>
        <button onClick={shuffleDeck} disabled={isShuffling}>
          Shuffle Deck
        </button>
        <button onClick={drawCard}>Draw Card</button>
      </div>
    </div>
  );
};

export default Card;
