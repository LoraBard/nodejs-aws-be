import { Client } from 'pg';

import dbOptions from './dbOptions.js';

async function invoke(): Promise<any> {
  const client = new Client(dbOptions);
  await client.connect();
  try {
    await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id uuid primary key default uuid_generate_v4(),
                title text NOT NULL,
                description text,
                price real
            )`);
    await client.query(`
            CREATE TABLE IF NOT EXISTS stocks (
                product_id uuid,
                count integer,
                foreign key ('product_id') references 'products' ('id')
            )`);

    const productIds = await client.query(`
            INSERT INTO products (description, price, title) VALUES
                ('This Polar Everest Backpack has your back whether on wheels or the streets', 43, 'Polar Everest 3 Backpack'),
                ('This Polar Everest Backpack has your back whether on wheels or the streets', 43, 'Polar Everest 3 Backpack'),
                ('This Polar Everest Backpack has your back whether on wheels or the streets', 43, 'Polar Everest 3 Backpack'),
                ('This elegant Meridet Zip Backpack in Romantic Pink portrays a sophisticated and simple appeal', 30, 'Meridet Zip Backpack'),
                ('This elegant Meridet Zip Backpack in Romantic Pink portrays a sophisticated and simple appeal', 30, 'Meridet Zip Backpack'),
                ('This elegant Meridet Zip Backpack in Romantic Pink portrays a sophisticated and simple appeal', 30, 'Meridet Zip Backpack'),
                ('The Tonny Silver 2020 Backpack has a low-profile, water-resistant design to be carried any and everywhere', 53.2, 'Tonny Silver 2020 Backpack'),
                ('The Tonny Silver 2020 Backpack has a low-profile, water-resistant design to be carried any and everywhere', 53.2, 'Tonny Silver 2020 Backpack'),
                ('The Tonny Silver 2020 Backpack has a low-profile, water-resistant design to be carried any and everywhere', 53.2, 'Tonny Silver 2020 Backpack'),
                ('The Tonny Silver 2020 Backpack has a low-profile, water-resistant design to be carried any and everywhere', 53.2, 'Tonny Silver 2020 Backpack')
            RETURNING id;
                `);

    await client.query(`
            INSERT INTO  stocks (product_id, count) VALUES
                ($1, 20),
                ($2, 11),
                ($3, 22),
                ($4, 12),
                ($5, 23),
                ($6, 11),
                ($7, 12),
                ($8, 23),
                ($9, 20),
                ($10, 11);
            `, productIds.rows.map((item) => item.id));

    const { rows: stocks } = await client.query(`select * from stocks`);
    console.log(stocks);
  } catch (err) {
    console.error('Error during database request executing:', err);
  } finally {
    client.end();
  }
}

invoke();
