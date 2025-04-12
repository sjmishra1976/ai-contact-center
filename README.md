# ai-contact-center
## 📌 Key Features in the Repo
### ✅ ollama based model communication with MCP and tools from a chat bot client
### ✅ AI Chatbot with Dialogflow CX – Handles customer queries
### ✅ CRM Integration (Salesforce/Zendesk) – Retrieves order details
### ✅ Live Agent Escalation (Twilio Flex) – Transfers calls/chats when needed
### ✅ Omnichannel Support – Works on Web, WhatsApp, IVR
### ✅ Cloud Deployment Scripts – Deploy on AWS/GCP in 


 ## Technical Architecture Overview
🛠️ Key Components
User Interaction Layer (Omnichannel)

Website, Mobile App, WhatsApp, Email, Social Media, IVR (Voice)
AI & Automation Layer

Conversational AI (Chatbots & IVR AI)
Handles FAQs, troubleshooting, payments, and appointment scheduling
Natural Language Processing (NLP) & Sentiment Analysis
Understands intent and emotions in real-time
AI-Powered Routing
Determines whether the query should be handled by AI or a human agent
Agent Assistance Layer

AI Agent Assist (Suggests responses to live agents)
Knowledge Base Integration (Auto-retrieves relevant articles for agents)
Real-time Speech-to-Text & Call Monitoring
Backend & CRM Integration

Connects AI and human agents to customer data (CRM, databases)
Automates tasks like order tracking, refunds, and scheduling
Analytics & Continuous Learning

Predictive Analytics & Business Intelligence
AI Model Retraining (Improves over time using real interactions)



## 📞 User Channels (Omnichannel)  
-------------------------------------------  
🌐 Website  📱 Mobile App  💬 WhatsApp  ✉️ Email  📞 IVR  
    │  
    ▼  
🤖 AI & Automation Layer  
-------------------------------------------  
🔹 Conversational AI (Chatbots & IVR AI)  
🔹 NLP & Sentiment Analysis  
🔹 AI-Powered Routing  
    │  
    ▼  
👩‍💻 Agent Assistance Layer  
-------------------------------------------  
🔸 AI Agent Assist (Suggested Responses)  
🔸 Knowledge Base Lookup  
🔸 Speech-to-Text & Call Monitoring  
    │  
    ▼  
💾 Backend & CRM Integration  
-------------------------------------------  
🔹 CRM (Salesforce, Zendesk, HubSpot)  
🔹 Order Management Systems  
🔹 Payment Gateways  
    │  
    ▼  
📊 Analytics & Learning Layer  
-------------------------------------------  
🔸 Predictive Analytics & BI Tools  
🔸 AI Model Retraining (Improves Responses)  

## Deployment Guide:

Go to root/backend folder:

1. Install Dependencies:
   $ npm install

2. Start Server Locally:
   $ node app.js

3. Docker Deployment:
   - Build Image: $ docker build -t ai-contact-center .
   - Run Container: $ docker run -p 3000:3000 ai-contact-center

4. Deploy on AWS (EC2):
   - SSH into EC2 Instance
   - Clone Repository: $ git clone <repo-url>
   - Install Node.js & npm
   - Run Application: $ npm start

5. Deploy on GCP (App Engine):
   - Create app.yaml:
     runtime: nodejs14
   - Deploy: $ gcloud app deploy

6. WebSocket & Frontend Setup:
   - Ensure WebSocket is enabled on the hosting service.
   - Serve static files from the 'public' directory.

7. CI/CD Pieline using github action (under .githob/workflows/ci-cd-pipeline.ym)
   - Build Job: Checks out the code. Installs Node.js and dependencies.Runs linting and tests.Builds a Docker image tagged with the current Git SHA.
   - Deploy Job: Authenticates with GCP using the GitHub secret GCP_CREDENTIALS. Deploys the app to Google Cloud App Engine.
   - Notify Job:Sends a Telegram notification on successful deployment.Uses GitHub Secrets for security.

8. CI/CD Pipeline using Jenkins ( root .Jenkinsfile) to GKE
   -  The Docker image is tagged with the GCP project ID and GKE-compatible path:gcr.io/${GCP_PROJECT_ID}/ai-contact-center:${env.BUILD_NUMBER}
   -  Uses gcloud container clusters get-credentials to connect to your GKE cluster.
   -  Applies Kubernetes manifests (k8s/deployment.yaml and k8s/service.yaml).
   -  Runs kubectl rollout status to verify the deployment is successful.

9. Jenkins Configurations
   - Install Plugins: Kubernetes CLI, Google Cloud SDK, Pipeline, Docker Pipeline
   - Jenkins Credentials: Go to Manage Jenkins > Credentials > System > Global credentials > Add credentials
   - Add GCP_PROJECT_ID → Your GCP project ID. GCP_SA_KEY → GCP service account key JSON.
   - Jenkins Docker Permissions: Ensure the Jenkins agent has Docker permissions. Add Jenkins to the Docker group:sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

10. To activate rasa python venv
   - python3 -m venv rasa_env
   - source rasa_env/bin/activate  # Linux/Mac
   - rasa_env\Scripts\activate     # Windows
   - pip show rasa #if installed already else pip install rasa ( note it works properly with python 3.9 and lower)
   - rasa init --no-prompt ( Only first time)
   - rasa train (first model)
   - rasa run --enable-api --cors "*" --debug to start API

11. You can use actions to combine Rasa’s structured NLU and dialogue management with LLM-powered generative responses

12. Using MCP server and client modules which uses LLMs and create context aware tools to be used in client server architecture makes powerful AGENTIC AI apps 
   - under backed/mcp/mcpHandler.js has methods to use some basic tools and llama model locally installed to demonstrate usage of tools association and basic tool routing
   - You will need to install ollama binaries on local and install llama3.2 model, you have option of creating own model from model file and use same in code. ollama is node sdk
     client used for it. It uses chat api, check https://www.npmjs.com/package/ollama for all other APIs available.

     



