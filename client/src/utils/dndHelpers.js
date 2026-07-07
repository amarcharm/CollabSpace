// Given the cards array and the drop index, calculate what position value to assign
export function calculateNewPosition(cards, destinationIndex) {
  const before = cards[destinationIndex - 1];
  const after = cards[destinationIndex];

  if (!before && !after) return 1000;                          // empty list
  if (!before) return after.position / 2;                     // dropped at top
  if (!after) return before.position + 1000;                  // dropped at bottom
  return (before.position + after.position) / 2;              // dropped between two cards
}

// Rebalance positions if they get too close (floating point precision limit)
export function needsRebalance(cards) {
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].position - cards[i - 1].position < 0.001) return true;
  }
  return false;
}

export function rebalancePositions(cards) {
  return cards.map((card, index) => ({ ...card, position: (index + 1) * 1000 }));
}