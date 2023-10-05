import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import firebase from 'firebase/app';
import 'firebase/auth';

const HomeScreen = ({navigation}) => {
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleNavigateToFeature = feature => {
    navigation.navigate(feature);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>

      <TouchableOpacity
        style={styles.featureContainer}
        onPress={() => handleNavigateToFeature('TrendingPlaces')}>
        <Image style={styles.featureImage} />
        <Text style={styles.featureText}>Trending Places</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.featureContainer}
        onPress={() => handleNavigateToFeature('trending events')}>
        <Image style={styles.featureImage} />
        <Text style={styles.featureText}>Good Restaurants</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureContainer: {
    backgroundColor: '#ECECEC',
    borderRadius: 8,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  featureImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  featureText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    width: '80%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
