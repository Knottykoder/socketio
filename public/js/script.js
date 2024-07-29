const socket = io()

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {lat,long} = position.coords
        socket.emit('send-location',{lat,long})
    },(error)=>{
        console.log("err",error);
    },{
        enableHighAccuracy:true,
        maximumAge:0,
        timeout:5000
    })
}

const map = L.map('map').setView([0,0],10)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: 'demo maps'
}).addTo(map)

const markers = {}

socket.on('receive',(data)=>{
    const {id,lat,long} = data
    console.log(data)
    map.setView([lat,long],16)
    if(markers[id]){
        markers[id].setLatLng([lat,long])
    }else{
        markers[id] = L.marker([lat,long]).addTo(map)
    }
})

socket.on("user-disconnect",(id)=>{
   if(markers[id]){
    map.removeLayer(markers[id])
    delete markers[id]
   }
})