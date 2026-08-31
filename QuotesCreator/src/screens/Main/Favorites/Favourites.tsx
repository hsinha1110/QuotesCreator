import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header/Header';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import ItemFavourites from '@/components/ListItems/ItemFavourites/ItemFavourites';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { clearFavourites } from '@/redux/slices/favouriteSlice';
import COLORS from '@/constants/Colors';
import { moderateScale } from 'react-native-size-matters';
import EmptyState from '@/components/EmptyState/EmptyState';

const Favourites = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites || [],
  );
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Favourites"
        onMenuPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        rightIcon={'trash-outline'}
        onRightPress={() => dispatch(clearFavourites())}
        showNotification={true}
      />

      <FlatList
        data={favourites}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <ItemFavourites
            item={item}
            onShare={item => {
              console.log('Share quote:', item);
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          favourites.length === 0
            ? styles.emptyListContainer
            : styles.listContainer
        }
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No Favourites Yet!"
            description={`Tap the heart icon on any quote
you like to save it here.`}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Favourites;
