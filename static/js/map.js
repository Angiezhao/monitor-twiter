function tweetsMap(data, radius){
    for (var i = 0; i < allLayers.length; i++){
        twitterMap.removeLayer(allLayers[i]);
    }
    allLayers = [];
    for(var i = 0; i < data.length; i++){
        var reversed_coordinates = [];
        reversed_coordinates = data[i]["coordinates"].reverse(); 
        //console.log(reversed_coordinates);
        var circle = L.circle(reversed_coordinates, parseInt(150*radius[i]), {
            color: '#87CEEB',
            fillColor: '#87CEEB',
            fillOpacity: 0.7
        });
        circle.addTo(twitterMap);
        allLayers.push(circle);
        
        //frequency
        // if(radius[i] != 0){ 
        //     console.log(parseInt((radius[i]-1)/0.1))
        // }
    };
};