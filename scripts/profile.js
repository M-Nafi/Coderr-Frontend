
let currentOrders = [];
let currentBusinessOfferListFilter = {
    creator_id: null,
    page: 1,
}


async function init() {
    let response = await setCurrentUser();

    if (!response.ok) {
        window.location.href = "./login.html";
    } else {
        await renderPage();
        setHeader();
    }
}

async function renderPage() {
    await getFullProfileData();

    let contentRef = document.getElementById("content");
    if (currentUser.type == "business") {
        currentBusinessOfferListFilter.creator_id = currentUser.user
        await setOffers(currentBusinessOfferListFilter)
        contentRef.innerHTML = getBusinessProfilePageTemplate(currentUser, currentOrders, currentOffers, currentReviews);
    } else if (currentUser.type == "customer") {
        contentRef.innerHTML = getCustomerProfilePageTemplate();
    } else {
        showToastMessage()
    }
}

async function goToOfferPage(pageNum) {
    if (pageNum) {
        currentBusinessOfferListFilter.page = pageNum
    }
    updateOfferListFilter()
}

async function updateOfferListFilter() {
    await setOffers(currentBusinessOfferListFilter);    
    document.getElementById("business_offer_list").innerHTML = `${getBusinessOfferTemplateList(currentOffers)}
    ${getOfferPagination(calculateNumPages(allOffersLength, PAGE_SIZE), currentBusinessOfferListFilter.page)}`
}

async function getFullProfileData() {

    if (currentUser.type == "business") {
        await setReviewsForBusinessUser(currentUser.user)
    } else if (currentUser.type == "customer") {
        await setReviewsForCustomerUser(currentUser.user)
    }


    let orderResp = await getData(ORDER_URL);
    if (orderResp.ok) {
        currentOrders = orderResp.data;
    }

    await setUsers();
}

async function changeReviewFilterProfile(element){
    currentReviewOrdering = element.value;

    if (currentUser.type == "business") {
        await setReviewsForBusinessUser(currentUser.user);
        document.getElementById("business_review_list").innerHTML = getReviewWLinkTemplateList(currentReviews)
    } else if (currentUser.type == "customer") {
        await setReviewsForCustomerUser(currentUser.user);
        document.getElementById("edit_review_list").innerHTML = getReviewWLinkEditableTemplateList(currentReviews)
    }
}




async function changeOrderStatus(status, orderId) {
    let singleOrderIndex = currentOrders.findIndex(item => item.id === orderId)
    if (singleOrderIndex >=0 && currentOrders[singleOrderIndex].status != status) {
        let resp = await updateOrder(orderId, status);
        if (resp.ok) {
            currentOrders[singleOrderIndex].status = status;
            document.getElementById("business_order_list").innerHTML = getBusinessOrderTemplateList();
        }
    }

}



async function businessEditOnsubmit(event) {
    event.preventDefault();
    const data = getFormData(event.target);
    let formData = jsonToFormData(data);

    updateBusinessProfile(formData)
}

async function updateBusinessProfile(formData) {
    if (currentFile) {
        formData.append('file', currentFile);
    }

    let resp = await patchData(PROFILE_URL + currentUser.user + "/", formData)

    if (resp.ok) {
        let userResp = await getData(PROFILE_URL + resp.data.user + "/")
        currentUser = userResp.data;
        closeDialog('business_dialog');
        document.getElementById("business_profile").innerHTML = getBusinessProfileTemplate(currentUser);
        setHeader();
    } else {
        extractErrorMessages(resp.data)
        showToastMessage(true, extractErrorMessages(resp.data))
    }
}




// Customer sepcific

function abboardCustomerEdit() {
    document.getElementById('customer_dialog').innerHTML = getCustomerDialogFormTemplate();
    closeDialog('customer_dialog');
}

async function customerEditOnsubmit(event) {
    event.preventDefault();
    const data = getFormData(event.target);

    let formData = jsonToFormData(data);

    updateCustomerProfile(formData)
}

async function updateCustomerProfile(formData) {
    if (currentFile) {
        formData.append('file', currentFile);
    }

    let resp = await patchData(PROFILE_URL + currentUser.user + "/", formData)

    if (resp.ok) {
        let userResp = await getData(PROFILE_URL + resp.data.user + "/")
        currentUser = userResp.data;
        closeDialog('customer_dialog');
        document.getElementById("customer_profile").innerHTML = getCustomerProfileTemplate();
    }else {
        extractErrorMessages(resp.data)
        showToastMessage(true, extractErrorMessages(resp.data))
    }
}

function abboardBusinessEdit() {
    closeDialog('business_dialog');
    document.getElementById('business_dialog').innerHTML = getBusinessDialogFormTemplate();
}

