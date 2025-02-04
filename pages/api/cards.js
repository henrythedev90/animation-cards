// pages/api/cards.js
import axios from "axios";

const DECK_API_URL = "https://deckofcardsapi.com/api/deck";

export default async function handler(req, res) {
  const { method, query } = req;

  // Initialize deck (if it's a new deck)
  if (method === "GET" && query.action === "new") {
    try {
      const response = await axios.get(
        `${DECK_API_URL}/new/shuffle/?deck_count=1`
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Error creating new deck" });
    }
  }

  // Shuffle deck
  if (method === "GET" && query.action === "shuffle" && query.deckId) {
    try {
      const response = await axios.get(
        `${DECK_API_URL}/${query.deckId}/shuffle/`
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Error shuffling deck" });
    }
  }

  // Draw card
  if (method === "GET" && query.action === "draw" && query.deckId) {
    try {
      const response = await axios.get(
        `${DECK_API_URL}/${query.deckId}/draw/?count=1`
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: "Error drawing card" });
    }
  }
}
