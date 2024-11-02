const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const CATALOG_SERVICE_URL = process.env.CATALOG_URL;
const ORDERS_FILE = path.resolve(__dirname, 'db/orders.json');
const PORT = process.env.PORT;

if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));
}

function recordOrder(order) {
    const data = fs.readFileSync(ORDERS_FILE);
    const orders = JSON.parse(data);
    orders.push(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders));
}

app.post('/purchase/:item_number', async (req, res) => {
    const itemNumber = req.params.item_number;
    const quantity = parseInt(req.body.qty) || 1;

    try {
        console.log(`Checking stock at ${CATALOG_SERVICE_URL}/info/${itemNumber}`);
        const response = await axios.get(`${CATALOG_SERVICE_URL}/info/${itemNumber}`);
        const book = response.data;

        if (book && book.stock >= quantity) {
            console.log(`Updating stock at ${CATALOG_SERVICE_URL}/items/${itemNumber}`);
            await axios.put(`${CATALOG_SERVICE_URL}/items/${itemNumber}`, {
                stock: book.stock - quantity
            }, {
                headers: {'Content-Type': 'application/json'}
            });

            const order = {
                id: itemNumber,
                title: book.title,
                date: new Date().toISOString(),
                qty: quantity
            };
            recordOrder(order);

            res.json({message: `Purchased ${quantity} book${quantity > 1 ? "s" : ""}: ${book.title}`});
        } else {
            res.status(400).json({error: 'Out of stock'});
        }
    } catch (error) {
        if (error.response) {
            console.error(`Error processing purchase: ${error.response.status} - ${error.response.data}`);
            res.status(error.response.status).json({error: error.response.data});
        } else {
            console.error('Error processing purchase:', error.message);
            res.status(500).json({error: 'Failed to process purchase'});
        }
    }
});

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});
