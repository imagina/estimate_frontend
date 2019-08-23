const moduleName = 'lead';
const moduleVersion = 'v1';
const baseApiUrl = `${env('forget_gorget', 'https://dev.fhaproducts.com')}/api`;
const urlBase = `${baseApiUrl}/${moduleName}/${moduleVersion}`


export default {
  urlBase : urlBase,
  version: moduleVersion,
  appointments: `${urlBase}/appointments/appointments-to-estimate`,
}
