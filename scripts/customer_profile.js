let currentCustomerUser;

async function initCProfile() {
    let response = await setCurrentUser()
    setHeader()
    if (!response.ok) {
        window.location.href = "./login.html";
    } else {
        await loadCustomerUser();
        document.getElementById('customer_detail_section').innerHTML = getCustomerDetailTemplate();
        await setUsers();
        await loadRenderCustomerReviews();
    }
}

async function loadRenderCustomerReviews() {
    await setReviewsForCustomerUser(currentCustomerUser.user);
    document.getElementById('customer_profile_review_list').innerHTML = getReviewWLinkTemplateList(currentReviews);
}

async function changeReviewFilterCustomerProfile(element){
    currentReviewOrdering = element.value;
    loadRenderCustomerReviews()
}

async function loadCustomerUser() {

    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');
    if (!profileId) {
        window.location.href = 'index.html';
    } else {
        let resp = await getData(PROFILE_URL + profileId + "/")
        if (resp.ok) {
            if (resp.data.type == "customer") {
                currentCustomerUser = resp.data
            } else {
                window.location.href = `business_profile.html?id=${resp.data.user}`;
            }
        } else {
            extractErrorMessages(resp.data)
            showToastMessage(true, extractErrorMessages(resp.data))
        }
    }
}