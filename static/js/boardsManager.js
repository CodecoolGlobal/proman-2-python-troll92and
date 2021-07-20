import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";
import { cardsManager } from "./cardsManager.js";
import { columnsManager } from "./columnManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board)
            domManager.addChild("#root", content)
            domManager.addEventListener(`.add-new-card[new-card-id="${board.id}"]`, "click", addCard)
            domManager.addEventListener(`.toggle-board-button[data-board-id="${board.id}"]`, "click", showHideButtonHandler)
        }
        domManager.addEventListener(`.add-board-button`,"click", addBoard)
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
    console.log(current_board.getElementsByClassName('board-columns')[0]);
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
        id : await dataHandler.getLastBoardId() + 1,
        title : 'New Board'
    }
    await dataHandler.createNewBoard(board.title)
    const boardBuilder = htmlFactory(htmlTemplates.board);
    board=boardBuilder(board)
    domManager.addChild(`#root`, board)
    domManager.addEventListener(`.add-new-card[new-card-id="${board.id}"]`, "click", addCard)
            domManager.addEventListener(`.toggle-board-button[data-board-id="${board.id}"]`, "click", showHideButtonHandler)
}

async function addCard(clickEvent) {
    const boardId = clickEvent.target.attributes['new-card-id'].nodeValue;
    let card = {
        id : await dataHandler.getLastCardId() + 1,
        title : "New Card",
        card_order : await dataHandler.getCardOrderByBoardColumnId(boardId,"1") + 1
    }
    await dataHandler.createNewCard(card.title, boardId, '1', card.card_order)
    const cardBuilder = htmlFactory(htmlTemplates.card);
    card = cardBuilder(card)
    domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns .board-column[data-column-id="1"] .board-column-content`, card);
}
