import { IProduct } from '../models';

const delayResponse = async (data: IProduct[] | IProduct, delay: number): Promise<IProduct[] | IProduct> => {
    return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

export default delayResponse;