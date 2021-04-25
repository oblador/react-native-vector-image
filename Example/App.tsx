import React from 'react';
import {ScrollView} from 'react-native';
import VectorImage from 'react-native-vector-image';

const App = () => (
  <ScrollView
    contentInsetAdjustmentBehavior="automatic"
    contentContainerStyle={{padding: 20}}>
    <VectorImage source={require('./react.svg')} />
  </ScrollView>
);

export default App;
