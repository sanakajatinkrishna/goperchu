import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const ParkingListScreen = () => {
  const navigation = useNavigation();
  const [parkingAreas, setParkingAreas] = useState([]);

  useEffect(() => {
    // Fetch parking areas data from Firestore
    const unsubscribe = firestore()
      .collection('ParkingAreas')
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setParkingAreas(data);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleParkingAreaSelect = parkingArea => {
    navigation.navigate('Parking', {parkingArea});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Parking Areas</Text>
      {parkingAreas.map(parkingArea => (
        <TouchableOpacity
          key={parkingArea.id}
          onPress={() => handleParkingAreaSelect(parkingArea)}
          style={styles.parkingAreaItem}>
          <Text style={styles.parkingAreaName}>{parkingArea.name}</Text>
          <Text style={styles.parkingAreaLocation}>{parkingArea.location}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  parkingAreaItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  parkingAreaName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  parkingAreaLocation: {
    fontSize: 16,
    color: 'gray',
  },
});

export default ParkingListScreen;
