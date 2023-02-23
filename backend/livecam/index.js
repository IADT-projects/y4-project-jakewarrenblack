const LiveCam = require('./livecam')

require('dotenv').config();

const webcam_server = new LiveCam
({
    // address and port of the webcam UI
    'ui_addr' : process.env.LIVECAM_UI_BROADCAST_ADDRESS,
    'ui_port' : process.env.LIVECAM_UI_BROADCAST_PORT,

    // address and port of the webcam Socket.IO server
    // this server broadcasts GStreamer's video frames
    // for consumption in browser side.
    'broadcast_addr' : process.env.SOCKET_BROADCAST_ADDRESS,
    'broadcast_port' : process.env.SOCKET_BROADCAST_PORT,

    // address and port of GStreamer's tcp sink
    'gst_tcp_addr' : process.env.GST_TCP_ADDRESS,
    'gst_tcp_port' : process.env.GST_TCP_PORT,

    // callback function called when server starts
    'start' : function() {
        console.log('WebCam server started!');
    },

    // webcam object holds configuration of webcam frames
    'webcam' : {
        // should width of the frame be resized (default : 0)
        // provide 0 to match webcam input
        'width' : 352,

        // should height of the frame be resized (default : 0)
        // provide 0 to match webcam input
        'height' : 240,

        // should a fake source be used instead of an actual webcam
        // suitable for debugging and development (default : false)
        'fake' : false,

        // framerate of the feed (default : 0)
        // provide 0 to match webcam input
        'framerate' : 0,
    }
});

webcam_server.broadcast()