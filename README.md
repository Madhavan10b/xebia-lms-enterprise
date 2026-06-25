# Geeknito Studio - Course Management Portal

This project is a unified Course Management application featuring a high-fidelity **Spring Boot + JPA** backend and a premium, responsive **React 18 + TypeScript + Tailwind CSS** frontend.

---

## 🎨 Design System & UI Themes
The interface utilizes a modern **Light Mode Glassmorphism** system with:
- **Tranquil Velvet (Primary)**: `#6C1D5F`
- **Emerald (Success Accent)**: `#01AC9F`
- **Sunset Orange (CTA)**: `#FF6200`
- **Rotating Glow Orbs**: Embedded background graphics animated using CSS.
- **Micro-interactions**: Transition animations powered by Framer Motion.

---

## 📂 Project Structure
- **/frontend**: React + TypeScript + Vite + Tailwind CSS source code.
- **/src/main/java**: Spring Boot backend application (JPA entities & REST controllers).
- **/src/main/resources/static**: Directory where production-compiled frontend assets are deployed.

---

## 🚀 How to Run the Project

We have included two quick-start script files in the project root to automate command line execution.

### Option 1: Running in Development Mode (Recommended for testing changes)
This runs the frontend on a hot-reloading dev server on port `5173` and proxies `/api` calls to the Spring Boot backend on port `8085`.

1. **Start the Backend**:
   Open a terminal in the root directory and run:
   ```bash
   mvn spring-boot:run
   ```
2. **Start the Frontend**:
   Open a **second** terminal window and run:
   ```cmd
   .\run_dev.bat
   ```
   *(Alternatively, you can double-click the `run_dev.bat` file directly in Windows File Explorer)*
3. **Explore**:
   Open your browser and navigate to **`http://localhost:5173`**.

---

### Option 2: Running in Production Mode (Unified Server)
This compiles the React app into HTML, CSS, and JS, placing the build directly into Spring Boot's static folder so it can be served as a single standalone app.

1. **Build the Assets**:
   Open a terminal in the root directory and run:
   ```cmd
   .\build_frontend.bat
   ```
   *(Alternatively, you can double-click the `build_frontend.bat` file directly in Windows File Explorer)*
2. **Start Spring Boot**:
   In the terminal, run:
   ```bash
   mvn spring-boot:run
   ```
3. **Explore**:
   Open your browser and navigate to **`http://localhost:8085/`**.

---

## 📊 Available REST API Endpoints
- **Get All Courses**: `GET http://localhost:8085/api/courses`
- **Create a Course**: `POST http://localhost:8085/api/courses`
- **Get All Categories**: `GET http://localhost:8085/api/categories`
- **Create a Category**: `POST http://localhost:8085/api/categories`
