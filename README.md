# SharePlate

SharePlate is a comprehensive food sharing platform that connects home cooks, restaurants, and grocery stores with local consumers. The platform facilitates sharing and selling food items, with a focus on homemade meals, traditional recipes, and reducing food waste through discounted near-expiry items.

## Project Structure

```
shareplate/
├── backend/           # Node.js/Express backend
├── frontend/          # React web application
├── mobile/           # React Native mobile app
└── shared/           # Shared types and utilities
```

## Prerequisites

- Node.js (v16 or later)
- Yarn package manager
- MongoDB
- AWS Account (for S3)
- Firebase Account
- Stripe Account

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shareplate.git
cd shareplate
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:
Create `.env` files in both backend and frontend directories based on the provided `.env.example` files.

4. Start the development servers:

Backend:
```bash
yarn backend:dev
```

Frontend:
```bash
yarn frontend:dev
```

Mobile:
```bash
yarn mobile:dev
```

## Features

- User authentication and authorization
- Food listing management
- Order processing
- Real-time notifications
- Payment integration
- Image upload and management
- Geolocation-based discovery
- Rating and review system

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript, MongoDB
- **Frontend**: React, TypeScript, Styled-components, Tailwind CSS
- **Mobile**: React Native, Expo
- **Authentication**: Firebase Auth
- **Storage**: AWS S3
- **Payment**: Stripe
- **State Management**: React Query, Zustand

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@fransesco_malila](https://twitter.com/fransessco_malila)
Project Link: [https://github.com/fransemalila/shareplate](https://github.com/fransemalila/shareplate)
