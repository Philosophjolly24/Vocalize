let textarea = document.querySelector('textarea'),
  fileNameInput = document.querySelector('.file-name input'),
  selectMenu = document.querySelector('.save-as select'),
  saveBtn = document.querySelector('.save-btn');

document.getElementById('output').disabled = true;

let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.continuous = true;

recognition.onresult = function(event) {
let finalTranscript = '';
let interimTranscript = '';
for (let i = event.resultIndex; i < event.results.length; ++i) {
if (event.results[i].isFinal) {
  finalTranscript += event.results[i][0].transcript;
} else {
  interimTranscript += event.results[i][0].transcript;
}
}
document.getElementById('output').innerHTML = finalTranscript;
if (interimTranscript) {
document.getElementById('output').innerHTML += interimTranscript;
}
};

function ChangePunctuation(text) {
  var replacements = {
    'comma': ',',
    'period': '.',
    'full stop': '.',
    'question mark': '?',
    'exclamation mark': '!',
    'colon': ':',
    'semicolon': ';',
    'ellipsis': '...',
    'hyphen': '-',
    'dash': '—',
    'single quote': "'",
    'double quote': '"',
    'open parenthesis': '(',
    'open bracket': '(',
    'close parenthesis': ')',
    'close bracket': ')',
    'open bracket': '[',
    'close bracket': ']',
    'open brace': '{',
    'close brace': '}'
  };

  // Create a regular expression pattern for matching recognized words
  var pattern = new RegExp(Object.keys(replacements).join('|'), 'g');

  // Replace recognized words with corresponding punctuation marks
  var newText = text.replace(pattern, function(match) {
    return replacements[match];
  });

  return newText;
}


recognition.onerror = function(event) {
  console.error('Speech recognition error detected: ' + event.error);
};

recognition.onend = function() {
  document.getElementById('startButton').disabled = false;
  document.getElementById('output').disabled = false;
  document.getElementById('stopButton').disabled = true;
};

document.getElementById('startButton').addEventListener('click', function() {
  recognition.start();
  document.getElementById('startButton').disabled = true;
  document.getElementById('startButton').innerHTML = "Listening...";
  document.getElementById('stopButton').disabled = false;
});

document.getElementById('resetButton').addEventListener('click', function() {
  location.reload();


});

document.getElementById('stopButton').addEventListener('click', function() {
  recognition.stop();
  document.getElementById('startButton').innerHTML = "Start Recording";
  finalDocument = ChangePunctuation(textarea.value);
  textarea.value = finalDocument;
});


saveBtn.addEventListener("click" , () => {
  const blob = new Blob([textarea.value],{type:selectMenu.value});
  const fileURL = URL.createObjectURL(blob);
  const link  = document.createElement('a');
  link.download = fileNameInput.value;
  link.href = fileURL;
  link.click();
  console.log(blob);
  fileNameInput.value ="";

});

