import COLORS from '@/constants/Colors';
import { StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  languageValue: {
    fontSize: 12,
    color: '#77777F',
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7437E8',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 10,
    marginLeft: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEF2',
    overflow: 'hidden',
    marginBottom: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  row: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F4',
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F4EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    color: '#7437E8',
    fontSize: 21,
    fontWeight: '600',
  },

  rowContent: {
    flex: 1,
    paddingVertical: 10,
  },

  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#191919',
    marginBottom: 4,
  },

  rowSubtitle: {
    fontSize: 12,
    color: '#8A8A91',
    lineHeight: 17,
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },

  value: {
    fontSize: 12,
    color: '#77777F',
    marginRight: 7,
  },

  arrow: {
    fontSize: 25,
    color: '#8C8C93',
    fontWeight: '300',
  },

  logoutButton: {
    height: 58,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EEEEF2',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 2,
  },

  logoutIcon: {
    fontSize: 23,
    color: '#EF3340',
    marginRight: 9,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF3340',
  },

  version: {
    textAlign: 'center',
    fontSize: 11,
    color: '#A0A0A6',
    marginTop: 18,
  },
  content: {
    paddingHorizontal: moderateScale(18),
  },
});
export default styles;
