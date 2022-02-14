const userPaginate = document.querySelector('#user-paginate');
const $usersContainer = $('#users-container');
const $userFeedback = $('#user-feedback');

userPaginate.addEventListener('click', async function(e) {
    e.preventDefault();
    console.log(this.href);
    const response = await fetch(this.href);
    const data = await response.json();
    for (const user of data.docs) {
        let template = generateTemplate(user);
        $usersContainer.append(template);
    }
    let { nextPage } = data;
    this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
    elementCondition(data);
});

function generateTemplate(user) {
    return `  
    <tr>
        <td class="product-category"><span class="categories">${user.username}</span></td>
        <td class="product-category"><span class="categories">${user.email}</span></td>
        <td class="product-category"><span class="categories">${user.isAdmin}</span></td>
        <td class="action" data-title="Action">
            <div class="">
                <ul class="list-inline justify-content-center">
                    <li class="list-inline-item">
                        <a class="edit" data-toggle="tooltip" data-placement="top" title="Edit Role" href="/superuser/users/${ user._id }/edit">
                            <i class="fa fa-pencil"></i>
                        </a>
                    </li>
                    <li class="list-inline-item">
                        <form action="/superuser/users/${ user._id }?_method=DELETE" method="POST">
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
        userPaginate.style.display = 'none';
        const p = document.createElement('p');
        p.classList.add('text-center');
        p.innerText = 'No more users to load.';
        $userFeedback.append(p);
    }
}