from ultralytics import YOLO
import cv2
import threading


class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.model = YOLO('../yolov8/models/animals.pt')
        self._last_frame = None
        self._lock = threading.Lock()

        self._thread = threading.Thread(target=self._update_loop, args=())
        self._thread.daemon = True
        self._thread.start()

    def __del__(self):
        self.video.release()

    def _update_loop(self):
        while True:
            ret, frame = self.video.read()
            if not ret:
                break

            # Run inference on the frame using YOLO
            results = self.model.predict(frame, conf=0.5)

            # Perform mutual exclusion here
            with self._lock:
                self._last_frame = frame

    def get_frame(self):
        # Perform mutual exclusion here
        with self._lock:
            frame = self._last_frame

        ret, jpeg = cv2.imencode('.jpg', frame)

        # Return the JPEG-encoded frame and the results
        return jpeg.tobytes()