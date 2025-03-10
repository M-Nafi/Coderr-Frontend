async function indexInit() {
    let response = await getBaseInfo();
    if (response.ok) {
        renderBaseInfo(response.data)
    }
}


async function getBaseInfo() {
    let response = await getData(BASE_INFO_URL);
    if (response.ok) {
        currentUser = response.data;
    } else {
        showToastMessage(true, ['Einige Daten konnten nicht geladen werden'])
    }
    return response;
}

function renderBaseInfo(baseInfo){
    for (let key in baseInfo) {
        if (baseInfo.hasOwnProperty(key)) {
            let element = document.getElementById(`base_info_`+key);
            if (element) {
                element.innerText = baseInfo[key];
            }
        }
    }
}

function redirectToOfferListWSearch(){
    let inputRef = document.getElementById("index_search_field");
    redirectToOfferList(inputRef.value);
}