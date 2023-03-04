from flask import Flask, Response
from camera import VideoCamera
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/": {"origins": "*"}})
video_camera = None

# No changes made to this yet.
def gen(camera):
    global video_camera

    if video_camera is None:
        video_camera = VideoCamera()

    while True:
        frame, results = camera.get_frame()
        # print('RESULTS', results)  # printing result of YOLOv8 inference, returned along with our jpeg

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route('/video_feed')
def video_feed():
    # Multipart/x-mixed-replace mimetype is saying we're going to constantly replace the image with the next
    # available frame.
    return Response(gen(VideoCamera()), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    # Create a VideoCamera object as soon as the Flask server starts
    with app.app_context():
        video_camera = VideoCamera()

    app.run(host='0.0.0.0', debug=True)
