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
            domManager.addEventListener(`.toggle-archive-button[data-board-archive-id="${board.id}"]`, "click", boardsManager.archiveButtonHandler)
            domManager.addEventListener(`.board-title[title-id="${board.id}"]`, "click", changeBoardTitle)
        }
    },
    archiveButtonHandler: async function(clickEvent){
        const boardId = clickEvent.target.attributes['data-board-archive-id'].nodeValue
        let button = document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`)
        if (button.childNodes[0].data !== "Show Cards") {

            let current_archive = document.querySelector(`.archive[archive-board-id="${boardId}"]`);
            if (current_archive === null) {
                let current_board = document.querySelector(`.board-container[board-id="${boardId}"]`)
                current_board.getElementsByClassName('toggle-archive-button')[0].innerHTML = "Hide Archive"
                await boardsManager.archiveLoad(boardId)
            } else {
                let parent = current_archive.parentNode
                parent.removeChild(current_archive)
                let current_board = document.querySelector(`.board-container[board-id="${boardId}"]`)
                current_board.getElementsByClassName('toggle-archive-button')[0].innerHTML = "Show Archive"
            }
        }
    },
    archiveLoad: async function(boardId){
        const archiveBuilder = htmlFactory(htmlTemplates.archive);
        const content = await archiveBuilder(boardId)
        await domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns`, content)
        let cards = await dataHandler.getArchivedCards(boardId)
        if (cards.length>0){
            for (let card of cards){
                const cardBuilder = htmlFactory(htmlTemplates.card);
                const card_content = await cardBuilder(card)
                domManager.addChild(` .archive-content[archive-owner-id="${boardId}"`, card_content)
                let added_card = document.querySelector(`.card-title[card-title-id="${card.id}"]`)
                added_card.parentNode.setAttribute("draggable",false)
                domManager.addEventListener(`.card-title[card-title-id="${card.id}"]`, "click", cardsManager.changeCardTitle)
                domManager.addEventListener(`.card-archive[data-card-archive-id="${card.id}"]`, "click", boardsManager.toggleArchiveCard)
                domManager.addEventListener(`.card-remove[data-card-id="${card.id}"]`, "click", cardsManager.deleteButtonHandler)

            }
        }
    },
    toggleArchiveCard: async function(clickEvent){
        const cardId = clickEvent.target.dataset.cardArchiveId;
        const currentCard = await document.querySelector(`.card[data-card-id="${cardId}"]`)
        const currentCardData = await dataHandler.getCard(cardId)
        const parent = currentCard.parentNode
        const boardId = currentCardData.board_id
        const cardSlot = await document.querySelector(`.board-container[board-id="${boardId}"] .board-columns .board-column[data-column-id="${currentCardData.status_id}"] .board-column-content`)
        const boardArchive = document.querySelector(`.archive[archive-board-id="${boardId}"]`)
        const archiveOpen = document.querySelector(`.toggle-archive-button[data-board-archive-id="${boardId}"]`).childNodes[0].data

        if (parent.classList[0] === "board-column-content"){
            parent.removeChild(currentCard)
            if (archiveOpen !== "Show Archive"){
                boardArchive.appendChild(currentCard)
                //await currentCard.removeEventListener('dragend', cardsManager.insertDragged, false);
                //await currentCard.removeEventListener('dragstart', cardsManager.insertDragged, false);
                //await currentCard.removeEventListener('dragover', cardsManager.insertDragged, false);
                //await currentCard.removeEventListener('dragleave', cardsManager.insertDragged, false);
            }//please send help it's 2021.07.23 - 4:18
            await dataHandler.updateCardArchivedStatus(cardId, "True")
        }else{
            parent.removeChild(currentCard)
            cardSlot.appendChild(currentCard)
            await dataHandler.updateCardArchivedStatus(cardId, "False")
            domManager.addEventListener(`.card-title[card-title-id="${cardId}"]`, "click", cardsManager.changeCardTitle)
            domManager.addEventListener(`.card-archive[data-card-archive-id="${cardId}"]`, "click", boardsManager.toggleArchiveCard)
            domManager.addEventListener(`.card-remove[data-card-id="${cardId}"]`, "click", cardsManager.deleteButtonHandler)

        }

    }
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
        current_board.getElementsByClassName('toggle-archive-button')[0].innerHTML = "Show archive";
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
    domManager.addEventListener(`.board-title[title-id="${board.id}"]`, "click", changeBoardTitle)
    domManager.addEventListener(`.toggle-archive-button[data-board-archive-id="${board.id}"]`, "click", boardsManager.archiveButtonHandler)

}


