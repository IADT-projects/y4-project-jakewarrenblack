from ultralytics import YOLO
import cv2


class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.model = YOLO('../yolov8/models/animals.pt')

    def __del__(self):
        self.video.release()

    def get_frame(self):
        ret, frame = self.video.read()
        # We are using Motion JPEG, but OpenCV defaults to capture raw images,
        # so we must encode it into JPEG in order to correctly display the video stream.
        # Run inference on the frame using YOLO
        results = self.model.predict(frame, show=False,conf=0.5)  # Running inference and returning the result from
        # get_frame

        ret, jpeg = cv2.imencode('.jpg', frame)

        # Return the JPEG-encoded frame and the results
        return jpeg.tobytes(), results
