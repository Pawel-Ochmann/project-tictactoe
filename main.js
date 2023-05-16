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

  function addFirstBorder() {
    const fieldset = document.querySelector('#x');
    fieldset.classList.add('itsYourTurn');
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
    if (sign === 'x') {
      addFirstBorder();
    }
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
  const wins = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 8, 5],
    [3, 6, 9],
    [3, 5, 7],
    [1, 5, 9],
  ];
  function checkWin() {
    
  }

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
    this.classList.remove('fieldActive');
    this.removeEventListener('click', makeMove);
    mainModule.toggleTurn();
  }

  for (field of fields) {
    field.addEventListener('click', makeMove);
    field.classList.add('fieldActive');
  }
})();
