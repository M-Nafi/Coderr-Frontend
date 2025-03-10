async function setHeader() {
    if (!currentUser) {
        await setCurrentUser()
    }
    setHeaderTemplate()
}

function setHeaderTemplate() {
    let headerRef = document.getElementById('head_content_right')
    if (currentUser) {
        headerRef.innerHTML = getLogedInHeaderTemplate()
    } else {
        headerRef.innerHTML = getLogedOutHeaderTemplate()
    }
}