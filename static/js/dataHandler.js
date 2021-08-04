export let dataHandler = {
    getBoards: async function () {
        let response = await apiGet('/get-boards')
        return response
    },
    getBoard: async function(boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getColumns: async function () {
        let response = await apiGet(`/get-columns`)
        return response
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        let response = await apiGet(`/get-cards/${boardId}`)
        return response
    },
    getCardOrderByBoardColumnId: async function (boardId, columnId) {
        let response = await apiGet(`/get-cards/${boardId}/${columnId}`)
        return response
    },

    getLastBoardId: async function () {
        let response = await apiGet(`/get-last-board-id`)
        return response
    },

    getLastStatusId: async function () {
        let response = await apiGet(`/get-last-status-id`)
        return response
    },

    getLastCardId: async function () {
        let response = await apiGet(`/get-last-card-id`)
        return response
    },

    getArchivedCards: async function (boardId) {
        let response = await apiGet(`/get-archived-cards/${boardId}`)
        return response
    },

    getCard: async function (cardId) {
        let response = await apiGet(`/get-card-by-id/${cardId}`)
        return response
        // the card is retrieved and then the callback function is called with the card
    },

    createNewBoard: async function (boardTitle) {
        // creates new card, saves it and calls the callback function with its data
        let payload = {"board_title": boardTitle}
        await apiPost("/add-new-board", payload)
    },

    createNewStatus: async function (title, table="global") {
        // creates new card, saves it and calls the callback function with its data
        let payload = {"title": title, "table": table}
        await apiPost("/add-new-status",payload)
    },

    createNewCard: async function (cardTitle, boardId, statusId, cardOrder, archived) {
        // creates new card, saves it and calls the callback function with its data
        let payload = {
            "card_title": cardTitle, 
            "board_id": boardId,
            "status_id": statusId,
            "card_order": cardOrder,
            "archived": archived
        }
        await apiPost("/add-new-card",payload)
    },

    deleteBoardById: async function(boardId){
        let payload = {"board_id": boardId}
        await apiPost("/delete-board-by-id",payload)
    },

    deleteStatusById: async function(boardId, statusId){
        let payload = {"board_id": boardId, "status_id": statusId}
        await apiPost("/delete-status-by-id", payload)
    },

    deleteCardById: async function(cardId){
        let payload = {"card_id": cardId}
        await apiPost("/delete-card-by-id", payload)
    },
    updateCardOrder: async function(id, cardOrder){
        let payload = {"id": id, "card_order": cardOrder}
        await apiPost("/update-card-order", payload)
    },
    updateCardPosition: async function(id, boardId, statusId){
        let payload = {"id": id, "board_id": boardId, "status_id": statusId }
        await apiPost("/update-card-by-id",payload)
    },
    updateCardArchivedStatus: async function(id, archived){
        let payload = {"id": id, "archived": archived}
        await apiPost("/update-card-archive-status", payload)
    },
    renameBoard: async function(boardId, boardTitle){
        let payload = {"board_id": boardId, "board_title": boardTitle}
        await apiPost("/rename-board-by-id", payload)
    },
    renameColumn: async function(columnId, columnTitle){
        let payload = {'column_id': columnId, 'column_title': columnTitle}
        await apiPost("/rename-column-by-id",payload)
    },
    renameCard: async function(cardId, cardTitle){
        let payload = {"card_id": cardId, "card_title": cardTitle}
        await apiPost(`/rename-card-by-id`,payload)
    },




};

async function apiGet(url) {
    let response = await fetch(url, {
        method: 'GET',
    })
    if (response.status === 200) {
        let data = response.json()
        return data
    }
}

async function apiPost(url, payload) {
    console.log('ok before fetch')
    await fetch(url, {
        headers:{"Content-Type": 'application/json'},
        method: 'POST',
        body: JSON.stringify(payload)
    })
    console.log('ok after fetch')
}

async function apiDelete(url) {
}

async function apiPut(url) {
}
