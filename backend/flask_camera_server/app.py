from distutils.log import debug
import os
from importlib import import_module
from flask import Flask, Response, request
from flask_cors import CORS
from camera import Camera
from flask_socketio import SocketIO, emit
from threading import Lock

app = Flask(__name__)
#cors = CORS(app, resources={r"/": {"origins": "*"}})
video_camera = None
socketio = SocketIO(app, cors_allowed_origins='*')

objectname = None

thread = None
thread_lock = Lock()


# No changes made to this yet.
def gen(camera):
    global objectname
    while True:
        frame, objectname = camera.get_frame() # method is defined in basecamera, but actually implemented in camera, which receives basecamera as argument
        # print('yolo result:', result)
        if objectname is not None:
            # print('-- object name:', objectname)
            objectname = objectname

            # this is printing, so why does the below event not work?
            # print('object name in app.py -- ', objectname)

            # socketio.emit('updateObjectName', {'value': objectname})

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


def background_thread():
    """Example of how to send server generated events to clients."""
    prevobjectname = None

    print('object name in bg thread')
    while True:
        socketio.emit('testing',{'data': 'objectname'})
        # if objectname != prevobjectname:
            
        #     socketio.emit('testing',{'data': objectname})

        #     #socketio.sleep(2)   
        #     prevobjectname = objectname





@app.route('/video_feed')
def video_feed():
    # Multipart/x-mixed-replace mimetype is saying we're going to constantly replace the image with the next
    # available frame.
    # return Response(gen(VideoCamera()), mimetype='multipart/x-mixed-replace; boundary=frame')
    return Response(gen(Camera()), mimetype='multipart/x-mixed-replace; boundary=frame')


"""
Decorator for connect
"""
@socketio.on('connect')
def connect():
    print("server socketio ")
    #  global thread
    #  with thread_lock:
    #      if thread is None:
    #          thread = socketio.start_background_task(background_thread)
    emit('my_response', {'data': 'Connected', 'count': 0})


"""
Decorator for disconnect
"""
@socketio.on('disconnect')
def disconnect():
    print('Client disconnected',  request.sid)


if __name__ == '__main__':
    #app.run(host='0.0.0.0', debug=True)
    socketio.start_background_task(background_thread)
    socketio.run(app, debug=True)