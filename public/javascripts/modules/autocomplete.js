function autocomplete(input, lat, lng){
    if(!input) return;  // skip this fn from running if there is not input on the page
    const dropdown =  new google.maps.places.Autocomplete(input);
    //lat = dropdown.getPlace().geometry.location.lat();
    dropdown.addListener('place_changed',  () => {
        const place = dropdown.getPlace();
        //console.log(place);
        lat.value = place.geometry.location.lat();
        lng.value = place.geometry.location.lng();
        console.log(place);
    });
    //console.log(input, latInput, lngInput);
    input.on('keydown', (e) => {
        if(e.keyCode === 13) e.preventDefault();
    })
}

export default autocomplete;