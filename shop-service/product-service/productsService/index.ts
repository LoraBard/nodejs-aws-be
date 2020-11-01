import PRODUCTS_LIST from '../mockData';

type ProductType = {
    count: number,
    description: string,
    id: string,
    price: number,
    title: string
};

class Products {
    private products: ProductType[] = PRODUCTS_LIST;

    setProductsList(data: ProductType[]): void {
        this.products = data;
    }

    getProductsList(): ProductType[] {
        return this.products;
    }

    getProductById(id: string): ProductType {
        return this.products.find((product) => product.id === id);
    }
}

export default Products;