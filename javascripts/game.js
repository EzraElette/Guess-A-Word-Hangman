const randomWord = (function () {
  let words = [
    "828384776795",
    "71698473687182",
    "85678783737971",
    "82738472716673",
    "69787969776772",
  ].sort(() => Math.random() - 0.5);

  function decrypt(str) {
    let chars = str.match(/\d{2}/g);
    chars = chars.map((d) => String.fromCodePoint((d ^ 6) | 0o40));
    return chars.join("");
  }

  return function randomWord() {
    let encryptedWord = words.splice(0, 1)[0];

    if (encryptedWord) {
      return decrypt(encryptedWord);
    }
  };
})();

function Game() {
  this.chosenWord = null;
  this.incorrectGuesses = 0;
  this.guesses = [];
  this.maxIncorrectGuesses = 6;
}

Game.prototype.chooseWord = function chooseWord() {
  return (this.chosenWord =
    randomWord() || showMessage("Sorry, I've ran out of words!"));
};

Game.prototype.resetGuesses = function resetGuesses() {
  $("#guesses span").remove();
  this.guesses = [];
};

Game.prototype.resetIncorrectGuesses = function resetIncorrectGuesses() {
  $("#apples")[0].className = "";
  this.incorrectGuesses = 0;
};

Game.prototype.createBlanks = function createBlanks() {
  $("#spaces span").remove();
  $("#spaces").append(`${"<span></span>".repeat(this.chosenWord.length)}`);
};

Game.prototype.addGuess = function addGuess(letter) {
  $("#guesses").append(`<span>${letter}</span>`);
};

Game.prototype.updateGuesses = function updateGuesses(letter) {
  letter = letter.toUpperCase();
  if (this.guesses.includes(letter)) return;

  this.guesses.push(letter);

  this.addGuess(letter);
};

Game.prototype.updateWord = function updateWord(letter) {
  Array.from($("#spaces span")).forEach((space, index) => {
    if (letter === this.chosenWord[index]) {
      $(space).text(letter);
    }
  });
};

Game.prototype.terminatingCondition = function terminatingCondition() {
  if (this.incorrectGuesses === this.maxIncorrectGuesses) {
    return "loss";
  } else if (
    [...this.chosenWord.toUpperCase()].every((letter) =>
      this.guesses.includes(letter)
    )
  ) {
    return "win";
  }
  return false;
};

Game.prototype.endGame = function endGame(status) {
  switch (status) {
    case "win":
      showMessage("You win");
      break;
    case "loss":
      showMessage("You lose");
  }
  $("#replay").show();
  $(document).off("keypress");
};

Game.prototype.guess = function guess(letter) {
  if (this.chosenWord.includes(letter)) {
    this.updateWord(letter);
  } else {
    if (!this.guesses.includes(letter.toUpperCase())) {
      this.incorrectGuesses++;
    }
    $("#apples")[0].className = `guess_${this.incorrectGuesses}`;
  }

  this.updateGuesses(letter);

  let gameOver = this.terminatingCondition();
  if (gameOver) {
    this.endGame(gameOver);
  }
};

Game.prototype.reset = function reset() {
  $("#replay").hide();
  this.resetGuesses();
  this.resetIncorrectGuesses();
  this.chooseWord();
  this.createBlanks();
  clearMessage();
  $(document).off("keypress");
  $(document).keypress((function (event) {
    if (event.keyCode < 97 || event.keyCode > 122) return;

    this.guess(event.key);
  }).bind(this));
};

function showMessage(message) {
  $("#message").text(message);
}

function clearMessage() {
  showMessage("");
}

$(function () {
  let game = new Game();
  game.reset();

  $("#replay").click(function (event) {
    game.reset();
  });
});
