import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 14,
  },

  inputContainer: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  inputError: {
    borderColor: '#E53935',
  },

  leftIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#111111',
    paddingVertical: 0,
  },

  eyeButton: {
    width: 40,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 3,
  },

  errorText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#E53935',
  },
});

export default styles;