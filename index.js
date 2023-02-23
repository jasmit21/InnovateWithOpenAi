//requiring all the packages used 
const express = require('express');
require("dotenv").config();
const app = express();
const { Configuration, OpenAIApi } = require('openai');

app.use(express.json()); //it is used to get (or extract) data sent from front end in request object

const port = process.env.PORT || 5000;  //variable to store the port number (process.env.PORT is used to access the variable 'PORT' which is declared in the .env file)


//giving the location of the css files to the server 
app.use(express.static(__dirname + "/views"));

//creating object for configuration where the api key of openai is stored
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

//creating openAIAPI which will be used to access the functions of the openai's API . Here the configuration object (created in above step) is passed as an parameter
const openai = new OpenAIApi(configuration)

//routes 
//this route renders the landing page (first page of the website)
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html")
})

//this route takes prompt and size of the image as an input and provides it to the openai api and sends the image-url as an response to the front-end
//it is a post method (usually used in case of html forms)
app.post('/generate', async (req, res) => {
    console.log("Inside generate route")
    // console.log(req.body);

    //req.body contains the data of the html form
    var prompt = req.body.prompt;  //storing the value of the prompt inside a local variable 
    var size = req.body.size;   //storing the value of the size inside a local variable
    console.log(req.body);

    //creating a object response that uses the funtion createImage of the API
    try {
        if (prompt == null) {
            throw new Error("Uh oh, no prompt was provided");
        }
        const response = await openai.createImage({
            prompt,  //passing the prompt value to the api 
            n: 1,   //no. of image = 1 
            size,  //passing the size value 
        });
        image_url = response.data.data[0].url;  //stores the output or response of the api i.e the url of the generated iamge, into a local variable named image_url
        console.log(image_url); //checking the image url in the terminal
        //sending the response to the fron-end side 
        //response is in the form of json that includes a success message and the image_url 
        return res.json({
            success: true,
            image_url: image_url,
        })
    } catch (error) {         //catch block is used to handle errors if occured during the api call 
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            return res.status(400).json({
                success: false,
                message: "Ughh ohh, something went wrong",
            });
        } else {
            console.log(error.message);
            return res.status(400).json({
                success: false,
                message: "Ughh ohh, something went wrong",
            });
        }
    }

});

//app.listen function is used to turn on the server at the specified port in our case it is 5000
app.listen(port, (err) => {
    if (err) throw err;
    console.log("Server running on http://localhost:5000");
    console.log("Did some changes");
});




