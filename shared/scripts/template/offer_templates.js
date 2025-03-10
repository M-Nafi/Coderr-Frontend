function getOfferTemplateList(offers){
    if (!Array.isArray(offers)) {
        return '<p>Fehler beim Laden der Angebote</p>';
    }
    if (offers.length <= 0) {
        return getEmptyOfferListTemplate();
    }
    let offerList = "";
    for (let i = 0; i < offers.length; i++) {
        offerList += getOfferTemplate(offers[i])
    }
    return offerList;
}

function getEmptyOfferListTemplate(){
    return `
        <div class=" d_flex_cc_gl f_d_c w_full">
            <img class="nothing_found_img" src="./assets/img/nothing_found.png" alt="Nothing found image">
            <h3 class="font_prime_color">Wir konnten keine Dienstleistungen finden, die deiner Suche entsprechen</h3>
        </div>
    `
}

function getOfferPagination(currentMax, currentPage){
    if (typeof currentMax !== 'number' || typeof currentPage !== 'number' || currentMax < 0 || currentPage < 1) {
        return '<p>Fehler bei der Paginierung</p>';
    }
    if(currentMax == 0){
        return ``;
    }
    return `
    <div class="d_flex_cc_gm f_d_r_resp_c w_full">
        <button onclick="goToOfferPage(${currentPage - 1})" class="d_flex_cc_gl btn_round_m btn_edit " ${currentPage <= 1 ? 'disabled="disabled"': ""}>
            <img class="rotate_half" src="./assets/icons/arrow_right_alt.svg" alt="">
        </button>
        <div class="d_flex_cc_gm">
            ${getPaginationNumbers(currentMax, currentPage)}
        </div>
        <button onclick="goToOfferPage(${currentPage + 1})" class="d_flex_cc_gl btn_round_m btn_edit " ${currentPage >= currentMax ? 'disabled="disabled"': ""}>
            <img  src="./assets/icons/arrow_right_alt.svg" alt="">
        </button>
    </div>`
}

function getPaginationNumbers(currentMax, currentPage){
    paginationListHTML = "";
    let start = 1;
    let ende = 5;
    let endHTML = "";
    if(currentPage - 3 > 0){
        start = currentPage - 2;
        paginationListHTML = '<p>...</p>';
    }
    if(currentPage + 3 < currentMax){
        ende = currentPage + 3;
        endHTML = '<p>...</p>';
    } else {
        ende = currentMax;
    }
    for (let i = start; i <= ende; i++) {
        paginationListHTML += `<p currentPage="${currentPage == i}" class="page_number" onclick="goToOfferPage(${i})">${i}</p>`;
    }
    return paginationListHTML + endHTML
}

function getOfferTemplate(offer){
    if (!offer || typeof offer !== 'object' || !offer.id || !offer.title || !offer.description) {
        console.error("Invalid offer object");
        return '<p>Fehler beim Laden des Angebots</p>';
    }
    return `
                <div onclick="redirectToOffer(${offer.id})" class="offer_card d_flex_cs_gm f_d_c">
                    <img class="offer_image" src="${getOfferImgPath(offer.image)}" alt="Angebotsbild">
                    <div class="d_flex_cs_gm f_d_c">
                        <h3>${offer.title}</h3>
                        <p>${offer.description}</p>
                        <p>${getUpdateOrCreateDate(offer)}</p>
                        <div class="d_flex_cs_gm f_d_c">
                            <p class="font_sec_color">ab ${offer.min_delivery_time} Tage Lieferzeit</p>
                            <h3 class="font_prime_color">ab ${offer.min_price} €</h3>
                        </div>
                    </div>
                </div>`
}


function getUpdateOrCreateDate(offer){
    const time1 = new Date(offer.created_at);
    const time2 = new Date(offer.updated_at);

    timeDifference = Math.abs(time2 - time1) / (1000 * 60 * 60)

    if(timeDifference < 1){
        return 'Erstellt: ' + formatToMonthYearAndDay(offer.created_at)
    } else {
        return 'Aktualisiert: ' + formatToMonthYearAndDay(offer.updated_at)
    }
}


