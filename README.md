# Bookmark Manager

A modern web application built with Next.js, TypeScript, and shadcn/ui that helps users organize their bookmarks in a clean and intuitive interface. Created during a late-night coding session when I needed a better way to manage my growing collection of developer resources, tutorials, and documentation links.

As a developer, I found myself drowning in browser bookmarks and couldn't find a tool that matched my needs for organizing and quickly accessing my resources. So, I built one.

## Features

- **Folder Organization**: Create and manage folders to categorize your bookmarks
- **Rich Bookmark Details**: Save URLs with custom titles and descriptions
- **Modern UI**: Built with shadcn/ui components for a clean, consistent design
- **Type Safety**: Implemented with TypeScript for improved code reliability
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Data Security**: All bookmark data is encrypted to ensure privacy

## Tech Stack

- **Frontend Framework**: Next.js
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS (via shadcn/ui)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bookmark-manager.git
cd bookmark-manager
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Creating a Folder**:
   - Click the "New Folder" button
   - Enter folder name
   - Press Enter or click Create

2. **Adding Bookmarks**:
   - Select a folder
   - Click "Add Bookmark"
   - Enter URL, title, and description
   - Click Save

3. **Managing Bookmarks**:
   - Edit bookmark details
   - Move bookmarks between folders
   - Delete unwanted bookmarks

## Roadmap

This is Version 1.0, built as a solution to my personal need for better bookmark management. Future plans include:

### Version 2.0
- **Authentication**: User accounts with secure login
- **Theme Support**: Dark/light mode toggle
- **Browser Extension**: 
  - Quick bookmark saving from any webpage
  - Powerful search capabilities across all bookmarks
  - Keyboard shortcuts for rapid access

### Version 3.0
- Tag-based organization
- Bookmark sharing between users
- Custom bookmark collections
- Analytics and insights
- Mobile app

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Personal Note

This project was born out of necessity during a late-night coding session. As developers, we often find ourselves collecting countless valuable resources, and managing them efficiently can become a real challenge. This tool aims to solve that problem, and I hope other developers find it as useful as I do.
