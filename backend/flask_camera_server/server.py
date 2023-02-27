from flask import Flask, render_template, Response, jsonify, request
from camera import VideoCamera
import cv2
import threading
from ultralytics import YOLO
import numpy as np

app = Flask(__name__)

video_camera = None
global_frame = None


@app.route('/')
def index():
    return render_template('index.html')


net = YOLO('../yolov8/models/animals.pt')
colors = np.random.uniform(0, 255, size=(len(['1', '2', '3']), 3))


def video_stream():
    global video_camera
    global global_frame

    if video_camera is None:
        video_camera = VideoCamera()

    while True:
        frame, results = video_camera.get_frame()  # this is a jpeg

        if frame is not None:
            global_frame = frame
            print('RESULTS', results) # printing result of YOLOv8 inference, returned along with our jpeg

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        else:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + global_frame + b'\r\n\r\n')


@app.route('/video_viewer')
def video_viewer():
    return Response(video_stream(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, threaded=True)
