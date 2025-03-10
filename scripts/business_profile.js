let currentBusinessUser;
let currentOfferBusinessProfileFilter = {
    page: 1,
    creator_id: 11
}

async function loadRenderOffers() {
    currentOfferBusinessProfileFilter.creator_id = currentBusinessUser.user;
    await setOffersWODetails(currentOfferBusinessProfileFilter);
    document.getElementById('business_profile_offer_list').innerHTML = getOfferTemplateList(currentOffers)  + getOfferPagination(calculateNumPages(allOffersLength, PAGE_SIZE), currentOfferBusinessProfileFilter.page);
}

async function goToOfferPage(pageNum) {
    if (pageNum) {
        currentOfferBusinessProfileFilter.page = pageNum
    }
    loadRenderOffers()
}

async function initBProfile() {
    let response = await setCurrentUser();
    setHeader();
    if (!response.ok) {
        window.location.href = "./login.html";       
    } else {
        await loadBusinessUser();
        currentOfferBusinessProfileFilter.creator_id = currentBusinessUser.user        
        document.getElementById('business_profile_personal_data').innerHTML = getBusinessProfileDataTmplate();
        await setUsers();
        await loadRenderBusinessReviews();
        await loadRenderOffers();
        await loadRenderBusinessBaseInfo();
        toggleReviewAddBtn()
    }
}


async function loadRenderBusinessBaseInfo(){
    let resp = await setSingleOfferCompletedCount(currentBusinessUser.user);
    if(resp.ok){
        document.getElementById("business_profile_project_count").innerText = resp.data.completed_order_count
    }
    document.getElementById("business_profile_avg_rating").innerHTML = `${meanValueReviews()}<img src="./assets/icons/kid_star.svg" alt="" srcset="">`;
    document.getElementById("business_profile_review_count").innerText = currentReviews.length;
    document.getElementById("business_profile_offer_count").innerText = currentOffers.length;
}

async function loadBusinessUser() {

    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');
    if (!profileId) {
        window.location.href = 'index.html';
    } else {
        let resp = await getData(PROFILE_URL + profileId + "/")
        if (resp.ok) {
            if (resp.data.type == "business") {
                currentBusinessUser = resp.data
            } else {
                window.location.href = `customer_profile.html?id=${resp.data.user}`;
            }
        } else {
            extractErrorMessages(resp.data)
            showToastMessage(true, extractErrorMessages(resp.data))
        }
    }
}



async function loadRenderBusinessReviews() {
    await setReviewsForBusinessUser(currentBusinessUser.user);
    document.getElementById('business_profile_review_list').innerHTML = getReviewWLinkTemplateList(currentReviews);
}

async function changeReviewFilterBusinessProfile(element){
    currentReviewOrdering = element.value;
    loadRenderBusinessReviews()
}

async function onSubmitReviewBusinessProfile() {
    let textInputRef = document.getElementById('review_description_input')
    if (textInputRef.value != "") {
        let data = {
            rating: countStars(),
            description: textInputRef.value,
            business_user: currentBusinessUser.user
        };

        let resp = await createReview(data)
        if (resp.ok) {
            document.getElementById('business_profile_review_list').innerHTML = getReviewWLinkTemplateList(currentReviews);
            closeDialog('rating_dialog')
        }
    } else {
        showFormErrors(['review_text_error'])
    }
}