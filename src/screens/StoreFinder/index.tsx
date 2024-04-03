/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  Appearance,
} from 'react-native';
import COLORS from '../../config/COLORS';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import {DROPDOWN_PAGES, DropDownContext} from '../../utils/dropdown-context';
import {connect} from 'react-redux';
import {clear_stores, get_stores} from '../../redux/actions/stores.actions';
import {Marker} from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import {FlatList} from 'react-native-gesture-handler';
import {ReducerType} from '../../redux/reducers/reducers';
import {filterStoresByCoordinates} from '../../utils/filterStoresByCoordinates';
import {sortStoresByDistance} from '../../utils/sortStoresByDistance';
import {Store} from '../../redux/reducers/storesReducer';
import {GOOGLE_KEY} from '../../config/CONSTANTS';

Geocoder.init(GOOGLE_KEY);

interface Props {
  get_stores_array: () => void;
  clear_stores: () => void;
  stores: ReducerType['stores'];
}

const StoreFinder = ({get_stores_array, stores}: Props) => {
  const mapRef = useRef<MapView>(null);
  const storeListRef = useRef<FlatList>(null);
  const {toOpen} = useContext(DropDownContext);

  const [isStoreLabels, setIsStoreLabels] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [current, setCurrent] = useState();
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    get_stores_array();
  }, []);

  useEffect(() => {});

  useEffect(() => {
    if (current) {
      setFilteredStores(
        sortStoresByDistance(filterStoresByCoordinates(stores.stores, current)),
      );
    } else {
      setFilteredStores([]);
    }
  }, [current]);

  const isDark = Appearance.getColorScheme() === 'dark';
  const searchBy = (term: string) => {
    setIsVisible(false);
    Geocoder.from(term, '')
      .then(json => {
        setIsStoreLabels(true);
        const location = {
          latitude: json.results[0].geometry.location.lat,
          longitude: json.results[0].geometry.location.lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        };
        setCurrent({
          latitude: json.results[0].geometry.location.lat,
          longitude: json.results[0].geometry.location.lng,
        });
        mapRef && mapRef.current.animateToRegion(location, 1000);
      })
      .catch(error => console.warn(error));
  };

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.white,
      }}>
      <Header />
      <View style={styles.container}>
        <MapView
          mapType={'standard'}
          ref={mapRef}
          style={styles.map}
          clusterColor={COLORS.red}
          clusterTextColor={COLORS.black}
          region={{
            latitude: 54.40899413031373,
            latitudeDelta: 9.921100796194331,
            longitude: -2.513791393898263,
            longitudeDelta: 9.424638891508605,
          }}
          showsMyLocationButton={true}
          showsScale={true}
          onRegionChangeComplete={data => {
            setIsVisible(true);
            if (data.latitudeDelta < 1 && data.longitudeDelta < 1) {
              setCurrent({
                longitude: data.longitude,
                latitude: data.latitude,
              });
            } else {
              setCurrent(null);
            }
          }}>
          {stores.stores.map((item, index) => (
            <Marker
              onPress={() => {
                toOpen({page: DROPDOWN_PAGES.store, content: item});
              }}
              key={index}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              title={item.name}
              description={item.brand_text}>
              <Image
                style={{width: 30, height: 40}}
                source={require('../../assets/images/RymanMapIcon.png')}
              />
            </Marker>
          ))}
        </MapView>

        {isVisible && (
          <View style={{position: 'absolute', top: 0}}>
            <PageTitle
              isTitle
              textKey="Store Finder"
              style={{
                color: isDark ? COLORS.white : COLORS.black,
                backgroundColor: 'transparent',
              }}
            />
            <GooglePlacesAutocomplete
              textInputProps={{
                placeholderTextColor: COLORS.gray,
                returnKeyType: 'search',
                onChangeText: text => {
                  setSearchTerm(text);
                },
                onSubmitEditing: () => {
                  searchBy(searchTerm);
                },
              }}
              styles={{
                container: styles.autoComplete,
                textInput: {borderRadius: 0, color: COLORS.black},
                description: {
                  color: COLORS.black,
                },
              }}
              placeholder="Search"
              onPress={data => {
                searchBy(data.description);
              }}
              onFail={err => console.log(err)}
              query={{
                key: GOOGLE_KEY,
                language: 'en',
                region: 'UK',
              }}
              currentLocationLabel="Current location"
              nearbyPlacesAPI="GooglePlacesSearch"
              GoogleReverseGeocodingQuery={{
                bounds: 10,
              }}
            />
          </View>
        )}

        {isStoreLabels && isVisible && (
          <View style={{position: 'absolute', bottom: 10}}>
            <FlatList
              ref={storeListRef}
              contentContainerStyle={{
                paddingLeft: 25,
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={filteredStores.length > 0 ? filteredStores : stores.stores}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    const location = {
                      longitude: item.longitude,
                      latitude: item.latitude,
                      latitudeDelta: 0.001,
                      longitudeDelta: 0.001,
                    };
                    setCurrent({
                      longitude: item.longitude,
                      latitude: item.latitude,
                    });
                    mapRef.current.animateToRegion(location, 1000);
                    storeListRef.current?.scrollToIndex({
                      animated: true,
                      index: 0,
                      viewOffset: 25,
                    });
                  }}
                  style={{
                    height: 150,
                    minWidth: 200,
                    marginRight: 25,
                    backgroundColor: COLORS.white,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: COLORS.gray,
                    padding: 15,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontSize: 20,
                        textDecorationStyle: 'solid',
                        textDecorationLine: 'underline',
                        marginBottom: 20,
                        color: COLORS.black,
                      }}>
                      {item.name}
                      {current && (
                        <Text
                          style={{
                            fontWeight: '300',
                            fontSize: 12,
                            color: COLORS.black,
                            textDecorationColor: 'white',
                          }}>
                          {' '}
                          ({Number(item.distance).toFixed(2)}m)
                        </Text>
                      )}
                    </Text>
                    <Text style={{color: COLORS.black}}>{item.address}</Text>
                    <Text style={{marginBottom: 10, color: COLORS.black}}>
                      {item.city}, {item.postcode}
                    </Text>
                    <Text style={{color: COLORS.black}}>{item.phone}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  textArea: {
    borderWidth: 1,
  },
  autoComplete: {
    width: Dimensions.get('screen').width,
    paddingHorizontal: 15,
  },
});

const mapDispatchToProps = (dispatch: (value: any) => void) => {
  return {
    get_stores_array: () => dispatch(get_stores()),
    clear_stores: () => dispatch(clear_stores()),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    stores: state.stores,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(StoreFinder));
