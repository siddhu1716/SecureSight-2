from flask import Flask, jsonify, request
import requests
import cv2
from twilio.rest import Client
from ultralytics import YOLO
import boto3
from botocore.exceptions import NoCredentialsError
from datetime import datetime
import os
import subprocess
import gdown
from pathlib import Path
import shutil
from paddleocr import PaddleOCR # main OCR dependencies
from PIL import Image
from datetime import datetime
from werkzeug.utils import secure_filename
import requests
import smtplib
from email.mime.text import MIMEText
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from email.mime.image import MIMEImage

app = Flask(__name__)

# Twilio Credentials
camera_label = 'Entrance Camera --->'
account_sid = 'AC8836dfeb51a6f5ea7f0b97cf4e7b2696'
auth_token = '165bdbc3c59a70a10aaf966662b9ac58'
twilio_phone_number = 'whatsapp:+14155238886'
recipient_phone_numbers = ['whatsapp:+919502152068']
recipient_email=["shivanampalli@gmail.com"]
client = Client(account_sid, auth_token)
ocr = PaddleOCR(use_angle_cls=True, lang='en')
lost_vehicles={}
Debug=True
ALLOWED_EXTENSIONS = {'.mp4', '.avi', '.mov', '.mkv'}  

def upload_to_s3(file_path, bucket='ak-hackathon-bucket'):
    file_name = os.path.basename(file_path)  # Extracts just the file name
    s3_client = boto3.client('s3')
    try:
        # Upload file to S3 bucket with the file name only, not the full local path
        s3_client.upload_file(
            Filename=file_path,
            Bucket=bucket,
            Key=file_name,
            ExtraArgs={'ContentType': 'image/jpeg'}
        )
        # Generate URL based on the bucket name and file name
        url = f'https://{bucket}.s3.amazonaws.com/{file_name}'
        return url
    except Exception as e:
        print(f"Error uploading to S3: {e}")
        return None
print('Siddhu')

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return '.' in filename and Path(filename).suffix in ALLOWED_EXTENSIONS

# Send WhatsApp alert function
def send_whatsapp_alert(alert_message, to, media_url=None):
    try:
        message = client.messages.create(
            to=to,
            from_=twilio_phone_number,
            body=alert_message,
            media_url=[media_url] if media_url else None
        )
        print("Message SID:", message.sid)
    except Exception as e:
        print(f"Error sending WhatsApp message: {e}")

def send_email_with_attachment(recipient, subject, body, attachment_path):
    sender_email = "shivanampalli@gmail.com"
    sender_password = "hahw qcjh letl sbuq"

    # Create the email
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    # Add the image as an attachment
    try:
        with open(attachment_path, "rb") as attachment:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition",
            f"attachment; filename={os.path.basename(attachment_path)}",
        )
        msg.attach(part)
    except Exception as e:
        print(f"Error attaching file: {e}")
        return

    # Send the email
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient, msg.as_string())
            print("Email sent successfully with attachment!")
    except Exception as e:
        print(f"Failed to send email: {e}")

def paddle_ocr(frame, results ,lost_vechiles):
    if Debug:print("entered paddle ocr")
    """Perform OCR on detected bounding boxes and send alerts if a match is found."""
    pil_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    # Check if there are any detections
    if not results.boxes or len(results.boxes) == 0:
        print("No detections found in this frame.")
        return

    # Loop through each detection
    for detection in results.boxes:
        x1, y1, x2, y2 = map(int, detection.xyxy[0].tolist())
        cropped_image = pil_image.crop((x1, y1, x2, y2))  # Crop the detected region

        # Perform OCR on the cropped image
        ocr_result = ocr.ocr(np.array(cropped_image), cls=True)

        # Ensure OCR result contains data
        if ocr_result and ocr_result[0]:
            detected_text = [line[1][0] for line in ocr_result[0]]

            # Check if detected text matches lost vehicles
            for text in detected_text:
                if text in lost_vechiles:
                    print(f"Vehicle {text} found!")
                    # Save the frame with a timestamp
                    file_name = f"detected_image_{datetime.now().strftime('%H_%M_%S')}.jpg"
                    cv2.imwrite(file_name, frame)

                    # Upload to S3 and send alert
                    media_url = upload_to_s3(file_name)
                    alert_message = (f"Alert: Vehicle {text} detected. "
                                     f"Owner: {lost_vechiles[text]['name']} ({lost_vechiles[text]['contact']})")
                    send_whatsapp_alert(alert_message, lost_vechiles[text]['contact'], media_url=media_url)
                    send_email_with_attachment(lost_vechiles[text]['email'], "Last Seen Lost Vechile Location", alert_message ,"/Users/apple/Desktop/licenseplate/test.png")

def clean_results(model_path):
    if Debug:print("entering clean results")
    if os.path.exists(model_path):
        shutil.rmtree(model_path)
    print("completed cleaning model")

def download_model(model_type):
    if Debug :print("entered download model")
    if model_type =="knife":
        file_id = "1P4x_5XQzRHCnej8FgKqytzvv2lGQ4daB"
        file_url = f"https://drive.google.com/uc?id={file_id}"
    else:
        #change for the vechile model file
        file_id = "1P4x_5XQzRHCnej8Fg"
        file_url = f"https://drive.google.com/uc?id={file_id}"

    # Get the user's desktop path
    desktop_path = Path(os.path.join(os.path.expanduser("~"), "Desktop"))

    # Create a new directory for saving the file on the desktop
    directory_path = desktop_path / "DownloadedModels"
    directory_path.mkdir(parents=True, exist_ok=True)
    # Specify the full path where the file should be saved
    output_path = f"{directory_path}/best_{model_type}.pt"

    # Download the file to the specified directory
    gdown.download(file_url, str(output_path), quiet=False)
    print(" Model downloaded successfully.")
    return output_path


