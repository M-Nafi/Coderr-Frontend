let globalUsers = [];
let currentUser;

async function setUsers() {
    let userBusinessResp = await getData(BUSINESS_PROFILES_URL);
    if (userBusinessResp.ok) {
        globalUsers = globalUsers.concat(userBusinessResp.data);
    }

    let userCustomerResp = await getData(CUSTOMER_PROFILES_URL);
    if (userCustomerResp.ok) {
        globalUsers = globalUsers.concat(userCustomerResp.data);
    }
}

function getUserInfo(id) {
    return globalUsers.find(user => user.user === id) || null
}

async function setCurrentUser() {
    if (getAuthUserId()) {
        let response = await getData(PROFILE_URL + getAuthUserId() + "/");
        if (response.ok) {
            currentUser = response.data;
        } else {
            showToastMessage(true, ['Eigene User konnte nicht gefunden werden'])
        }
        return response;
    }
    return {ok:false}
}