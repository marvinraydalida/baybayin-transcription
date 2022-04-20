const character = new Map();
const vowelSingle = new Map();
const kudlit = new Map();
const nonEquivalentConsonant = new Map();


//Basic Syllables
character.set('ka', '\u1703');
character.set('qa', '\u1703');
character.set('ga', '\u1704');
character.set('nga', '\u1705');
character.set('ta', '\u1706');
character.set('da', '\u1707');
character.set('ra', '\u1707');
character.set('na', '\u1708');
character.set('pa', '\u1709');
character.set('fa', '\u1709');
character.set('ba', '\u170A');
character.set('va', '\u170A');
character.set('ma', '\u170B');
character.set('ya', '\u170C');
character.set('la', '\u170E');
character.set('wa', '\u170F');
character.set('sa', '\u1710');
character.set('za', '\u1710');
character.set('ha', '\u1711');
character.set('ña', '\u1708\u1714\u170C');

//Vowels
vowelSingle.set('a', '\u1700');
vowelSingle.set('e', '\u1701');
vowelSingle.set('i', '\u1701');
vowelSingle.set('o', '\u1702');
vowelSingle.set('u', '\u1702');


//kudlit
kudlit.set('e', '\u1712');
kudlit.set('i', '\u1712');
kudlit.set('o', '\u1713');
kudlit.set('u', '\u1713');
kudlit.set('end', '\u1714');

//Other consonants with no baybayin equivalent



export function filter(transcript) {
    const invalidChracters = /[!\"#$%&\'()*+,.\/0-9-:;<=>?@[\]\\-`~{}|]/g;
    const filteredTranscript = transcript.replace(invalidChracters, '');

    return filteredTranscript;
}

export function baybayinSafe(transcript) {
    //Replace words with Start X to eks
    transcript = transcript.replace(/\bx/gi, 'eks');

    //Replace remaining X with ks
    transcript = transcript.replace(/x/gi, 'ks');

    //Replace ch to ts
    transcript = transcript.replace(/ch/gi, 'ts');


    //Replace C not followed by a vowel to K
    transcript = transcript.replace(/c(?![aeiou])/gi, 'k');
    //console.log(transcript.match(/[a-z]*j\w*/gi));

    return transcript;
}

export function isBaybayinSafe(transcript){
    if(!/[a-z]*j\w*/gi.test(transcript) && !/\w*c[aeiou]\w*/gi.test(transcript)){
        return true;
    }

    return false;
}

export function transcribeToBaybayin(transcript) {
    const consonants = ['ng', 'k', 'q', 'g', 't', 'd', 'r', 'n', 'p', 'b', 'v', 'm', 'y', 'l', 'w', 's', 'z', 'h', 'ñ'];
    const vowels = ['a', 'e', 'i', 'o', 'u'];


    //transcript = baybayinSafe(transcript);

    //Syllables
    for (const consonant of consonants) {
        for (const vowel of vowels) {
            const regex = new RegExp(`(${consonant}${vowel})`, 'gi');
            if (vowel === 'a') {
                transcript = transcript.replace(regex, character.get(`${consonant}${vowel}`));
            }
            else {
                transcript = transcript.replace(regex, character.get(`${consonant}a`) + kudlit.get(vowel));
            }
        }
    }

    //Single Consonant
    for (const consonant of consonants) {
        const regex = new RegExp(`(${consonant})`, 'gi');
        transcript = transcript.replace(regex, character.get(`${consonant}a`) + kudlit.get('end'));
    }

    //Single Vowel
    for (const vowel of vowels) {
        const regex = new RegExp(`(${vowel})`, 'gi');
        transcript = transcript.replace(regex, vowelSingle.get(`${vowel}`));
    }

    //add more space
    transcript = transcript.replace(/[ ]/g, '\xa0\xa0\xa0');
    return transcript;
}