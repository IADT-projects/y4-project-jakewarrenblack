import os
from importlib import import_module

from flask import Flask, Response
from camera import Camera
from flask_cors import CORS

if os.environ.get('CAMERA'):
    Camera = import_module('camera_' + os.environ['CAMERA']).Camera
    print("Load module {}".format('camera_' + os.environ['CAMERA']))
else:
    from camera import Camera

app = Flask(__name__)
cors = CORS(app, resources={r"/": {"origins": "*"}})
video_camera = None


# No changes made to this yet.
def gen(camera):
    while True:
        frame = camera.get_frame()
        # print('RESULTS', results)  # printing result of YOLOv8 inference, returned along with our jpeg

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
