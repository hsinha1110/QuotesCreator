import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
  },

  tabBar: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',

    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',

    paddingHorizontal: 8,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
  },

  // ==========================================
  // CENTER + BUTTON
  // ==========================================

  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButton: {
    width: 58,
    height: 58,
    borderRadius: 29,

    backgroundColor: '#6C2BD9',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: -28,

    elevation: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});
export default styles;
