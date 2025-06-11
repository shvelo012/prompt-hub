1. Prompt:
What are the steps to integrate Sequelize with a Next.js project using PostgreSQL?

Project:
Initial database setup and Sequelize integration.

Verification:
AI provided a complete step-by-step guide:

Install necessary packages (sequelize, pg, pg-hstore)

Create and configure a Sequelize instance

Define models using sequelize.define or class-based models

Run migrations

I followed this advice closely. I slightly customized the setup to fit a models/ directory structure. The connection logic worked immediately. I later added error handling around model imports based on AI recommendations.

2. Prompt:
How to convert prompt template string like 'Translate {text} to {language}' into a filled string using provided variables in js?

Project:
Creating the logic for executing a prompt with dynamic variable substitution.

Verification:
AI suggested using a regex with .replace(/{(.*?)}/g, ...). This worked as-is and was implemented. 

3. Prompt:
How to validate that all input variables are filled before making API request?

Project:
Form validation for prompt execution.

Verification:
AI recommended checking for empty string values before submission. I implemented this inside PromptCard's onSubmit handler.

4. Prompt:
How to integrate AI into my project to generate text responses using OpenAI API?

Project:
Implemented AI text generation for prompt execution in BE.

Verification:
The AI integration steps were mostly accurate. I had to adjust the API call structure and error handling to fit my project’s setup and add loading states for better UX. Overall, the guidance helped me implement the core functionality quickly.

5. Prompt:
What is a good commit message format for feature additions, bug fixes, and refactoring?

Project Part:
Writing concise and descriptive git commit messages following conventional commits style.

Verification:
AI suggested standard prefixes (feat:, fix:, refactor:) which helped keep commits clear. Followed advice consistently.

