import PRODUCTS_LIST from '../mockData';

interface Product {
    count: number;
    description: string;
    id: string;
    price: number;
    title: string;
};

class Products {
    private products: Product[] = PRODUCTS_LIST;

    setProductsList(data: Product[]): void {
        this.products = data;
    }

    getProductsList(): Product[] {
        return this.products;
    }

    getProductById(id: string): Product {
        return this.products.find((product: Product) => product.id === id);
    }
}

export default Products;