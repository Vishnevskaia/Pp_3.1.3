$(async function () {
    await getTableWithUsers();
    getNewUserForm();
    getDefaultModal();
    addNewUser();
    getTableWithUser();
})


const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    // bodyAdd : async function(user) {return {'method': 'POST', 'headers': this.head, 'body': user}},
    findAllUsers: async () => await fetch('api/users'),
    findOneUser: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`api/users/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {method: 'DELETE', headers: userFetchService.head})
}






/// таблица  всех юзеров-----------------------------

async function getTableWithUsers() {
    const admin = document.getElementById("AdminPannel");
    console.dir(admin);
    setTimeout(() => {
        admin.style.color = "magenta"
    }, 15000)

    let button2 = $(`#nav-userstable`);

    let table = $('#mainTableWithUsers tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let userRoles = "";
                for(let i = 0; i < user.roles.length; i++) {
                    userRoles += user.roles[i].role;
                    userRoles += " ";
                }

                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>      
                            <td> ${userRoles}              
                            </td>               
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-success" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })







/// логика кнопок EDIT DELETE -----------------------------


    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#someDefaultModal');
        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })

}


/// NEW USER открытие формы ---------------------------------


async function getNewUserForm() {
    let button = $(`#SliderNewUserForm`);
    let form = $(`#defaultSomeForm`)
    let table = document.getElementById("mainTableWithUsers");
    let button2 = $(`#nav-userstable`);
    let form2 = $(`#usersTableForm`);


    button.on('click', () => {
        if (form.attr("data-hidden") === "true") {
            form.attr('data-hidden', 'false');
            form.show();
            button.text('Hide panel');

            table.style.display = 'none';
        } else {
            form.attr('data-hidden', 'true');
            form.hide();
            button.text('New User');

        }
    })

    button2.on('click', () => {

            // getTableWithUsers();

            table.style.display = '';
        }
    )

}




// ЛОГИКА МОДАЛЬНЫХ ОКОН EDIT, DELETE ---------------------------------



async function getDefaultModal() {
    $('#someDefaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}


// EDIT USER ---------------------------------

async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-outline-success" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {

        let bodyForm = `
            <form class="form-group" id="editUser">
                <input type="text" class="form-control" id="id" name="id" value="${user.id}" disabled><br>
                <input class="form-control" type="text" id="name" value="${user.name}"><br>
                <input class="form-control" type="password" id="password" value="${user.password}"><br>
                 <input class="form-control" type="text" id="email" value="${user.email}"><br>
                 
                 
                <select class="custom-select" id="roles" name="roles" multiple>
                <option value="ROLE_USER">ROLE_USER</option>
                <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                </select>
  
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val().trim();
        let name = modal.find("#name").val().trim();
        let password = modal.find("#password").val().trim();
        let email = modal.find("#email").val().trim();

        let roles = modal.find('select[name=roles]').val();



        let data = {
            id: id,
            name: name,
            password: password,
            email: email,
            roles: roles
        }
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}





// DELETE USER ---------------------------------

async function deleteUser(modal, id) {
    await userFetchService.deleteUser(id);
    getTableWithUsers();
    modal.find('.modal-title').html('');
    modal.find('.modal-body').html('User (id = ' + id + ') was deleted');
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(closeButton);
}



// NEW USER ---------------------------------

async function addNewUser() {
    $('#addNewUserButton').click(async () => {
        let addUserForm = $('#defaultSomeForm')
        let name = addUserForm.find('#newName').val().trim();
        let email = addUserForm.find('#newEmail').val().trim();
        let password = addUserForm.find('#newPassword').val().trim();
        let roles = addUserForm.find('select[name=newRoles]').val();
        let data = {
            name: name,
            email: email,
            password: password,
            roles: roles
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            getTableWithUsers();
            addUserForm.find('#newName').val('');
            addUserForm.find('#newEmail').val('');
            addUserForm.find('#newPassword').val('');
            addUserForm.find('select[name=newRoles]').val('');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12"
 role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })
}
