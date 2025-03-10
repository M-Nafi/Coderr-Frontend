function getReviewWLinkTemplateList(reviews) {
    if (!Array.isArray(reviews) ) {
        return '<p>Fehler beim Laden der Bewertungen!</p>';
    }
    if (reviews.length === 0) {
        return '<p>Noch keine Bewertungen vorhanden.</p>';
    }
    let reviewListHTML = "";

    reviews.forEach(review => {

        business_user = getUserInfo(review.business_user)
        reviewer = getUserInfo(review.reviewer)
        reviewListHTML += getReviewWLinkTemplate(review, business_user, reviewer)
    });

    return reviewListHTML;
}

function getReviewWLinkTemplate(review, business_user, reviewer) {
    if (!review || typeof review !== 'object' || !reviewer || typeof reviewer !== 'object' || !business_user || typeof business_user !== 'object') {
        return `
            <div class="card d_flex_cs_gm f_d_c">
                Es ist ein Fehler aufgetreten
            </div>`;
    }
    return `
                        <div class="card d_flex_cs_gm f_d_c">
                            <div class="d_flex_cs_gm f_d_r_resp_c">
                                <img class="profile_img_small c_pointer" onclick="redirectToCustomerProfile(${reviewer.user.pk})" src="${getPersonImgPath(reviewer.file)}" alt="Benutzeravatar">
                                <div>
                                    <h3 class="link c_black w_full" onclick="redirectToCustomerProfile(${reviewer.user.pk})">${reviewer.user.first_name} ${reviewer.user.last_name}</h3>
                                    <div class="review_stars">
                                        ${getStarsTemplate(review.rating)}
                                    </div>
                                    <p class="link" onclick="redirectToBusinessProfile(${business_user.user.pk})">über @${business_user.user.username}</p>
                                </div>
                            </div>
                            <p>${review.description}</p>
                            <span class="font_sec_color">${formatDate(review.created_at)}</span>
                        </div>
    `
}


function getReviewWLinkEditableTemplateList(reviews) {
    if (!Array.isArray(reviews)) {
        return '<p>Fehler beim Laden der Bewertungen</p>';
    }
    if (reviews.length === 0) {
        return '<p>Es existieren noch keine Bewertungen</p>';
    }
    let reviewListHTML = "";

    reviews.forEach(review => {
        business_user = getUserInfo(review.business_user)
        reviewer = getUserInfo(review.reviewer)

        reviewListHTML += getReviewEditableTemplate(review, business_user, reviewer)
    });

    return reviewListHTML;
}



function getReviewEditableTemplate(review, business_user, reviewer) {
    if (!review || typeof review !== 'object' || !reviewer || typeof reviewer !== 'object' || !business_user || typeof business_user !== 'object') {
        return `
            <div class="card d_flex_cs_gm f_d_c">
                Es ist ein Fehler aufgetreten
            </div>`;
    }
    return `
        <div class="card d_flex_cs_gm f_d_c own_review">
                        <button onclick="openReviewEditDialog(${review.id})"
                            class="d_flex_cc_gl btn_round_m btn_edit abs_pos_edit_btn">
                            <img src="./assets/icons/more_vert.svg" alt="" srcset="">
                        </button>
                        <div class="d_flex_cs_gm f_d_r_resp_c">
                            <img class="profile_img_small" src="${getPersonImgPath(reviewer.file)}" alt="Benutzeravatar">
                            <div>
                                <div class="d_flex_cc_gm">
                                    <h3 class="c_black w_full">${reviewer.user.first_name} ${reviewer.user.last_name}</h3>
                                </div>
                                <div class="review_stars">
                                ${getStarsTemplate(review.rating)}
                                </div>
                                <p class="link" onclick="redirectToCustomerProfile(${business_user.user.pk})">über @${business_user.user.username}</p>
                            </div>
                        </div>
                        <p>${review.description}</p>
                        <span class="font_sec_color">${formatDate(review.created_at)}</span>
                    </div>
    `
}


function getReviewDialogformTemplate(review, edit=false) {
    if (!review || typeof review !== 'object' ) {
        return `
            <div class="card d_flex_cs_gm f_d_c">
                Es ist ein Fehler aufgetreten
            </div>`;
    }

    return `
        <form onclick="stopProp(event)" onsubmit="onReviewSubmit(event, ${review.id})" class="m_auto small_form d_flex_cs_gm f_d_c pos_rel">
                    <h2 class="font_prime_color">Bewertung ändern</h2>
                    <button type="button" onclick="closeDialog('rating_dialog')"
                            class="d_flex_cc_gl btn_round_l btn_edit abs_pos_edit_btn_m">
                            <img src="./assets/icons/close_black.svg" alt="">
                    </button>
                    <div class="star_rating d_flex_cs_gm">
                        <div id="review_stars_input" class="review_stars stars_input">
                            ${getStarsEditTemplate(review.rating)}
                        </div>
                    </div>
    
                    <div class="form_group">
                        <label for="description">Beschreibung:</label>
                        <textarea class="input_field" id="description" name="description" rows="4"
                            placeholder="Ihre Bewertung hier eingeben...">${review.description}</textarea>
                    </div>
                    <div class="d_flex_cs_gm f_d_r_resp_c">
                        <button type="submit" class="std_btn btn_prime pad_s w_full">Speichern</button>
                        <button onclick="openReviewDeleteDialog(${review.id})" type="button"
                            class="std_btn btn_delete pad_s w_full">Löschen</button>
                    </div>
        </form>
    `
}


function getDeleteOrNotTemplate(review_id){
    return `
        <form onclick="stopProp(event)" class="m_auto small_form d_flex_cs_gm f_d_c pos_rel">
                    <div class="d_flex_cc_gxl f_d_c w_full">
            <img class="profile_img" src="./assets/icons/error_circle_red.svg" alt="" srcset="">
            <h2 class="text_a_c">Bewertung unwideruflich löschen?</h2>
            <div class="d_flex_cc_gm f_d_r_resp_c w_full">
                <button onclick="deleteReview(${review_id})" class="std_btn btn_delete pad_s">löschen</button>
                <button onclick="closeDialog('order_dialog')" class="std_btn btn_secondary pad_s">abbrechen</button>
            </div>
        </div>
        </form>
    `
}


// Utilities

function getStarsEditTemplate(count) {
    if (!count ) {
        return `
            <div >
                Es ist ein Fehler aufgetreten
            </div>`;
    }
    let starsHTML = ""
    for (let index = 1; index < 6; index++) {
        if (count >= index) {
            starsHTML += '<img src="./assets/icons/kid_star.svg" onmouseenter="updateStars(this)" alt="" srcset="">'
        } else {
            starsHTML += '<img src="./assets/icons/kid_star_empty.svg" onmouseenter="updateStars(this)" alt="" srcset="">'
        }
    }
    return starsHTML;
}


function getStarsTemplate(count) {
    if (!count ) {
        return `
            <div >
                Es ist ein Fehler aufgetreten
            </div>`;
    }
    let starsHTML = ""
    for (let index = 1; index < 6; index++) {
        if (count >= index) {
            starsHTML += '<img src="./assets/icons/kid_star.svg" alt="" srcset="">'
        } else {
            starsHTML += '<img src="./assets/icons/kid_star_empty.svg" alt="" srcset="">'
        }
    }
    return starsHTML;
}