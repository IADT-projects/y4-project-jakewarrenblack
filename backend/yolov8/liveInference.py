from ultralytics import YOLO
import cv2

model = YOLO('./models/animals.pt')
model.predict(source='0', show=True, conf=0.5)