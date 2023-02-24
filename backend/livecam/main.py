from threading import Thread
from time import sleep

import gi # gstreamer python bindings (gstreamer is written in C)

gi.require_version('Gst', '1.0') # list the minimum version of gstreamer we need. 1.0 installed on pi.
gi.require_version('GstApp', '1.0')

from gi.repository import Gst, GstApp, GLib # done. now we have gstreamer.

_ = GstApp # prevent any tools from removing this import since it isn't used. we do need it.

Gst.init()

main_loop = GLib.MainLoop()
main_loop_thread = Thread(target=main_loop.run) # Running the main loop on its own thread
main_loop_thread.start()

# Gstreamer uses a special syntax for its pipelines, elements separated by exclamation marks. Always begins with source and ends with sink (where the video is being displayed)
# 1. v4l2src is specific to linux, access webcam.
# 2. decodebin used for detecting what format its receiving, and choose the right decoder to provide raw images.
# 3. videoconvert takes care of colour conversions.
# 4. 'autovideosink' would display the stream. we actually will use a custom sink, named 'sink', allows us to get the feed out of the pipeline
pipeline = Gst.parse_launch("v4l2src ! decodebin ! videoconvert ! appsink name=sink")
appsink = pipeline.get_by_name("sink") # now we have a reference to it

# ask Gstreamer to set pipeline to 'playing' state
pipeline.set_state(Gst.State.PLAYING)

# above will happen on the main thread, so make sure the code doesn't just exit before anything happens (we are waiting for gstreamer to begin)
# can still exit the loop with keyboard interrupt (ctrl+c)
try:
    while True:
        sample = appsink.try_pull_sample(Gst.SECOND) # only give a sample if available within 1 second
        if sample is None:
            continue
        print("Sample found")
except KeyBoardInterrupt:
    pass

# clean the pipeline up
pipeline.set_state(Gst.State.NULL)
main_loop.quit()
main_loop_thread.join() # stop the main loop thread

