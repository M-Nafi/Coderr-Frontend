function getCustomerDetailTemplate(){
    if (!currentCustomerUser ) {
        return `
            <div>
                Es ist ein Fehler aufgetreten
            </div>`;
    }
    return `
    <div class="d_flex_cs_gm f_d_c">
                <img class="profile_img" src="${getPersonImgPath(currentCustomerUser.file)}" alt="Profilbild">
            </div>
            <div class="d_flex_cs_gl f_d_c">

                <div class="d_flex_cs_gm about_me_header">
                    <h3>${currentCustomerUser.first_name} ${currentCustomerUser.last_name}</h3>
                    <p class="font_sec_color">
                        @${currentCustomerUser.username}
                    </p>
                </div>

                <div class="d_flex_cs_gm f_d_c w_full">
                    <p class="d_flex_cc_gm">
                        <img src="./assets/icons/mail.svg" alt="" srcset="">
                        ${currentCustomerUser.email}
                    </p>
                    <p class="d_flex_cc_gm">
                        <img src="./assets/icons/person.svg" alt="" srcset="">
                        Mitglied seit ${formatToMonthYearAndDay(currentCustomerUser.created_at)}
                    </p>

                </div>
            </div>`
}