const paginate = document.querySelector('#paginate');
const $generateDataDiv = $('#generate-data');
const $businessesContainer = $('#businesses-container');
let generateDisplay = '';

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

paginate.addEventListener('click', async function(e) {
    e.preventDefault();
    let generatedData = await fetchData(this.href);
    for (const business of generatedData.docs) {
        generateDisplay = displayStars(business)
        let template = generateBusiness(business);
        $businessesContainer.append(template);
    }
    let { nextPage } = generatedData;
    this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
    businesses.features.push(...generatedData.docs);
    map.getSource('businesses').setData(businesses);
    elementCondition(generatedData);
});

function generateBusiness(business) {
    let template = `<div class="biz-listing-list mt-20">
    <div class="row p-lg-3 p-sm-5 p-4">
        <div class="col-lg-4 align-self-center">
            <a href="/businesses/${business._id}">
        <img src="${business.images.length ? business.images[0].url : 'https://res.cloudinary.com/dofxpwwou/image/upload/v1642398778/iLocale/w2cjwlko98y1i8z1vtx2.jpg" alt="Card image cap'}" class="img-fluid" alt="">
    </a>
        </div>
        <div class="col-lg-8">
            <div class="row">
                <div class="col-lg-6 col-md-10">
                    <div class="ad-listing-content">
                        <div>
                            <a href="/businesses/${business._id}" class="font-weight-bold">
                                ${business.title}
                            </a>
                        </div>
                        <ul class="list-inline mt-2 mb-3">
                            <li class="list-inline-item">
                                <a href="category.html"> <i class="fa fa-folder-open-o"></i>
                                    ${business.category.categoryName.charAt(0).toUpperCase() + business.category.categoryName.slice(1)}
                                </a>
                            </li>
                            <li class="list-inline-item"><a href=""><i class="fa fa-location-arrow"></i> ${business.location}</a></li>
                        </ul>
                        <p class="pr-5">
                            ${business.shortText}
                        </p>
                    </div>
                </div>
                <div class="col-lg-6 align-self-center">
                    <div class="product-ratings float-lg-right pb-3">
                        ${generateDisplay}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;

    return template;
}

function displayStars(dataBusiness) {
    if (dataBusiness.rateCount) {
        return `
        <div class="stars-outer">
            <div class="stars-inner"></div>
        </div>
        <span class="text-muted" style="font-size: small;">
          ${reviewGrammar(dataBusiness)}
        </span>`;
    }
    return `<p>No reviews</p>`;

}

function reviewGrammar(data) {
    if (data.rateCount && data.rateCount === 1) {
        return `${data.rateCount} review`;
    }
    return `${data.rateCount} reviews`;
}

function elementCondition(responseData) {
    if (!responseData.hasNextPage) {
        paginate.style.display = 'none';
        const p = document.createElement('p');
        p.classList.add('text-center');
        p.innerText = 'No more businesses to load.';
        $generateDataDiv.append(p);
    }
}