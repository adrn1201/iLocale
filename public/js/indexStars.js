const starsTotal = 5;

document.addEventListener('DOMContentLoaded', getRatings);

function getRatings() {
    for (let rating of businesses.features) {
        const starPercentage = (rating.rateAvg / starsTotal) * 100;
        const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
        document.querySelector('.stars-inner').style.width = starPercentageRounded;
    }
}