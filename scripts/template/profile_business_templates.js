

function getBusinessProfilePageTemplate(currentUser, currentOrders, currentOffers, currentReviews) {
    return `
                    <section id="business" class="business_section section_group d_flex_cs_gxl ">



            <section class="business_section_profile d_flex_cs_gl f_d_c">
                <div id="business_profile" class="d_flex_cs_gxl f_d_c about_me_section pos_rel w_full section_group_w_border">
                    
                    ${getBusinessProfileTemplate(currentUser)}
                    
                </div>
                <button onclick="redirectToBusinessProfile(${currentUser.user})" class="std_btn btn_prime d_flex_cc_gm w_full">
                    <img src="./assets/icons/visibility.svg" alt="" srcset="">
                    zum öffentlichen Profil
                </button>
            </section>

            <section class="d_flex_cs_gxl f_d_c business_section_content">
                <section class="section_group_w_border d_flex_cs_gm f_d_c ">
                    <h2 class="font_prime_color">Meine Aufträge</h2>
                    <ul class="order_list d_flex_cc_gm f_d_c" id="business_order_list">
                        ${getBusinessOrderTemplateList()}
                    </ul>
                </section>
                <section id="business_offer_list" class="section_group_w_border d_flex_cs_gl f_d_c ">
                    ${getBusinessOfferTemplateList(currentOffers)}
                    ${getOfferPagination(calculateNumPages(allOffersLength, PAGE_SIZE), currentBusinessOfferListFilter.page)}
                </section>
                <section class="section_group w_full d_flex_cs_gl f_d_c">
                    <div class="w_full d_flex_cs_gm review_header">
                        <h2 class="font_prime_color">Bewertungen</h2>

                        <div class="d_flex_cc_gm">
                            <p for="review_filter" class="ws_nw">Sortieren nach:</p>
                            <select onchange="changeReviewFilterProfile(this)" id="review_filter" class="input_field">
                                <option value="-updated_at" selected>Neueste zuerst</option>
                                <option value="updated_at">Älteste zuerst</option>
                                <option value="-rating">Höchste Bewertung</option>
                                <option value="rating">Niedrigste Bewertung</option>
                            </select>
                        </div>
                    </div>

                    <div class=" d_flex_cs_gm f_d_c w_full" id="business_review_list">

                        <!-- Reviews -->
                        ${getReviewWLinkTemplateList(currentReviews)}
                    </div>

                    <div class="w_full d_flex_cc_gm review_footer">
                        <hr>
                        <p class="link d_flex_cc_gm">
                            <img src="./assets/icons/add.svg" alt="" srcset="">
                            Mehr anzeigen
                        </p>
                    </div>
                </section>

            </section>

            
            <!-- Dialogs -->
            ${getBusinessDialogTemplate()}
            
            ${getOfferDialogWrapperTemplate()}

        </section>
    `
}

function getBusinessOfferTemplateList(currentOffers) {
    if (!Array.isArray(currentOffers)) {
        return `
            <div class="d_flex_cc_gm f_d_r_resp_c">
                <h2 class="font_prime_color">Keine Angebote verfügbar</h2>
            </div>`;
    }
    let offerListHTML = `
        <div class="d_flex_cc_gm f_d_r_resp_c">
            <h2 class="font_prime_color">Meine Angebote</h2>
            <button onclick="openOfferDialog()" class="std_btn btn_prime pad_s d_flex_cc_gm">Angebot hinzufügen 
                <img src="./assets/icons/add_white.svg" alt="" srcset="">
            </button>
        </div>`;

    currentOffers.forEach(offer => {
        user = getUserInfo(offer.user)
        offerListHTML += getBusinessOfferTemplate(offer, user)
    });

    return offerListHTML;
}

function getBusinessOrderTemplateList() {
    let orderListHTML = ``;

    currentOrders.forEach(order => {
        orderListHTML += getBusinessOrderTemplate(order)
    });

    return orderListHTML;
}

