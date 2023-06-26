import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyListComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>There's nothing here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EmptyListComponent;
