function getLogedInHeaderTemplate() {
    return `<img onclick="toggleOpen(this); stopProp(event)" closable="true" open="false" class="profile_img_small" src="${getPersonImgPath(currentUser.file)}" alt="Profilbild">
            <div class="menu_content d_flex_cc_gm f_d_c">
                <a href="./own_profile.html">Mein Profil</a>
                <p onclick="logOut()">Ausloggen</p>
            </div>`
}

function getLogedOutHeaderTemplate() {
    const currentUrl = window.location.href;
    
    if (currentUrl.endsWith('login.html')) {
        return `
        <div class="d_flex_cc_gm">
            <a href="./registration.html" class="std_btn btn_prime pad_s  font_white_color">Registrieren</a>
        </div>`
    } else if (currentUrl.endsWith('registration.html')) {
        return `
        <div class="d_flex_cc_gm">
            <a href="./login.html" class="std_btn btn_secondary pad_s ">Login</a>
        </div>`
    } else {
        return `
            <div class="d_flex_cc_gm">
                <a href="./login.html" class="std_btn btn_secondary pad_s ">Login</a>
                <a href="./registration.html" class="std_btn btn_prime pad_s  font_white_color">Registrieren</a>
            </div>`
    }

}