function getBusinessOrderTemplate(order) {
    if (!order || typeof order !== 'object' || !order.id) {
        return `
            <li class="order_item_box d_flex_cc_gm w_full f_d_c">
                <p>Ungültige Bestellung.</p>
            </li>`;
    }
    customer_user = getUserInfo(order.customer_user)
    return `
                        <li class="order_item_box d_flex_cc_gm w_full f_d_c">
                            <button open=false class="std_btn btn_prime pad_s order_btn_close d_flex_cc_gm"
                                onclick="toggleOpen(this)">
                                <img src="./assets/icons/close.png" alt="" srcset="">
                            </button>
                            <div class="order_item d_flex_cs_gm">
                                <div class="order_info ">
                                    <h3>Bestellung #${order.id}</h3>
                                <p>Datum: ${formatDate(order.created_at)}</p>
                                </div>
                                <div open=false closable="true" onclick="toggleOpen(this); stopProp(event)" status="${order.status}"
                                    class="order_status d_flex_cc_gm c_pointer dropdown_wrapper">
                                    <div class="order_status_icon"></div>
                                    <p>${orderStatus[order.status]}</p>
                                    <img src="./assets/icons/arrow_drop_down.svg" alt="">
                                    <div class="dropdown_box">
                                        <ul class="card dropdown_content d_flex_cc_gm f_d_c" >
                                            <li onclick="changeOrderStatus('in_progress',${order.id} )">In Bearbeitung</li>
                                            <li onclick="changeOrderStatus('completed',${order.id} )">Abgeschlossen</li>
                                            <li onclick="changeOrderStatus('cancelled',${order.id} )">Abgebrochen</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="w_full order_item_detail d_flex_cs_gm f_d_c">
                                <div class="order_info d_flex_cs_gm f_d_c">
                                    <p class="link" onclick="redirectToBusinessProfile(${order.customer_user})"><strong>Käufer:</strong> ${customer_user.user.first_name} ${customer_user.user.last_name}</p>
                                    <p><strong>Titel:</strong> ${order.title}</p>
                                    <p><strong>Lieferzeit:</strong> ${order.delivery_time_in_days} Tage</p>
                                    <p><strong>Revisionen:</strong> ${getOrderRevisionTemplate(order.revisions)} </p>
                                    <p><strong>Preis:</strong> ${parseFloat(order.price).toFixed(2)}€</p>
                                    <ul class="feature_list">
                                    ${getOrderFeatureListTemplate(order.features)}
                                    </ul>
                                </div>
                                <hr>
                            </div>
                            
                        </li>
    `
}

function getOrderFeatureListTemplate(features){
    if (!Array.isArray(features) || features.length === 0) {
        return `<li>Keine Features verfügbar.</li>`;
    }
    
    let featureList = "";
    
    features.forEach(feature => {
        featureList += `<li>${feature}</li>`
    });
    return featureList
}

function getOrderRevisionTemplate(revisions){
    if(revisions == 0){
        return 'Unbegrenzte'
    } else if(revisions == 1) {
        return revisions
    } else {
        return revisions
    }
}

function getBusinessProfileTemplate(currentUser) {
    if (!currentUser) {
        return `<div>Profilinformationen sind nicht verfügbar.</div>`;
    }
    return `      
                    <button onclick="openDialog('business_dialog')"
                        class="d_flex_cc_gl btn_round_l btn_edit abs_pos_edit_btn">
                        <img src="./assets/icons/edit.svg" alt="">
                    </button>
                    <div class="d_flex_cs_gm f_d_c profile_detail">
                        <h1 class="font_prime_color w_full">Mein Profil</h1>
                        <img class="profile_img" src="${getPersonImgPath(currentUser.file)}" alt="Profilbild">
                        <div class="w_full">
                            <h3>${currentUser.first_name} ${currentUser.last_name}</h3>
                            <p class="font_sec_color">@${currentUser.username}</p>
                        </div>
                        <p>
                        ${currentUser.description}
                        </p>
                    </div>
                    <div class="d_flex_cs_gl f_d_c">
                        <div class="d_flex_cs_gm f_d_c w_full">
                            <hr class="about_me_top_hr">
                            <p class="d_flex_cc_gm">
                                <img src="./assets/icons/mail.svg" alt="" srcset="">
                                ${currentUser.email}
                            </p>
                            <p class="d_flex_cc_gm">
                                <img src="./assets/icons/call.svg" alt="" srcset="">
                                ${currentUser.tel}
                            </p>
                            <hr>
                            <p class="d_flex_cc_gm">
                                <img src="./assets/icons/location_on.svg" alt="" srcset="">
                                Standort: ${currentUser.location}
                            </p>
                            <p class="d_flex_cc_gm">
                                <img src="./assets/icons/person.svg" alt="" srcset="">
                                Mitglied seit ${formatToMonthYearAndDay(currentUser.created_at)}
                            </p>
                            <hr>
                            <p class="d_flex_cc_gm">
                                <img src="./assets/icons/schedule.svg" alt="" srcset="">
                                Verfügbarkeit: ${currentUser.working_hours}
                            </p>
                        </div>
                    </div>
    `
}

