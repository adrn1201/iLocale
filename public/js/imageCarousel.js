const imgs = document.querySelector('#fluid-images');
const mainImg = document.querySelector('#main-img');

if (business.images.length <= 1) {
    mainImg.classList.remove('mt-4')
    mainImg.classList.add('carousel-imgs')
    imgs.classList.add('d-none');
} else if (business.images.length === 2) {
    mainImg.classList.add('double-images')
} else if (business.images.length === 3) {
    mainImg.classList.add('triple-images')
} else if (business.images.length === 4) {
    mainImg.classList.add('four-images')
} else {
    mainImg.classList.add('five-images')
}
// imgs.addEventListener('load')