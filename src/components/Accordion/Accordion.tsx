import React, {ReactNode, useState} from 'react';
import {
  Button,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AccordionColapsible from 'react-native-collapsible/Accordion';
import COLORS from '../../config/COLORS';

interface Props {
  style?: StyleProp<ViewStyle>;
  open?: number[];
  onChange?: (val: number[]) => void;
  expandMultiple?: boolean;
  data: {
    title: string;
    content: ReactNode;
  }[];
}

const Accordion = ({
  style,
  data,
  open,
  onChange,
  expandMultiple = false,
}: Props) => {
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const onActiveChange = (sections: number[]) => setActiveSections(sections);

  function renderHeader(section, _, isActive) {
    return (
      <View style={styles.accordHeader}>
        <Text style={styles.accordTitle}>{section.title}</Text>
        <Icon
          name={isActive ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#bbb"
        />
      </View>
    );
  }

  function renderContent(section, _, isActive) {
    return <View style={styles.accordBody}>{section.content}</View>;
  }

  return (
    <View style={[styles.container, style]}>
      <AccordionColapsible
        easing="ease"
        duration={200}
        align="bottom"
        sections={data}
        activeSections={open ?? activeSections}
        expandMultiple={expandMultiple}
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={onChange ?? onActiveChange}
        sectionContainerStyle={styles.accordContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: COLORS.black,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  accordContainer: {
    paddingBottom: 4,
  },
  accordHeader: {
    padding: 12,
    backgroundColor: COLORS.white,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accordTitle: {
    color: COLORS.black,
    fontSize: 20,
  },
  accordBody: {
    padding: 12,
  },
  textSmall: {
    fontSize: 16,
  },
  seperator: {
    height: 12,
  },
});

export default Accordion;
