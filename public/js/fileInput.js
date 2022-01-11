const fileInput = document.querySelector('#file-upload');
const fileText = document.querySelector('#file-text');

fileInput.addEventListener('change', (e) => {
    if (fileText.innerText === 'Image(s):') {
        fileText.innerText = '';
    }
    for (let file of e.target.files) {
        const fileName = file.name;
        fileText.append(`${fileName} `);
    }
});