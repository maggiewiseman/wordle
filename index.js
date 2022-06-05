
const Helpers = {
  intersection(arr1, arr2) {
    return arr1.filter(x => arr2.includes(x));
  },
  difference(arr1, arr2) {
    return arr1.filter(x => !arr2.includes(x));
  },
  equal(arr1, arr2) {
    arr1.length === arr2.length &&
    arr1.every(function (element) {
      return arr2.includes(element);
    });
  }
}

let app = {
  dictionary: [
    'tooth',
    'chomp', 
    'roast', 
    'meter', 
    'stare', 
    'whale',
    'crown',
    'bayou',
    'trick',
    'cheat',
    'crick',
    'brook',
    'brick',
    'money',
    'honey',
    'paper',
    'trick',
    'quick',
    'photo',
    'clomp',
    'clump',
    'trump',
    'final',
    'payer',
    'pound',
    'crowd',
    'quite',
    'quiet',
    'quell',
    'smell',
    'treat',
    'doily',
    'steam',
    'waste',
    'fling',
    'drink',
    'click',
    'oxide',
    'vapor',
    'bring',
    'dream',
    'choir',
    'sugar',
    'sweet',
    'clown',
    'rough',
    'asset',
    'scowl',
    'opine',
    'scoop',
    'sling',
    'smokey',
    'showy',
    'lunch',
    'album'
  ],
  
  currentWord: "",
  submittedWordCount: 0,
  currentRowDomChildren: null,
  checkWordBtn: null,
  isLetter: new RegExp(/[aA-zZ]/),
  gameAnswer: '',

  intialize() {
    this.setGameAnswer()
    document.addEventListener('keyup', this.handleLetterSubmission, false);
    this.checkWordBtn = document.getElementById('checkWordBtn')
    this.checkWordBtn.addEventListener('click', this.handleWordSubmission, false);
    this.currentRowDomChildren = document.getElementsByClassName('word')[0].children;

  },
    
  handleLetterSubmission: (event) => {      
    if (event.key.toLowerCase() == 'backspace' && app.currentWord.length > 0) {
      let index = app.currentWord.length - 1;
      app.currentRowDomChildren[index].innerHTML = "";
      app.currentWord = app.currentWord.substr(0, app.currentWord.length - 1);
    } else if (app.currentWord.length < 5 && app.isLetter.test(event.key) && event.key.length === 1) {
      let index = app.currentWord.length;
      app.currentRowDomChildren[index].innerHTML = event.key
      app.currentWord += event.key

    }
    app.checkWordLength()
  },

  handleWordSubmission(event) {
    // if (!app.wordIsInDictionary()) { 
    //   alert(`${app.currentWord} is not in my dictionary`);
    //   return; 
    // }

    let currentWordHash = app.getLetterCountHash(app.currentWord);
    
    let result = Array(5);
    for(const letter in currentWordHash) {
      if (app.gameAnswerHash[letter]) {
        app.handlePotentialMatches(currentWordHash, letter, result)
      } else {
        let indexes = currentWordHash[letter];
        indexes.forEach(index => {
          result[index] = "INCORRECT"
        })
      }
    }
    
    console.log(result)
    app.displayResult(result)

    if (app.currentWord === app.gameAnswer) {
      alert('You win!!')
    }

    app.setupForNextWord();
    return result;
  },

  handlePotentialMatches(currentWordHash, letter, result) {
    let currWordIndexes = currentWordHash[letter];
    console.log(currentWordHash)
    let answerIndexes = app.gameAnswerHash[letter];

    if (currWordIndexes.length == answerIndexes.length) {
      //2,4 1,3
      //2,4, 2,3
      //2,4  1,4
      currWordIndexes.forEach(index => {
        result[index] =  answerIndexes.includes(index) ? "CORRECT" : "WRONG_PLACE"
      })
    } else if (currWordIndexes.length > answerIndexes.length) {
      let matchesFound = 0;
      let nonMatchingIndexes = [];
      currWordIndexes.forEach(index => {
        //1, guessed 2,3
        if (answerIndexes.includes(index)) {
          result[index] = "CORRECT";
          matchesFound += 1;
        } else {
          nonMatchingIndexes.push(index);
          result[index] = "INCORRECT";
        }
          
      })
      if ( answerIndexes.length > matchesFound) {
        let numberToUpdate = answerIndexes.length - matchesFound;
        for(var i = 0; i < numberToUpdate; i++) {
          result[nonMatchingIndexes[i]] = "WRONG_PLACE"
        }
      }

    } else {
      //more letters than guessed
      //2,4 only guessed 1
      //2,4 only guessed 2 or 4
      currWordIndexes.forEach(index => {
        result[index] =  answerIndexes.includes(index) ? "CORRECT" : "WRONG_PLACE"
      })
    }
  },
  
  wordIsInDictionary() {
    console.log('this', this);
    return this.dictionary.indexOf(this.currentWord) > -1;
  },

  displayResult(result) {
    result.forEach((location, index) => {
      switch (location) {
        case 'WRONG_PLACE': 
          app.markLetterPresent(index);
          break;
        case 'CORRECT': 
          app.markLetterCorrect(index);
          break;
        case 'INCORRECT': 
          app.markLetterWrong(index);
          break;
      }
    })
  },

  markLetterCorrect(index) {
    this.currentRowDomChildren[index].className += ' correct';
  },

  markLetterPresent(index) {
    this.currentRowDomChildren[index].className += ' present';
  },

  markLetterWrong(index) {
    this.currentRowDomChildren[index].className += ' wrong';
  },

  setupForNextWord() {
    if (this.submittedWordCount < 5) {
      this.submittedWordCount += 1;
      this.currentRowDomChildren = document.getElementsByClassName('word')[this.submittedWordCount].children;
      this.currentWord = "";
      this.checkWordBtn.setAttribute('disabled', '');
    }
  },

  checkWordLength() {
    console.log(this.currentWord.length)
    if (this.currentWord.length == 5) {
      this.checkWordBtn.removeAttribute('disabled');
    } else {
      this.checkWordBtn.setAttribute('disabled', '');
    }
  },

  setGameAnswer(testWord=null) {
    this.gameAnswer = testWord ? testWord : this.dictionary[Math.floor(Math.random() * this.dictionary.length)]
    this.gameAnswerHash = this.getLetterCountHash(this.gameAnswer);
  },

  getLetterCountHash(word) {
    let wordArr = word.split("");
    let wordHash = {}

    wordArr.forEach((letter, index) => {
      if (wordHash[letter]) {
        wordHash[letter].push(index)
      } else {
        wordHash[letter] = [index];
      }
    })

    return wordHash
  },

  test(guess, answer, expectedResult) {
    app.currentWord = guess;
    app.setGameAnswer(answer);
    let result = app.handleWordSubmission();
    return Helpers.equal(result, expectedResult)
  }
}

app.intialize();

  // app.test('scoop', 'opine', ['INCORRECT', 'INCORRECT', 'WRONG_PLACE', 'INCORRECT', 'WRONG_PLACE']);
  // app.test('there', 'stare', ['WRONG_PLACE', 'INCORRECT', 'INCORRECT', 'CORRECT', 'WRONG_PLACE']);




