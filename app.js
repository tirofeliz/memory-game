function init() {
    var startBtn = document.getElementById("startBtn");
    startBtn.onclick = function () {
        hideStartScreen();
        var game = new Game();
        game.start(
            function () {
                var gameFields = document.getElementsByClassName("game-field");
                for (var i = 0; i < gameFields.length; i++) {
                    var gameField = gameFields[i];
                    gameField.onclick = function () {
                        game.guessField(this.id);
                    }
                }
            }
        );
    };
}

function Game() {
    this.level = getLevelValue();
    this.stats = new Stats();
    this.fields = [];
    this.firstGuess = '';
    this.start = function (callback) {
        showGameScreen();
        addBoard(this.level);
        this.fields = setFields(this.level);
        showBoardFields(this.level, this.fields);
        this.stats.update();
        var that = this;
        var countdownValue = 5;
        var starter = document.getElementById("starterCountdown");
        var countdown = setInterval(function () {
            countdownValue--;
            starter.innerHTML = countdownValue.toString();
        }, 1000);
        setTimeout(function () {
            hideBoardFields(that.level);
            callback();
            that.stats.startTimer();
            clearInterval(countdown);
            starter.setAttribute('class', 'd-none');
        }, 5000);
    };
    this.guessField = function (id) {
        var columnGuess = +id.charAt(0);
        var rowGuess = +id.charAt(1);
        var guessField = document.getElementById(id);
        var guessValue = this.fields[columnGuess][rowGuess];
        var guessFieldText = document.createTextNode(guessValue);

        if (this.firstGuess) {
            if (this.firstGuess != id) {
                var columnFirstGuess = this.firstGuess.charAt(0);
                var rowFirstGuess = this.firstGuess.charAt(1);
                var firstGuessValue = this.fields[columnFirstGuess][rowFirstGuess];
                var firstGuessField = document.getElementById(this.firstGuess);

                if (firstGuessValue == guessValue) {
                    guessField.appendChild(guessFieldText);
                    guessField.onclick = null;
                    firstGuessField.onclick = null;
                    this.stats.points++;
                    this.checkGame();
                }
                else {
                    firstGuessField.innerHTML = '';
                    this.stats.errors++;
                }
                this.firstGuess = '';
            }

        } else {
            this.firstGuess = id;
            guessField.appendChild(guessFieldText);
        }
        this.stats.update();
    };
    this.checkGame = function () {
        if (this.stats.points == this.stats.maxPoints()) {
            hideGameScreen();
            showEndScreen();
            this.stats.setEndStats();
        }
    }
}

function Stats() {
    this.level = getLevelValue();
    this.levelName = getLevelName();
    this.time = 0;
    this.errors = 0;
    this.points = 0;
    this.maxPoints = function () {
        if (this.level) {
            return this.level * this.level / 2;
        }
    };
    this.update = function () {
        var levelName = document.getElementById("levelName");
        levelName.innerHTML = this.levelName;

        var errors = document.getElementById("errorsValue");
        errors.innerHTML = this.errors.toString();

        var points = document.getElementById("pointsValue");
        points.innerHTML = this.points.toString() + "/" + this.maxPoints().toString();

    };
    this.startTimer = function () {
        var that = this;
        setInterval(function () {
            that.time++;
            var time = timeFormat(that.time);
            var clock = document.getElementById("timeValue");
            clock.innerHTML = time;
        }, 1000);
    };
    this.setEndStats = function () {
        var levelName = document.getElementById("endLevelValue");
        levelName.innerHTML = this.levelName;

        var errors = document.getElementById("endErrorsValue");
        errors.innerHTML = this.errors.toString();

        var points = document.getElementById("endPointsValue");
        points.innerHTML = this.points.toString() + "/" + this.maxPoints().toString();

        var time = timeFormat(this.time);
        var clock = document.getElementById("endTimeValue");
        clock.innerHTML = time;
    }
}

function timeFormat(sec_num) {
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

function showBoardFields(level, fields) {
    for (var i = 0; i < level; i++) {
        for (var j = 0; j < level; j++) {
            var field = document.getElementById(i.toString() + j.toString());
            var value = document.createTextNode(fields[i][j]);
            field.appendChild(value);
        }
    }
}

function hideBoardFields(level) {
    for (var i = 0; i < level; i++) {
        for (var j = 0; j < level; j++) {
            var field = document.getElementById(i.toString() + j.toString());
            field.innerHTML = "";
        }
    }
}

function setFields(level) {
    var fieldsOptions = shuffle(generateFieldsOptions(level));
    var fields = [];
    var index = 0;
    for (var i = 0; i < level; i++) {
        var row = [];
        for (var j = 0; j < level; j++) {
            row[j] = fieldsOptions[index];
            index++;
        }
        fields[i] = row;
    }
    return fields;
}

//generuj tablice wszystkich mozliwych liczb na planszy
function generateFieldsOptions(level) {
    var fields = [];
    var options = level * level / 2;
    var index = 0;
    for (var i = 0; i < options; i++) {
        fields[index] = i;
        fields[index + 1] = i;
        index = index + 2;
    }
    return fields;
}

function shuffle(fields) {
    var j, x, i;
    for (i = fields.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = fields[i];
        fields[i] = fields[j];
        fields[j] = x;
    }
    return fields;
}

function hideStartScreen() {
    var startContainer = document.getElementById("startOptions");
    startContainer.setAttribute('class', 'd-none');
}

function showGameScreen() {
    var gameContainer = document.getElementById("gameWrapper");
    gameContainer.classList.remove("d-none");
}

function hideGameScreen() {
    var gameContainer = document.getElementById("gameWrapper");
    gameContainer.setAttribute('class', 'd-none');
}

function showEndScreen() {
    var gameContainer = document.getElementById("endScreen");
    gameContainer.classList.remove("d-none");
}

function getLevelValue() {
    var levelDifficult = document.getElementById('levelDifficult');
    return levelDifficult.options[levelDifficult.selectedIndex].value;
}

function getLevelName() {
    var levelDifficult = document.getElementById('levelDifficult');
    var value = levelDifficult.options[levelDifficult.selectedIndex].value;
    switch (value) {
        case '4':
            return 'easy';
        case '6':
            return 'medium';
        case '8':
            return 'hard';
        case '10':
            return 'expert';
    }
}

function addBoard(level) {
    var gameWrapper = document.getElementById("boardWrapper");
    var board = document.createElement("table");
    for (var tr = 0; tr < level; tr++) {
        var row = document.createElement("tr");
        for (var td = 0; td < level; td++) {
            var column = document.createElement("td");
            column.setAttribute('id', td.toString() + tr.toString());
            column.setAttribute('class', "game-field");
            row.appendChild(column);
        }
        board.appendChild(row);
    }
    gameWrapper.appendChild(board);
}

window.onload = function () {
    init();
};
