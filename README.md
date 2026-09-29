# Campus Marketplace

A modern campus marketplace where students can buy, sell, search, and manage products within their college community.

## Overview

Campus Marketplace is a responsive React-based web application designed specifically for students. It allows users to browse campus products, view detailed product information, create their own listings, manage listings, and save products to favorites.

## Features

- Browse products with images, names, prices, and categories
- Search products by name
- Filter products by category
- View detailed product information
- Create new product listings
- Edit existing listings
- Delete listings
- Manage personal listings
- Add products to favorites
- Persistent data using browser localStorage
- Responsive design for desktop and mobile devices
- Light and dark themes
- Modern campus-focused UI

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Lucide React
- JavaScript
- LocalStorage

## Project Structure

```text
src/
├── components/
│   ├── Hero.jsx
│   ├── MarketplaceSection.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   └── StarField.jsx
│
├── data/
│   └── products.js
│
├── hooks/
│   └── useLocalStorage.js
│
├── pages/
│   ├── EditListing.jsx
│   ├── Favorites.jsx
│   ├── Marketplace.jsx
│   ├── MyListings.jsx
│   ├── ProductDetails.jsx
│   └── Sell.jsx
│
├── App.jsx
├── index.css
└── main.jsx