export function parseGoogleAddressComponents(addressComponents: any[]) {
  const addressObject = {
    street: '',
    streetNumber: '',
    postcode: '',
    country: '',
    countryId: '',
    city: '',
    address2: '',
  };

  for (const component of addressComponents) {
    const componentType = component.types[0];

    switch (componentType) {
      case 'street_number':
        addressObject.streetNumber = component.long_name;
        break;
      case 'route':
        addressObject.street = component.long_name;
        break;
      case 'administrative_area_level_1':
        addressObject.address2 = component.long_name;
        break;
      case 'postal_town':
        addressObject.city = component.long_name;
        break;
      case 'postal_code':
        addressObject.postcode = component.long_name;
        break;
      case 'country':
        addressObject.countryId = component.short_name;
        addressObject.country = component.long_name;
        break;
      // Add more cases for other address components as needed

      default:
        break;
    }
  }

  return addressObject;
}
