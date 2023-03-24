const axios = require("axios");
const fs = require("fs");

const image = fs.readFileSync("dog.jpg", {
    encoding: "base64"
});

axios({
    method: "POST",
    url: "http://localhost:9001/cats_dogs_and_wild_animals/1",
    params: {
        api_key: "NotZ49lvMpo1QwEINQgR"
    },
    data: image,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})
.then(function(response) {
    console.log(response.data);
})
.catch(function(error) {
    console.log(error.message);
});
