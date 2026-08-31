import { StyleSheet } from 'react-native';
import COLORS from '@/constants/Colors';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  tab: {
    flex: 1,
    height: moderateScale(48),
    marginHorizontal: moderateScale(22),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  tabText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#777777',
  },

  activeTabText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },

  activeLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.accent,
  },
});

export default styles;
