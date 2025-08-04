# Backend

This is the backend for the application. It is a Node.js/Express application that uses Prisma for database access.

## Getting Started

To get started, you will need to have Node.js and npm installed.

### Installation

1.  Clone the repository.
2.  Navigate to the `backend` directory.
3.  Install the dependencies:

    ```
    npm install
    ```

4.  Create a `.env` file in the `backend` directory and add the following environment variables:

    ```
    DATABASE_URL="file:./dev.db"
    JWT_SECRET="a-super-secret-key"
    ```

5.  Seed the database:

    ```
    npm run seed
    ```

### Running the Application

To run the application, use the following command:

```
npm start
```

The application will be available at `http://localhost:3001`.

## API Endpoints

The following are the available API endpoints:

*   `POST /api/auth/login`: Authenticate a user and get a token.
*   `GET /api/products`: Get all products.
*   `GET /api/products/:id`: Get a single product by ID.
*   `POST /api/products`: Create a new product.
*   `PUT /api/products/:id`: Update a product.
*   `DELETE /api/products/:id`: Delete a product.
*   `GET /api/lists/logos`: Get all logos.
*   `POST /api/lists/logos`: Create a new logo.
*   `GET /api/lists/brands`: Get all brands.

## Testing

To run the tests, use the following command:

```
npm test
```
