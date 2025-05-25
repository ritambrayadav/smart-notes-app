Prerequisites
Node.js (v20+ recommended)

npm

AWS DynamoDB (Local or Cloud)

Dynamoose (installed via dependencies)

🛠 Steps to Run Backend Locally
Navigate to the backend folder:

cd backend
Install dependencies:

npm install

# or

yarn install
Set up environment variables:

A .env file needs to be created.
Example required variables:

PORT=8000

# AWS Credentials (DO NOT expose in public repos)

AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-south-1

# JWT Token secret

JWT_SECRET=your_jwt_secret

# HuggingFace for AI-based summaries/tagging

HUGGINGFACE_API_KEY=your_huggingface_api_key

# Node environment

NODE_ENV=local

# or for development with auto-reload:

npm run dev
The backend should now be running at:

http://localhost:8000
🔐 Notes
The backend uses HTTP-only cookies for authentication.

Make sure CORS and cookie settings are properly configured to allow frontend requests:

"compromise" library is used to extract the tags as Hugging face and openAI was not working properly. "compromise" lib is not much accurate.