function getBusinessOfferTemplate(offer) {
    if (!offer || typeof offer !== 'object' || !offer.id || !offer.title || !offer.description) {
        return '<p>Fehler beim Laden des Angebots</p>';
    }
    return `
                    <div class="d_flex_cs_gm f_d_c pos_rel w_full">
                        <button onclick="openOfferDialog(${offer.id})"
                            class="d_flex_cc_gl btn_round_m btn_edit abs_pos_edit_btn_s">
                            <img src="./assets/icons/edit.svg" alt="" srcset="">
                        </button>
                        <h3 class="own_offer_header d_flex_cc_gm">${offer.title}</h3>
                        <p>${offer.description}</p>
                        <div class="d_flex_cs_gm f_d_c">
                            <p class="font_sec_color">ab ${offer.min_delivery_time} Tage Lieferzeit</p>
                            <h3 class="font_prime_color">ab ${offer.min_price} €</h3>
                        </div>
                        <button onclick="redirectToOffer(${offer.id})" class="std_btn btn_prime d_flex_cc_gm ">Zum Angebot</button>
                    </div>
    `
}


// Dialogs

function getOfferDialogWrapperTemplate() {
    return `
            <section id="dialog_add_edit_offer" 
                class="dialog d_flex_cc_gl pad_m d_none" >
                
            </section>
    `
}

function getOfferDialogTemplate() {
    if (!Array.isArray(currentOffers) || !currentOffer) {
        return '<p>Fehler beim Laden des Angebotsdialogs</p>';
    }

    let offer = currentOffers.find(item => item.id === currentOfferId)
    let title = currentOfferId ? "Angebot bearbeiten" : "Angebot hinzufügen";
    let submitBtnText = currentOfferId ? "Bearbeiten" : "Hinzufügen";
    let deleteBtn = currentOfferId ? '<button onclick="deleteOffer()" type="button" class="std_btn btn_delete pad_s ">Angebot löschen</button>' : "";
    return `
    <div onclick="stopProp(event)" class="m_auto dialog_content large_form d_flex_cc_gl f_d_c m_auto pos_rel">
                    <h2 class="font_prime_color p_top_s">${title}</h2> 
                    <button onclick="closeEditDialog()"
                        class="d_flex_cc_gl btn_round_l btn_edit abs_pos_edit_btn_m">
                        <img src="./assets/icons/close_black.svg" alt="">
                    </button>
                    <form onsubmit="onOfferSubmit(event)" id="add_offer_form" class="d_flex_cc_gl f_d_c w_full" novalidate>
                        <div class="form_group ">
                            <div class="image_input_box">
                                <img class="offer_image" src="${getOfferImgPath(offer?.image)}" alt="Aktuelles Angebotsbild"
                                    id="offer_img_input_output">
                                <div onclick="clickFileInput('offer_img_input')"
                                    class="file_input_l d_flex_cc_gl btn_round_l btn_edit">
                                    <img src="./assets/icons/edit.svg" alt="" srcset="">
                                    <input onchange="changeCurrentFiles(this)" type="file" id="offer_img_input"
                                        accept="image/*">
                                </div>
                            </div>
                        </div>

                        <!-- Allgemeine Angebotsinformationen -->
                        <div class="form_group">
                            <label for="offer_title">Titel</label>
                            <input placeholder="Gib hier deinen Titel ein" value="${currentOffer.title}" onkeydown="hideFormErrors(['offer_title_error'])" class="input_field" type="text" id="offer_title" name="offer_title" required>
                            <p id="offer_title_error" class="form_error d_none">Bitte ausfüllen!</p>
                        </div>

                        <div class="form_group">
                            <label for="offer_description">Beschreibung</label>
                            <textarea  placeholder="Gib hier die Beschreibung ein" onkeydown="hideFormErrors(['offer_description_error'])" class="input_field" id="offer_description" name="offer_description"
                                rows="4" required>${currentOffer.description}</textarea>
                            <p id="offer_description_error" class="form_error d_none">Bitte ausfüllen!</p>
                        </div>

                        <!-- Varianten für das Angebot -->

                        ${getOfferDetailDialogTemplateList()}

                        <div class="d_flex_cs_gl f_d_r_resp_c">
                            <button type="submit" class="std_btn btn_prime pad_s ">${submitBtnText}</button>
                            ${deleteBtn}
                        </div>
                    </form>
                </div>
    `
}

