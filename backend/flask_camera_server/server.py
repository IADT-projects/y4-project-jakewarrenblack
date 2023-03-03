from flask import Flask, Response
from camera import VideoCamera
from flask_socketio import SocketIO
from flask_cors import CORS, cross_origin
import cv2

app = Flask(__name__)
cors = CORS(app, resources={r"/": {"origins": "*"}})
video_camera = None


def gen(camera):
    while True:
        # camera.update_frame()
        frame, results = camera.get_frame()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route('/video_feed')
def video_feed():
    return Response(gen(VideoCamera()), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
