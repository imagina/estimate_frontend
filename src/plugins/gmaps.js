// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  let autocompleteGoogle = document.createElement('script')
  autocompleteGoogle.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?offset=5&key='+env('GOOGLE_APY_KEY')+'&libraries=places')
  document.head.appendChild(autocompleteGoogle)
}
