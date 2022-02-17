const fileInput = document.querySelector('#file-upload');
const fileText = document.querySelector('#file-text');
const form = document.querySelector('#create-business');
const numFileText = document.querySelector('#num-of-imgs');

let lengthOfFiles = 0;

const changeFileInpTxt = (files, filesLength) => {
    numFileText.classList.remove('num-of-imgs');
    for (const file of files) {
        const fileName = file.name;
        if (filesLength === 1) {
            fileText.innerText = fileName;
            lengthOfFiles = filesLength;
        } else {
            fileText.innerText = `${filesLength} files`;
            lengthOfFiles = filesLength;
        }
    }
}

fileInput.addEventListener('change', (e) => {
    let fileLength = e.target.files.length;
    if (fileLength > 5) {
        e.preventDefault();
        numFileText.classList.add('num-of-imgs');
        fileText.innerText = 'Image(s):'
        lengthOfFiles = fileLength;
    } else changeFileInpTxt(e.target.files, fileLength);
});

form.addEventListener('submit', (e) => {
    if (lengthOfFiles > 5) {
        e.preventDefault();
        numFileText.classList.add('num-of-imgs');
        fileText.innerText = 'Image(s):'
    }
});