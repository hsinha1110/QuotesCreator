import { StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';

const styles = StyleSheet.create({
  logo: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(14),
    alignSelf: 'center',
    marginBottom: moderateScale(20),
    backgroundColor: '#F0EAFE',
  },
});

export default styles;