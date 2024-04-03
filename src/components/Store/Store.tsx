/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';

import {
  Text,
  TouchableOpacity,
  View,
  Linking,
  FlatList,
  Platform,
} from 'react-native';
import IconComponent from '../IconComponent';
import moment from 'moment';
import COLORS from '../../config/COLORS';
import {Store} from '../../redux/reducers/storesReducer';

interface Props {
  storeFinder: Store;
  withOutStoreOptions?: boolean;
}

const StoreComponent = ({storeFinder, withOutStoreOptions}: Props) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (storeFinder) {
      setReady(true);
    }
  }, [storeFinder]);

  const checkIsOpen = () => {
    const current = moment();
    const start =
      moment().format('d') !== '2'
        ? moment().set({hours: 9, minutes: 0, seconds: 0})
        : moment().set({hours: 11, minutes: 0, seconds: 0});
    const end =
      moment().format('d') !== '2'
        ? moment().set({hours: 17, minutes: 30, seconds: 0})
        : moment().set({hours: 16, minutes: 30, seconds: 0});
    return current.isAfter(start) && current.isBefore(end);
  };

  return ready ? (
    <View style={{flex: 1}}>
      <View style={{paddingHorizontal: 15, marginVertical: 15}}>
        <Text style={{fontWeight: '700', fontSize: 22, color: COLORS.black}}>
          {storeFinder.name}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 15,
          marginBottom: 50,
        }}>
        <View style={{flex: 1}}>
          <View>
            <Text
              style={{fontWeight: '700', fontSize: 16, color: COLORS.black}}>
              Address
            </Text>
            <View style={{marginVertical: 10}}>
              <Text style={{color: COLORS.black}}>{storeFinder.address}</Text>
              <Text style={{color: COLORS.black}}>
                {storeFinder.city}, {storeFinder.postcode}
              </Text>
            </View>
          </View>
          <View style={{}}>
            <Text
              style={{fontWeight: '700', fontSize: 16, color: COLORS.black}}>
              Phone
            </Text>
            <View style={{flexDirection: 'row', marginVertical: 10}}>
              <IconComponent color={COLORS.black} size={20} iconName="phone" />
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel:${storeFinder.phone}`);
                }}>
                <Text style={{marginLeft: 5, color: COLORS.black}}>
                  {storeFinder.phone}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text
            style={{
              paddingHorizontal: 15,
              fontWeight: '700',
              fontSize: 16,
              color: COLORS.black,
            }}>
            Opening hours
          </Text>
          <View style={{paddingHorizontal: 15, marginTop: 10}}>
            <FlatList
              data={storeFinder.opening_hours}
              renderItem={({item, index}) => {
                const data = JSON.parse(item);
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 2,
                    }}>
                    <Text style={{color: COLORS.black}}>{data.day}:</Text>
                    <Text style={{color: COLORS.black}}>
                      {data.open_time} - {data.closing_time}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </View>
      {!withOutStoreOptions && (
        <>
          <View style={{flex: 1, paddingHorizontal: 15}}>
            <Text
              style={{fontWeight: '700', fontSize: 16, color: COLORS.black}}>
              Store Options
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 15,
                width: '100%',
                height: 50,
                backgroundColor: COLORS.red,
                borderRadius: 8,
              }}>
              <Text style={{color: COLORS.white, fontWeight: '700'}}>
                {checkIsOpen() ? 'We are open' : 'We are closed'}
              </Text>
            </View>
            <Text style={{color: COLORS.black}}>
              At Ryman you can shop for stationery and office supplies, as well
              as print from USB/email, photocopy, comb, click, wire, and thermal
              binding services, laminate, DHL, Western Union, and scan to
              USB/email.
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 15,
              marginBottom: 50,
              height: 50,
            }}>
            <TouchableOpacity
              onPress={() => {
                const scheme = Platform.select({
                  ios: 'maps://0,0?q=',
                  android: 'geo:0,0?q=',
                });
                const latLng = `${storeFinder.latitude},${storeFinder.longitude}`;
                const label = `${storeFinder.address}, ${storeFinder.city}, ${storeFinder.postcode}`;
                const url = Platform.select({
                  ios: `${scheme}${label}@${latLng}`,
                  android: `${scheme}${latLng}(${label})`,
                });

                Linking.openURL(url as string);
              }}
              style={{
                height: 50,
                borderRadius: 8,
                backgroundColor: COLORS.black,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: COLORS.white, fontWeight: '700'}}>
                Get directions
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  ) : (
    <View />
  );
};

export default React.memo(StoreComponent);
