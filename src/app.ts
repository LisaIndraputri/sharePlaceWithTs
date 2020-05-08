import axios from 'axios';
import { GOOGLE_API_KEY } from './source';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;


export type GoogleGeocodingResponse = {
  results: {geometry: {location: {lat: number, lng: number}}}[];
  status: 'OK' | 'ZERO_RESULTS';
}

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios.get<GoogleGeocodingResponse>
    (`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
    .then(res => {
      if (res.data.status !== 'OK') {
        throw new Error('can\'t get the location');
      }
      const coordinates = res.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById('map')!, {
        center: coordinates,
        zoom: 8
      });
      new google.maps.Marker({position: coordinates, map: map});
    })
    .catch(err => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener('submit', searchAddressHandler);
