from flask import Flask, Response
from camera import VideoCamera
from flask_socketio import SocketIO
from flask_cors import CORS, cross_origin
import cv2
import time
import queue
import threading


app = Flask(__name__)

cors = CORS(app, resources={r"/": {"origins": ""}})
app.config['CORS_HEADERS'] = 'Content-Type'

video_camera = None

socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet', logger=True, engineio_logger=True)


# Use a queue to communicate between the main thread and the Flask-SocketIO server
frame_queue = queue.Queue()


def gen(camera):
    global video_camera

    if video_camera is None:
        video_camera = VideoCamera()

    while True:
        frame, results = camera.get_frame()

        # Add the frame and results to the queue
        frame_queue.put((frame, results))

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route('/video_feed')
@cross_origin()
def video_feed():
    return Response(gen(VideoCamera()), mimetype='multipart/x-mixed-replace; boundary=frame')


# Define a function that runs the Flask-SocketIO server in a separate thread
def socketio_server():
    socketio.run(app, host='0.0.0.0', port=5000)


# Define a function that reads from the queue and emits the data to the clients
def emit_frames():
    while True:
        # Block until there is data in the queue
        frame, results = frame_queue.get()

        # Emit the frame data to the client
        socketio.emit('frame', {'frame': 'hello world'})

        # Sleep for a short amount of time to allow other events to be processed
        time.sleep(0.01)


if __name__ == '__main__':
    # Start the Flask-SocketIO server in a separate thread
    socketio_thread = threading.Thread(target=socketio_server)
    socketio_thread.daemon = True
    socketio_thread.start()

    # Start a separate thread that reads from the queue and emits frames to the clients
    emit_thread = threading.Thread(target=emit_frames)
    emit_thread.daemon = True
    emit_thread.start()

    # Start the main OpenCV loop
    video_camera = VideoCamera()
    while True:
        # Read a frame from the camera and process it
        frame, results = video_camera.get_frame()

        # Add the frame and results to the queue
        frame_queue.put((frame, results))

        # Sleep for a short amount of time to allow other events to be processed
        time.sleep(0.01)
