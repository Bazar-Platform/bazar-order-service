# Bazar Order Service

This is a Node.js microservice for managing book purchases in the Bazar online bookstore. It communicates
with the `bazar-catalog-service` to check stock availability and record orders.

## Project Structure

```
bazar-order-service/
├── src/
│   ├── app.js               # The main Node.js application
│   ├── db/
│   │   └── orders.json      # File to store order records
│   └── package.json         # List of dependencies
└── Dockerfile               # Dockerfile at the root
```

## Environment Variables

- **PORT**: The port on which the service will run (default: 5002).
- **CATALOG_URL**: URL for the catalog service, used to check stock availability (default:
  `http://catalog-service:5001`).

## Endpoints

### Purchase a Book

- **POST** `/purchase/:item_number`

  Initiates a purchase for a specific book by `item_number`. It checks the stock in the `catalog-service`, updates the
  stock, and records the order.

    - **Request Body**: ```{ "qty": 1 }```

    - **Response**:
        - Success: ```{ "message": "Purchased <quantity> book(s): <book title>" }```
        - Failure: ```{ "error": "Out of stock" }```

## Build and Run the Services with Docker Compose

### Step 1: Start the Services with Docker Compose

Use Docker Compose to build and start both `order-service` and `catalog-service` in one step.

```bash
docker-compose up --build
```

### Step 2: Access the Order Service

Once the services are running, you can access the order-service API at http://localhost:5002.

### Example Usage

1. **Purchase a Book**:
   ```
   POST http://localhost:5002/purchase/1
   Content-Type: application/json

   {
   "qty": 2
   }
   ```

   This request initiates a purchase of 2 units of the book with `item_number` 1.
