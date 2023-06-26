import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Screen1 = ({ screenName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{screenName}</Text>
      <Text>This is a placeholder screen.</Text>
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
    marginBottom: 10,
  },
});

export default Screen1;