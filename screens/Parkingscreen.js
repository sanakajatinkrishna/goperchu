import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import geolib from 'geolib';

const ParkingScreen = ({route}) => {
  const {parkingArea} = route.params;
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [parkingData, setParkingData] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('ParkingAreas')
      .doc(parkingArea.id)
      .collection('ParkingData')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setParkingData(data);
      });

    return () => unsubscribe();
  }, [parkingArea.id]);

  const handleSlotSelect = slot => {
    setSelectedSlot(slot);
  };

  const handleSlotBook = () => {
    if (selectedSlot) {
      if (bookedSlots.includes(selectedSlot.id)) {
        Alert.alert(
          'Slot Already Booked',
          `Slot ${selectedSlot.poleNumber} is already booked. Please select another slot.`,
        );
      } else {
        setBookedSlots([...bookedSlots, selectedSlot.id]);
        setSelectedSlot(null);
        Alert.alert(
          'Slot Booked',
          `Slot ${selectedSlot.poleNumber} has been booked successfully!`,
        );
      }
    } else {
      Alert.alert('No Slot Selected', 'Please select a slot to book.');
    }
  };

  const isSlotBooked = slot => {
    return bookedSlots.includes(slot.id);
  };

  useEffect(() => {
    const geofenceCoordinates = parkingData
      .map(level => level.slots.map(slot => slot.coordinates))
      .flat()
      .map(coordSet => coordSet[0]);

    const watchId = Geolocation.watchPosition(
      position => {
        for (const coordinate of geofenceCoordinates) {
          const distance = geolib.getDistance(position.coords, coordinate);
          if (distance <= 100) {
            Alert.alert('Geofence Alert', 'You have reached the parking slot!');
            break;
          }
        }
      },
      error => {
        console.log('Error watching position:', error);
      },
      {enableHighAccuracy: true, distanceFilter: 10},
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [parkingData]);

  const renderSlot = slot => {
    const isBooked = isSlotBooked(slot);

    return (
      <TouchableOpacity
        key={slot.id}
        onPress={() => handleSlotSelect(slot)}
        style={[
          styles.slot,
          isBooked && styles.bookedSlot,
          selectedSlot === slot && styles.selectedSlot,
        ]}>
        <Text style={styles.slotText}>{slot.poleNumber}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('./assets/parking-background.jpg')}
      style={styles.container}>
      <Text style={styles.heading}>Parking Screen for {parkingArea.name}</Text>
      {parkingData.map(level => (
        <View key={level.id} style={styles.levelContainer}>
          <Text style={styles.levelText}>Level {level.level}</Text>
          <View style={styles.slotsContainer}>
            {level.slots.map(slot => renderSlot(slot))}
          </View>
        </View>
      ))}
      <TouchableOpacity onPress={handleSlotBook} style={styles.bookButton}>
        <Text style={styles.bookButtonText}>Book Slot</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  levelContainer: {
    marginBottom: 16,
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  slot: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
    borderRadius: 8,
    margin: '1%',
  },
  bookedSlot: {
    backgroundColor: 'red',
  },
  selectedSlot: {
    backgroundColor: 'green',
  },
  slotText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ParkingScreen;
