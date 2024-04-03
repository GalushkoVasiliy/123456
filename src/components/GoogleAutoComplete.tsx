import React, {useState} from 'react';
import COLORS from '../config/COLORS';
import Geocoder from 'react-native-geocoding';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {GOOGLE_KEY} from '../config/CONSTANTS';

interface Props {
  onPress: (val: any) => void;
  label?: string;
}

const GoogleAutoComplete = ({onPress, label}: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const searchBy = (term: string) => {
    Geocoder.from(term, '')
      .then(json => {
        onPress(json);
      })
      .catch(err => console.warn(err));
  };

  return (
    <View>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <GooglePlacesAutocomplete
        textInputProps={{
          placeholderTextColor: COLORS.gray,
          returnKeyType: 'search',
          onChangeText: text => {
            setSearchTerm(text);
          },
          onSubmitEditing: text => {
            searchBy(searchTerm);
          },
        }}
        styles={{
          container: {
            paddingHorizontal: 7,
            width: '100%',
            backgroundColor: COLORS.white,
            borderColor: COLORS.gray,
            borderWidth: 1,
            marginBottom: 16,
          },
          textInputContainer: {
            height: 50,
          },
          textInput: {
            color: COLORS.black,
          },
          listView: {
            position: 'absolute',
            bottom: 50,
            left: -1,
            right: 0,
            borderWidth: 1,
            borderColor: COLORS.gray,
            width: Dimensions.get('screen').width - 30,
          },
          description: {
            color: COLORS.black,
          },
        }}
        placeholder="Enter your address or Postcode"
        onPress={data => {
          searchBy(data.description);
        }}
        onFail={err => console.log(err)}
        query={{
          key: GOOGLE_KEY,
          language: 'en',
          components: 'country:gb',
          fields: ['address_components'],
          types: ['address', 'postal_code', 'geocode'],
        }}
        currentLocationLabel="Current location"
        nearbyPlacesAPI="GoogleReverseGeocoding"
        GoogleReverseGeocodingQuery={{
          bounds: 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 90,
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
  },
});

export default GoogleAutoComplete;
