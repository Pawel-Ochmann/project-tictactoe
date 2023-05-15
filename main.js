(function mainModule() {
  player1 = {};
  player2 = {};
  function playerCreate(sign, name) {
    return { sign, name };
  }
  function addPlayerButtonHandler() {
    const sign = this.dataset.sign;
    const box = document.querySelector(`div[data-sign='${sign}']`);
    const name = document.querySelector(`input[data-sign='${sign}']`).value;
    if (player1.sign) {
      player2 = playerCreate(sign, name);
    } else player1 = playerCreate(sign, name);
    box.innerHTML = name;
    box.classList.add('playerCreated');
  }

  const addPlayerButtons = document.querySelectorAll('.addPlayer');
  addPlayerButtons.forEach((button) => {
    button.addEventListener('click', addPlayerButtonHandler);
  });
})();
