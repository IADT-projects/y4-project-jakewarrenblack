from ultralytics import YOLO
import cv2
from threading import Thread, Lock
from threaded_videocapture import ThreadedVideoCapture

'''
FileNotFoundError: ...\\venv\\Lib\\site-packages\\ultralytics\\assets does not exist

YOLO might throw above error. I think this happens because `frame` is none, and so YOLO defaults to its default 
assets, which aren't included with the pip package.

https://github.com/ultralytics/ultralytics/issues/188

Though still not sure why that would happen, since YOLO's `predict.py` (
venv/Lib/site-packages/ultralytics/yolo/v8/detect/predict.py) defaults to using a hosted image if assets aren't found.
'''


class VideoCamera(object):
    def __init__(self):
        # Replace OpenCV video capture with one which runs on a background thread
        # With update_frame running on its own thread, we're getting some errors relating to OpenCV being unable to grab video frames
        # Using this replacement in an attempt to solve this...
        self.video = ThreadedVideoCapture(0)

        self.model = YOLO('../yolov8/models/animals.pt')  # Load pretrained YOLO model
        self._last_frame = None  # To keep track of the most recently available frame

        # Begin running update_frame on its own thread as soon as the VideoCamera object is initialised
        self.update = Thread(target=self.update_frame).start()

    def __del__(self):
        self.video.release()

    # To retrieve the frame from the feed and update it with our YOLO bounding box. To run in a separate thread.
    def update_frame(self):
        ret, frame = self.video.read()

        # Do this check to make sure YOLO doesn't try to switch to a default asset for predictions
        if frame is not None:
            # Get the predicted bounding boxes and class labels for the image, running inference with YOLO
            # Minimum detection confidence of 50%
            results = self.model.predict(frame, conf=0.5)

            # Loop over the list of bounding boxes and labels from our results
            for result in results:
                bboxes = result.boxes.boxes
                labels = result.names

                # Draw the bounding boxes on the image
                for bbox, label in zip(bboxes, labels):
                    if bbox.numel() > 0:  # check if there are elements in the YOLO frame
                        x1, y1, x2, y2 = map(int, bbox[:4])  # coords are 0-4
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        # Get the last index from bbox array: Bbox format is [x1, y1, x2, y2, certainty %, label index]
                        cv2.putText(frame, labels[int(bbox[-1])], (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                                    (0, 255, 0),
                                    2)

            # Now we have a video frame with bounding box/label overlay. Ready for Flask to serve.
            self._last_frame = frame

    # To return the most recent frame in our JPEG encoding for Flask to serve
    def get_frame(self):
        frame = self._last_frame

        # We're using Motion JPEG, but OpenCV defaults to capture raw images, so we encode into JPEG for the browser.
        # Return the JPEG-encoded frame and the results. Don't really need the results, just for printing.
        ret, jpeg = cv2.imencode('.jpg', frame)
        return jpeg.tobytes()