// Dialogs

function getBusinessDialogTemplate() {
    return `
        <section id="business_dialog"
                class="dialog d_flex_cc_gl pad_m d_none">
                ${getBusinessDialogFormTemplate()}
            </section>
    `
}

function getBusinessDialogFormTemplate() {
    if (!currentUser) {
        return `<div>Es ist ein Fehler aufgetreten</div>`;
    }
    return `<div onclick="stopProp(event)" class="m_auto dialog_content small_form d_flex_cc_gl f_d_c">

                    <form onsubmit="businessEditOnsubmit(event)" class="d_flex_cc_gm f_d_c w_full pos_rel">
                        <button type="button" onclick="abboardBusinessEdit()"
                            class="d_flex_cc_gl btn_round_l btn_edit abs_pos_edit_btn_m">
                            <img src="./assets/icons/close_black.svg" alt="">
                        </button>
                        <h2 class="font_prime_color p_top_s">Profil editieren</h2>
                        <div class="image_input_box">
                            <img id="business_profile_img_input_output" class="profile_img_l" src="${getPersonImgPath(currentUser.file)}" alt="Aktuelles Profilbild">
                            <div onclick="clickFileInput('business_profile_img_input')"
                                class="file_input d_flex_cc_gl btn_round_m btn_edit btn_border_secondary">
                                <img src="./assets/icons/photo_camera.svg" alt="" srcset="">
                                <input onchange="changeCurrentFiles(this)" type="file" id="business_profile_img_input"
                                    accept="image/*">
                                
                            </div>
                            
                        </div>
                        <p id="img_error" class="form_error d_none">*falsches Dateiformat (png, jpg und jpeg)</p>
                        <p class="font_sec_color">@${currentUser.username}</p>
                        <div class="form_group">
                            <label for="business_edit_first_name">Vorname:</label>
                            <input type="text" id="business_edit_first_name" name="first_name" value="${currentUser.first_name}" required
                                class="input_field" autocomplete="off">
                        </div>
                        <div class="form_group">
                            <label for="business_edit_last_name">Nachname:</label>
                            <input type="text" id="business_edit_last_name" name="last_name" value="${currentUser.last_name}" required
                                class="input_field" autocomplete="off">
                        </div>
                        <div class="form_group">
                            <label for="business_edit_email">E-Mail-Adresse:</label>
                            <input type="email" id="business_edit_email" name="email" value="${currentUser.email}" required
                                class="input_field" autocomplete="off">
                        </div>
                        <div class="form_group">
                            <label for="business_edit_tel">Telefonnummer:</label>
                            <input type="number" id="business_edit_tel" name="tel" value="${currentUser.tel}" required
                                class="input_field" autocomplete="off">
                        </div>
                        <div class="form_group">
                            <label for="business_edit_location">Standort:</label>
                            <input class="input_field" type="text" id="business_edit_location" name="location"
                                value="${currentUser.location}">
                        </div>
                        <div class="form_group">
                            <label for="description">Beschreibung:</label>
                            <textarea class="input_field" type="text" id="description"
                                name="description">${currentUser.description}</textarea>
                        </div>
                        <div class="form_group">
                            <label for="working_hours">Verfügbarkeit:</label>
                            <input class="input_field" type="text" id="working_hours" name="working_hours"
                                value="${currentUser.working_hours}">
                        </div>
                        <div class="form_actions d_flex_cc_gm f_d_r_resp_c">
                            <button type="submit" class="std_btn btn_prime pad_s">Speichern</button>
                            <button onclick="abboardBusinessEdit()" type="button"
                                class="std_btn btn_secondary pad_s">Abbrechen</button>
                        </div>
                    </form>
                </div>
    `
}