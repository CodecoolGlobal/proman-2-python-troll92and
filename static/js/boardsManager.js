import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";
import { cardsManager } from "./cardsManager.js";
import { columnsManager } from "./columnManager.js";


domManager.addEventListener(`.add-board-button`,"click", addBoard)


export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = await boardBuilder(board)
            domManager.addChild("#root", content)
            domManager.addEventListener(`.add-new-card[new-card-id="${board.id}"]`, "click", addCard)
            domManager.addEventListener(`.add-new-status[new-status-id="${board.id}"]`, "click", addStatus)
            domManager.addEventListener(`.delete-board-button[delete-board-id="${board.id}"]`, "click", deleteBoard)
            domManager.addEventListener(`.toggle-board-button[data-board-id="${board.id}"]`, "click", showHideButtonHandler)
        }

    },
}

async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId
    let boards = document.getElementsByClassName('board-container');
    let current_board = "";
    for (let board of boards) {
        if(clickEvent.target.dataset.boardId === board.attributes['board-id'].nodeValue) {
            current_board = board;
        }
    }
    if (current_board.getElementsByClassName('board-columns')[0].innerText.length > 0) {
        current_board.getElementsByClassName('board-columns')[0].innerHTML = "";
        current_board.getElementsByClassName('toggle-board-button')[0].innerText = "Show Cards";
    } else {
        current_board.getElementsByClassName('toggle-board-button')[0].innerText = "Hide Cards";
        await columnsManager.loadColumns(boardId);
        await cardsManager.loadCards(boardId)
    }
}

async function addBoard(){

    let board = {
        id : 0,
        title : 'New Board'
    }
    await dataHandler.createNewBoard(board.title)
    board.id = await dataHandler.getLastBoardId()
    const boardBuilder = htmlFactory(htmlTemplates.board)
    let table=boardBuilder(board)
    domManager.addChild(`#root`, table)
    domManager.addEventListener(`.add-new-card[new-card-id="${board.id}"]`, "click", addCard)
    domManager.addEventListener(`.add-new-status[new-status-id="${board.id}"]`, "click", addStatus)
    domManager.addEventListener(`.toggle-board-button[data-board-id="${board.id}"]`, "click", showHideButtonHandler)
    domManager.addEventListener(`.delete-board-button[delete-board-id="${board.id}"]`, "click", deleteBoard)
}


async function addStatus(clickEvent) {
    const boardId = clickEvent.target.attributes['new-status-id'].nodeValue;
    let status = {
        id : 0,
        title : "New Status",
        board_id : boardId
    }
    await dataHandler.createNewStatus(status.title, status.board_id )
    status.id = await dataHandler.getLastStatusId()
    const columnBuilder = htmlFactory(htmlTemplates.column);
    let column = columnBuilder(status)
    domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns`, column);
}


async function addCard(clickEvent) {
    const boardId = clickEvent.target.attributes['new-card-id'].nodeValue;
    let card = {
        id : 0,
        title : "New Card",
        card_order : await dataHandler.getCardOrderByBoardColumnId(boardId,"1") + 1
    }
    await dataHandler.createNewCard(card.title, boardId, '1', card.card_order)
    card.id = await dataHandler.getLastCardId()
    const cardBuilder = htmlFactory(htmlTemplates.card);
    card = cardBuilder(card)
    domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns .board-column[data-column-id="1"] .board-column-content`, card);
}


async function deleteBoard(clickEvent){
    const boardId = clickEvent.target.attributes['delete-board-id'].nodeValue;
    console.log('hit')
    await dataHandler.deleteBoardById(boardId)
    let boards = document.getElementsByClassName('board-container');
    for (let board of boards) {
        console.log(board.attributes['board-id'].nodeValue)
        if(boardId === board.attributes['board-id'].nodeValue) {
            root.removeChild(board)
            break;
        }
    }
}


