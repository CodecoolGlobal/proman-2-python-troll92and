import { dataHandler } from "./dataHandler.js";
import { htmlFactory, htmlTemplates } from "./htmlFactory.js";
import { domManager } from "./domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card)
            domManager.addChild(`.board-container[board-id="${boardId}"] .board-columns .board-column[data-column-id="${card.status_id}"] .board-column-content`, content)
            domManager.addEventListener(`.card-remove[data-card-id="${card.id}"]`, "click", cardsManager.deleteButtonHandler)
        }
        await cardsManager.dragCards()
        await cardsManager.insertDragged()

    },
    deleteButtonHandler: async function(clickEvent) {
        const cardId = clickEvent.target.attributes['data-card-id'].nodeValue;
        let item = document.querySelector(`.card[data-card-id="${cardId}"]`)
        let parent = item.parentNode

        parent.removeChild(item)
        await dataHandler.deleteCardById(cardId)
    },
    dragCards: async function (){
        let dragAbles = document.getElementsByClassName('card')
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
                if (children.length > 0){
                    for (let order = 1; order < children.length; order++){
                        let child = children[order]
                        card.id = child.attributes[1].nodeValue
                        card.board_id = parent.parentNode.parentNode.parentNode.attributes["board-id"].nodeValue
                        card.status_id = parent.parentNode.attributes["data-column-id"].nodeValue
                        card.card_order = order
                        dataHandler.updateCardPosition(card.id, card.board_id, card.status_id, card.card_order)
                        console.log('update')
                    }
                }
            })
        }

    },
    insertDragged: async function(){
        let cards = document.getElementsByClassName("card")
            for (let card of cards){
                card.addEventListener('dragover', e => {
                    e.preventDefault()
                    const draggable = document.querySelector('.dragging')
                    draggable.setAttribute('is_over_card', 'true')
                    draggable.setAttribute('prev_over_id', draggable.getAttribute('over_id'))
                    draggable.setAttribute('over_id', card.getAttribute('data-card-id'))
                    draggable.setAttribute('over_card', 'true')

                    if (draggable.getAttribute('over_id') !== draggable.getAttribute('prev_over_id')){
                        card.parentNode.insertBefore(draggable, card)
                    }
                })
                card.addEventListener('dragleave',e =>{
                    const draggable = document.querySelector('.dragging')
                    draggable.setAttribute('over_card', 'false')
                })
            }

    },
    isOverCard: async function(){

    }
}



async function cardOrder(boardId, columnId){
    const cards = await dataHandler.getCardOrderByBoardColumnId(boardId,columnId);

}

