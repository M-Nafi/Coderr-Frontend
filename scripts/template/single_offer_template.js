function getsingleOfferHeaderTemplate(){
    if (!currentSingleOfferUser) {
        return `<div>Es ist ein Fehler aufgetreten</div>`;
    }
    return `
                    <div class="d_flex_cc_gl f_d_r_resp_c">
                        <img class="profile_img_l c_pointer" onclick="redirectToCustomerProfile(${currentSingleOfferUser.user})" src="${getPersonImgPath(currentSingleOfferUser.file)}" alt="Profilbild">
                        <div class="d_flex_cs_gm f_d_c ">
                            <div class="d_flex_cs_gm f_d_r_resp_c">
                                <h3 class="link c_black" onclick="redirectToCustomerProfile(${currentSingleOfferUser.user})">${currentSingleOfferUser.first_name} ${currentSingleOfferUser.last_name}</h3>
                                <p class="font_sec_color">
                                    @${currentSingleOfferUser.username}
                                </p>
                            </div>
                            <div class="offer_detail_review">
                                <img src="./assets/icons/kid_star_green.svg" alt="">
                                <p class="font_prime_color">${meanValueReviews()}</p>
                                <p>(${currentReviews.length})</p>
                            </div>
                            <p>${currentOfferCount} Bestellung(en) in der Warteschlange</p>
                        </div>
                    </div>
                    <h3>
                        ${currentSingleOffer.title}
                    </h3>
                    <p>
                    ${currentSingleOffer.description}
                    </p>
    `
}


function getSingleOfferDetailTemplate(){
    if (!currentOpenedDetail) {
        return `<div>Es ist ein Fehler aufgetreten</div>`;
    }

    
    return `
        <h3 class="font_prime_color">${currentOpenedDetail.price} €</h3>
                        <h3>${currentOpenedDetail.title}</h3>
                        <p class="d_flex_cc_gm">
                            <img src="./assets/icons/schedule.svg" alt="Lieferzeit Icon" class="icon">
                            ${currentOpenedDetail.delivery_time_in_days} Tag(e) Lieferzeit
                        </p>
                        <p class="d_flex_cc_gm">
                            <img src="./assets/icons/autorenew.svg" alt="Revisionen Icon" class="icon">
                            ${getRevisionTemplate()}
                        </p>

                        <ul class="feature_list">
                            ${getFeatureListTemplate()}
                        </ul>
    	                ${getOrderBtnTemplate()}
    `
}

function getOrderBtnTemplate(){
    if(currentUser.type == "business"){
        return `
                        <div >
                            <button onclick="openDialog('offer_orderbtn_error')" class="std_btn std_btn_disabled btn_prime pad_s">Bestellen</button>
                            <p id="offer_orderbtn_error" class="font_error_color d_none">dies ist nur als Kunde möglich</p>
                        </div>
        `
    } else {
        return `<button onclick="openDialog('order_dialog')" class="std_btn btn_prime pad_s">Bestellen</button>`
    }
}

function getFeatureListTemplate(){
    if (!Array.isArray(currentOpenedDetail.features)) {
        return `<li>Es ist ein Problem aufgetreten</li>`;
    }
    if (currentOpenedDetail.features.length === 0) {
        return `<li>Keine Features verfügbar.</li>`;
    }
    let featureList = "";
    
    currentOpenedDetail.features.forEach(feature => {
        featureList += `<li>${feature}</li>`
    });
    return featureList
}

function getRevisionTemplate(){
    if(currentOpenedDetail.revisions == -1){
        return 'Unbegrenzte Revisionen'
    } else if(currentOpenedDetail.revisions == 1) {
        return currentOpenedDetail.revisions + ' Revision'
    } else {
        return currentOpenedDetail.revisions + ' Revisionen'
    }
}

function getShowOrderDialogContentTemplate(){
    if (!currentOpenedDetail) {
        return `<div>Es ist ein Fehler aufgetreten</div>`;
    }
    return `
    <h2 class="font_prime_color">Bestellung bestätigen</h2>

                    <h3>${currentOpenedDetail.title}</h3>

                    <div class="d_flex_cs_gm f_d_c">
                        <p class="d_flex_cc_gm">
                            <img src="./assets/icons/box.svg" alt="Paket Icon" class="icon">
                            ${currentOpenedDetail.offer_type} Paket
                        </p>
                        <p class="d_flex_cc_gm">
                            <img src="./assets/icons/schedule.svg" alt="Lieferzeit Icon" class="icon">
                            ${currentOpenedDetail.delivery_time_in_days} Tag(e) Lieferzeit
                        </p>
                        <p class="d_flex_cc_gm">
                            <img src="./assets/icons/autorenew.svg" alt="Revisionen Icon" class="icon">
                            ${getRevisionTemplate()}
                        </p>

                        <ul class="feature_list">
                            ${getFeatureListTemplate()}
                        </ul>
                    </div>

                    <p>
                        <strong>Gesamtpreis:</strong>
                        <strong class="font_prime_color ">${currentOpenedDetail.price} €</strong>
                    </p>
                    <div class="d_flex_cs_gl">
                        <button onclick="singleOfferOrderCreate()" class="std_btn btn_prime pad_s">Kostenpflichtig bestellen</button>
                        <button onclick="closeDialog('order_dialog')"
                            class="std_btn btn_secondary pad_s">Abbrechen</button>
                    </div>`
}

function getSendOrderDialogContentTemplate(){
    return `<div class="d_flex_cc_gxl f_d_c w_full">
            <img src="./assets/icons/check_circle.svg" alt="" srcset="">
            <h2 class="text_a_c">Erfolgreich Bestellung aufgegeben</h2>
            <div class="d_flex_cc_gm f_d_r_resp_c w_full">
                <button onclick="redirectToOwnProfile()" class="std_btn btn_prime pad_s">Status checken</button>
                <button onclick="closeDialog('order_dialog')" class="std_btn btn_prime pad_s">Weiter shoppen</button>
            </div>
        </div>
    `
}