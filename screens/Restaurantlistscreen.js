import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const RestaurantListScreen = () => {
  const navigation = useNavigation();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch restaurants data from Firestore
    const unsubscribe = firestore()
      .collection('restaurant')
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        setRestaurants(data);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleRestaurantSelect = restaurant => {
    navigation.navigate('RestaurantScreen', {restaurant});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Restaurant List</Text>
      {restaurants.map(restaurant => (
        <TouchableOpacity
          key={restaurant.id}
          onPress={() => handleRestaurantSelect(restaurant)}
          style={styles.restaurantItem}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
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
  restaurantItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RestaurantListScreen;
