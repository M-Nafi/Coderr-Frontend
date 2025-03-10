function logOut(){
    removeAuthCredentials();
    window.location.href = "./index.html"
}

async function logIn(formData) {
    let response = await postDataWJSON(LOGIN_URL, formData);
    if (!response.ok) {
        showFormErrors(['error_pw']);
    } else {
        setAuthCredentials(response.data.token, response.data.user_id, response.data.username)
        window.location.href = "./offer_list.html"
    }
}

async function registration(data) {

    let response = await postDataWJSON(REGISTER_URL, data); 
    if(!response.ok){
        let errorArr = extractErrorMessages(response.data)
        showToastMessage(true, errorArr)
    } else {
        setAuthCredentials(response.data.token, response.data.user_id, response.data.username)
        window.location.href = "./offer_list.html"
    }
}

