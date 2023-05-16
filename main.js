const mainModule = (function () {
  let player1 = {};
  let player2 = {};
  function playerCreate(sign, name) {
    let turn = true;
    if (sign === 'o') {
      turn = false;
    }
    return { sign, name, turn };
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

  function toggleTurn() {
    player1.turn = !player1.turn;
    player2.turn = !player2.turn;
    const fieldset = document.querySelectorAll('fieldset');
    fieldset.forEach((f) => {
      f.classList.toggle('itsYourTurn');
    });
  }

  function players() {
    return [player1, player2];
  }

  return {
    players,
    toggleTurn,
  };
})();

const gameModule = (function () {
  const fields = Array.from(document.querySelectorAll('.field'));

  function returnSign() {
    let sign = '';
    const players = mainModule.players();
    for (player of players) {
      if (player.turn === true) {
        sign = player.sign;
      }
    }
    return sign;
  }

  function makeMove() {
    this.innerHTML = returnSign();
    mainModule.toggleTurn();
  }

  for (field of fields) {
    field.addEventListener('click', makeMove);
  }
})();
