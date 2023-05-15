(function mainModule() {
  player1 = {};
  player2 = {};
  function playerCreate(sign, name) {
    return { sign, name };
  }
  function addPlayerButtonHandler() {
    const sign = this.dataset.sign;
    const name = document.querySelector(`input[data-sign='${sign}']`).value;
    if (player1.sign) {
      player2 = playerCreate(sign, name);
    } else player1 = playerCreate(sign, name);
    console.log(player1, player2);
  }

  const addPlayerButtons = document.querySelectorAll('.addPlayer');
  addPlayerButtons.forEach((button) => {
    button.addEventListener('click', addPlayerButtonHandler);
  });
})();
