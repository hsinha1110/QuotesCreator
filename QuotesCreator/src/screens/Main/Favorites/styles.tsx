import { StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  emptyListContainer: {
    flexGrow: 1,
  },

  listContainer: {
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(20),
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(30),
  },

  emptyIconContainer: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(20),
  },

  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginBottom: moderateScale(8),
  },

  emptyDescription: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(21),
    textAlign: 'center',
    fontWeight: '300',
  },
});

export default styles;
