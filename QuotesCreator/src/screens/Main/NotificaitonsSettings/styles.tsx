import {StyleSheet} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  timeContainer: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(30),
  },

  timeTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#181818',
    lineHeight: moderateScale(26),
    marginBottom: moderateScale(25),
  },

  timeCard: {
    minHeight: moderateScale(100),
    borderRadius: moderateScale(18),
    backgroundColor: '#F7F2FF',
    borderWidth: 1,
    borderColor: '#E8DFFF',
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(18),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  timeLabel: {
    fontSize: moderateScale(13),
    color: '#77727F',
    marginBottom: moderateScale(5),
  },

  timeValue: {
    fontSize: moderateScale(32),
    fontWeight: '700',
    color: '#7437E8',
  },

  editText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    color: '#7437E8',
  },

  pickerContainer: {
    marginTop: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9FB',
    borderRadius: moderateScale(18),
    paddingVertical: moderateScale(15),
  },

  infoContainer: {
    marginTop: moderateScale(25),
    padding: moderateScale(15),
    borderRadius: moderateScale(14),
    backgroundColor: '#F8F8FA',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  infoIcon: {
    fontSize: moderateScale(17),
    color: '#7437E8',
    marginRight: moderateScale(10),
  },

  infoText: {
    flex: 1,
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19),
    color: '#77777F',
  },

  timezoneContainer: {
    marginTop: moderateScale(18),
    paddingVertical: moderateScale(18),
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEF2',
  },

  timezoneTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#181818',
    marginBottom: moderateScale(5),
  },

  timezoneValue: {
    fontSize: moderateScale(13),
    color: '#888891',
  },
});

export default styles;