# Capstone Project (Group 8) - Optimisation of Einstein-First & Quantum Girls Contact Database

This repository is the work conducted for our capstone project working with Einstein-First and Quantum Girls. The original problem to resolve was as follows:
> The primary goal of this project is to enhance and optimize the Einstein-First and Quantum Girls contact database. Currently, the database contains [thousands of contacts], but with the project expanding from a state-level initiative to a national and international scale, the database is expected to grow significantly. Improving its structure and classification system now will ensure efficient management, segmentation, and usability as the project scales.
This project involves analyzing, restructuring, and optimizing the existing database to allow for better sorting, classification, and filtering of various stakeholder groups. The database contains diverse contacts, including educators, industry professionals, policymakers, and students, making it essential to categorize and structure the data effectively.
> I’m seeking assistance in implementing advanced sorting, filtering, tagging, and potential automation tools to streamline the management of this growing dataset.
>- This project offers hands-on experience in data organization, spreadsheet automation, and database management within a real-world context. Students will gain skills in:
>- Advanced Excel functions (pivot tables, formulas, data validation, conditional formatting).
>- Data cleaning and classification techniques for large datasets.
>- Database structuring for scalability and usability.
>- Potential integration with automation tools (e.g., Google Sheets scripting, CRM integration).
> This project is ideal for students with an interest in data management, business intelligence, or digital transformation, and those looking to apply their analytical and technical skills in a meaningful, education-focused initiative.

## MVP

We have decided on a Minimal Viable Product (MVP) that addresses the essential features that fulfill the client's requirements. Upon discussion with the client, the following essential functions were agreed upon:
- Data collection, cleaning, automated categorisation, and integration directly from forms into the database.
- A basic analytics dashboard showing insights from workshops, time periods, referrals, locations, categories, and tags.
- API integration with Mailchimp (or similar services) for automated, personalized emails.
- Functionality to upload and manage contact groups from CSV files.
- Capability to add and manage new features within the interface.
- Finding solutions for integration or hosting via SharePoint/Teams.
- Protecting client data by increasing security to maintain privacy

## Tech Stack

The project is being developed with:
- Django for backend
- PostgreSQL for the database
- React for UI
- Next.js for API routing with Mailchimp / Microsoft Graph / Eventbrite

To demonstrate how the UI will be interacted with by the client (checking user flow), a prototype was created and stills can be found under the closed milestone "Prototype Demo" and closed issue #22 under it.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌱 Environment Configuration

This project uses environment variables to manage database credentials for local development. Each team member should set up their own `.env` file based on the provided template.

### 📄 How to Use the `.env.example` File

1. **Copy the template**

   Rename `.env.example` to `.env` in the project root:

   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file**

   Update the values in `.env` according to your local PostgreSQL setup:

   ```env
   POSTGRES_NAME=quantum
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_actual_password
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   ```

3. **Run the server**

   Once the `.env` file is configured, run the development server as usual:

   ```bash
   python manage.py runserver
   ```

> ⚠️ **Important:** Do **not** commit your `.env` file to version control. It may contain sensitive information. Only `.env.example` should be committed.

