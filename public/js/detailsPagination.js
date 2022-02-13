const reviewPaginate = document.querySelector('#review-paginate');
const $reviewsContainer = $('#reviews-container');
const $feedbackDiv = $('#feedback-div');

reviewPaginate.addEventListener('click', async function(e) {
    e.preventDefault();
    console.log(this.href);
    const response = await fetch(this.href);
    const data = await response.json();
    for (const review of data.docs) {
        let template = generateTemplate(review);
        $reviewsContainer.append(template);
    }
    let { nextPage } = data;
    this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
    elementCondition(data);
});

function generateTemplate(review) {
    return `<div class="media">
    <div class="media-body">
        <div class="row">
            <div class="col-11">
                <p class="starability-result" data-rating="${review.rating}">
                    Rated:
                    ${ review.rating } stars
                </p>
            </div>
            ${generateOptions(review)}
        </div>
        <div class="name">
            <h5>
                ${ review.author.username }
            </h5>
        </div>
        <div class="date">
            <p>Mar 20, 2018</p>
        </div>
        <div class="review-comment">
            <p>
                ${ review.body }
            </p>
        </div>
    </div>
</div>`
}

function generateOptions(review) {
    if (currentUserId && review.author._id === currentUserId || currentUserId && currentUserIsAdmin) {
        return `<div class="col-1 dropleft">
                <a class="dropdown-toggle" href="" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                </a>
                <div class="dropdown-menu" id="review-options">
                    <form action="/businesses/${business._id }/reviews/${review._id }?_method=DELETE" method="POST">
                        <button class="dropdown-item" id="option-delete">Delete</button>
                    </form>
                </div>
            </div>`
    }
    return '';
}

function elementCondition(responseData) {
    if (!responseData.hasNextPage) {
        reviewPaginate.style.display = 'none';
        const p = document.createElement('p');
        p.classList.add('text-center');
        p.innerText = 'No more reviews to load.';
        $feedbackDiv.append(p);
    }
}