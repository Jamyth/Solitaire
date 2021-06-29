import { ArrayUtil } from 'jamyth-web-util';
import { CardUtil } from './CardUtil';
import { ForceRender } from './decorators/ForceRender';
export type CardType = 'diamonds' | 'hearts' | 'clubs' | 'spades';

export interface Card {
    type: CardType;
    value: number;
    visible: boolean;
}

type CardWithType<T extends CardType> = { [K in keyof Card]: K extends 'type' ? T : Card[K] };

export class Solitaire {
    static init() {
        const cards = CardUtil.init();
        const numberOfCols = 7;
        const columns: Card[][] = [];
        const decks: Card[][] = [];
        for (let i = 1; i < numberOfCols + 1; i++) {
            const _cards = cards.splice(0, i);
            _cards[_cards.length - 1].visible = true;
            columns.push(_cards);
        }
        cards.forEach((_) => (_.visible = true));
        const shape = Array(Math.ceil(cards.length / 3)).fill(3);
        let offset = 0;
        shape.forEach((size) => {
            decks.push(cards.slice(offset, offset + size));
            offset += size;
        });
        return { columns, decks };
    }

    static isRed(card: Card): boolean {
        return ['diamonds', 'hearts'].includes(card.type);
    }

    private columns: Card[][];
    private decks: Card[][];

    private iterationIndex: number;
    private shownCards: Card[];

    private diamonds: CardWithType<'diamonds'>[];
    private hearts: CardWithType<'hearts'>[];
    private clubs: CardWithType<'clubs'>[];
    private spades: CardWithType<'spades'>[];

    constructor() {
        const { columns, decks } = Solitaire.init();
        this.columns = columns;
        this.decks = decks;

        this.iterationIndex = 0;
        this.shownCards = [];

        this.diamonds = [];
        this.hearts = [];
        this.clubs = [];
        this.spades = [];

        this.pick = this.pick.bind(this);
        this.getNextShownCards = this.getNextShownCards.bind(this);
        this.getShownCards = this.getShownCards.bind(this);
    }

    @ForceRender()
    pick(card: Card, colIndex?: number) {
        if (colIndex !== undefined) {
            this.pickToColumn(card, colIndex);
        } else {
            this.pickToHouse(card);
        }
    }

    @ForceRender()
    getNextShownCards() {
        this.iterationIndex = (this.iterationIndex + 1) % this.decks.length;
        this.shownCards = this.decks[this.iterationIndex];
        return this.shownCards;
    }

    @ForceRender()
    flipCard(card: Card, colIndex: number) {
        const column = this.columns[colIndex];
        if (!column) {
            return;
        }
        const lastCard = column[column.length - 1];
        if (lastCard.type === card.type && lastCard.value === card.value && !lastCard.visible) {
            column[column.length - 1].visible = true;
        }
    }

    getShownCards() {
        return this.shownCards;
    }

    getHouseCards(type: CardType): Card[] {
        switch (type) {
            case 'diamonds':
                return this.diamonds;
            case 'clubs':
                return this.clubs;
            case 'hearts':
                return this.hearts;
            case 'spades':
                return this.spades;
        }
    }

    getColumnCards(colIndex: number): Card[] {
        return this.columns[colIndex];
    }

    findColumnByCard(card: Card | string): number | undefined {
        let _card: Card;
        let index: number | undefined;
        if (typeof card === 'string') {
            _card = CardUtil.getCard(card as any);
        } else {
            _card = card;
        }
        this.columns.forEach((_, i) => {
            const exist = _.find((_) => _.type === _card.type && _.value === _card.value);
            if (exist) {
                index = i;
            }
        });
        return index;
    }

    // eslint-disable-next-line sonarjs/cognitive-complexity -- temp fix
    private pickToColumn(card: Card, colIndex: number) {
        const column: Card[] | undefined = this.columns[colIndex];
        if (!column) {
            return;
        }

        const lastCard: Card | undefined = column[column.length - 1];

        if (!lastCard && card.value === 12) {
            const fromColIndex = this.findColumnByCard(card);
            if (fromColIndex !== undefined) {
                const fromColumn = this.columns[fromColIndex];
                const fromColumnLastCard: Card | undefined = fromColumn[fromColumn.length - 1];

                if (fromColumnLastCard?.type === card.type && fromColumnLastCard.value === card.value) {
                    column.push(card);
                    fromColumn.splice(fromColumn.length - 1, 1);
                } else {
                    const cardIndex = fromColumn.findIndex((_) => _.type === card.type && _.value === card.value);
                    if (cardIndex !== -1) {
                        const cards = fromColumn.splice(cardIndex, fromColumn.length - 1);
                        column.push(...cards);
                    }
                }
            } else {
                column.push(card);
                this.decks = this.findAndRemoveCard(card, this.decks);
            }
            return;
        } else if (!lastCard) {
            return;
        }

        const colorPair = [Solitaire.isRed(lastCard), Solitaire.isRed(card)].sort();

        if (ArrayUtil.areSame([false, true], colorPair) && lastCard.value === card.value + 1) {
            const fromColIndex = this.findColumnByCard(card);
            if (fromColIndex === undefined) {
                column.push(card);
                this.decks = this.findAndRemoveCard(card, this.decks);
                return;
            }
            const fromColumn = this.columns[fromColIndex];
            const fromColumnLastCard: Card | undefined = fromColumn[fromColumn.length - 1];

            if (fromColumnLastCard?.type === card.type && fromColumnLastCard.value === card.value) {
                column.push(card);
                fromColumn.splice(fromColumn.length - 1, 1);
            } else {
                const cardIndex = fromColumn.findIndex((_) => _.type === card.type && _.value === card.value);
                if (cardIndex !== -1) {
                    const cards = fromColumn.splice(cardIndex, fromColumn.length - 1);
                    column.push(...cards);
                }
            }
        }
    }

    private pickToHouse(card: Card) {
        let columns: CardWithType<any>[];
        switch (card.type) {
            case 'diamonds':
                columns = this.diamonds;
                break;
            case 'clubs':
                columns = this.clubs;
                break;
            case 'hearts':
                columns = this.hearts;
                break;
            case 'spades':
                columns = this.spades;
                break;
        }
        if (card.value === columns.length) {
            columns.push(card);
            this.decks = this.findAndRemoveCard(card, this.decks);
            this.columns = this.findAndRemoveCard(card, this.columns);
        }
    }

    private findAndRemoveCard(target: Card, cards: Card[][]) {
        cards.forEach((_) => {
            const exist = _.find((_) => _.type === target.type && _.value === target.value);
            if (exist) {
                const index = _.indexOf(exist);
                _.splice(index, 1);
            }
        });
        return cards;
    }
}
