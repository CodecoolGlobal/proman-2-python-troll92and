import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";
import {columnsManager} from "./columnManager.js";
import {boardsManager} from "./boardsManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card)
            domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns .board-column[data-column-id="${card.status_id}"] .board-column-content`, content)
            domManager.addEventListener(`.card-title[card-title-id="${card.id}"]`, "click", cardsManager.changeCardTitle)
            domManager.addEventListener(`.card-archive[data-card-archive-id="${card.id}"]`, "click", boardsManager.toggleArchiveCard)
            domManager.addEventListener(`.card-remove[data-card-id="${card.id}"]`, "click", cardsManager.deleteButtonHandler)
        }
        let dragAbles = document.getElementsByClassName('card')
        await cardsManager.dragCards(dragAbles)
        let all_cards = document.getElementsByClassName("card")
        await cardsManager.insertDragged(all_cards)

    },
    deleteButtonHandler: async function(clickEvent) {
        const cardId = clickEvent.target.attributes['data-card-id'].nodeValue;
        let item = document.querySelector(`.card[data-card-id="${cardId}"]`)
        let parent = item.parentNode

        parent.removeChild(item)
        await dataHandler.deleteCardById(cardId)
    },
    dragCards: async function (dragAbles){
        for (let dragAble of dragAbles){
            await dragAble.addEventListener('dragstart', () => {
                dragAble.classList.add('dragging')
                dragAble.setAttribute('prev_over_id','')
                dragAble.setAttribute('over_id', '')
                dragAble.setAttribute('over_card', 'false')
                dragAble.setAttribute('over_content', 'false')
            })

            await dragAble.addEventListener('dragend', () => {
                dragAble.classList.remove('dragging')
                dragAble.classList.remove('prev_over_id')
                dragAble.classList.remove('over_id')
                dragAble.classList.remove('over_card')
                dragAble.classList.remove('over_content')
                let parent = dragAble.parentNode
                let children = parent.childNodes
                let card = {
                    id : 0,
                    board_id : 0,
                    status_id : 0,
                    card_order: 0
                }
                for (let child of children){
                    card.id = child.attributes[1].nodeValue
                    card.board_id = parent.parentNode.parentNode.parentNode.attributes["board-id"].nodeValue
                    card.status_id = parent.parentNode.attributes["data-column-id"].nodeValue
                    dataHandler.updateCardPosition(card.id, card.board_id, card.status_id)
                }
                columnsManager.orderCards(dragAble)
            })
        }

    },
    insertDragged: async function(cards){
        for (let card of cards){
            let cardId = await card.getAttribute('data-card-id')
            const cardData = await dataHandler.getCard(cardId)
            card.addEventListener('dragover', cardsManager.addDragStatEvent)

            card.addEventListener('dragleave',e =>{
                const draggable = document.querySelector('.dragging')
                draggable.setAttribute('over_card', 'false')
            })
        }
    },
    addDragStatEvent: async function(clickEvent){
        const card = clickEvent.currentTarget
        console.log(card)
        clickEvent.preventDefault()
            const draggable = document.querySelector('.dragging')
            draggable.setAttribute('is_over_card', 'true')
            draggable.setAttribute('prev_over_id', draggable.getAttribute('over_id'))
            draggable.setAttribute('over_id', card.getAttribute('data-card-id'))
            draggable.setAttribute('over_card', 'true')

            if (draggable.getAttribute('over_id') !== draggable.getAttribute('prev_over_id')){
                card.parentNode.insertBefore(draggable, card)
            }
    },
    changeCardTitle: function(clickEvent) {
        const cardId = clickEvent.target.attributes['card-title-id'].nodeValue;
        let element = document.querySelector(`.card-title[card-title-id='${cardId}']`)
        let oldText = element.innerText
        element.addEventListener('focusout', async () =>{
            let title = element.innerText
            if(title === ""){
                element.innerText = "unnamed"
                await dataHandler.renameCard(cardId, "unnamed")
            }
            else if(title !== oldText){
                await dataHandler.renameCard(cardId, title)
            }
        })
    }
}
