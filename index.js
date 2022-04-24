import { filter, transcribeToBaybayin, baybayinSafe, isBaybayinSafe } from './baybayin.js';
import { createIssue, displayStates } from "./status.js";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

try {
    recognition = new SpeechRecognition();
} catch (error) {
    const modal = document.getElementById('modal');
    modal.parentNode.addEventListener('click', closeModal);
    modal.children[0].addEventListener('click', closeModal);
    modal.parentNode.style.display = 'block';
}

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

function closeModal(event) {
    if (event.target === modal.children[0] || event.target === modal.parentNode)
        modal.parentNode.style.display = 'none';
}


export { originalTranscript, filteredTranscript, baybayinSafeTranscript };