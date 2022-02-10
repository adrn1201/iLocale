const starsTotal = 5;

document.addEventListener('DOMContentLoaded', getRatings);

function getRatings() {
    businesses.forEach((rating, i) => {
        if (rating.rateAvg) {
            const starPercentage = (rating.rateAvg / starsTotal) * 100;
            const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
            document.querySelector(`#biz-home-${i} .stars-inner`).style.width = starPercentageRounded;
        }
    });
}