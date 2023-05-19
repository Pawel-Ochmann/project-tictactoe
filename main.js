const mainModule = (function () {
  let player1 = {};
  let player2 = {};

  function checkForAi() {
    const bothPlayers = players();
    if (player1.name && player2.name) {
      for (player of bothPlayers) {
        if (player.turn === true && player.level === 'easy') {
          return aiModule.makeMove();
        } else if (player.turn === true && player.level === 'average') {
          return aiModule.makeMoveAverage();
        } else if (player.turn === true && player.level === 'hard') {
          return aiModule.makeMoveHard();
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
      player2 = playerCreate(sign, name, level);
    } else player1 = playerCreate(sign, name, level);
    box.innerHTML = name;
    box.classList.add('playerCreated');
    if (sign === 'x') {
      addFirstBorder();
    }
    setTimeout(checkForAi, 1000);
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
    setTimeout(checkForAi, 1000);
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
  function getEmptyFields() {
    const fields = gameModule.fields;
    const emptyFields = [];
    for (const field of fields) {
      if (field.innerHTML === '') {
        emptyFields.push(fields.indexOf(field));
      }
    }
    return emptyFields;
  }

  function getRandomField(emptyFields) {
    const random = Math.floor(Math.random() * emptyFields.length);
    return emptyFields[random];
  }

  function levelEasy() {
    return getRandomField(getEmptyFields());
  }

  function checkLine(array, sign) {
    let testString = '';
    const double = array.filter((e) => {
      return e.innerHTML !== '';
    });
    if (double.length === 2) {
      testString = double[0].innerHTML + double[1].innerHTML;
    }

    if (testString === sign + sign) return true;
    else return false;
  }

  function oneMark(line) {
    let mark = 0;
    for (const field of line) {
      if (field.innerHTML === returnSignEnemy()) {
        mark = 0;
        break;
      } else if (field.innerHTML === gameModule.returnSign()) {
        mark++;
      }
    }
    if (mark === 1) {
      return line.filter((e) => {
        return e.innerHTML != returnSign();
      });
    } else return false;
  }

  function checkTwoLines(lines) {
    const field = false;
    const markOnLine = [];
    for (const line of lines) {
      if (oneMark(line)) {
        markOnLine.push(oneMark());
      }
    }
    const doubleField = [];
    for (const array of markOnLine) {
      if (doubleField.includes(array[0])) {
        field = array[0];
        break;
      } else if (doubleField.includes(array[0])) {
        field = array[1];
        break;
      } else doubleField.push(array[0], array[1]);
    }
    return field;
  }

  function levelAverage() {
    let field = false;
    const lines = [];
    for (const array of gameModule.wins) {
      const line = [
        gameModule.fields[array[0]],
        gameModule.fields[array[1]],
        gameModule.fields[array[2]],
      ];
      lines.push(line);
    }

    for (const line of lines) {
      if (checkLine(line, gameModule.returnSign())) {
        if (field) {
          break;
        }
        for (element of line) {
          if (element.innerHTML === '') {
            field = element;
            break;
          }
        }
      }
    }
    for (const line of lines) {
      if (checkLine(line, gameModule.returnSignEnemy())) {
        if (field) {
          break;
        }
        for (element of line) {
          if (element.innerHTML === '') {
            field = element;
            break;
          }
        }
      }
    }
    return field;
  }

  function levelHard() {
    let field = false;
    const lines = [];
    for (const array of gameModule.wins) {
      const line = [
        gameModule.fields[array[0]],
        gameModule.fields[array[1]],
        gameModule.fields[array[2]],
      ];
      lines.push(line);
    }

    field = checkTwoLines(lines);
    return field;
  }

  function makeMove() {
    const field = gameModule.fields[levelEasy()];
    gameModule.makeMove.call(field);
  }

  function makeMoveAverage() {
    let field = levelAverage();
    if (field) {
      gameModule.makeMove.call(field);
      return;
    } else field = gameModule.fields[levelEasy()];
    gameModule.makeMove.call(field);
    return;
  }

  function checkEmpty(...args) {
    const field = false;
    for (const arg of args) {
      if (arg.innerHTML === '') field = arg;
      break;
    }
    return field;
  }
  function checkFull(...args) {
    const full = false;
    for (const arg of args) {
      if (arg.innerHTML !== '') field = true;
      break;
    }
    return full;
  }

  function makeMoveHard() {
    const fields = gameModule.fields;
    const emptyFields = getEmptyFields();
    if (levelAverage()) {
      return gameModule.makeMove.call(levelAverage());
      //round 1 player X
    } else if (emptyFields.length === 9) {
      return gameModule.makeMove.call(fields[0]);
      //round 3 X
    } else if (emptyFields.length === 7) {
      if (checkFull(fields[1], fields[3], fields[5], fields[7]))
        return gameModule.makeMove.call(fields[4]);
      else if (checkFull(fields[2], fields[6], fields[8])) {
        return gameModule.makeMove.call(checkEmpty(fields[2], fields[6]));
      } else if (checkFull(fields[4])) {
        return gameModule.makeMove.call(checkEmpty(fields[8]));
      }
      // round 2 player O
      else if (emptyFields.length === 8) {
        if (!checkFull(fields[4])) {
          return gameModule.makeMove.call(fields[4]);
        } else if (checkFull(fields[4])) {
          return gameModule.makeMove.call(fields[0]);
        }
      }
      // round 4 player o
      else if (emptyFields.length === 6) {
        if (!checkEmpty(fields[0], fields[4], fields[8])) {
          return gameModule.makeMove.call(fields[1]);
        }
      }
    } else return gameModule.makeMove.call(levelHard());
  }
  return { makeMove, makeMoveAverage, makeMoveHard };
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
        break;
      }
    }
    return sign;
  }

  function returnSignEnemy() {
    let sign = '';
    const players = mainModule.players();
    for (player of players) {
      if (player.turn === false) {
        sign = player.sign;
        break;
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
    returnSignEnemy,
    checkWin,
    displayWinner,
    makeMove,
    wins,
  };
})();
