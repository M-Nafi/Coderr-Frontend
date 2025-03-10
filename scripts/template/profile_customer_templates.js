function getCustomerProfilePageTemplate(){
    return `
                <section id="customer" class="section_group d_flex_cc_gl f_d_c ">

            <section id="customer_profile" class="d_flex_ss_gxl f_d_c w_full section_group_w_border pos_rel">
                ${getCustomerProfileTemplate()}
            </section>

            <section class="section_group_w_border d_flex_cs_gm f_d_c ">
                <h2 class="font_prime_color">Meine Aufträge</h2>
                <ul class="order_list d_flex_cc_gm f_d_c">
                    ${getCustomerOrderTemplateList()}
                    <!-- LIST getCustomerOrderTemplate  -->
                </ul>
            </section>

            <section class="section_group w_full d_flex_cs_gl f_d_c">
                <div class="w_full d_flex_cs_gm review_header">
                    <h2 class="font_prime_color">Bewertungen</h2>

                    <div class="">
                        <label for="review_filter">Sortieren nach:</label>
                        <select onchange="changeReviewFilterProfile(this)" id="review_filter" class="input_field">
                            <option value="-updated_at" selected>Neueste zuerst</option>
                            <option value="updated_at">Älteste zuerst</option>
                            <option value="-rating">Höchste Bewertung</option>
                            <option value="rating">Niedrigste Bewertung</option>
                    </select>
                    </div>
                </div>

                <div class=" d_flex_cs_gm f_d_c w_full" id="edit_review_list">
                    <!-- LIST getReviewEditableTemplate -->
                    ${getReviewWLinkEditableTemplateList(currentReviews)}
                </div>

                <div class="w_full d_flex_cc_gm review_footer">
                    <hr>
                    <p class="link d_flex_cc_gm">
                        <img src="./assets/icons/add.svg" alt="" srcset="">
                        Mehr anzeigen
                    </p>
                </div>
            </section>

            <!-- Dialogs -->
            ${getCustomerDialogTemplate()}
            ${getCustomerReviewDialogWrapperTemplate()}
        </section>
    `
}


function getCustomerProfileTemplate(){  
    if (!currentUser ) {
        return `
            <div>
                Es ist ein Fehler aufgetreten
            </div>`;
    }  
    return `
        <button onclick="openDialog('customer_dialog')"
                    class="d_flex_cc_gl btn_round_l btn_edit abs_pos_edit_btn">
                    <img src="./assets/icons/edit.svg" alt="">
        </button>
        <h1 class="font_prime_color">Mein Profil</h1>
        <div class="d_flex_cs_gxl profile_customer">
                    <div class="d_flex_cc_gm f_d_c">
                        <img class="profile_img_l" src="${getPersonImgPath(currentUser.file)}" alt="Profilbild">
                    </div>
                    <div class="d_flex_cs_gl f_d_c offer_card">

                        <div class="d_flex_cs_gm about_me_header f_d_r_resp_c">
                            <h3>${currentUser.first_name} ${currentUser.last_name}</h3>
                            <p class="font_sec_color">
                                @${currentUser.username}
                            </p>
                        </div>

                        <div class="d_flex_cs_gm f_d_c w_full">
                            <p class="d_flex_cc_gm">
                                <img src="./assets/icons/mail.svg" alt="" srcset="">
                                ${currentUser.email}
                            </p>
                            <p class="d_flex_cc_gm">
                                <img src="./assets/icons/person.svg" alt="" srcset="">
                                Mitglied seit ${formatToMonthYearAndDay(currentUser.created_at)}
                            </p>
                            <button onclick="redirectToCustomerProfile(${currentUser.user})" class="std_btn btn_prime d_flex_cc_gm w_full">
                                <img src="./assets/icons/visibility.svg" alt="" srcset="">
                                zum öffentlichen Profil
                            </button>
                        </div>
                    </div>
                </div>
    `
}



