import { filter, transcribeToBaybayin, baybayinSafe, isBaybayinSafe } from './baybayin.js';
import { createIssue } from "./issue.js";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const startBtn = document.querySelector('button');
const outputBox = document.getElementById('output');

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
        startBtn.textContent = 'Listening...';
    }

    recognition.start();
}


recognition.onresult = (event) => {
    if (event.results[0].isFinal) {
        recognition.stop();
        startBtn.disabled = false;
        startBtn.textContent = 'Start';
        startBtn.classList.toggle('listening');
        outputBox.classList.toggle('baybayin');
        const originalTranscript = event.results[0][0].transcript;
        const filteredTranscript = filter(originalTranscript);
        const baybayinSafeTranscript = baybayinSafe(filteredTranscript);
        outputBox.textContent = baybayinSafeTranscript;
        if (isBaybayinSafe(baybayinSafeTranscript)) {
            outputBox.textContent = transcribeToBaybayin(baybayinSafeTranscript);
        } else {
            createIssue(baybayinSafeTranscript.match(/[a-z]*j[a-z]*/gi));
            createIssue(baybayinSafeTranscript.match(/[a-z]*c[aeiou][a-z]*/gi));
        }
    }
    else {
        outputBox.textContent = event.results[0][0].transcript;
    }
}
outputBox.textContent = transcribeToBaybayin('rajah jose jossie juan yopaj');