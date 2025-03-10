function redirectToOffer(id){
    if(currentUser){
        window.location.href = "./offer.html?id=" + id;
    }
}

function redirectToOfferList(search){
    window.location.href = "./offer_list.html?search=" + search;
}

function redirectToOwnProfile(){
    window.location.href = "./own_profile.html";
}

function redirectToBusinessProfile(id){
    window.location.href = "./business_profile.html?id=" + id;
}

function redirectToCustomerProfile(id){
    window.location.href = "./customer_profile.html?id=" + id;
}

