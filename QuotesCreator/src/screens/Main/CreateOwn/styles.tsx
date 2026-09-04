import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: moderateScale(30),
  },

  headingContainer: {
    marginTop: moderateScale(20),
    marginBottom: moderateScale(25),
  },

  title: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: '#202020',
    marginBottom: moderateScale(8),
  },

  subtitle: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(21),
    color: '#777780',
  },

  inputContainer: {
    marginBottom: moderateScale(20),
  },

  label: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#24242A',
    marginBottom: moderateScale(9),
  },

  quoteInput: {
    minHeight: moderateScale(150),
    borderWidth: 1,
    borderColor: '#E3E0EA',
    borderRadius: moderateScale(14),
    paddingHorizontal: moderateScale(15),
    paddingTop: moderateScale(15),
    paddingBottom: moderateScale(30),
    fontSize: moderateScale(15),
    color: '#202020',
    backgroundColor: '#FAF9FC',
  },

  characterCount: {
    position: 'absolute',
    right: moderateScale(12),
    bottom: moderateScale(10),
    fontSize: moderateScale(11),
    color: '#9999A3',
  },

  authorInput: {
    height: moderateScale(52),
    borderWidth: 1,
    borderColor: '#E3E0EA',
    borderRadius: moderateScale(14),
    paddingHorizontal: moderateScale(15),
    fontSize: moderateScale(15),
    color: '#202020',
    backgroundColor: '#FAF9FC',
  },

  optional: {
    fontSize: moderateScale(11),
    color: '#9999A3',
    marginTop: moderateScale(5),
  },

  previewContainer: {
    marginTop: moderateScale(2),
    marginBottom: moderateScale(25),
  },

  previewLabel: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#24242A',
    marginBottom: moderateScale(10),
  },

  previewCard: {
    minHeight: moderateScale(150),
    borderRadius: moderateScale(18),
    backgroundColor: '#6C4AB6',
    padding: moderateScale(22),
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewQuote: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(27),
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  previewAuthor: {
    marginTop: moderateScale(15),
    fontSize: moderateScale(13),
    color: '#FFFFFF',
    opacity: 0.9,
  },

  continueButton: {
    height: moderateScale(54),
    borderRadius: moderateScale(14),
    backgroundColor: '#6C4AB6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.45,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
});

export default styles;
