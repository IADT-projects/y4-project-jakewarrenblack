from ultralytics import YOLO
import cv2



class VideoCamera(object):
    def __init__(self):
        self.video = cv2.VideoCapture(0)
        self.model = YOLO('../yolov8/models/animals.pt')
        self.target_size = (
            320, 240)  # 240p - resizing frame before providing it to YOLO, trying to speed up inference.

    def get_frame(self):
        ret, frame = self.video.read()
        # We are using Motion JPEG, but OpenCV defaults to capture raw images,
        # so we must encode it into JPEG in order to correctly display the video stream.
        # Run inference on the frame using YOLO

        # Get the predicted bounding boxes and class labels for the image
        results = self.model.predict(frame, conf=0.5)

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
                    # Access the last index of the bbox array. The format of bbox is [x1, y1, x2, y2, inference certainty, label index]
                    cv2.putText(frame, labels[int(bbox[-1])], (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0),
                                2)

        ret, jpeg = cv2.imencode('.jpg', frame)

        # Return the JPEG-encoded frame and the results
        return jpeg.tobytes(), results
