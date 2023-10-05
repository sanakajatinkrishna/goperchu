import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import Geolib from 'geolib'; // Import Geolib

const ArcadeListScreen = () => {
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);
  const [arcadeData, setArcadeData] = useState([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log('Error getting user location:', error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Arcade')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setArcadeData(data);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userLocation) {
      arcadeData.forEach(arcade => {
        const distance = Geolib.getDistance(
          {latitude: userLocation.latitude, longitude: userLocation.longitude},
          {latitude: arcade.latitude, longitude: arcade.longitude},
        );
        if (distance <= 100) {
          //sendNotification('Welcome to ' + arcade.name);
          console.log('User entered:', arcade.name);
        }
      });
    }
  }, [userLocation, arcadeData]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {arcadeData.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.item}
          onPress={() =>
            navigation.navigate('Layout', {arcadeName: item.name})
          }>
          <Text style={styles.title}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
  },
});

export default ArcadeListScreen;
