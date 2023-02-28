from ultralytics import YOLO
import cv2
import time


class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.model = YOLO('../yolov8/models/animals.pt')
        self.target_size = (
        320, 240)  # 240p - resizing frame before providing it to YOLO, trying to speed up inference.
        # self.motion_detected = False
        # self.last_inference_time = time.time()

        # Using opencv background subtractor to detect motion
        # self.motionDetector = cv2.createBackgroundSubtractorMOG2()

    def get_frame(self):
        ret, frame = self.video.read()
        # We are using Motion JPEG, but OpenCV defaults to capture raw images,
        # so we must encode it into JPEG in order to correctly display the video stream.
        # Run inference on the frame using YOLO

        # Now using the background subtraction to detect motion
        # foreground_mask = self.motionDetector.apply(frame)

        # num_pixels = foreground_mask.shape[0] * foreground_mask.shape[1]

        # num_fg_pixels = cv2.countNonZero(foreground_mask) # Number of changed pixels

        # if num_fg_pixels / num_pixels > 0.1: # If more than 10% of pixels are foreground
        # Adjust this percentage to change motion sensitivity
        # self.motion_detected = True

        # Run inference if motion is detected and at least 1 second has passed since the last inference
        # if self.motion_detected and time.time() - self.last_inference_time > 1:

        # resize image
        YOLOFrame = cv2.resize(frame, (224, 224))

        # Get the predicted bounding boxes and class labels for the image
        results = self.model.predict(YOLOFrame, conf=0.5)

        # Loop over the list of dictionaries and extract the bounding boxes and class labels for each image in the batch
        for result in results:
            bboxes = result.boxes.boxes
            labels = result.names

            # Draw the bounding boxes on the image
            for bbox, label in zip(bboxes, labels):
                if bbox.numel() > 0:  # check if there are elements in the YOLO frame
                    # x1, y1, x2, y2 = map(int, bbox)

                    x1, y1, x2, y2 = map(int, bbox[:4])
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, labels[int(label)], (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            # self.last_inference_time = time.time()
            # self.motion_detected = False  # Reset motion detection flag

        # else:
        #     results = None

        ret, jpeg = cv2.imencode('.jpg', frame)

        # Return the JPEG-encoded frame and the results
        return jpeg.tobytes(), results
