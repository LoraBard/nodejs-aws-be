import PRODUCTS_LIST from '../mockData';
import { IProduct } from '../models';


class Products {
    private products: IProduct[] = PRODUCTS_LIST;

    setProductsList(data: IProduct[]): void {
        this.products = data;
    }

    getProductsList(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct {
        return this.products.find((product: IProduct) => product.id === id);
    }
}

export default new Products();