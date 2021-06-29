import type { CardType, Card } from './Solitaire';
import { CardV2 } from './SolitaireV2';
import type { CardTypeV2 } from './SolitaireV2';

function init() {
    const types: CardType[] = ['diamonds', 'clubs', 'hearts', 'spades'];
    const values = 13;
    const cards: Card[] = [];
    for (const type of types) {
        for (let value = 0; value < values; value++) {
            const card: Card = {
                type,
                value,
                visible: false,
            };
            cards.push(card);
        }
    }
    return shuffle(cards);
}

function initV2() {
    const types: CardTypeV2[] = ['diamonds', 'clubs', 'hearts', 'spades'];
    const values: number = 13;
    const cards: CardV2[] = [];
    for (const type of types) {
        for (let value = 0; value < values; value++) {
            cards.push(new CardV2(type, value));
        }
    }
    return shuffle(cards);
}

function shuffle<T extends Card[] | CardV2[]>(cards: T): T {
    let currentIndex = cards.length;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [cards[currentIndex], cards[randomIndex]] = [cards[randomIndex], cards[currentIndex]];
    }

    return cards;
}

function getSymbol(type: CardType | CardTypeV2): string {
    switch (type) {
        case 'clubs':
            return '♣';
        case 'diamonds':
            return '♦';
        case 'hearts':
            return '♥';
        case 'spades':
            return '♠';
    }
}

function getValue(value: number): string {
    switch (value) {
        case 0:
            return 'A';
        case 10:
            return 'J';
        case 11:
            return 'Q';
        case 12:
            return 'K';
        default:
            return `${value + 1}`;
    }
}

function getCard(str: `${CardType}.${number}`): Card {
    const [type, value] = str.split('.');
    return {
        type,
        value: parseInt(value, 10),
        visible: true,
    } as Card;
}

export const CardUtil = Object.freeze({
    init,
    initV2,
    shuffle,
    getSymbol,
    getValue,
    getCard,
});
