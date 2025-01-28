# SecureSight-2

SecureSight-2 is a comprehensive AI-powered security platform that provides advanced solutions for public and personal safety through real-time threat detection and lost vehicle tracking capabilities.

## Features

### Real-time Threat Detection
- Utilizes YOLO AI models for identifying potential security threats
- Monitors live video feeds for dangerous objects (firearms, weapons)
- Sends instant alerts via Twilio integration to designated contacts

### Lost Vehicle Tracking System
- AI-powered vehicle detection and recognition
- Real-time monitoring through CCTV camera feeds
- License plate recognition using Paddle OCR
- Distributed worker system for efficient processing
- Comprehensive alerting system for stakeholders

## System Architecture

### Distributed Workers
1. **Worker 1**: Handles initial database matching (T1, T2)
2. **Worker 2**: Performs periodic database matching every 6 hours
3. **Worker 3**: Manages alert distribution to users and authorities

### Database Structure
- **T1 & T2**: Primary storage for vehicle information and incident reports
- **T3**: Stores matched data and actionable insights

### Front-End Components
- Lost Vehicle Form
- Incident Reporting Module
- Real-time Monitoring Dashboard

## Technology Stack

### Backend
- Python
- Flask
- Boto3
- Celery (for worker management)

### Machine Learning
- TensorFlow
- YOLO
- Paddle OCR

### Cloud Infrastructure
- AWS DynamoDB
- AWS S3

### Frontend
- React.js

### Communication
- Twilio API

## Project Structure
```
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
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/SecureSight-2.git
cd SecureSight-2
```

2. Install backend dependencies:
```bash
pip install -r backend/requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Configure AWS:
   - Set up AWS DynamoDB and S3
   - Update configuration in `backend/config.py`

## Running the Application

1. Start the backend server:
```bash
python backend/app.py
```

2. Launch the frontend:
```bash
cd frontend
npm start
```

3. Start the workers:
```bash
celery -A backend.workers.worker1 worker --loglevel=info
celery -A backend.workers.worker2 worker --loglevel=info
celery -A backend.workers.worker3 worker --loglevel=info
```

## Workflow

1. **Preprocessing**: Process live camera feeds for ML analysis
2. **Vehicle Detection**: ML Model 1 identifies vehicles and extracts details
3. **License Plate Recognition**: Paddle OCR processes plate information
4. **Database Matching**: Workers check against existing database entries
5. **Alert Generation**: System triggers appropriate notifications based on matches
6. **Periodic Updates**: Regular re-evaluation of all cases every 6 hours

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers directly.