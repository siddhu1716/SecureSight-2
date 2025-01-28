# SecureSight-2

Secure Sight is a safety-focused AI platform offering advanced solutions for public and personal security. Our core features include:
1- Real-time Threat Detection: Using AI models like YOLO, we identify potential threats such as firearms or knives in live video feeds and send instant alerts via Twilio to designated contacts.
2- Lost Vehicle Tracking: Leveraging AI and object recognition, we assist in locating lost or stolen vehicles by analyzing traffic footage and identifying registered vehicle details.
3- With seamless integration, intuitive interfaces, and proactive alerts, Secure Sight ensures enhanced safety and security for individuals and communities.


Lost Vehicle Tracking System

Overview
This repository contains the implementation of a Lost Vehicle Tracking System that leverages machine learning, OCR, and distributed workers to monitor, detect, and report lost or suspicious vehicles in real time. The system integrates live CCTV camera feeds, a lost vehicle form, and a report incident module to ensure quick and efficient tracking of vehicles across multiple locations.

Features

Real-time Monitoring: Processes live camera feeds to detect vehicles and identify lost or suspicious activity.
OCR Integration: Uses Paddle OCR for license plate recognition.
Distributed Workers:
Worker 1: Handles initial matching against the database (T1, T2).
Worker 2: Matches entries in the database every 6 hours to ensure updates are processed.
Worker 3: Sends alerts to users, police, or other relevant authorities if a match is found.

Alerting System: Sends notifications for detected vehicles to: 
Vehicle owners.
Local police or hospitals in critical scenarios.

Database Layers:
T1 & T2: Stores initial vehicle information and incident reports.
T3: Contains updated matches and actionable insights.

Front-End Interface:
Lost Vehicle Form: For users to report missing vehicles.
Report Incident: For users to report general incidents or suspicious activity.

Workflow
Preprocessing: Processes live camera feeds to extract frames for ML-based analysis.
ML Model 1: Detects vehicles and captures relevant details.
License Plate Recognition: Uses Paddle OCR to extract license plate information.
Database Match:
Workers match data against the database.
If a match is found, actionable insights are derived.

Alerts: Triggers alerts via appropriate channels (user/police/hospital).
Periodic Check: Worker 2 ensures all lost vehicles are re-evaluated every 6 hours.

Technology Stack
Backend: Python, Flask, Boto3
Machine Learning: TensorFlow, YOLO, Paddle OCR
Database: AWS DynamoDB
Cloud Storage: AWS S3
Frontend: React.js
Messaging: Twilio API
Workers: Celery for distributed task management

Folder Structure

Edit
├── backend/
│   ├── app.py               # Main backend application
│   ├── workers/
│   │   ├── worker1.py       # Worker 1 for initial matching
│   │   ├── worker2.py       # Worker 2 for periodic re-evaluation
│   │   ├── worker3.py       # Worker 3 for sending alerts
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
├── models/
│   ├── model1/              # ML Model 1 for vehicle detection
│   ├── model2/              # ML Model 2 for incident analysis
├── scripts/
│   ├── preprocess.py        # Preprocessing scripts
├── README.md
Installation
Clone the repository:

bash
git clone https://github.com/your-username/lost-vehicle-tracking-system.git
cd lost-vehicle-tracking-system
Install dependencies:

Backend:
bash
pip install -r backend/requirements.txt
Frontend:
bash


cd frontend
npm install
Configure AWS:

Set up AWS DynamoDB and S3.
Update the configuration in backend/config.py.
Run the application:

Start the backend:
bash
python backend/app.py
Start the frontend:
bash

cd frontend
npm start
Start workers:

bash
celery -A backend.workers.worker1 worker --loglevel=info
celery -A backend.workers.worker2 worker --loglevel=info
celery -A backend.workers.worker3 worker --loglevel=info
Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes. Ensure all code is properly documented and follows best practices.

License
This project is licensed under the MIT License. See the LICENSE file for more details.