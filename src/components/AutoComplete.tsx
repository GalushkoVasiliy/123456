import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TextStyle,
  TouchableOpacity as RNTouchableOpacity,
  Text,
  ViewStyle,
} from 'react-native';
import COLORS from '../config/COLORS';
import useDebounceState from '../hooks/useDebounceState';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import CloseIcon from '../assets/icons/Close';

const auth_token = '16b5cd19-e6e2-458b-a2b0-5751fcd6b5c1';

interface ISearch {
  format: string;
  suggestion: string;
  matched: [number, number][];
}

interface IResult {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  locality: string;
  province: string;
  postalCode: string;
  country: string;
}

interface Props {
  style?: ViewStyle;
  textStyle?: TextStyle;
  label?: string;
  onPress: (val: IResult) => void;
}

const AutoComplete = ({style, textStyle, label, onPress}: Props) => {
  const [search, debounceSearch, setSearch, resetSearch] = useDebounceState('');
  const [results, setResults] = useState<null | ISearch[]>(null);
  const inputRef = useRef<TextInput>(null);

  const searchRequest = (val: string) => {
    const searchValue = val.toLowerCase().replace('united kingdom', '');
    try {
      fetch(
        `https://api.edq.com/capture/address/v2/search?query=${searchValue}&country=GBR&dataset=&take=60&auth-token=${auth_token}`,
      )
        .then(r => r.json())
        .then(response => {
          setResults(response.results);
        });
    } catch (e) {
      console.error(e);
    }
  };

  const onSelect = (item: ISearch) => {
    inputRef.current?.blur();
    try {
      fetch(`${item.format}&auth-token=${auth_token}`)
        .then(r => r.json())
        .then(response => {
          const t = response.address.reduce((res: any, singleItem: any) => {
            return {...res, ...singleItem};
          }, {});
          onPress(t);
          setResults(null);
        });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (debounceSearch && inputRef.current?.isFocused()) {
      searchRequest(debounceSearch);
    }

    if (!debounceSearch) {
      setResults(null);
    }
  }, [debounceSearch]);

  const onClear = () => {
    resetSearch();
    setResults(null);
  };

  return (
    <View style={style}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={{height: 50}}>
        <TextInput
          ref={inputRef}
          style={[styles.input, textStyle]}
          value={search}
          onChangeText={v => setSearch(v)}
          placeholder="Enter your address or Postcode"
          placeholderTextColor={COLORS.gray}
        />

        {search.length > 0 && (
          <RNTouchableOpacity
            style={{position: 'absolute', right: 10, top: 15}}
            onPress={onClear}>
            <CloseIcon height={20} width={20} />
          </RNTouchableOpacity>
        )}
      </View>

      {!!results && results.length > 0 && (
        <FlatList
          style={styles.list}
          numColumns={1}
          data={results}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => {
                onSelect(item);
                setSearch(item.suggestion);
              }}>
              <Text numberOfLines={1} style={styles.listItemLabel}>
                {item.suggestion}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {!!results && !results.length && (
        <View style={styles.list}>
          <Text style={styles.emptyText}>
            Oops, we couldn't find your address. Try searching with just your
            postcode, or tap 'Enter Address Manually' to type it in yourself
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: COLORS.gray,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 50,
    borderColor: COLORS.gray,
    color: COLORS.black,
  },
  list: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.gray,
    bottom: 50,
    left: 0,
    right: 0,
    maxHeight: 150,
    zIndex: 101,
    paddingHorizontal: 15,
  },
  listItem: {
    height: 50,
    justifyContent: 'center',
  },
  listItemLabel: {
    color: COLORS.black,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 14,
  },
});

export default AutoComplete;
