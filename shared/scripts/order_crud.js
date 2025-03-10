let orderStatus = {
    'in_progress': 'In Bearbeitung',
    'completed': 'Abgeschlossen',
    'cancelled': 'Abgebrochen'
}

async function createOrder(detailId) {
    if (detailId) {
        data = {
            offer_detail_id: detailId
        }
        let orderResp = await postDataWJSON(ORDER_URL, data);

        if (!orderResp.ok) {
            showToastMessage(true, extractErrorMessages(orderResp.data))
        } 
        return orderResp
    } else {
        showToastMessage(true, ['Das Angebotsdetail konnte nicht gefunden werden'])
        return { ok: false }
    }
}

async function updateOrder(orderId, status) {
    let stati = ['in_progress', 'cancelled', 'completed']

    data = {
        status: status
    }

    let orderResp = await patchDataWoFiles(ORDER_URL + orderId + "/", data);
    if (!orderResp.ok) {
        showToastMessage(true, extractErrorMessages(orderResp.data))
    }
    return orderResp


}