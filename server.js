const axios = require("axios");
var express = require("express");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var bodyParser = require("body-parser");
const request = require("request");
var app = express();
app.use(cookieParser());
app.use(session({secret: "It matters - AQI WebApp", cookie: {maxAge: 3600000}}));
app.use('/images',express.static('public'));
app.use('/images/icons',express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get(['/','index.html'],function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.get(['/explore','explore.html'],function(req,res){
    res.sendFile(__dirname + "/explore.html");
});
app.get(['/currentlocation','currentlocation.html'],function(req,res){
    res.sendFile(__dirname + "/currentlocation.html");
});

app.get(['/show','show.html'],function(req,res){
    res.sendFile(__dirname + "/show.html");
});

app.get('/style.css',function(req,res){
    res.sendFile(__dirname + "/style.css");
});

app.get('/cl.js',function(req,res){
    res.sendFile(__dirname + "/cl.js" );
});
app.get('/app.js',function(req,res){
    res.sendFile(__dirname + "/app.js" );
});
app.get('/sw.js',function(req,res){
    res.sendFile(__dirname + "/sw.js" );
});

app.get('/manifest.json',function(req,res){
    res.sendFile(__dirname + "/manifest.json");
});


app.get('/forecast',function(req,res){
    if(req.hasOwnProperty('query') == false){
        return res.status(404).send("No provided queries");
    }
    
    //Convert address to lat/long and then search AQI
    if("address" in req.query){
        address = req.query.address;
        axios.get('https://nominatim.openstreetmap.org/?addressdetails=1&q=' + address + '&format=json&limit=1'
        ).then(result => {
            let geo = result.data[0].lat + ";" + result.data[0].lon;
                axios.get('https://api.waqi.info/feed/geo:' + geo + '/?token=e8a9dea557d6a8dee58dc9040e45718a231b431c&latlng='
                ).then(result => {
                    res.status(200).send(result.data);
                    }).catch(error => {
                    console.log(error);
                    return res.status(404).send("Error");
            });
        
        }).catch(error => {
            console.log(error);
            return res.status(404).send("Error");
          });
    }
    //Takes latitude and longitude, and returns conditions for one or more nearby stations
    if(("lat" in req.query)&&("lon" in req.query)){
            let lat = parseFloat(req.query.lat);
            let lon = parseFloat(req.query.lon);

            if("multiple" in req.query){
                console.log("sfjdshfsdf");
                let lat2 = (lat < 89) ? lat + 1 : lat + 1;
                let lon2 = (lon < 179) ? lon + 1 : lon + 1;
                let geo = String(lat) + "," + String(lon) + "," + String(lat2) + "," + String(lon2);
            
                axios.get('https://api.waqi.info/map/bounds/?token=e8a9dea557d6a8dee58dc9040e45718a231b431c&latlng=' + geo
                ).then(result => {res.status(200).send(result.data);}).catch(error => {
                    console.log(error);
                    return res.status(404).send("Error");
                  });
            }

            else{
                let geo = String(lat) + ";" + String(lon);
                axios.get('https://api.waqi.info/feed/geo:' + geo  + '/?token=e8a9dea557d6a8dee58dc9040e45718a231b431c&latlng='
                ).then(result => {res.status(200).send(result.data)}).catch(error => {
                    console.log(error);
                    return res.status(404).send("Error");
                  });

            }

        
    }

    if("city" in req.query){
        if(req.query.city != false){
            let city = req.query.city.toLowerCase();
            axios.get('https://api.waqi.info/feed/' + city + '/?token=e8a9dea557d6a8dee58dc9040e45718a231b431c'
            ).then(result => {res.send(result.data)}).catch(error => {
                console.log(error);
                return res.status(404).send("Error");
              });
        }
    }
   

});

server = app.listen(process.env.PORT || 3000);

