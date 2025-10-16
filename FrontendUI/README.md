# Network Device Inventory - FrontendUI

This React app provides a lightweight UI to manage network devices with CRUD, filters, sorting, pagination, and ping actions.

Features:
- Devices table with columns: name, ip, mac, type, location, status, last_ping, actions
- Client-side search and sort
- Server-side pagination and type filter (page, per_page, type)
- Row actions: Edit, Delete, Ping
- Device form with validation for IPv4 and MAC formats
- Accessible alerts via aria-live, responsive design, light/dark theme toggle

Getting Started:
1) Install dependencies
   npm install

2) Configure environment
   Copy .env.example to .env and adjust as needed.
   REACT_APP_API_BASE=http://localhost:3001/api

3) Run the app
   npm start
   Open http://localhost:3000

Structure:
- src/api/client.js: axios instance with base URL from REACT_APP_API_BASE
- src/api/devices.js: devices API wrapper (list, get, create, update, delete, ping)
- src/pages/DevicesPage.jsx: main page logic (load, paginate, filter, alerts)
- src/components/DeviceTable.jsx: table with search/sort and row actions
- src/components/DeviceForm.jsx: create/edit form with validation
- src/components/Pagination.jsx: pagination controls

Notes:
- The frontend expects the backend API to implement endpoints under /devices and /devices/{id}/ping conforming to the provided OpenAPI.
- If the backend returns arrays for list endpoints, we normalize to { items, total }.
