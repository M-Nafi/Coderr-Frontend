let currentFile;
let currentFileId;

function clickFileInput(id){
    const fileInput = document.getElementById(id);
    currentFileId = id + "_output";
    fileInput.click();
}


async function changeCurrentFiles(element) {
    if (element.files.length > 0) {
        currentFile = element.files[0];
        const fileType = currentFile.type;
        if (fileType === "image/jpeg" || fileType === "image/jpg" || fileType === "image/png") {
            const imgElement = document.getElementById(currentFileId);
            const reader = new FileReader();

            reader.onload = function(e) {
                imgElement.src = e.target.result;
                currentFileId = null;
            };

            reader.readAsDataURL(currentFile);
        } else {
            showToastMessage(error=true, msg=["falsches Dateiformat, bitte nur jpg, jpeg oder png"])
        }
    }
}


function getFormData(form){
    const formData = new FormData(form); 

    return Object.fromEntries(formData.entries());
}


function showFormErrors(idArr){
    idArr.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('d_none');
        }
    });
}

function hideAllFormErrors(){
    const errorElements = document.querySelectorAll('.form_error');
    errorElements.forEach(element => {
        element.classList.add('d_none');
    });
}

function hideFormErrors(idArr){
    
    idArr.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.classList.add('d_none');
        }
    });
}