@app.route("/")
def home():
    return "Welcome to the Flask App!"

# Report crime route
@app.route('/api/report_crime', methods=['POST'])
# def home():
#     return "Welcome to the Flask App!"
def report_crime():
    data = request.get_json()  # Assuming form is sent as JSON
    name = data.get('name')
    contact_number = data.get('contact_number')
    location = data.get('location')
    issue_type = data.get('issue_type')
    description = data.get('description')
    time_reported = data.get('time')
    
    # Check for an uploaded photo (as base64 or an image file path)
    upload_photo = data.get('upload_photo')  # base64 encoded image or file path
    
    if upload_photo:
        # Assuming upload_photo is a path for simplicity. If it’s base64, decode it first.
        media_url = upload_to_s3(upload_photo)  # upload the file to S3 and get the URL
    else:
        media_url = None

    # Prepare the alert message for WhatsApp
    alert_message = (
        f"The person named {name} with contact number {contact_number} "
        f"has reported an emergency of type '{issue_type}' at {location} "
        f"at {time_reported}. Description: {description}"
    )
    print(alert_message)

    # Send alert via WhatsApp to police
    # print(media_url)
    for recipient in recipient_phone_numbers:
        send_whatsapp_alert(alert_message, recipient, media_url=media_url)
    for mail in recipient_email:
        send_email_with_attachment(mail, "Last Seen Lost Vechile Location", alert_message ,"/Users/apple/Desktop/licenseplate/test.png")   
    # return "Crime reported successfully!"

@app.route('/apipost/v1/upload', methods=['POST'])
def upload_video():
    if Debug: print("Received request to upload video")

    # Extract the uploaded file from the request
    file = request.files.get('file')
    if not file:
        if Debug: print("No file found in the request")
        return jsonify({'error': 'No file found in the request'}), 400

    # Validate the file extension
    if file and allowed_file(file.filename):
        # Secure the filename and define the upload folder
        filename = secure_filename(file.filename)
        upload_folder = Path(os.path.join(os.path.expanduser("~"), "Desktop", "UploadedVideos"))
        upload_folder.mkdir(parents=True, exist_ok=True)  # Ensure directory exists

        # Save the file
        file_path = upload_folder / filename
        try:
            file.save(str(file_path))
        except Exception as e:
            if Debug: print(f"Error saving file: {e}")
            return jsonify({'error': 'File saving failed', 'details': str(e)}), 500

        if Debug: print(f"File uploaded successfully to {file_path}")
        return jsonify({'message': 'File uploaded successfully', 'file_path': str(file_path)}), 200

    if Debug: print("File type not allowed")
    return jsonify({'error': 'File type not allowed'}), 400
    
@app.route('/api/get_owner_details', methods=['POST'])
def get_owner_details():
    data = request.get_json()
    owner_name = data.get('name')
    license_plate = data.get('license')
    contact_number = data.get('contact_number')
    description = data.get('description')
    if not owner_name or not license_plate or not contact_number:
        return jsonify({"error": "Missing required fields"}), 400
    lost_vehicles[license_plate] = {
        "name": owner_name,
        "license_plate":license_plate,
        "description":description,
        "time_reported": datetime.time(),
        "contact": f"whatsapp:+91{contact_number}"
    }
    return jsonify({"message": "Owner details added successfully"}), 200
    
@app.route('/api/get_model_detected_report', methods=['POST'])
def get_model_detection_report():

    file = request.files.get('file')
    model_type = request.form.get('model_type')

    if not file or not allowed_file(file.filename):
        return jsonify({"error": "No valid file provided"}), 400

    # Save the uploaded file
    upload_folder = Path(os.path.join(os.path.expanduser("~"), "Desktop", "UploadedVideos"))
    upload_folder.mkdir(parents=True, exist_ok=True)
    file_path = upload_folder / secure_filename(file.filename)
    file.save(str(file_path))

    # video_path = request.json.get('video_path')
    # if not video_path or not os.path.exists(video_path):
    #     return jsonify({"error": "Invalid video path or file does not exist"}), 400

    # Download the model
    # model_type = "vehicle_model"
    model_path=download_model(model_type)

    # Define paths
    desktop_path = Path(os.path.expanduser("~")) / "Desktop"
    directory_path = desktop_path / "DownloadedModels"
    # output_video_path = directory_path / "output_detected.mp4"

    # Ensure the YOLO package is installed
    try:
        subprocess.run(["pip", "install", "yolo"], check=True)
    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Failed to install YOLO", "details": str(e)}), 500

    # Run YOLO detection
    try:
        subprocess.run([
            "yolo",
            "detect",
            "predict",
            f"model={model_path}",
            f"conf=0.5",
            f"source={file_path}",
            f"project={directory_path}",
            f"name=output_detected",
            "save=True",
        ], check=True)

        # Locate the output file
        runs_dir = directory_path / "output_detected"
        output_file = next(runs_dir.glob("*.mp4"), None)
        if not output_file:
            raise FileNotFoundError("Output video not found in YOLO results.")

        return jsonify({
            "message": "Detection completed successfully",
            "output_video_path": str(output_file)
        }), 200

    except subprocess.CalledProcessError as e:
        return jsonify({"error": "YOLO detection failed", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Unexpected error occurred", "details": str(e)}), 500
    finally:
        clean_results(model_path)


if __name__ == '__main__':
    app.run(debug=True)
