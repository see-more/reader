import React from 'react';
import { View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const AddIcon = () => {
  return (
    <View>
      <MaterialIcons
        name='add'
        size={30}
        color='black'
      />
    </View>
  );
};

export default AddIcon;
