# Getting Started

This guide will help you set up the project and understand its structure. Follow the steps below to start development.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Recommended installation via [Node Version Manager (NVM)](https://github.com/coreybutler/nvm-windows).  
  Using NVM allows you to easily switch between Node versions if working on multiple projects.
- **Code Editor**: [VS Code](https://code.visualstudio.com/) is recommended, along with these extensions for development:
  - Tailwind CSS IntelliSense
  - ESLint
  - TypeScript

> **Note**: In the current setup, the project wont build if ESLint throws **any errors or warnings**.

---

## Setting Up the Project

Follow these steps to install and start the project:

1. **Clone the Repository**:  
   Use `git clone https://github.com/K-Lorenz/its` to get the project files.

2. **Open the Project**:  
   Navigate to the folder containing the cloned files.

3. **Install Dependencies**:  
   Run the following command in the terminal:  
   ```bash
   npm install
   ```

   > *Shortcut for VS Code*: Press ``CTRL + SHIFT + ` `` to open an integrated terminal.

4. **Start the Development Server**:  
   Launch the app with:  
   ```bash
   npm run dev
   ```

5. **Access the Application**:  
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## Editing the Application

- To modify the main page, edit the file: `app/page.tsx`.  
- Changes will automatically reflect in the browser upon saving.

---

## Project Structure

### 1. **Main Route (`/`)**
- **File**: `app/page.tsx`
- **Purpose**: This is the Main Page of the application. Here the inputmask aswell as all the steps are displayed. It serves as the default route when users visit the root URL (`/`).

### 2. **Edit Route (`/edit`)**
- **Folder**: `app/edit/`
- **File**: `app/edit/page.tsx`
- **Purpose**: A secondary route for editing functionality. This is where users can modify data.

### 3. **Shared Layout**
- **File**: `app/layout.tsx`
- **Purpose**: Provides a shared structure across all pages, such as a navigation bar, footer, or global styles.

---

## Components

- **Directory**: `components/`
- **Purpose**: Contains reusable UI components used throughout the application.  
  - **Examples**: A markdown editor and display component, a step-by-step process component.

Using components improves consistency and reduces duplication in the codebase.

---

## How the Application Works

Here’s how the various parts of the application work together:

1. **Routing**: Next.js automatically generates routes based on the `app/` folder structure.  
2. **Layouts**: The `layout.tsx` file ensures consistent structure across pages.  
3. **Components**: Reusable elements from `components/` are imported and used in pages or layouts.  
4. **Modular Pages**: Each page is its own isolated module, making development and debugging straightforward.
# Working on the Project

## 1. **GitHub Workflow**
This project uses GitHub for collaboration and issue tracking. Follow these steps to ensure a smooth workflow:

- **Issues**:  
  - Feature requests: Create or review issues with the `feature-request` tag.  
  - Bug reports: Create or review issues with the `bug` tag.  

- **Tags**:  
  - Always tag issues appropriately (e.g., `feature-request`, `bug`, `priority`, etc.).  
  - Add your issue to the **GitHub Project Board** to track its progress.

## 2. **Steps to Work on a Feature or Bug**
1. **Create an Issue**:  
   - Go to the **Issues** tab on GitHub and click "New Issue".  
   - Fill out the details of the issue and select the appropriate tags (e.g., `feature-request` or `bug`).  
   - Add the issue to the GitHub Project Board for tracking.
2. **Creating a feature-Branch**
   - For fixing the bug or adding a new feature create a new Branch
   - Name it so everybody can quickly understand what you are doing
   - Ideally you create the new Branch in the issue (Create a new Branch)
3. **Pull Request**
   - After completing the work create a new pull request into main.
   - The pullrequest should have a small description of what you did.
   - Wait for the project-maintainer to merge the pullrequest
