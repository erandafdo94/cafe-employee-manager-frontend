# Café Management System

A modern web application for managing café information, built with React and .NET Core. This system allows users to create, read, update, and delete café information through a user-friendly interface.

## Features

- **Café Management**
  - View list of cafés
  - Add new café entries
  - Edit existing café information
  - Delete café entries
  - Validation for café data

## Tech Stack

### Frontend

- React 18
- TypeScript
- Material-UI (MUI)
- Formik & Yup for form handling
- Axios for API communication

### Backend

- .NET Core 7.0
- Entity Framework Core
- MediatR for CQRS pattern
- SQL Server

## Prerequisites

- Node.js (v16 or higher)
- .NET Core SDK 7.0
- SQL Server
- Visual Studio 2022 or VS Code

## Getting Started

### Backend Setup

1. Clone the repository

```bash
git clone [repository-url]
```

2. Navigate to the backend directory

```bash
cd CafeManagement/Backend
```

3. Update database connection string in `appsettings.json`

4. Run migrations

```bash
dotnet ef database update
```

5. Start the backend server

```bash
dotnet run
```

The API will be available at `http://localhost:5135`

### Frontend Setup

1. Navigate to the frontend directory

```bash
cd CafeManagement/Frontend
```

2. Install dependencies

```bash
npm install
```

3. Update the API base URL in the configuration if needed

4. Start the development server

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
├── Backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   └── Data/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── pages/
│   └── public/
```

## API Endpoints

### Cafés

- `GET /api/cafe` - Get all cafés
- `GET /api/cafe?id={id}` - Get café by ID
- `PUT /api/cafe?id={id}` - Update café
- `POST /api/cafe` - Create new café
- `DELETE /api/cafe?id={id}` - Delete café

## Data Models

### Café

```typescript
interface Cafe {
  id: string;
  name: string;
  description: string;
  location: string;
  logo: string;
}
```

## Form Validation Rules

- Name: 6-10 characters
- Description: Maximum 256 characters
- Location: Required
- Logo: Optional

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
