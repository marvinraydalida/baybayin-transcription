import { filter, transcribeToBaybayin, baybayinSafe, isBaybayinSafe } from './baybayin.js';
import { createIssue, displayStates } from "./status.js";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const startBtn = document.querySelector('button');
const outputBox = document.getElementById('output');
let originalTranscript;
let filteredTranscript;
let baybayinSafeTranscript;

recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'fil-PH';


startBtn.addEventListener('click', listenCallback);

function listenCallback(event) {
    const issueContainer = document.querySelector('#status-container');
    issueContainer.innerHTML = '';

    startBtn.classList.toggle('listening');
    outputBox.classList.toggle('baybayin');
    outputBox.textContent = '';
    if (startBtn.classList.contains('listening')) {
        startBtn.disabled = true;
        startBtn.textContent = 'N A K I K I N I G . . .';
    }

    recognition.start();
}


recognition.onresult = (event) => {
    if (event.results[0].isFinal) {
        recognition.stop();
        startBtn.disabled = false;
        startBtn.textContent = 'S I M U L A N';
        startBtn.classList.toggle('listening');
        outputBox.classList.toggle('baybayin');
        originalTranscript = event.results[0][0].transcript;
        filteredTranscript = filter(originalTranscript);
        baybayinSafeTranscript = baybayinSafe(filteredTranscript);
        outputBox.textContent = baybayinSafeTranscript;
        if (isBaybayinSafe(baybayinSafeTranscript)) {
            outputBox.textContent = transcribeToBaybayin(baybayinSafeTranscript);
            displayStates();
        } else {
            createIssue(baybayinSafeTranscript.match(/[a-z]*j[a-z]*/gi));
            createIssue(baybayinSafeTranscript.match(/[a-z]*c[ei][a-z]*/gi));
        }
    }
    else {
        outputBox.textContent = event.results[0][0].transcript;
    }
}

export { originalTranscript, filteredTranscript, baybayinSafeTranscript };