async function addStatus(clickEvent) {
    const boardId = clickEvent.target.attributes['new-status-id'].nodeValue;
    let button = document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`)
    if (button.childNodes[0].data !== "Show Cards"){

        let status = {
            id : 0,
            title : "New Status",
            owner : boardId
        }
        await dataHandler.createNewStatus(status.title, status.owner )
        status.id = await dataHandler.getLastStatusId()
        const columnBuilder = htmlFactory(htmlTemplates.column);
        let column = columnBuilder(status)
        domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns`, column);
        domManager.addEventListener(`.board-column-title[column-title-id='${status.id}']`, "click", columnsManager.changeColumnTitle)
        domManager.addEventListener(`.delete-column-button[data-delete-status-id="${status.id}"], .delete-column-button[data-delete-owner-id="${status.owner}"]`, "click", columnsManager.deleteStatus)
        let delete_buttons = document.querySelectorAll(`.delete-column-button[data-delete-status-id="${status.id}"], .delete-column-button[data-delete-owner-id="${status.owner}"]`)
        for (let delete_button of delete_buttons){
               delete_button.addEventListener("click", columnsManager.deleteStatus)
        }
        let target = document.querySelector(`.board-container[board-id="${boardId}"] .board-columns .board-column[data-column-id="${status.id}"] .board-column-content`)
        await columnsManager.insertDragged([target])
    }
}


async function addCard(clickEvent) {
    const boardId = clickEvent.target.attributes['new-card-id'].nodeValue;
    let button = document.querySelector(`.toggle-board-button[data-board-id="${boardId}"]`)
    if (button.childNodes[0].data !== "Show Cards") {
        let card = {
            id: 0,
            title: "New Card",
            card_order: await dataHandler.getCardOrderByBoardColumnId(boardId, "1") + 1,
            archived: false
        }
        await dataHandler.createNewCard(card.title, boardId, '1', card.card_order, card.archived)
        card.id = await dataHandler.getLastCardId()
        const cardBuilder = htmlFactory(htmlTemplates.card);
        let content = cardBuilder(card)
        await domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns .board-column[data-column-id="1"] .board-column-content`, content);
        await domManager.addEventListener(`.card-title[card-title-id="${card.id}"]`, "click", cardsManager.changeCardTitle)
        await domManager.addEventListener(`.card-remove[data-card-id="${card.id}"]`, "click", cardsManager.deleteButtonHandler)

        let target = document.querySelector(`.card[data-card-id="${card.id}"]`)
        await cardsManager.dragCards([target])
        await cardsManager.insertDragged([target])
    }
}


async function deleteBoard(clickEvent){
    const boardId = clickEvent.target.attributes['delete-board-id'].nodeValue;
    await dataHandler.deleteBoardById(boardId)
    let boards = document.getElementsByClassName('board-container');
    for (let board of boards) {
        if(boardId === board.attributes['board-id'].nodeValue) {
            root.removeChild(board)
            break;
        }
    }
}


function changeBoardTitle(clickEvent) {
    const boardId = clickEvent.target.attributes['title-id'].nodeValue;
    let element = document.querySelector(`.board-title[title-id='${boardId}']`)
    let oldText = element.innerText
    element.addEventListener('focusout', async () =>{
        let title = element.innerText
        if(title === ""){
            element.innerText = "unnamed"
            await dataHandler.renameBoard(boardId, "unnamed")
        }
        else if(title !== oldText){
            await dataHandler.renameBoard(boardId, title)
        }
    })
}