function getOfferDetailDialogTemplateList() {
    if (!currentOffer || !Array.isArray(currentOffer.details) || currentOffer.details.length === 0) {
        return '<p>Fehler beim Laden der Angebotsdetails</p>';
    }
    let detailTemplateList = "";

    for (let index = 0; index < currentOffer.details.length; index++) {
        detailTemplateList += getOfferDetailDialogTemplate(currentOffer.details[index])
    }

    return detailTemplateList;
}

function getOfferDetailDialogTemplate(detail) {

    let checked = detail.revisions == -1 ? "checked" : "";
    let revisionsCount = detail.revisions <= 0 ? 0 : detail.revisions;
    let revisionsDisabled = detail.revisions == null || detail.revisions > 0 ? "" : "disabled";
    return `
    <section class="variant_section section_group d_flex_cs_gl f_d_c">
                            <button id="add_offer_${detail.offer_type}_btn" type="button" open="false"
                                class="std_btn btn_prime pad_s order_btn_close d_flex_cc_gm" onclick="toggleOpen(this)">
                                <img src="./assets/icons/close.png" alt="" srcset="">
                            </button>
                            <h2>${detail.offer_type}</h2>

                            <div class="order_item_detail w_full w_full d_flex_cc_gl f_d_c">
                                <div class="w_full d_flex_cc_gm f_d_c">
                                    <div class="form_group">
                                        <label for="offer_title_${detail.offer_type}">Titel</label>
                                        <input placeholder="Gib hier die Beschreibung ein" value="${detail.title}" onkeydown="hideFormErrors(['offer_title_${detail.offer_type}_error'])" class="input_field" type="text" id="offer_title_${detail.offer_type}"
                                            name="offer_title_${detail.offer_type}" required>
                                        <p id="offer_title_${detail.offer_type}_error" class="form_error d_none">Bitte ausfüllen!</p>
                                    </div>
                                    <div class="form_group">
                                        <label for="offer_price_${detail.offer_type}">Preis (€)</label>
                                        <input placeholder="0.00" value="${detail.price}" onkeydown="hideFormErrors(['offer_price_${detail.offer_type}_error'])" class="input_field" type="number" id="offer_price_${detail.offer_type}"
                                            name="offer_price_${detail.offer_type}"  step="0.01" required>
                                        <p id="offer_price_${detail.offer_type}_error" class="form_error d_none">Bitte ausfüllen!</p>
                                    </div>
                                    <div class="form_group">
                                        <label for="offer_delivery_time_${detail.offer_type}">Lieferzeit (Tage)</label>
                                        <input placeholder="0" value="${detail.delivery_time_in_days}" onkeydown="hideFormErrors(['offer_delivery_time_${detail.offer_type}_error'])" class="input_field" type="number" id="offer_delivery_time_${detail.offer_type}"
                                            name="offer_delivery_time_${detail.offer_type}" required>
                                        <p id="offer_delivery_time_${detail.offer_type}_error" class="form_error d_none">Bitte ausfüllen!</p>
                                        
                                    </div>
                                    <div class="form_group d_flex_cs_gm f_d_c ">
                                        <label>Features:</label>


                                        <ul class="feature_list d_flex_cs_gm f_d_c w_full"  id="offer_feature_list_${detail.offer_type}">
                                            ${getOfferDetailFeatureTemplateList(detail)}
                                            
                                        </ul>
                                        <p id="offer_feature_list_${detail.offer_type}_error" class="form_error d_none">Bitte füge mindestens ein Feature hinzu!</p>
                                    </div>
                                    <div class="d_flex_cc_gm f_d_c w_full">
                                        <div class="form_group">
                                            <label for="offer_revisions_${detail.offer_type}">Revisionen</label>
                                            <div class="d_flex_cc_gl ">
                                                <input value="${revisionsCount}" onkeydown="hideFormErrors(['offer_revisions_${detail.offer_type}_error'])" class="input_field " type="number" id="offer_revisions_${detail.offer_type}"
                                                    name="offer_revisions_${detail.offer_type}" step="1" ${revisionsDisabled}>
                                                <div class="form_group d_flex_cc_gm f_d_r input_checkbox_group">
                                                    <label class="text_a_e" for="offer_revisions_${detail.offer_type}_limitless">Unbegrenzt</label>
                                                    <input onchange="changeRevisionInput(['offer_revisions_${detail.offer_type}']); hideFormErrors(['offer_revisions_${detail.offer_type}_error'])" onkeydown="" type="checkbox" id="offer_revisions_${detail.offer_type}_limitless"
                                                        name="offer_revisions_${detail.offer_type}_limitless" ${checked}>
                                                </div>
                                                
                                            </div>
                                            <p id="offer_revisions_${detail.offer_type}_error" class="form_error d_none">Bitte füge eine ganze Anzahl hinzu oder aktiviere unbegrenzte Revisionen</p>
                                        </div>
                                    </div>
                                </div>

                                <hr>
                            </div>
                        </section>`
}



