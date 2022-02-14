const categoryPaginate = document.querySelector('#category-paginate');
const $categoryContainer = $('#categories-container');
const $categoryFeedback = $('#category-feedback');

categoryPaginate.addEventListener('click', async function(e) {
    e.preventDefault();
    console.log(this.href);
    const response = await fetch(this.href);
    const data = await response.json();
    for (const category of data.docs) {
        let template = generateTemplate(category);
        $categoryContainer.append(template);
    }
    let { nextPage } = data;
    this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
    elementCondition(data);
});

function generateTemplate(category) {
    return `
    <tr>
        <td class="product-category"><span class="categories">${category.categoryName}</span></td>
        <td class="action" data-title="Action">
            <div class="">
                <ul class="list-inline justify-content-center">
                    <li class="list-inline-item">
                        <a data-toggle="tooltip" data-placement="top" title="view" class="view" href="category.html">
                            <i class="fa fa-eye"></i>
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <a class="edit" data-toggle="tooltip" data-placement="top" title="Edit" href="/admin/categories/${category._id}/edit">
                            <i class="fa fa-pencil"></i>
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <form action="/admin/categories/${category._id}?_method=DELETE" method="POST">
                            <button class="delete" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button>
                        </form>
                    </li>
                </ul>
            </div>
    </td>
</tr>`
}

function elementCondition(responseData) {
    if (!responseData.hasNextPage) {
        categoryPaginate.style.display = 'none';
        const p = document.createElement('p');
        p.classList.add('text-center');
        p.innerText = 'No more categories to load.';
        $categoryFeedback.append(p);
    }
}