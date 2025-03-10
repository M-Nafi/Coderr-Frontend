let currentReviews = [];
let currentReviewOrdering = '-updated_at'


async function setReviewsForBusinessUser(id) {
    let reviewsResp = await getData(REVIEW_URL + `?business_user_id=${id}&ordering=${currentReviewOrdering}`);
    if (reviewsResp.ok) {
        currentReviews = reviewsResp.data;
    } else {
        showToastMessage(true, ['Bewertung zu diesem User konnte nicht gefunden werden'])
    }
}

async function setReviewsForCustomerUser(id) {
    let reviewsResp = await getData(REVIEW_URL + `?reviewer_id=${id}&ordering=${currentReviewOrdering}`);
    if (reviewsResp.ok) {
        currentReviews = reviewsResp.data;
    } else {
        showToastMessage(true, ['Bewertung zu diesem User konnte nicht gefunden werden'])
    }
}

async function createReview(data) {
    let index = currentReviews.findIndex(item => item.reviewer === currentUser.user);
    if (index >= 0) {
        showToastMessage(true, ['Du hast diesen User schon einmal Bewertet'])
        return { ok: false }
    } else {
        let reviewsResp = await postDataWJSON(REVIEW_URL, data);
        if (reviewsResp.ok) {
            currentReviews.push(reviewsResp.data);
            showToastMessage(false, ['Bewertung erstellt'])
            return reviewsResp
        } else {
            showToastMessage(true, extractErrorMessages(reviewsResp.data))
            return reviewsResp
        }
    }
}

function openReviewEditDialog(reviewId) {
    let index = currentReviews.findIndex(item => item.id === reviewId);
    if (index < 0) {
        showToastMessage(true, ['Bewertung konnte nicht gefunden werden'])
    } else {
        openDialog('rating_dialog');
        document.getElementById('rating_dialog').innerHTML = getReviewDialogformTemplate(currentReviews[index],true)
    }
}

function openReviewDeleteDialog(reviewId) {
    document.getElementById('rating_dialog').innerHTML = getDeleteOrNotTemplate(reviewId)

}

async function onReviewSubmit(event, reviewId) {
    event.preventDefault();
    const data = getFormData(event.target);
    data['rating'] = countStars();
    let resp = await patchDataWoFiles(REVIEW_URL + reviewId + "/", data);

    if (!resp.ok) {
        showToastMessage(true, extractErrorMessages(resp.data))
    } else {
        let index = currentReviews.findIndex(item => item.id === reviewId);
        currentReviews[index].rating = data.rating
        currentReviews[index].description = data.description
        document.getElementById("edit_review_list").innerHTML = getReviewWLinkEditableTemplateList(currentReviews);
        closeDialog('rating_dialog');
        showToastMessage(false, ['Bewertung angepasst'])
    }
}

async function deleteReview(reviewId) {
    let index = currentReviews.findIndex(item => item.id === reviewId);
    if (index < 0) {
        showToastMessage(true, ['Bewertung konnte nicht gefunden werden'])
    } else {

        let resp = await deleteData(REVIEW_URL + reviewId + "/");
        if (resp.ok) {
            currentReviews.splice(index, 1);
            document.getElementById("edit_review_list").innerHTML = getReviewWLinkEditableTemplateList(currentReviews);
            closeDialog('rating_dialog');
            showToastMessage(false, ['Bewertung gelöscht'])
        } else {            
            showToastMessage(true, extractErrorMessages(resp.data))
        }
    }
}

function countStars() {
    const reviewStarsDiv = document.getElementById('review_stars_input');
    const imgElements = reviewStarsDiv.children;

    let count = 0;

    for (let i = 0; i < imgElements.length; i++) {
        const img = imgElements[i];
        if (img.tagName === 'IMG' && img.src.endsWith('kid_star.svg')) {
            count++;
        }
    }
    return count;
}

function meanValueReviews() {
    sum = 0;
    currentReviews.forEach(rev => {
        sum += parseFloat(rev.rating)
    });
    let result = (sum / currentReviews.length).toFixed(1)
    if (!isNaN(result)) {
        return result
    } else {
        return '-'
    }

}