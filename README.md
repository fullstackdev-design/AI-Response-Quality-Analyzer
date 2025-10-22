# 🧠 AI Response Quality Analyzer

**Full-stack demo project** built with **Next.js (frontend)** and **Node.js / Express (TypeScript backend)** — showcasing AI response evaluation, parameter sweeps, and mock LLM generation.

---

## 🚀 Live Deployments

| Component | Stack | URL |
|------------|--------|------|
| 🖥️ **Frontend** | Next.js 14 + Tailwind CSS | [https://gal-frontend.onrender.com/](https://gal-frontend.onrender.com/) |
| ⚙️ **Backend** | Express + TypeScript + PostgreSQL | [https://gal-backend.onrender.com/](https://gal-backend.onrender.com/) |
| 🎬 **Demo Video** | 2-minute walkthrough | [View Demo Video → Click Here](demo/demo.mp4) |

---

## 🧩 Overview

This project analyzes the **quality of AI-generated responses** under different model parameters such as:
- `temperature`
- `top_p`
- `n` (number of responses)

Each generated response is scored across multiple quality metrics:
- **Coherence**
- **Relevance**
- **Length Score**
- **Overall Quality**

The frontend visualizes these metrics interactively and allows exporting experiment data as JSON.

---

## ⚙️ Tech Stack

### Frontend
- ⚡ Next.js 14 + TypeScript  
- 🎨 Tailwind CSS  
- 📊 Recharts (for metrics visualization)  
- 🔐 JWT Authentication  

### Backend
- ⚙️ Node.js + Express + TypeScript  
- 🐘 PostgreSQL with Sequelize ORM  
- 🔑 JWT-based authentication  
- 🐳 Dockerized for deployment on Render  

---

## 🧠 Architecture

```mermaid
graph TD
A[Next.js Frontend] -->|API Calls| B[Express Backend]
B -->|Read/Write| C[(PostgreSQL DB)]
B -->|Mock responses| D[Mock LLM Generator]
A -->|JWT Token| B
A -->|Visualize Data| E[Charts / Metrics Viewer]
