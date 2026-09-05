import { FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header/Header';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import ItemFavourites from '@/components/ListItems/ItemFavourites/ItemFavourites';
import { clearFavourites } from '@/redux/slices/favouriteSlice';
import EmptyState from '@/components/EmptyState/EmptyState';
import { translations } from '@/language';

const Favourites = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  // App language
  const language = useSelector(
    (state: RootState) => state.language.language,
  );

  const t = translations[language].FAVOURITES;

  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites || [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t.TITLE}
        onMenuPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        rightIcon="trash-outline"
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
            title={t.EMPTY_TITLE}
            description={t.EMPTY_DESCRIPTION}
          />
        }
      />
    </SafeAreaView>
  );
};

export default Favourites;