function getCustomerDialogTemplate(){
    return `
        <section onclick="closeDialog('customer_dialog')" id="customer_dialog"
                class="dialog d_flex_cc_gl pad_m d_none">
                ${getCustomerDialogFormTemplate()}
            </section>
    `
}

function getCustomerDialogFormTemplate(){
    if (!currentUser ) {
        return `
            <div>
                Es ist ein Fehler aufgetreten
            </div>`;
    }  
    return`
    <div onclick="stopProp(event)" class="m_auto dialog_content small_form d_flex_cc_gl f_d_c">
                    <form onsubmit="customerEditOnsubmit(event)" class="d_flex_cc_gm f_d_c w_full pos_rel">
                        <button onclick="abboardCustomerEdit()"
                            class="d_flex_cc_gl btn_round_l btn_edit abs_pos_edit_btn_m">
                            <img src="./assets/icons/close_black.svg" alt="">
                        </button>
                        <h2 class="font_prime_color p_top_s">Profil editieren</h2>

                        <div class="image_input_box">
                            <img id="customer_profile_img_input_output" class="profile_img_l" src="${getPersonImgPath(currentUser.file)}" alt="Aktuelles Angebotsbild">
                            <div onclick="clickFileInput('customer_profile_img_input')"
                                class="file_input d_flex_cc_gl btn_round_m btn_edit btn_border_secondary">
                                <img src="./assets/icons/photo_camera.svg" alt="" srcset="">
                                <input onchange="changeCurrentFiles(this)" type="file" id="customer_profile_img_input"
                                    accept="image/*">
                            </div>
                        </div>
                        <p class="font_sec_color">@${currentUser.username}</p>
                        <div class="form_group">
                            <label for="edit_first_name">Vorname:</label>
                            <input type="text" id="edit_first_name" name="first_name" value="${currentUser.first_name}" required
                                class="input_field">
                        </div>
                        <div class="form_group">
                            <label for="edit_last_name">Nachname:</label>
                            <input type="text" id="edit_last_name" name="last_name" value="${currentUser.last_name}" required
                                class="input_field">
                        </div>
                        <div class="form_group">
                            <label for="edit_email">E-Mail-Adresse:</label>
                            <input type="email" id="edit_email" name="email" value="${currentUser.email}" required
                                class="input_field">
                        </div>
                        <div class="form_actions d_flex_cc_gl">
                            <button type="submit" class="std_btn btn_prime pad_s">Speichern</button>
                            <button onclick="abboardCustomerEdit()" type="button"
                                class="std_btn btn_secondary pad_s">Abbrechen</button>
                        </div>
                    </form>
                </div>`
}

function getCustomerOrderTemplateList() {
    let orderListHTML = ``;

    currentOrders.forEach(order => {
        orderListHTML += getCustomerOrderTemplate(order)
    });

    return orderListHTML;
}

function getCustomerOrderTemplate(order){
    business_user = getUserInfo(order.business_user)
    if (!order || typeof order !== 'object' || !order.business_user || !order.id || !order.created_at || !order.status || !order.title || !order.delivery_time_in_days || !order.revisions || !order.price) {
        return `
            <li class="order_item_box d_flex_cs_gm w_full f_d_c">
                Es ist ein Fehler aufgetreten
            </li>`;
    }
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
                            <div status="${order.status}" class="order_status d_flex_cc_gm">
                                <div class="order_status_icon"></div>
                                <p>${orderStatus[order.status]}</p>
                            </div>
                        </div>
                        <div class="w_full order_item_detail d_flex_cs_gm f_d_c">
                            <div class="order_info d_flex_cs_gm f_d_c">
                                <p class="link" onclick="redirectToCustomerProfile(${order.business_user})"><strong>Anbieter:</strong> ${business_user.user.first_name} ${business_user.user.last_name}</p>
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
        return '<li>Keine Features verfügbar</li>';
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

function getCustomerReviewDialogWrapperTemplate(){
    return `
        <section onclick="closeDialog('rating_dialog')" id="rating_dialog" class="dialog pad_m d_flex_cc_gm d_none">
                
            </section>
    `
}

