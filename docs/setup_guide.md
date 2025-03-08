# Deployment Instructions

## Deployment Guide:

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
