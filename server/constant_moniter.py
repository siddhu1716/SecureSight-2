from ultralytics import YOLO
import cv2
import util
from sort.sort import *
from util import get_car, read_license_plate, write_csv
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
import boto3
from datetime import datetime, timedelta


account_sid = 'XXX'
auth_token = 'XXX'
twilio_phone_number = 'whatsapp:+xxx'
client = Client(account_sid, auth_token)

results = {}
mot_tracker = Sort()

# load models
coco_model = YOLO('/home/mcw/Desktop/SecureSight-2/server/yolo11s.pt')
license_plate_detector = YOLO('/home/mcw/Desktop/work/anpr/Automatic-License-Plate-Recognition-using-YOLOv8/license_plate_detector.pt')

# load video
cap = cv2.VideoCapture('/home/mcw/Desktop/work/anpr/sample.mp4')
vehicles = [2, 3, 5, 7]


def upload_to_s3(file_path, license_number, location, additional_attributes=None, bucket='ak-hackathon-bucket'):
    """
    Upload a file to S3 with metadata including location and additional attributes.

    Parameters:
    - file_path (str): The local path to the file being uploaded.
    - license_number (str): The unique identifier for the file in S3 (used as the object key).
    - location (str): The location information to be stored as metadata.
    - additional_attributes (dict): A dictionary of additional metadata attributes (optional).
    - bucket (str): The S3 bucket name.

    Returns:
    - str: The URL of the uploaded file if successful, otherwise None.
    """
    s3_client = boto3.client('s3')
    try:
        # Prepare metadata
        metadata = {'location': location}
        if additional_attributes:
            # Ensure all metadata values are strings
            metadata.update({k: str(v) for k, v in additional_attributes.items()})
        
        # Upload file to S3 bucket
        s3_client.upload_file(
            Filename=file_path,
            Bucket=bucket,
            Key=license_number,
            ExtraArgs={
                'ContentType': 'image/jpeg',
                'Metadata': metadata
            }
        )
        
        # Generate URL based on the bucket name and license_number (key)
        url = f'https://{bucket}.s3.amazonaws.com/{license_number}'
        
        # Save metadata to DynamoDB
        save_metadata_to_dynamodb(license_number, url, location)
        
        return url
    except Exception as e:
        print(f"Error uploading to S3: {e}")
        return None

def save_metadata_to_dynamodb(license_number, s3_url, location):
    """
    Save metadata to DynamoDB with a TTL for automatic expiration.
    """
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('YourTableName')  # Replace with your actual table name
    try:
        expiration_time = int((datetime.utcnow() + timedelta(days=6)).timestamp())  # 6 days from now
        table.put_item(
            Item={
                'license_number': license_number,
                's3_url': s3_url,
                'location': location,
                'timestamp': datetime.utcnow().isoformat(),  # For record-keeping
                'expiration_time': expiration_time  # For TTL
            }
        )
    except Exception as e:
        print(f"Error saving to DynamoDB: {e}")


def get_metadata_from_dynamodb(license_number):
    """
    Retrieve metadata from DynamoDB.

    Parameters:
    - license_number (str): The unique identifier for the file in S3.

    Returns:
    - dict: The metadata if found, or None if not found or error occurs.
    """
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('YourTableName') 
    try:
        response = table.get_item(Key={'license_number': license_number})
        return response.get('Item', None)
    except Exception as e:
        print(f"Error retrieving from DynamoDB: {e}")
        return None


def set_s3_lifecycle(bucket):
    """
    Set a lifecycle policy to automatically delete objects after 6 days.
    """
    s3_client = boto3.client('s3')
    lifecycle_config = {
        'Rules': [
            {
                'ID': 'Delete-after-6-days',
                'Status': 'Enabled',
                'Filter': {'Prefix': ''},  # Apply to all objects
                'Expiration': {'Days': 6}
            }
        ]
    }
    try:
        s3_client.put_bucket_lifecycle_configuration(
            Bucket=bucket,
            LifecycleConfiguration=lifecycle_config
        )
        print(f"Lifecycle policy set for bucket: {bucket}")
    except Exception as e:
        print(f"Error setting lifecycle policy: {e}")


