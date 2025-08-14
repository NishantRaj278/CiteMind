# 🧠 CiteMind

<div align="center">
  <img src="public/citemind.png" alt="CiteMind Logo" width="120" height="120">
  
  **AI-Powered Research Discovery Platform**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.4.6-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6.18.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-FF6B6B?style=for-the-badge&logo=pinecone&logoColor=white)](https://www.pinecone.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 🚀 Overview

CiteMind is a modern AI-powered research discovery platform that revolutionizes how researchers explore, analyze, and connect scientific papers. Built with cutting-edge technologies, it provides intelligent search capabilities, citation network visualization, trend analysis, and AI-powered research synthesis.

### ✨ Key Features

- 🔍 **AI-Powered Search**: Semantic search with natural language processing
- 🕸️ **Citation Network Visualization**: Interactive network graphs showing paper relationships
- 📈 **Research Trends Analysis**: Dynamic charts revealing emerging research patterns
- 🏆 **Seminal Papers Discovery**: Curated lists of influential research papers
- 🤖 **AI Research Synthesis**: Automated analysis and insights generation
- 🎨 **Modern UI/UX**: Glassmorphism design with smooth animations

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.4.6** - React framework with App Router
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.0** - Modern utility-first CSS framework
- **Chart.js 4.5.0** - Interactive data visualization
- **D3.js 7.9.0** - Advanced data-driven visualizations

### Backend & AI

- **MongoDB 6.18.0** - NoSQL database for paper storage
- **Pinecone** - Vector database for semantic search
- **HuggingFace Inference** - AI model integration
- **Node.js APIs** - RESTful backend services

### Visualization

- **Force-Graph** - Network visualization engine
- **Vis.js** - Advanced network and timeline visualization
- **Custom SVG** - Citation network rendering

---

## 🏗️ Project Structure

```
citemind/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── query/         # Search and AI analysis
│   │   │   ├── papers/        # Paper management
│   │   │   ├── trends/        # Trend analysis
│   │   │   └── seminal-papers/ # Top papers endpoint
│   │   ├── citation/          # Citation network page
│   │   ├── trends/            # Research trends page
│   │   ├── seminal-papers/    # Top papers page
│   │   ├── loading.tsx        # Global loading component
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   └── components/            # Reusable UI components
│       ├── Navbar.tsx         # Navigation component
│       ├── PaperItems.tsx     # Paper display cards
│       ├── LoadingScreen.tsx  # Custom loading screen
│       └── ClientWrapper.tsx  # Client-side wrapper
├── public/                    # Static assets
└── configuration files
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** database
- **Pinecone** account (for vector search)
- **HuggingFace** API access

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/NishantRaj278/CiteMind.git
   cd CiteMind
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**

   Create a `.env.local` file in the root directory:

   ```env
   # MongoDB Configuration
   MONGODB_URI=your_mongodb_connection_string

   # Pinecone Configuration
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX_NAME=your_index_name

   # HuggingFace Configuration
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 API Documentation

### Core Endpoints

| Endpoint                | Method | Description                       |
| ----------------------- | ------ | --------------------------------- |
| `/api/query`            | POST   | Search papers and get AI analysis |
| `/api/papers`           | GET    | Retrieve all papers               |
| `/api/load-papers`      | POST   | Load sample papers into database  |
| `/api/trends`           | GET    | Get research trend analysis       |
| `/api/seminal-papers`   | GET    | Get top influential papers        |
| `/api/citation-network` | GET    | Get citation relationships        |

### Example API Usage

**Search with AI Analysis:**

```javascript
const response = await fetch("/api/query", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "machine learning in healthcare",
    includeAnalysis: true,
  }),
});
```

---

## 🎨 Design System

CiteMind features a modern **Glassmorphism** design system with:

- **Color Palette**: Blue to purple gradients (#2563eb → #7c3aed)
- **Typography**: Montserrat font family with multiple weights
- **Components**: Backdrop blur effects, gradient backgrounds, smooth animations
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 AA compliant

---

## 🔧 Configuration

### Database Setup

1. **MongoDB**: Create a database for storing research papers
2. **Pinecone**: Set up a vector index for semantic search
3. **Collections**: The app will automatically create necessary collections

### AI Models

The platform uses HuggingFace models for:

- **Text Embedding**: Semantic search capabilities
- **Text Summarization**: Research synthesis
- **Analysis Generation**: Automated insights

---

## 📊 Features Deep Dive

### 🔍 AI-Powered Search

- Semantic similarity search using vector embeddings
- Natural language query processing
- Real-time result filtering and ranking
- AI-generated research synthesis

### 🕸️ Citation Network

- Interactive force-directed graph visualization
- Node clustering and relationship mapping
- Hover interactions and detailed paper information
- Export capabilities for further analysis

### 📈 Trends Analysis

- Temporal analysis of research patterns
- Dynamic chart generation with Chart.js
- Publication trends over time
- Topic emergence tracking

### 🏆 Seminal Papers

- Citation-based ranking algorithm
- Curated lists of influential research
- Author impact analysis
- Cross-disciplinary connections

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Nishant Raj**

- GitHub: [@NishantRaj278](https://github.com/NishantRaj278)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/nishantraj1234)

---

## 🙏 Acknowledgments

- **HuggingFace** for AI model APIs
- **Pinecone** for vector database services
- **MongoDB** for data storage solutions
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first approach

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/NishantRaj278/CiteMind/issues) page
2. Create a new issue with detailed description
3. Join our community discussions

---

<div align="center">
  <strong>Built with ❤️ for the research community</strong>
  
  ⭐ Star this repository if you find it helpful!
</div>
