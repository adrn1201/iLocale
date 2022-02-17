const fileInput = document.querySelector('#file-upload');
const fileText = document.querySelector('#edit-file-text');
const form = document.querySelector('#edit-business');
const numFileText = document.querySelector('#edit-num-of-imgs');

let lengthOfFiles = 0;

const changeToFileName = (files, filesLength) => {
    numFileText.innerText = 'Maximum number of images: 5'
    numFileText.classList.remove('num-of-imgs');
    for (const file of files) {
        const fileName = file.name;
        if (filesLength === 1) {
            fileText.innerText = fileName;
            fileText.classList.remove('text-dark');
            fileText.classList.add('text-success');
            lengthOfFiles = filesLength;
        } else {
            fileText.innerText = `${filesLength} files`;
            fileText.classList.remove('text-dark');
            fileText.classList.add('text-success');
            lengthOfFiles = filesLength;
        }
    }
}

const generateFeedback = (totalImgs) => {
    fileText.classList.remove('text-success');
    fileText.classList.add('text-dark');
    fileText.innerText = 'Image(s):'
    numFileText.innerHTML = `Total images is <b>${totalImgs}</b> including the uploaded image(s).
                            <br>Please add images less than the total images uploaded.
                            <br>Maximum of <b>5</b> Images`
    numFileText.classList.add('num-of-imgs');
}


fileInput.addEventListener('click', function(e) {
    if (imagesLength >= 5) {
        e.preventDefault();
        numFileText.innerHTML = 'You have reached the limit of <b>5</b> images. <br>Please <b>delete image(s)</b> before adding.'
        numFileText.classList.add('num-of-imgs');
    }
});


fileInput.addEventListener('change', function(e) {
    let fileLength = e.target.files.length;
    let total = imagesLength + fileLength;
    if (total > 5 && fileLength > 5 || (total > 5 && fileLength <= 5)) {
        e.preventDefault();
        generateFeedback(total);
        lengthOfFiles = fileLength;
    } else changeToFileName(e.target.files, fileLength);
});


form.addEventListener('submit', function(e) {
    let totalImages = lengthOfFiles + imagesLength;
    if (totalImages > 5 && lengthOfFiles > 5 || (totalImages > 5 && lengthOfFiles <= 5)) {
        e.preventDefault();
        generateFeedback(totalImages);
    }
})