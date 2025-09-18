# ScrapeFlow – Full-Stack SaaS Web App

[ScrapeFlow](https://scrape-flow-rust.vercel.app) is a **full-stack SaaS application**. It allows users to design, execute, and manage automated workflows for web scraping and data extraction.  

The project leverages **Next.js**, **React**, **TypeScript**, **React Flow**, **Prisma**, and **React Query**, and is deployed on [Vercel](https://vercel.com/).

---

## Demo

Check out the live app here: [https://scrape-flow-rust.vercel.app](https://scrape-flow-rust.vercel.app)

---
## Project Overview

ScrapeFlow allows users to design, execute, and manage web scraping workflows with a visual interface. It supports authentication, workflow management, task automation, execution monitoring, and billing. The platform includes features commonly required for SaaS applications, making it an excellent reference for learning full-stack development with Next.js.

### Tech Stack

- **Frontend:** Next.js, React, TypeScript, React Flow  
- **Backend:** Prisma (PostgreSQL), Next.js API routes  
- **State Management:** React Query  
- **Authentication:** NextAuth or custom auth setup  
- **Payments:** Stripe integration  
- **Other:** Workflow execution engine, AI-powered data extraction, webhook delivery

## Features

### User & Authentication
- User account setup and management  
- Authentication system for secure access  
- User balance tracking for workflow execution credits  

### Workflow Management
- Workflows page with workflow cards  
- Workflow creation, duplication, deletion  
- Workflow publishing/unpublishing  
- Workflow execution scheduler  
- Workflow types and validation  

### Tasks / Nodes
- Node/task components with inputs, outputs, and menus  
- Save, delete, and duplicate nodes/tasks  
- Task types include:  
  - Extract text from element  
  - Fill input  
  - Click element  
  - Wait for element  
  - Deliver via webhook  
  - Extract data with AI  
  - Navigate to URL  
  - Scroll to element  
  - Read property from JSON  
  - Add property to JSON  
- Connections validation and deletable edges  
- Workflow execution environment  

### Workflow Execution
- Execution validation and monitoring  
- Execution viewer with multiple parts (logs, real-time updates)  
- Credit consumption during execution  
- Execution history page  
- Log collector  

### Billing & Payments
- Billing page with Stripe integration  
- Credit system for workflow execution  

### Additional Features
- Bypass scraping protections  
- Home page for overview  
- Fully interactive UI with React Flow  
- Modular, reusable components for tasks and workflows  

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
# or
yarn
yarn dev
# or
pnpm install
pnpm dev
