import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const LayoutScreen = ({route}) => {
  const {arcadeId, arcadeName} = route.params;
  const [snookerTables, setSnookerTables] = useState([]);
  const [gamingConsoles, setGamingConsoles] = useState([]);
  const [bowlingLanes, setBowlingLanes] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('arcades')
      .doc(arcadeId)
      .collection('details')
      .onSnapshot(querySnapshot => {
        const snookerData = [];
        const gamingData = [];
        const bowlingData = [];

        querySnapshot.forEach(doc => {
          const item = {
            id: doc.id,
            ...doc.data(),
          };

          switch (item.type) {
            case 'snooker':
              snookerData.push(item);
              break;
            case 'gaming':
              gamingData.push(item);
              break;
            case 'bowling':
              bowlingData.push(item);
              break;
            default:
              break;
          }
        });

        setSnookerTables(snookerData);
        setGamingConsoles(gamingData);
        setBowlingLanes(bowlingData);
      });

    return () => unsubscribe();
  }, [arcadeId]);

  const handleBooking = async (tableType, tableId) => {
    const itemRef = firestore()
      .collection('arcades')
      .doc(arcadeId)
      .collection('details')
      .doc(tableId);

    try {
      const itemSnapshot = await itemRef.get();
      if (itemSnapshot.exists) {
        const itemData = itemSnapshot.data();

        if (!itemData.isBooked) {
          const endTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes
          await itemRef.update({
            isBooked: true,
            timer: endTime,
          });

          // Update other items of the same type to not booked
          const itemCollection =
            tableType === 'snooker'
              ? snookerTables
              : tableType === 'gaming'
              ? gamingConsoles
              : bowlingLanes;

          const updatedCollection = itemCollection.map(item => ({
            ...item,
            isBooked: item.id === tableId,
          }));

          if (tableType === 'snooker') {
            setSnookerTables(updatedCollection);
          } else if (tableType === 'gaming') {
            setGamingConsoles(updatedCollection);
          } else {
            setBowlingLanes(updatedCollection);
          }
        } else {
          await itemRef.update({
            isBooked: false,
            timer: 0,
          });

          // Update state to reflect unbooking
          const itemCollection =
            tableType === 'snooker'
              ? snookerTables
              : tableType === 'gaming'
              ? gamingConsoles
              : bowlingLanes;

          const updatedCollection = itemCollection.map(item => ({
            ...item,
            isBooked: false,
            timer: 0,
          }));

          if (tableType === 'snooker') {
            setSnookerTables(updatedCollection);
          } else if (tableType === 'gaming') {
            setGamingConsoles(updatedCollection);
          } else {
            setBowlingLanes(updatedCollection);
          }
        }
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const renderEventItem = (item, image) => {
    const isBooked = item.isBooked;
    const remainingTime = (item.timer - currentTime.getTime()) / 1000;

    const formatTime = seconds => {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.itemContainer, isBooked && styles.bookedContainer]}
        onPress={() => handleBooking(item.type, item.id)}>
        <Image source={image} style={styles.image} />
        <Text style={[styles.eventName, isBooked && styles.bookedText]}>
          {item.name}
        </Text>
        <Text style={styles.eventType}>{item.type}</Text>
        <Text style={styles.timer}>
          {isBooked ? formatTime(remainingTime) : ''}
        </Text>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>{isBooked ? 'End' : 'Book'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {snookerTables.map(item =>
          renderEventItem(item, require('./assets/snooker_table.png')),
        )}
        {gamingConsoles.map(item =>
          renderEventItem(item, require('./assets/gaming_console.png')),
        )}
        {bowlingLanes.map(item =>
          renderEventItem(item, require('./assets/bowling_lane.png')),
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F5F9',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
  },
  bookedContainer: {
    opacity: 0.7,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  bookedText: {
    color: '#999999',
  },
  eventType: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  timer: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  bookButton: {
    backgroundColor: '#FF6F00',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LayoutScreen;