function getOfferDetailFeatureTemplateList(detail) {
    if (!detail || typeof detail !== 'object' || !Array.isArray(detail.features)) {
        return '<p>Fehler beim Laden der Angebotsfeatures</p>';
    }
    let featureTemplateList = ""
    for (let featureIndex = 0; featureIndex < detail.features.length; featureIndex++) {
        featureTemplateList += getOfferDetailFeatureTemplate(detail, featureIndex)
    }

    featureTemplateList += `
                                            <li class="feature_list_input_box d_flex_cc_gm">
                                                <input class="input_field" type="text" id="new_feature_${detail.offer_type}"
                                                    placeholder="Neues Feature hinzufügen">
                                                <button onclick="addNewFeature('new_feature_${detail.offer_type}', '${detail.offer_type}')" type="button"
                                                    class="std_btn btn_prime pad_s">Hinzufügen</button>
                                            </li>`

    return featureTemplateList;
}

function getOfferDetailFeatureTemplate(detail, featureIndex) {
    if (!detail || typeof detail !== 'object' || !Array.isArray(detail.features) || featureIndex < 0 || featureIndex >= detail.features.length) {
        return '<p>Fehler beim Laden des Angebotsfeatures</p>';
    }
    if (!isInEdit(`feature_${detail.offer_type}_${featureIndex}_input`)) {
        return `
                                            <li id="feature_${detail.offer_type}_${featureIndex}">
                                                <p>${detail.features[featureIndex]}</p>
                                                <button onclick="openEditFeature('feature_${detail.offer_type}_${featureIndex}_input','${detail.offer_type}',${featureIndex})" type="button" class="d_flex_cc_gl btn_round_m btn_edit">
                                                    <img src="./assets/icons/edit.svg" alt="">
                                                </button>
                                            </li>
        `
    } else {
        return getOfferDetailFeatureEditTemplate(detail, featureIndex)
    }
}

function getOfferDetailFeatureEditTemplate(detail, featureIndex) {


    return `                            
                                        <li id="feature_${detail.offer_type}_${featureIndex}">
                                            <input onkeyup="updateEditFeature('feature_${detail.offer_type}_${featureIndex}_input')" class="input_field" type="text"
                                                    id="feature_${detail.offer_type}_${featureIndex}_input" value="${getEditFeature(`feature_${detail.offer_type}_${featureIndex}_input`).value}">
                                            <div class="d_flex_cs_gm">
                                                    <button onclick="saveEditFeature('feature_${detail.offer_type}_${featureIndex}_input', ${featureIndex}, '${detail.offer_type}')" type="button" class="d_flex_cc_gl btn_round_m btn_edit">
                                                        <img src="./assets/icons/ok_join.svg" alt="">
                                                    </button>
                                                    <button onclick="deleteEditFeature('feature_${detail.offer_type}_${featureIndex}_input', ${featureIndex}, '${detail.offer_type}')" type="button" class="d_flex_cc_gl btn_round_m btn_edit">
                                                        <img src="./assets/icons/delete_join.svg" alt="">
                                                    </button>
                                            </div>
                                        </li>
                                        <p id="feature_${detail.offer_type}_${featureIndex}_input_error" class="form_error d_none">Bitte beende den Vorgang</p>
    `
}
