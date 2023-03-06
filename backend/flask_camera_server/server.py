import os
from importlib import import_module
from flask import Flask, Response
from flask_cors import CORS
from camera import Camera
from flask_socketio import SocketIO

app = Flask(__name__)
cors = CORS(app, resources={r"/": {"origins": "*"}})
video_camera = None
socketio = SocketIO(app, cors_allowed_origins='*')


# No changes made to this yet.
def gen(camera):
    while True:
        frame, objectname = camera.get_frame() # method is defined in basecamera, but actually implemented in camera, which receives basecamera as argument
        # print('yolo result:', result)
        if objectname is not None:
            print('-- object name:', objectname)

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route('/video_feed')
def video_feed():
    # Multipart/x-mixed-replace mimetype is saying we're going to constantly replace the image with the next
    # available frame.
    # return Response(gen(VideoCamera()), mimetype='multipart/x-mixed-replace; boundary=frame')
    return Response(gen(Camera()), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
    # socketio.run(app)
