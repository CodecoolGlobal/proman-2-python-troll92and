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
