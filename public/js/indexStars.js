const starsTotal = 5;

document.addEventListener('DOMContentLoaded', getRatings);

function getRatings() {
    for (const rating of businesses.features) {
        if (rating.rateAvg) {
            const starPercentage = (rating.rateAvg / starsTotal) * 100;
            const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
            document.querySelector(`#biz-${rating._id} .stars-inner`).style.width = starPercentageRounded;
        }
    }
}