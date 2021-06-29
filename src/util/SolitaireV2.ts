import { CardUtil } from './CardUtil';
import { ArrayUtil } from 'jamyth-web-util';

export type CardTypeV2 = 'diamonds' | 'clubs' | 'hearts' | 'spades';

export class CardV2 {
    constructor(public readonly type: CardTypeV2, public readonly value: number) {}
}

interface ColumnV2 {
    hiddenCards: CardV2[];
    cards: CardV2[];
}

export class SolitaireV2 {
    private static readonly columnSize: number = 7;
    private static readonly pageSize: number = 3;

    private currentDeckIndex: number;
    private decks: CardV2[][];
    private house: Record<CardTypeV2, CardV2[]>;
    private columns: ColumnV2[];

    // Initialize all variables
    constructor() {
        this.currentDeckIndex = 0;
        this.decks = [];
        this.house = {
            diamonds: [],
            clubs: [],
            hearts: [],
            spades: [],
        };
        this.columns = [];

        this.init();
    }

    // --- Setter ---
    toNextDeckPage(): void {
        this.currentDeckIndex = (this.currentDeckIndex + 1) % this.decks.length;
    }

    flipHiddenCard(colIndex: number): void {
        const column = this.getColumn(colIndex);
        if (this.canRevealCard(column)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- hiddenCards length must be greater than 0
            const revealedCard = column.hiddenCards.pop()!;
            column.cards.push(revealedCard);
        }
    }

    // Deck To Column
    pickDeckToColumn(colIndex: number) {
        const column = this.getColumn(colIndex);
        const currentPage = this.decks[this.currentDeckIndex];
        if (!currentPage.length) {
            // Current page is empty
            return;
        }

        // Columns Is Completely Empty
        if (this.isEmptyColumn(column)) {
            if (this.isKing(this.getLastCard(currentPage))) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- currentPage is not empty
                const KingCard = currentPage.pop()!;
                column.cards.push(KingCard);
            }
            return;
        }

        // Columns Has no Cards but hidden cards
        if (this.canRevealCard(column)) {
            return;
        }

        // Column has cards
        if (this.canStackCard(this.getLastCard(column.cards), this.getLastCard(currentPage))) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- currentPage is not empty
            const card = currentPage.pop()!;
            column.cards.push(card);
        }
    }

    // Column To Column
    pickColumnToColumn(fromColIndex: number, fromCardIndex: number, toColIndex: number) {
        const fromColumn = this.getColumn(fromColIndex);
        const toColumn = this.getColumn(toColIndex);

        if (this.isEmptyColumn(toColumn)) {
            if (this.isKing(this.getCardByIndex(fromCardIndex, fromColumn.cards))) {
                if (this.isLastCard(fromCardIndex, fromColumn.cards)) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- from Column always has card
                    const lastCard = fromColumn.cards.pop()!;
                    toColumn.cards.push(lastCard);
                } else {
                    const cards = fromColumn.cards.splice(fromCardIndex);
                    toColumn.cards.push(...cards);
                }
            }
            return;
        }

        if (this.canRevealCard(toColumn)) {
            return;
        }

        if (this.canStackCard(this.getLastCard(toColumn.cards), this.getCardByIndex(fromCardIndex, fromColumn.cards))) {
            if (this.isLastCard(fromCardIndex, fromColumn.cards)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- from Column always has card
                const lastCard = fromColumn.cards.pop()!;
                toColumn.cards.push(lastCard);
            } else {
                const cards = fromColumn.cards.splice(fromCardIndex);
                toColumn.cards.push(...cards);
            }
        }
    }

    // To House
    pickDeckToHouse(): void {
        const currentPage = this.decks[this.currentDeckIndex];
        if (!currentPage.length) {
            // Current page is empty
            return;
        }
        this.pickLastCardToHouse(currentPage);
    }

    pickColumnToHouse(colIndex: number, cardIndex: number) {
        const column = this.getColumn(colIndex);
        if (this.isLastCard(cardIndex, column.cards)) {
            this.pickLastCardToHouse(column.cards);
        }
    }

    // --- Getter ---
    getCurrentDeckPage(): CardV2[] {
        return this.decks[this.currentDeckIndex];
    }

    getHouse(type: CardTypeV2): CardV2[] {
        return this.house[type];
    }

    getColumn(colIndex: number): ColumnV2 {
        const column: ColumnV2 | undefined = this.columns[colIndex];
        if (!column) {
            throw new Error(`Cannot Find Column with index -- ${colIndex}`);
        }
        return column;
    }

    isVictory(): boolean {
        return Object.values(this.house).every((house) => house.length === 13);
    }
    // --- End of Getter ---

    private pickLastCardToHouse(cards: CardV2[]) {
        if (this.canPushToHouse(this.getLastCard(cards))) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- current page is not empty
            const lastCard = cards.pop()!;
            const house = this.getHouse(lastCard.type);
            house.push(lastCard);
        }
    }

    // --- Utility ---
    private canPushToHouse(card: CardV2): boolean {
        const house = this.getHouse(card.type);
        return house.length === card.value;
    }

    private getLastCard(cards: CardV2[]): CardV2 {
        if (!cards.length) {
            throw new Error('Source Cards is empty');
        }
        return cards[cards.length - 1];
    }

    private isLastCard(cardIndex: number, cards: CardV2[]): boolean {
        return cardIndex === cards.length - 1;
    }

    private isEmptyColumn(column: ColumnV2): boolean {
        return column.cards.length === 0 && column.hiddenCards.length === 0;
    }

    private isKing(card: CardV2): boolean {
        return card.value === 12;
    }

    private canRevealCard(column: ColumnV2): boolean {
        return column.hiddenCards.length !== 0 && column.cards.length === 0;
    }

    private canStackCard(topCard: CardV2, bottomCard: CardV2): boolean {
        const colorPair = [this.isRed(topCard), this.isRed(bottomCard)].sort();
        if (!ArrayUtil.areSame([false, true], colorPair)) {
            return false;
        }
        return topCard.value === bottomCard.value + 1;
    }

    private isRed(card: CardV2): boolean {
        return ['hearts', 'diamonds'].includes(card.type);
    }

    private getCardByIndex(cardIndex: number, cards: CardV2[]): CardV2 {
        const card = cards[cardIndex];
        if (card === undefined) {
            throw new Error(`Cannot get card`);
        }
        return card;
    }
    // --- End of Utility ---

    // --- Setup game ---
    private init(): void {
        const restCards = this.initColumn(CardUtil.initV2());
        this.initDecks(restCards);
    }

    private initColumn(cards: CardV2[]): CardV2[] {
        const replica = [...cards];
        for (let i = 0; i < SolitaireV2.columnSize; i++) {
            const hiddenCards = replica.splice(0, i);
            const cards = replica.splice(0, 1);
            this.columns.push({
                hiddenCards,
                cards,
            });
        }
        return replica;
    }

    private initDecks(cards: CardV2[]): void {
        for (let i = 0; i < SolitaireV2.pageSize; i++) {
            this.decks.push(cards.splice(0, SolitaireV2.pageSize));
        }
    }
    // -- End of Setup game ---
}
