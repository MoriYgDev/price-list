# Price List Management System

This project consists of a frontend (React.js with TypeScript) and a backend (Node.js with Express and Prisma) designed to manage product price lists. It includes features for viewing products (publicly) and an authenticated admin panel for adding, editing, and deleting products and managing logos.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Build & Serve](#production-build--serve)
- [Deployment](#deployment)
  - [Environment Variables](#environment-variables)
  - [General Deployment Steps](#general-deployment-steps)
- [Admin Credentials (Default)](#admin-credentials-default)

## Features

* **Public Product List:** View all products with details, including logos, brands, prices, and profit percentages.
* **Search & Sort:** Filter products by name, brand, or partner name, and sort them by various criteria.
* **Admin Authentication:** Secure login for administrators.
* **Product Management:** Add, edit, and delete products via a dedicated admin dashboard.
* **Logo Management:** Add new logos which can be associated with products.
* **Responsive Design:** User-friendly interface adaptable to different screen sizes.
* **RTL Support:** Right-to-left language support for the UI.
* **Dark/Light Mode:** Toggle between dark and light themes.

## Technologies Used

### Frontend

* **React.js**: A JavaScript library for building user interfaces.
* **TypeScript**: A superset of JavaScript that adds static typing.
* **Vite**: A fast build tool for modern web projects.
* **Material-UI (MUI)**: A popular React UI framework.
* **React Hook Form**: For form management with validation.
* **Axios**: For making HTTP requests to the backend.
* **Jalali-Moment & Date-Fns-Jalali**: For Persian (Shamsi) date handling.
* **Stylis & Stylis-Plugin-RTL**: For RTL styling support in MUI.

### Backend

* **Node.js**: JavaScript runtime for server-side logic.
* **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
* **Prisma**: A modern database toolkit (ORM) for Node.js and TypeScript.
* **SQLite**: Lightweight, file-based database (used for development, easily changeable with Prisma).
* **Bcrypt.js**: For password hashing.
* **JSON Web Token (JWT)**: For user authentication.
* **Multer**: For handling multipart/form-data (file uploads).
* **CORS**: Middleware for enabling Cross-Origin Resource Sharing.

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js**: Version 18 or higher.
* **npm** (Node Package Manager) or **Yarn**: Comes bundled with Node.js.
* **Git**: For cloning the repository.

## Getting Started

Follow these steps to set up the project locally.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd price-list/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend/` directory with the following content:
    ```dotenv
    DATABASE_URL="file:./dev.db" # Or your production database URL
    JWT_SECRET="your-super-secret-key" # Replace with a strong, random key
    PORT=3001 # Or your desired port
    ```
    * **`DATABASE_URL`**: This specifies your database connection. For development, `file:./dev.db` creates a SQLite file. For production, you would replace this with your production database URL (e.g., PostgreSQL, MySQL).
    * **`JWT_SECRET`**: A secret key used to sign JWTs. **Crucially, change this to a long, random, and strong string for production environments.**
    * **`PORT`**: The port on which the backend server will run.

4.  **Run database migrations and seed initial data:**
    ```bash
    npx prisma migrate dev --name init
    npm run seed
    ```
    * `npx prisma migrate dev`: Applies pending database migrations and creates the database schema. The `--name init` provides a name for the initial migration.
    * `npm run seed`: Populates the database with an initial admin user (username: `admin`, password: `password123`). **Change this default password immediately after deployment for security.**

5.  **Create the `uploads` directory:**
    The backend uses `multer` to store uploaded logo images. Create this directory in the `backend/` folder:
    ```bash
    mkdir uploads
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

3.  **Update API base URL:**
    You need to update the `baseURL` in `frontend/src/services/api.ts` and `frontend/src/pages/ClientPage.tsx` to point to your backend server.

    **File:** `frontend/src/services/api.ts`
    ```typescript
    // src/services/api.ts
    import axios from 'axios';

    // Use an environment variable for the backend URL
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

    const api = axios.create({
      baseURL: API_BASE_URL,
    });

    export default api;
    ```

    **File:** `frontend/src/pages/ClientPage.tsx`
    ```typescript
    // src/pages/ClientPage.tsx
    // ... (other imports)
    import MyLogo from '../assets/afratec asli.png';

    // Get the base URL for backend static assets from environment variable
    const BACKEND_STATIC_URL = import.meta.env.VITE_BACKEND_STATIC_URL || 'http://localhost:3001';

    type Order = 'asc' | 'desc';
    type SortableKeys = keyof Product | 'brand' | 'logo';

    // Row Sub-Component for expandable details
    const Row = (props: { product: Product }) => {
        const { product } = props;
        const [open, setOpen] = useState(false);
        const finalPrice = product.price * (1 + product.profitPercentage / 100);
        const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price) + ' ریال';
        const formatDate = (date: string) => moment(date).locale('fa').format('YYYY/MM/DD');
        // Use the environment variable for logo paths
        // const backendUrl = 'http://localhost:3001'; // OLD LINE
        const backendUrl = BACKEND_STATIC_URL; // NEW LINE

        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover onClick={() => setOpen(!open)}>
                    <TableCell><IconButton aria-label="expand row" size="small">{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton></TableCell>
                    <TableCell>
                        <img
                            src={`${backendUrl}${product.logo.filePath}`}
                            alt={product.logo.name}
                            style={{
                                maxHeight: '40px',
                                maxWidth: '120px',
                                verticalAlign: 'middle'
                            }}
                        />
                    </TableCell>
                    {/* ... rest of the component ... */}
                </React.Fragment>
            );
        }
    ```

    **Create a `.env` file in the `frontend/` directory:**
    ```dotenv
    VITE_API_BASE_URL="http://localhost:3001/api" # Replace with your deployed backend API URL
    VITE_BACKEND_STATIC_URL="http://localhost:3001" # Replace with your deployed backend URL for static files
    ```
    * **`VITE_API_BASE_URL`**: The URL where your backend API is accessible.
    * **`VITE_BACKEND_STATIC_URL`**: The URL where your backend serves static files (specifically, uploaded logos). This is typically the same as the base backend URL but without the `/api` suffix.

## Running the Application

### Development Mode

To run both frontend and backend concurrently in development:

1.  **Start the backend server:**
    Open a new terminal, navigate to `price-list/backend/` and run:
    ```bash
    npm start # Or node index.js if you don't have a start script
    ```
    *(Note: You might want to add a `start` script to `backend/package.json` like ` "start": "node index.js"` for convenience)*

2.  **Start the frontend development server:**
    Open another terminal, navigate to `price-list/frontend/` and run:
    ```bash
    npm run dev
    # or yarn dev
    ```

The frontend will typically be available at `http://localhost:5173` (or another port Vite chooses), and it will communicate with the backend running on `http://localhost:3001`.

### Production Build & Serve

For a production environment, you should build the frontend and then serve it.

1.  **Build the frontend for production:**
    Navigate to `price-list/frontend/` and run:
    ```bash
    npm run build
    # or yarn build
    ```
    This will create a `dist/` directory inside `frontend/` containing the optimized production-ready files.

2.  **Serve the production build (for testing locally):**
    You can preview the built application using Vite's `preview` command:
    ```bash
    npm run preview
    # or yarn preview
    ```
    This will serve the static files from the `dist/` directory.

## Deployment

Deploying the application involves setting up the backend server and serving the frontend's static build files. The exact steps can vary based on your hosting provider (e.g., Vercel, Netlify, DigitalOcean, AWS, etc.).

### Environment Variables

Ensure all necessary environment variables are set on your production server:

For the **Backend**:

* `DATABASE_URL`: Your production database connection string.
* `JWT_SECRET`: A strong, random secret key.
* `PORT`: The port your server will listen on (e.g., `80` or `3001`).

For the **Frontend** (typically set during build process or within your hosting platform):

* `VITE_API_BASE_URL`: The full URL to your deployed backend API (e.g., `https://api.yourdomain.com/api`).
* `VITE_BACKEND_STATIC_URL`: The full URL to your deployed backend for static assets (e.g., `https://api.yourdomain.com`).

### General Deployment Steps

Here's a generalized outline for deploying to a Linux-based server:

1.  **Clone the repository:**
    On your server, clone your project repository.
    ```bash
    git clone <your-repository-url> price-list
    cd price-list
    ```

2.  **Backend Deployment:**
    a.  **Install dependencies:**
        ```bash
        cd backend
        npm install --production # Install only production dependencies
        ```
    b.  **Configure Environment Variables:**
        Set your `DATABASE_URL`, `JWT_SECRET`, and `PORT` as environment variables on your server. How you do this depends on your server setup (e.g., directly in a service file, using a `.env` file with a process manager like PM2, or via your hosting platform's dashboard).
    c.  **Run Migrations:**
        Ensure your production database is set up and run Prisma migrations.
        ```bash
        npx prisma migrate deploy # For production environment
        npm run seed # If you need to seed initial data
        ```
    d.  **Create `uploads` directory:**
        ```bash
        mkdir uploads
        ```
    e.  **Start the Backend:**
        Use a process manager like PM2 to keep your Node.js application running reliably.
        ```bash
        npm install -g pm2 # Install PM2 globally if you haven't
        pm2 start index.js --name price-list-backend
        pm2 save # Saves the process list to restart on boot
        ```
        Make sure the `uploads` directory and its contents are persisted across deployments/restarts if you're storing user-uploaded logos there.

3.  **Frontend Deployment:**
    a.  **Build the Frontend:**
        Navigate back to the root of the project, then to the frontend directory.
        ```bash
        cd ../frontend
        npm run build # This creates the 'dist' folder
        ```
    b.  **Configure Frontend Environment Variables (for build time):**
        Ensure `VITE_API_BASE_URL` and `VITE_BACKEND_STATIC_URL` are correctly set as environment variables before running `npm run build` on your CI/CD or deployment environment. Vite injects these at build time.
    c.  **Serve Static Files:**
        The `dist/` folder generated by `npm run build` contains all the static assets for your frontend. You need to configure a web server (like Nginx or Apache) or use a static site hosting service (like Netlify, Vercel, GitHub Pages) to serve these files.

        **Example using Nginx (on a Linux server):**
        Create an Nginx configuration file (e.g., `/etc/nginx/sites-available/price-list`)
        ```nginx
        server {
            listen 80;
            server_name yourdomain.com [www.yourdomain.com](https://www.yourdomain.com); # Replace with your domain

            # Serve frontend static files
            location / {
                root /path/to/your/price-list/frontend/dist; # Absolute path to your frontend dist folder
                try_files $uri $uri/ /index.html;
            }

            # Proxy API requests to the backend server
            location /api/ {
                proxy_pass http://localhost:3001/api/; # Match your backend port and API path
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
            }

            # Serve uploaded static files from backend
            location /uploads/ {
                alias /path/to/your/price-list/backend/uploads/; # Absolute path to your backend uploads folder
            }
        }
        ```
        *Replace `/path/to/your/price-list/` with the actual absolute path on your server.*

        Enable the site and restart Nginx:
        ```bash
        sudo ln -s /etc/nginx/sites-available/price-list /etc/nginx/sites-enabled/
        sudo nginx -t # Test Nginx configuration
        sudo systemctl restart nginx
        ```

    d.  **Consider HTTPS:**
        For production, always use HTTPS. You can obtain SSL/TLS certificates using Let's Encrypt with Certbot.

## Admin Credentials (Default)

* **Username**: `admin`
* **Password**: `password123`

**IMPORTANT:** Change this password immediately after the first login in a production environment.

---

### File Modifications Summary:

Here's a summary of the exact lines to change in your files:

1.  **`frontend/src/services/api.ts`**:
    * **Original:** `const api = axios.create({ baseURL: 'http://localhost:3001/api', });`
    * **Modified:**
        ```typescript
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
        const api = axios.create({
          baseURL: API_BASE_URL,
        });
        ```

2.  **`frontend/src/pages/ClientPage.tsx`**:
    * **Original (inside `Row` component):** `const backendUrl = 'http://localhost:3001';`
    * **Modified (at the top of `ClientPage.tsx` component, outside the `Row` component):**
        ```typescript
        const BACKEND_STATIC_URL = import.meta.env.VITE_BACKEND_STATIC_URL || 'http://localhost:3001';
        // ... (inside Row component)
        const backendUrl = BACKEND_STATIC_URL; // Use the environment variable
        ```

3.  **Create new file: `frontend/.env`**:
    Add this file in the `frontend/` directory:
    ```dotenv
    VITE_API_BASE_URL="http://localhost:3001/api"
    VITE_BACKEND_STATIC_URL="http://localhost:3001"
    ```

4.  **Create new file: `backend/.env`**:
    Add this file in the `backend/` directory:
    ```dotenv
    DATABASE_URL="file:./dev.db"
    JWT_SECRET="your-super-secret-key"
    PORT=3001
    ```
    (Ensure you replace `your-super-secret-key` with a strong, random key.)

5.  **Add `start` script to `backend/package.json` (optional but recommended for consistency):**
    * Find the `"scripts"` section and add:
        ```json
        "start": "node index.js"
        ```

---
