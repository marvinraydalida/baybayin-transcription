import { transcribeToBaybayin } from "./baybayin.js";
import { originalTranscript, filteredTranscript, baybayinSafeTranscript } from "./index.js";

const outputBox = document.getElementById('output');
const issueContainer = document.querySelector('#status-container');
const states = document.querySelector('#states');
let baybayinSafeTranscriptAlt;
let prevStateToggled;

export function createIssue(issues) {

    if(issues === null)return;

    const issueTemplate = document.querySelector('template');

    issues = issues.filter((value, index) => issues.indexOf(value) === index);


    for (const issueText of issues) {
        const issue = issueTemplate.content.firstElementChild.cloneNode(true);
        issue.firstElementChild.textContent = issueText;

        const newOption1 = document.createElement("button");
        const newOption2 = document.createElement("button");

        if(/[a-z]*j[a-z]*/gi.test(issueText)){
            newOption1.textContent = issueText.replace(/j/i, 'diy');
            newOption2.textContent = issueText.replace(/j/i, 'h');    
        }

        if(/[a-z]*c[ei][a-z]*/gi.test(issueText)){
            newOption1.textContent = issueText.replace(/c/i, 'k');
            newOption2.textContent = issueText.replace(/c/i, 's');
        }

        newOption1.addEventListener('click', selectOption);
        newOption2.addEventListener('click', selectOption);

        issue.append(newOption1);
        issue.appendChild(newOption2);


        issueContainer.append(issue);
    }

    const dropDownBtn = document.querySelectorAll('.issue i');

    for (const button of dropDownBtn) {
        button.addEventListener('click', expandIssue);
    }
}

export function displayStates(){
    for(const state of states.content.children){
        if(state.classList.contains('original')){
            state.lastElementChild.value = originalTranscript;
        }
        else if(state.classList.contains('filtered')){
            state.lastElementChild.value = filteredTranscript;
        }
        else if(state.classList.contains('safe')){
            state.lastElementChild.value = baybayinSafeTranscript;
            if(baybayinSafeTranscriptAlt !== undefined){
                state.lastElementChild.value = baybayinSafeTranscriptAlt;
                baybayinSafeTranscriptAlt = undefined;
            }
        }
        else if(state.classList.contains('baybayin')){
            state.lastElementChild.value = outputBox.textContent;
        } 
        issueContainer.append(state.cloneNode(true));
        issueContainer.lastElementChild.addEventListener('click', outputState, true);
    }
}

function outputState(event){
    event.stopPropagation();
    let currentStateToggled;
    if(event.target.tagName === 'DIV'){
        if(event.target.classList.contains('baybayin')){
            outputBox.textContent = transcribeToBaybayin(event.target.lastElementChild.value);
        }
        else{
            outputBox.textContent = event.target.lastElementChild.value;
        }
        currentStateToggled = event.target;
    }
    else{
        if(event.target.parentNode.classList.contains('baybayin')){
            outputBox.textContent = transcribeToBaybayin(event.target.parentNode.lastElementChild.value);
        }
        else{
            outputBox.textContent = event.target.parentNode.lastElementChild.value;
        }
        currentStateToggled = event.target.parentNode;
    }

    currentStateToggled.classList.toggle('toggle');
    if(prevStateToggled !== undefined) prevStateToggled.classList.toggle('toggle');
    prevStateToggled = currentStateToggled;
        
}

function selectOption(event){
    event.stopPropagation();

    const originalIssue = event.target.parentNode.firstElementChild.textContent;
    const updatedIssue = originalIssue.replace(originalIssue, event.target.textContent);
    outputBox.textContent = outputBox.textContent.replace(originalIssue, updatedIssue);



    if(/[a-z]*j[a-z]*/i.test(updatedIssue) || /[a-z]*c[ei][a-z]*/i.test(updatedIssue)){

        const options = event.target.parentNode.querySelectorAll('button');
        event.target.parentNode.firstElementChild.textContent = updatedIssue;

        if(/[a-z]*j[a-z]*/gi.test(updatedIssue)){
            options[0].textContent = updatedIssue.replace(/j/i, 'diy');
            options[1].textContent = updatedIssue.replace(/j/i, 'h');    
        }
        else if(/[a-z]*c[ei][a-z]*/gi.test(updatedIssue)){
            options[0].textContent = updatedIssue.replace(/c/i, 'k');
            options[1].textContent = updatedIssue.replace(/c/i, 's');
        }  
    }
    else{
        event.target.parentNode.parentNode.removeChild(event.target.parentNode);      
    }

    if(issueContainer.firstElementChild === null){
        baybayinSafeTranscriptAlt = outputBox.textContent;
        outputBox.textContent = transcribeToBaybayin(outputBox.textContent);
        displayStates();
    }
}

function expandIssue(event) {
    event.stopPropagation();
    const button = event.target;
    button.classList.toggle('rotate');

    const options = button.parentNode.querySelectorAll('button');

    if (button.parentNode.classList.contains('expand')) {
        button.parentNode.classList.toggle('expand');
        button.parentNode.classList.toggle('shrink');
        for(const option of options){
            option.style.display = 'none';
        }
    } else if (button.parentNode.classList.contains('shrink')) {
        button.parentNode.classList.toggle('shrink');
        button.parentNode.classList.toggle('expand');
        for(const option of options){
            option.style.display = 'block';
        }
    }
    else {
        button.parentNode.classList.toggle('expand');
        for(const option of options){
            option.style.display = 'block';
        }
    }

}