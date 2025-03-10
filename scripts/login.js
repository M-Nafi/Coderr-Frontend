function checkAuthLogin(){
    if(getAuthToken()){
        window.location.href = "./index.html";
    } 
    setHeader()
}

function logInSubmit(event){
    event.preventDefault();
    const data = getFormData(event.target);

    logIn(data);
}

function guestLogin(type){
    logIn(GUEST_LOGINS[type])
}