import fs from "fs";
import axios from "axios";

const localImagetest = fs.readFileSync('./my_image.JPG', {
    encoding: 'base64'
})

await axios({
    method: 'POST',
    url: 'https://detect.roboflow.com/lola/3',
    params: {
        api_key: 'NotZ49lvMpo1QwEINQgR'
    },
    data: localImagetest,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    }
})
    .then((res) => {
        console.log(res.data)
    }).catch((e) => {
        console.log(e.message)
    })