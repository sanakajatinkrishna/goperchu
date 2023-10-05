import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const RestaurantScreen = () => {
  const route = useRoute();
  const {restaurant} = route.params;
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // Fetch tables data for the restaurant from Firestore
    const unsubscribe = firestore()
      .collection('restaurant')
      .doc('gpOKcu0EmLaoSKTvImHH')
      .collection('Tables')
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTables(data);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  // Function to handle table selection
  const toggleTableSelection = tableId => {
    if (selectedTables.includes(tableId)) {
      setSelectedTables(selectedTables.filter(id => id !== tableId));
    } else {
      setSelectedTables([...selectedTables, tableId]);
    }
  };

  // Function to render tables with seat availability and selection
  const renderTables = () => {
    return tables.map(table => (
      <TouchableOpacity
        key={table.id}
        style={[
          styles.table,
          selectedTables.includes(table.id) && styles.selectedTable,
        ]}
        onPress={() => toggleTableSelection(table.id)}>
        <Text style={styles.tableName}>Table {table.id}</Text>
        <Text style={styles.seats}>Seats: {table.seats.join(', ')}</Text>
        <Text style={styles.availability}>
          Availability: {table.available ? 'Available' : 'Not Available'}
        </Text>
      </TouchableOpacity>
    ));
  };

  // Function to handle the booking action
  const handleBooking = async () => {
    // Perform booking logic here, e.g., update Firestore with booking information
    // You can use the selectedTables array to determine which tables to book

    // For example, you can set the 'available' property of the selected tables to false.
    // Be sure to handle this according to your Firestore data structure.

    // After booking, you can set a state to indicate booking success.
    setBookingSuccess(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{restaurant.name} Tables</Text>
      <View style={styles.tablesContainer}>{renderTables()}</View>
      {selectedTables.length > 0 && !bookingSuccess && (
        <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
          <Text style={styles.bookingButtonText}>Book Selected Tables</Text>
        </TouchableOpacity>
      )}
      {bookingSuccess && (
        <Text style={styles.bookingSuccessMessage}>Booking successful!</Text>
      )}
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
  tablesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    alignItems: 'center',
  },
  selectedTable: {
    backgroundColor: 'lightblue', // Change to your selected table color
  },
  tableName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seats: {
    fontSize: 16,
    marginTop: 8,
  },
  availability: {
    fontSize: 16,
    marginTop: 8,
  },
  bookingButton: {
    backgroundColor: 'blue', // Change to your desired button style
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  bookingButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bookingSuccessMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 16,
  },
});

export default RestaurantScreen;
