let currentSingleOfferUser = null;
let currentOpenedDetail;
let currentOfferCount = 0;
async function singleOfferInit() {
    
    await setCurrentUser();
    toggleReviewAddBtn()
    await loadRenderSingleOffer()
    setHeader()
}

async function loadRenderSingleOffer() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');
    if (!profileId) {
        window.location.href = 'index.html';
    } else {
        let offerResp = await setSingleOffer(profileId);
        if (offerResp.ok) {
            await loadSingleOfferUser(currentSingleOffer.user);
            await setSingleOfferCount(currentSingleOffer.user);
            await loadRenderSingleOfferReviews();
            document.getElementById('single_offer_header_section').innerHTML = getsingleOfferHeaderTemplate();

            renderSingleOfferDetail('basic');
        } else {
            showToastMessage(error = true, msg = ['Das Angebot konnte nicht gefunden werden'])
        }
    }
}

function renderSingleOfferDetail(type) {
    if (currentOpenedDetail?.offer_type != type) {
        let foundDetail = currentSingleOffer.details.find(item => item.offer_type === type);
        if (foundDetail) {
            currentOpenedDetail = foundDetail
        } else {
            showToastMessage(error = true, msg = ['Das Angebotsdetail konnte nicht gefunden werden'])
        }
        document.getElementById('single_offer_detail_section').innerHTML = getSingleOfferDetailTemplate();
        document.getElementById('single_offe_order_dialog').innerHTML = getShowOrderDialogContentTemplate();
    }
}

function activatedButton(element) {
    const header = document.getElementById('offer_detail_header');
    const buttons = header.querySelectorAll('button');

    buttons.forEach(button => {
        button.classList.remove('active');
    });
    element.classList.add('active');
}

async function loadSingleOfferUser(profileId) {
    let resp = await getData(PROFILE_URL + profileId + "/")
    if (resp.ok) {
        currentSingleOfferUser = resp.data
    } else {
        extractErrorMessages(resp.data)
        showToastMessage(true, extractErrorMessages(resp.data))
    }
}








// ReviewDialog Handling

async function loadRenderSingleOfferReviews() {
    await setUsers();
    await setReviewsForBusinessUser(currentSingleOfferUser.user);
    document.getElementById('single_offer_review_list').innerHTML = getReviewWLinkTemplateList(currentReviews);
}

async function changeReviewFilterSingleOffer(element){
    currentReviewOrdering = element.value;
    await setReviewsForBusinessUser(currentSingleOfferUser.user);
    document.getElementById('single_offer_review_list').innerHTML = getReviewWLinkTemplateList(currentReviews);
}

async function onSubmitReviewSingleOffer() {
    let textInputRef = document.getElementById('review_description_input')
    if (textInputRef.value != "") {
        let data = {
            rating: countStars(),
            description: textInputRef.value,
            business_user: currentSingleOfferUser.user
        };

        let resp = await createReview(data)
        if (resp.ok) {
            document.getElementById('single_offer_review_list').innerHTML = getReviewWLinkTemplateList(currentReviews);
            closeDialog('rating_dialog')
        }


    } else {
        showFormErrors(['review_text_error'])
    }
}


async function singleOfferOrderCreate(){
    let orderResp = await createOrder(currentOpenedDetail.id);
    if(orderResp.ok){
        document.getElementById('single_offe_order_dialog').innerHTML = getSendOrderDialogContentTemplate();
    } else {

    }
}













// UI Handling

window.addEventListener("resize", moveOnResize);
window.addEventListener("load", moveOnResize);
let respView = false;
const RESPVIEWPOINT = 1024;

function moveDetailBox(source, destination) {
    let destinationRef = document.getElementById(destination);
    destinationRef.classList.remove('d_none');


    let fragment = document.createDocumentFragment();
    let sourceElement = document.getElementById(source);
    let destinationElement = document.getElementById(destination);

    while (sourceElement.firstChild) {
        fragment.appendChild(sourceElement.firstChild);
    }
    destinationElement.appendChild(fragment);


    let sourceRef = document.getElementById(source);
    sourceRef.classList.add('d_none');
}

function setRespView() {
    if (window.innerWidth < RESPVIEWPOINT) {
        moveDetailBox("detail_box", "resp_detail_box")
        respView = true;
    }
}

function moveOnResize() {
    if (window.innerWidth < RESPVIEWPOINT && !respView) {
        moveDetailBox("detail_box", "resp_detail_box")
        respView = !respView
    }
    if (window.innerWidth >= RESPVIEWPOINT && respView) {
        moveDetailBox("resp_detail_box", "detail_box")
        respView = !respView
    }
}