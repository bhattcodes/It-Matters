
console.log("app script working");

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/sw.js")
        .then(res => {
          console.log("service worker registered");
          let startbtn = document.getElementById("getstartedbtn");
          if(startbtn){
            startbtn.addEventListener("click",function(){
              window.location.href = "explore";
            });
          }
          let locbtn = document.getElementById("getlocationbtn");
          if(locbtn){
            locbtn.addEventListener("click",function(){
              window.location.href = "currentlocation#getCurrent";
            });
          }
          let searchbtn = document.getElementById("searchbtn");
          if(searchbtn){
            searchbtn.addEventListener("click",function(){
              let searchvalue = document.getElementById("searchtextbar");
              if(searchvalue.value != ""){
                window.location.href = "currentlocation#" + searchvalue.value;
              }
             
            });
          }

          let searchbtn2 = document.getElementById("curlocsearch");
          if(searchbtn2){
            searchbtn2.addEventListener("click",function(){
              let searchvalue = document.getElementById("curloctext");
              if(searchvalue.value != ""){
                window.location.href = "currentlocation#" + searchvalue.value;
                window.location.reload();
              }
             
            });
          }

          let returnhome = document.getElementById("returnhome");
          if(returnhome){
            returnhome.addEventListener("click",function(){
              window.location.href = "/";
            });
          }

          let returnbtn = document.getElementById("returnexplore");
          if(returnbtn){
            returnbtn.addEventListener("click",function(){
              window.location.href = "explore";
            });
          }

          if((window.location.hash === '#getCurrent')||(window.location.hash === '')){
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
              if(this.readyState == 4  && this.status == 200){
                let response = JSON.parse(this.response);
              
                lat = response.data.city.geo[0];
                long = response.data.city.geo[1];
                

                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function(){
                  if(this.readyState == 4 && this.status == 200){
                    let res2 = JSON.parse(this.response);
        
                    for(let i = 0; i < Math.min(3,res2.data.length); i++){
                      let aqiblock = document.getElementById("aqi" + String(i+1));
                      aqiblock.innerHTML = "AQI: " + res2.data[i].aqi;
                      aqiblock.style.display = "block";
                     

                      let cityname = res2.data[i].station.name.split(",")[0];
                      if(cityname.length > 15){
                        cityname = cityname.split(" ")[0] + " " + cityname.split(" ")[1];
                      }

                      document.getElementById("city" + String(i+1)).innerHTML = cityname;
                    }

                  }
                }

                xhttp.open("GET", "/forecast?lat=" + String(lat) + "&lon=" + String(long) + "&multiple=true", true);   
                xhttp.send(); 









                function initMap(lat,long){
                  map = new google.maps.Map(document.getElementById("map"), {
                    center: { lat: lat, lng: long },
                    zoom: 8,
                  }).catch(e => console.log(e));
                }
                initMap(lat,long);
                
              }
            };

            xhttp.open("GET", "https://api.waqi.info/feed/here/?token=e8a9dea557d6a8dee58dc9040e45718a231b431c", true);   
            xhttp.send(); 
          }
          else{
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
              if(this.readyState == 4  && this.status == 200){
                let response = JSON.parse(this.response);
     
                lat = response.data.city.geo[0];
                long = response.data.city.geo[1]; 
              

                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function(){
                  if(this.readyState == 4 && this.status == 200){
                    let res2 = JSON.parse(this.response);

                    for(let i = 0; i < Math.min(3,res2.data.length); i++){
                      let aqiblock = document.getElementById("aqi" + String(i+1));
                      aqiblock.innerHTML = "AQI: " + res2.data[i].aqi;
                      aqiblock.style.display = "block";
                     

                      let cityname = res2.data[i].station.name.split(",")[0];
                      if(cityname.length > 15){
                        cityname = cityname.split(" ")[0] + " " + cityname.split(" ")[1];
                      }

                      document.getElementById("city" + String(i+1)).innerHTML = cityname;
                    }

                  }
                }

                xhttp.open("GET", "/forecast?lat=" + String(lat) + "&lon=" + String(long) + "&multiple=true", true);   
                xhttp.send(); 




                function initMap(lat,long){
                  map = new google.maps.Map(document.getElementById("map"), {
                    center: { lat: lat, lng: long },
                    zoom: 8,
                  }).catch(e => console.log(e));
                }
                initMap(lat,long);
                          
              }
            };
       
            xhttp.open("GET", "/forecast?city=" + window.location.hash.substr(1), true);   
            xhttp.send(); 
          }
        

        })
        .catch(err => console.log("service worker not registered", err))
    })
  }


 