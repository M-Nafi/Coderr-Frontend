let currentOfferListFilter = {
    search: "",
    page: 1,
    ordering: "",
    max_delivery_time: ""
}
let currentmaxDeliveryTime = "";

async function offerListInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    if (search) {
        currentOfferListFilter.search = search
        document.getElementById("offer_list_searchbar").value = search;
    }
    await setCurrentUser();
    setGreetingsSection();
    await setOffersWODetails(currentOfferListFilter);
    renderOfferList()
}

function renderOfferList() {
    let listRef = document.getElementById("offer_list_content");
    listRef.innerHTML = getOfferTemplateList(currentOffers) + getOfferPagination(calculateNumPages(allOffersLength, PAGE_SIZE), currentOfferListFilter.page);
}

async function goToOfferPage(pageNum) {
    if (pageNum) {
        currentOfferListFilter.page = pageNum
    }
    updateOfferListFilter()
}

async function updateOfferListFilter() {
    currentOfferListFilter.ordering = document.getElementById("offer_list_filter_ordering").value;
    await setOffersWODetails(currentOfferListFilter);
    renderOfferList()
}


async function updateOfferListFilterMaxDeliveryTime() {
    currentOfferListFilter.max_delivery_time = currentmaxDeliveryTime;
    updateOfferListFilter()
}

async function updateOfferListFilterSearch(){
    currentOfferListFilter.search = document.getElementById("offer_list_searchbar").value;
    updateOfferListFilter()
}

function setGreetingsSection() {
    if (currentUser) {
        let greetingRef = document.getElementById("offer_list_greeting_section");
        greetingRef.classList.remove('d_none');
        let name = currentUser.first_name ? currentUser.first_name : "@" + currentUser.username
        greetingRef.innerHTML = getGreetingBoxTemplate(name)
    }
}

function offerListDeactivateAllRadio() {
    let element = document.getElementById('offer_list_delivery_time_box')
    const radioInputs = element.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(element => {
        if (element) {
            element.checked = false;
        }
    });
}

function offerListAbboardDeliveryTime() {
    offerListDeactivateAllRadio();
    currentmaxDeliveryTime = ''; 
    updateOfferListFilterMaxDeliveryTime();
    toggleOpenId('time_filter');
}

function offerListApplyDeliveryTimeFilter() {
    updateOfferListFilterMaxDeliveryTime();
    toggleOpenId('time_filter');
}