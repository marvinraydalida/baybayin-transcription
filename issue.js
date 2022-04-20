import { transcribeToBaybayin } from "./baybayin.js";

const outputBox = document.getElementById('output');
const issueContainer = document.querySelector('#status-container');

export function createIssue(issues) {

    if(issues === null)return;

    const issueTemplate = document.querySelector('template');

    issues = issues.filter((value, index) => issues.indexOf(value) === index);


    for (const issueText of issues) {
        //console.dir(template)
        const issue = issueTemplate.content.firstElementChild.cloneNode(true);
        issue.firstElementChild.textContent = issueText;

        const newOption1 = document.createElement("button");
        const newOption2 = document.createElement("button");

        if(/[a-z]*j\w*/gi.test(issueText)){
            newOption1.textContent = issueText.replace(/j/i, 'diy');
            newOption2.textContent = issueText.replace(/j/i, 'h');    
        }

        if(/[a-z]*c\w*/gi.test(issueText)){
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

function selectOption(event){
    event.stopPropagation();

    const originalIssue = event.target.parentNode.firstElementChild.textContent;
    const updatedIssue = originalIssue.replace(originalIssue, event.target.textContent);
    outputBox.textContent = outputBox.textContent.replace(originalIssue, updatedIssue);



    if(/[a-z]*j\w*/i.test(updatedIssue) || /[a-z]*c\w*/i.test(updatedIssue)){

        const options = event.target.parentNode.querySelectorAll('button');
        event.target.parentNode.firstElementChild.textContent = updatedIssue;

        if(/[a-z]*j\w*/gi.test(updatedIssue)){
            options[0].textContent = updatedIssue.replace(/j/i, 'diy');
            options[1].textContent = updatedIssue.replace(/j/i, 'h');    
        }
        else if(/[a-z]*c\w*/gi.test(updatedIssue)){
            options[0].textContent = updatedIssue.replace(/c/i, 'k');
            options[1].textContent = updatedIssue.replace(/c/i, 's');
        }  
    }
    else{
        event.target.parentNode.parentNode.removeChild(event.target.parentNode);      
    }

    if(issueContainer.firstElementChild === null){
        outputBox.textContent = transcribeToBaybayin(outputBox.textContent);
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
        console.log(button.parentNode.lastElementChild);
        for(const option of options){
            option.style.display = 'block';
        }
    }

}