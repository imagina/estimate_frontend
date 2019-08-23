<template>
  <div id="mapCanvas" style="width: 60vw; height: 500px; maxHeight: 500px"/>
</template>
<script>
  export default {
    props: {
      address: {default: false},
      data: {
        default: () => {
          return []
        },
      },
    },
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        this.initializeMap()
      })
    },
    data() {
      return {
        geocoder: new google.maps.Geocoder(),
      }
    },
    methods: {
      initializeMap() {
        let latitude = 26.0692597
        let longitude = -80.185617
        let mapOptions = {zoom: 12, mapTypeId: google.maps.MapTypeId.ROADMAP}
        let objectMap = false

        //Geocode address to get lat and lng
        this.geocoder.geocode({'address': this.address}, (results, status) => {
          if (status == google.maps.GeocoderStatus.OK) {

            //Set latitude and longitude
            if (results[0]) {
              latitude = results[0].geometry.location.lat()
              longitude = results[0].geometry.location.lng()
            }

            //Set map Center
            mapOptions.center = new google.maps.LatLng(latitude, longitude)

            //Initialize map
            objectMap = new google.maps.Map(document.getElementById("mapCanvas"), mapOptions);
            //Add market
            new google.maps.Marker({
              map: objectMap,
              draggable: false,
              position: mapOptions.center,
            });
          }

        });
      }
    },
  }
</script>
<style lang="stylus">
  @import "~variables";
</style>
