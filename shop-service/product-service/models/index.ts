export interface IProduct {
    count: number;
    description: string;
    id: string;
    price: number;
    title: string;
}

export class CustomError extends Error {
    errorMessage: string;
    constructor(public message: string) {
        super(message);
        this.errorMessage = message;
        this.stack = (<any>new Error()).stack;
    }
    toString() {
        return this.errorMessage;
    }
}