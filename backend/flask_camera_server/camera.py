from ultralytics import YOLO
import cv2
from threading import Thread
import time
from baseCamera import BaseCamera


class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.model = YOLO('../yolov8/models/animals.pt')  # Load pretrained YOLO model

        self.Frame = []
        self.objectName = None
        self.status = False
        self.isStopped = False

        self.start()

    def start(self):
        print('-- Starting video streaming --')
        Thread(target=self.queryFrame, daemon=True, args=()).start()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            self.stop()
        except Exception as e:
            print("{}".format(str(e)))

    def stop(self):
        self.isStopped = True
        print('-- Stop capturing --')

    def getFrame(self):
        # Returning the most recent frame
        return self.status, self.Frame

    def queryFrame(self):
        while not self.isStopped:
            self.status, self.Frame = self.video.read()
        self.video.release()

    def __del__(self):
        self.video.release()


class Camera(BaseCamera):
    @staticmethod
    def frames():
        objectname = None

        with VideoCamera() as cam:
            try:
                while True:
                    status, frame = cam.getFrame()

                    if not status: continue

                    # now run inference and draw boxes and text to the thing

                    if frame is not None:
                        # Get the predicted bounding boxes and class labels for the image, running inference with YOLO
                        # Minimum detection confidence of 50%
                        results = cam.model.predict(frame, conf=0.5)

                        # Loop over the list of bounding boxes and labels from our results
                        for result in results:
                            bboxes = result.boxes.boxes
                            labels = result.names

                            # Draw the bounding boxes on the image
                            for bbox, label in zip(bboxes, labels):
                                if bbox.numel() > 0:  # check if there are elements in the YOLO frame

                                    # means it sees something, we'll need to send a screenshot to a hosted endpoint eventually, but for now we'll try to notify the user via socketio...
                                    objectname = labels[int(bbox[-1])]

                                    x1, y1, x2, y2 = map(int, bbox[:4])  # coords are 0-4
                                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                                    # Get the last index from bbox array: Bbox format is [x1, y1, x2, y2, certainty
                                    # %, label index]
                                    cv2.putText(frame, labels[int(bbox[-1])], (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX,
                                                0.5,
                                                (0, 255, 0),
                                                2)

                    # finally, outside that loop:
                    yield cv2.imencode('.jpg', frame)[1].tobytes(), objectname


            except Exception as e:
                print("Inference error:{}".format(str(e)))
                time.sleep(10)
                cam.stop()
