const mainModule = (function () {
  let player1 = {};
  let player2 = {};

  function checkForAi() {
    const bothPlayers = players();
    if (player1.name && player2.name) {
      for (player of bothPlayers) {
        if (player.turn === true && player.level === 'easy') {
          return aiModule.makeMove();
        }
      }
    }
  }

  function playerCreate(sign, name, level) {
    let turn = true;
    if (sign === 'o') {
      turn = false;
    }
    return { sign, name, turn, level };
  }

  function addFirstBorder() {
    const fieldset = document.querySelector('#x');
    fieldset.classList.add('itsYourTurn');
  }

  function addPlayerButtonHandler() {
    const sign = this.dataset.sign;
    const box = document.querySelector(`div[data-sign='${sign}']`);
    const name = document.querySelector(`input[data-sign='${sign}']`).value;
    const level = document.querySelector('select').value;
    if (player1.sign) {
      player2 = playerCreate(sign, name);
    } else player1 = playerCreate(sign, name, level);
    box.innerHTML = name;
    box.classList.add('playerCreated');
    if (sign === 'x') {
      addFirstBorder();
    }
    checkForAi();
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
    checkForAi();
  }

  function players() {
    return [player1, player2];
  }

  return {
    players,
    toggleTurn,
  };
})();

const aiModule = (function () {
  function getRandomField(length) {
    return Math.floor(Math.random() * length);
  }

  function levelEasy() {
    const emptyFields = gameModule.fields.filter((e) => {
      return e.innerHTML === '';
    });
    return getRandomField(emptyFields.length);
  }
  function makeMove() {
    const field = gameModule.fields[levelEasy()];
    gameModule.makeMove.call(field);
  }
  return { makeMove };
})();

const gameModule = (function () {
  const fields = Array.from(document.querySelectorAll('.field'));
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8],
  ];
  function checkWin() {
    let win = false;
    const winCondition = [returnSign(), returnSign(), returnSign()];
    const values = fields.map((e) => {
      return e.innerHTML;
    });
    for (array of wins) {
      const line = [values[array[0]], values[array[1]], values[array[2]]];
      if (line.toString() === winCondition.toString()) {
        win = true;
      }
    }
    return win;
  }

  function displayWinner() {
    const box = document.querySelector('.board');
    box.classList.add('finalBoard');
    box.innerHTML = `The winner is ${returnSign()} player!`;
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

    if (checkWin() === true) {
      displayWinner();
    } else mainModule.toggleTurn();
  }

  for (field of fields) {
    field.addEventListener('click', makeMove);
    field.classList.add('fieldActive');
  }

  return {
    fields,
    returnSign,
    checkWin,
    displayWinner,
    makeMove,
  };
})();
