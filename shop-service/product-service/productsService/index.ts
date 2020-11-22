import { Client } from "pg";

import { IProduct, CustomError } from "../models";
import dbOptions from "../db/dbOptions";

class Products {
  async getProductsList(): Promise<IProduct[]> {
    const client = new Client(dbOptions);
    await client.connect();
    try {
      const { rows } = await client.query(
        "SELECT * from products LEFT JOIN stocks ON products.id = stocks.product_id"
      );
      return rows;
    } finally {
      await client.end();
    }
  }

  async getProductById(id: string): Promise<IProduct> {
    const client = new Client(dbOptions);
    await client.connect();
    try {
      const {
        rows,
      } = await client.query(
        "SELECT * from products LEFT JOIN stocks ON products.id = stocks.product_id WHERE products.id=$1",
        [id]
      );
      const product = rows[0];
      if (!product) {
        throw new CustomError(`Product with id ${id} is not found`);
      }
      return product;
    }
    catch(error) {
      throw error;
    } 
    finally {
      client.end();
    }
  }

  async createProduct(data: IProduct): Promise<IProduct> {
    const client = new Client(dbOptions);
    await client.connect();
    try {
      const { title, description, price, count } = data;
      await client.query("BEGIN");

      const {
        rows: products,
      } = await client.query(
        "INSERT INTO products (description, price, title) VALUES ($1, $2, $3) RETURNING id",
        [description, price, title]
      );

      await client.query(
        "INSERT INTO stocks (product_id, count) VALUES ($1, $2)",
        [products[0].id, count]
      );
      
      await client.query("COMMIT");
      return;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.end();
    }
  }
}

export default new Products();
