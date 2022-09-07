/** Sets the players' bomb count to a specific amount. */
export function setBombs(player: EntityPlayer, amount: number): void {
  player.AddBombs(amount - player.GetNumBombs());
}

/** Sets the players' key count to a specific amount. */
export function setKeys(player: EntityPlayer, amount: number): void {
  player.AddKeys(amount - player.GetNumKeys());
}

/** Sets the players' coin count to a specific amount. */
export function setCoins(player: EntityPlayer, amount: number): void {
  player.AddCoins(amount - player.GetNumBombs());
}