def give_file_path(frame,license_number,location):
    # Check if detected text matches lost vehicles
    # Save the frame with a timestamp
    file_name = f"detected_image_{datetime.now().strftime('%H_%M_%S')}.jpg"
    cv2.imwrite(file_name, frame)
    media_url = upload_to_s3(file_name,license_number,location)
    #we can either store the urls and return them instead using the twillio


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
    sender_email = "XXX@gmail.com"
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

def get_owner_details(lost_vehicle_number):
    """
    Retrieve owner details from DynamoDB using the vehicle number as the primary key.

    Parameters:
    - lost_vehicle_number (str): The license plate number of the lost vehicle.

    Returns:
    - dict: A dictionary containing owner details (email and contact number) if found.
            Returns None if no details are found or an error occurs.
    """
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('LostVehicles')  # Replace with your actual table name

    try:
        # Fetch item from DynamoDB using the primary key
        response = table.get_item(Key={'license_plate': lost_vehicle_number})

        # Check if the item exists
        if 'Item' in response:
            item = response['Item']
            return {
                "name":item.get("name","N/A"),
                "email": item.get("email", "N/A"),  # Replace "email" with your actual attribute key
                "contact_number": item.get("contact", "N/A")  # Replace "contact" with your actual attribute key
            }
        else:
            print(f"No details found for vehicle number: {lost_vehicle_number}")
            return None

    except Exception as e:
        print(f"Error retrieving details from DynamoDB: {e}")
        return None


def check_if_present_in_database(lost_vechile_number):
    # we should also have the number plate to vechile owners details database
    # lost_vehicles=["AP2035","TS6765"]
    owner_details=get_owner_details(lost_vechile_number)
    data=get_metadata_from_dynamodb(lost_vechile_number)
    if data:
        alert_message = (f"Alert: Vehicle of number plate {lost_vechile_number} has detected. "
                            f"Owner: {owner_details['name']} ({owner_details['contact_number']})")
        send_whatsapp_alert(alert_message, owner_details['contact_number'], media_url=data)
        send_email_with_attachment(owner_details['email'], "Last Seen Lost Vechile Location", alert_message ,"/Users/apple/Desktop/licenseplate/test.png")


        # recipient_phone_numbers = ['whatsapp:+XXX']
        # recipient_email=["XXX@gmail.com"]

def report_to_user():
    lost_vehicles=["AP2035","TS6765"]

set_s3_lifecycle(bucket='ak-hackathon-bucket')

def Constant_monitering():
    # read frames
    location="front gate"
    frame_nmr = -1
    ret = True
    while ret:
        frame_nmr += 1
        ret, frame = cap.read()
        if ret:
            results[frame_nmr] = {}
            # detect vehicles
            detections = coco_model(frame)[0]
            detections_ = []
            for detection in detections.boxes.data.tolist():
                x1, y1, x2, y2, score, class_id = detection
                if int(class_id) in vehicles:
                    detections_.append([x1, y1, x2, y2, score])

            # track vehicles
            track_ids = mot_tracker.update(np.asarray(detections_))

            # detect license plates
            license_plates = license_plate_detector(frame)[0]
            for license_plate in license_plates.boxes.data.tolist():
                x1, y1, x2, y2, score, class_id = license_plate

                # assign license plate to car
                xcar1, ycar1, xcar2, ycar2, car_id = get_car(license_plate, track_ids)

                if car_id != -1:

                    # crop license plate
                    license_plate_crop = frame[int(y1):int(y2), int(x1): int(x2), :]

                    # process license plate
                    license_plate_crop_gray = cv2.cvtColor(license_plate_crop, cv2.COLOR_BGR2GRAY)
                    _, license_plate_crop_thresh = cv2.threshold(license_plate_crop_gray, 64, 255, cv2.THRESH_BINARY_INV)

                    # read license plate number
                    frame2=cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    license_plate_text, license_plate_text_score = read_license_plate(license_plate_crop_thresh)
                    if license_plate_text is not None:
                        give_file_path(license_plate_text,frame2,location)
                        results[frame_nmr][car_id] = {'car': {'bbox': [xcar1, ycar1, xcar2, ycar2]},
                                                    'license_plate': {'bbox': [x1, y1, x2, y2],
                                                                        'text': license_plate_text,
                                                                        'bbox_score': score,
                                                                        'text_score': license_plate_text_score}}

