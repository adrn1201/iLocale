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
    if (currentUserId && review.author._id === currentUserId || (currentUserId && (currentUserIsAdmin && !review.author.isSuperUser)) || currentUserId && currentUserIsSuperUser) {
        return `<div class="col-1 dropleft" id="review-options">
        <a class="dropdown-toggle" href="" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        </a>
        <div class="dropdown-menu" id="review-options">
            <button type="button" class="dropdown-item" data-toggle="modal" data-target="#editReviewModal${review._id}" data-whatever="@mdo">Edit</button>
            <form action="/businesses/${ business._id }/reviews/${ review._id }?_method=DELETE" method="POST">
                <button class="dropdown-item" id="option-delete">Delete</button>
            </form>
        </div>
        <div class="modal fade" id="editReviewModal${review._id}" tabindex="-1" role="dialog" aria-labelledby="editReviewModalLabel${review._id}" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editReviewModalLabel${review._id}">Edit Review -
                            ${ review.author.username }
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                    </div>
                    <div class="modal-body">
                        <form action="/businesses/${ business._id }/reviews/${ review._id }?_method=PUT" method="POST" class="needs-validation" novalidate>
                            Rating:
                            <fieldset class="starability-basic">
                                <input type="radio" id="no-rate-${ review._id}" class="input-no-rate" name="review[rating]" value="0" checked aria-label="No rating." />
                                <input type="radio" id="edit-${ review._id }1" name="review[rating]" value="1" ${review.rating===1 ? 'checked' : '' } />
                                <label for="edit-${ review._id }1" title="Terrible">1 star</label>
                                <input type="radio" id="edit-${ review._id }2" name="review[rating]" value="2" ${review.rating===2 ? 'checked' : '' } />
                                <label for="edit-${ review._id }2" title="Not good">2 stars</label>
                                <input type="radio" id="edit-${ review._id }3" name="review[rating]" value="3" ${review.rating===3 ? 'checked' : '' } />
                                <label for="edit-${ review._id }3" title="Average">3 stars</label>
                                <input type="radio" id="edit-${ review._id }4" name="review[rating]" value="4" ${review.rating===4 ? 'checked' : '' } />
                                <label for="edit-${ review._id }4" title="Very good">4 stars</label>
                                <input type="radio" id="edit-${ review._id }5" name="review[rating]" value="5" ${review.rating===5 ? 'checked' : '' } />
                                <label for="edit-${ review._id }5" title="Amazing">5 stars</label>
                            </fieldset>
                            <div class="form-group">
                                <label for="message-text-${review._id}" class="col-form-label">Message:</label>
                                <textarea class="form-control" name="review[body]" id="message-text-${review._id}" required>${ review.body }</textarea>
                                <div class="invalid-feedback error-text">Message is required</div>
                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-success">Save Changes</button>
                        </div>
                        </form>
                           
                    </div>
                  
                </div>
            </div>
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