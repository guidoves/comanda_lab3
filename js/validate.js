

user_validate();

function user_validate(){

    let data = { 'token' : localStorage.getItem('token') };
    
    $.ajax({

        url: URL_SERVER + '/login/check_token',
        type: 'post',
        data,
        success: (res) => {
            return res.role;
        },
        error: (err) => {
            window.location.href = '/login.html'
        }

    });

}