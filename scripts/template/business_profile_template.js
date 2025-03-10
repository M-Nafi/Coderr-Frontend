function getBusinessProfileDataTmplate(){
    if (!currentBusinessUser ) {
        return `
            <div>
                Es ist ein Fehler aufgetreten
            </div>`;
    }
    return `
                <div class="d_flex_cs_gm f_d_c">
                    <img class="profile_img" src="${getPersonImgPath(currentBusinessUser.file)}" alt="Profilbild">
                    <div>
                        <h3>${currentBusinessUser.first_name} ${currentBusinessUser.last_name}</h3>
                        <p class="font_sec_color">
                            @${currentBusinessUser.username}
                        </p>
                    </div>
                    <p>
                    ${currentBusinessUser.description}
                    </p>
                </div>
                <div class="d_flex_cs_gl f_d_c">
                    <h2 class="font_prime_color">Über Mich</h2>

                    <div class="d_flex_cs_gm f_d_c w_full">
                        <p class="d_flex_cc_gm">
                            <img src="./assets/icons/mail.svg" alt="" srcset="">
                            ${currentBusinessUser.email}
                        </p>
                        <p class="d_flex_cc_gm">
                            <img src="./assets/icons/call.svg" alt="" srcset="">
                            ${currentBusinessUser.tel}
                        </p>
                        <hr>
                        <p class="d_flex_cc_gm">
                            <img src="./assets/icons/location_on.svg" alt="" srcset="">
                            Standort: ${currentBusinessUser.location}
                        </p>
                        <p class="d_flex_cc_gm">
                            <img src="./assets/icons/person.svg" alt="" srcset="">
                            Mitglied seit ${formatToMonthYearAndDay(currentBusinessUser.created_at)}
                        </p>
                        <hr>
                        <p class="d_flex_cc_gm">
                            <img src="./assets/icons/schedule.svg" alt="" srcset="">
                            Verfügbarkeit: ${currentBusinessUser.working_hours}
                        </p>
                    </div>

                </div>
    `
}