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
        await apiPost(`/add-new-board/${boardTitle}`)
    },

    createNewStatus: async function (title, table="global") {
        // creates new card, saves it and calls the callback function with its data
        let payload = [title,table];
        await apiPost(`/add-new-status/${payload}`)
    },

    createNewCard: async function (cardTitle, boardId, statusId, cardOrder, archived) {
        // creates new card, saves it and calls the callback function with its data
        let payload = [cardTitle, boardId, statusId, cardOrder, archived];
        await apiPost(`/add-new-card/${payload}`)
    },

    deleteBoardById: async function(boardId){
        await apiPost(`/delete-board-by-id/${boardId}`)
    },

    deleteStatusById: async function(boardId, statusId){
        await apiPost(`/delete-status-by-id/${boardId}/${statusId}`)
    },

    deleteCardById: async function(card_id){
        await apiPost(`/delete-card-by-id/${card_id}`)
    },
    updateCardOrder: async function(id, card_order){
        let payload = [id, card_order];
        await apiPost(`/update-card-order/${payload}`)
    },
    updateCardPosition: async function(id, board_id, status_id){
        let payload = [id, board_id, status_id];
        await apiPost(`/update-card-by-id/${payload}`)
    },
    updateCardArchivedStatus: async function(id, archived){
        let payload = [id, archived];
        await apiPost(`/update-card-archive-status/${payload}`)
    },
    renameBoard: async function(boardId, boardTitle){
        await apiPost(`/rename-board-by-id/${boardId}/${boardTitle}`)
    },
    renameColumn: async function(columnId, columnTitle){
        await apiPost(`/rename-column-by-id/${columnId}/${columnTitle}`)
    },
    renameCard: async function(cardId, cardTitle){
        await apiPost(`/rename-card-by-id/${cardId}/${cardTitle}`)
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

async function apiPost(url) {
    await fetch(url, {
        method: 'POST',
    })
}

async function apiDelete(url) {
}

async function apiPut(url) {
}
