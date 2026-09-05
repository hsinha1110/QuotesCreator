import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import Header from '@/components/Header/Header';
import {goBack} from '@/utils/NavigationUtils';
import {AppDispatch, RootState} from '@/redux/store';

import {createQuoteThunk} from '@/redux/thunk/createQuoteThunk';
import {saveRecentQuoteThunk} from '@/redux/thunk/saveRecentThunk';

import {THEME_COLORS} from '@/constants/Colors';

import createStyles from './styles';

const CreateOwn = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: RootState) => state.auth.token);

  // ==========================================
  // LANGUAGE
  // ==========================================

  const language = useSelector(
    (state: RootState) => state.language.language,
  );

  const isHindi =
    String(language).toLowerCase() === 'hindi';

  // ==========================================
  // THEME
  // ==========================================

  const themeMode = useSelector(
    (state: RootState) => state.theme.mode,
  );

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // ==========================================
  // TRANSLATIONS
  // ==========================================

  const t = {
    createQuote: isHindi ? 'कोट बनाएं' : 'Create Quote',

    writeYourOwn: isHindi
      ? 'अपना कोट लिखें'
      : 'Write Your Own Quote',

    subtitle: isHindi
      ? 'कुछ प्रेरणादायक लिखें और अपने विचार दुनिया के साथ साझा करें'
      : 'Create something inspiring and share your thoughts with the world',

    yourQuote: isHindi ? 'आपका कोट' : 'Your Quote',

    quotePlaceholder: isHindi
      ? 'अपना कोट यहां लिखें...'
      : 'Write your quote here...',

    author: isHindi ? 'लेखक' : 'Author',

    authorPlaceholder: isHindi
      ? 'लेखक का नाम दर्ज करें (वैकल्पिक)'
      : 'Enter author name (optional)',

    optional: isHindi ? 'वैकल्पिक' : 'Optional',

    preview: isHindi ? 'प्रीव्यू' : 'Preview',

    previewQuote: isHindi
      ? '"आपका प्रेरणादायक कोट यहां दिखाई देगा..."'
      : '"Your inspiring quote will appear here..."',

    saving: isHindi ? 'सेव हो रहा है...' : 'Saving...',

    save: isHindi ? 'सेव करें' : 'Save',

    quoteRequired: isHindi
      ? 'कोट आवश्यक है'
      : 'Quote is required',

    tokenMissing: isHindi
      ? 'टोकन उपलब्ध नहीं है'
      : 'Token missing',

    quoteIdMissing: isHindi
      ? 'कोट ID नहीं मिली'
      : 'Quote ID not found after creating quote',

    createError: isHindi
      ? 'कोट बनाने में समस्या हुई'
      : 'Failed to create quote',
  };

  // ==========================================
  // HANDLE SAVE
  // ==========================================

  const handleContinue = async () => {
    const trimmedQuote = quote.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedQuote) {
      console.log(`❌ ${t.quoteRequired}`);
      return;
    }

    if (!token) {
      console.log(`❌ ${t.tokenMissing}`);
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // 1️⃣ CREATE QUOTE
      // ==========================================

      console.log('📝 Creating custom quote...');

      const createResponse = await dispatch(
        createQuoteThunk({
          text: trimmedQuote,
          author: trimmedAuthor || 'Unknown',

          language: isHindi ? 'Hindi' : 'English',

          source: 'user',

          translations: {
            English: isHindi ? '' : trimmedQuote,
            Hindi: isHindi ? trimmedQuote : '',
          },
        }),
      ).unwrap();

      console.log(
        '🔥 CREATE QUOTE RESPONSE:',
        JSON.stringify(createResponse, null, 2),
      );

      // ==========================================
      // 2️⃣ GET CREATED QUOTE ID
      // ==========================================

      const quoteId =
        createResponse?.quote?._id ||
        createResponse?._id ||
        createResponse?.data?.quote?._id ||
        createResponse?.data?._id;

      console.log('🔥 CREATED QUOTE ID:', quoteId);

      if (!quoteId) {
        throw new Error(t.quoteIdMissing);
      }

      // ==========================================
      // 3️⃣ SAVE RECENT QUOTE
      // ==========================================

      console.log('🕘 Calling saveRecentQuoteThunk...');

      const recentResponse = await dispatch(
        saveRecentQuoteThunk(String(quoteId)),
      ).unwrap();

      console.log(
        '✅ SAVE RECENT RESPONSE:',
        JSON.stringify(recentResponse, null, 2),
      );

      // ==========================================
      // 4️⃣ SUCCESS
      // ==========================================

      console.log(
        '✅ Quote created and saved in recent quotes',
      );

      goBack();
    } catch (error: any) {
      console.log(
        '❌ CREATE OWN ERROR:',
        error?.response?.data ||
          error?.message ||
          error,
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={t.createQuote}
        icon="close"
        onMenuPress={goBack}
        showNotification={false}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* TITLE */}

          <View style={styles.headingContainer}>
            <Text style={styles.title}>
              {t.writeYourOwn}
            </Text>

            <Text style={styles.subtitle}>
              {t.subtitle}
            </Text>
          </View>

          {/* QUOTE */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {t.yourQuote}
            </Text>

            <TextInput
              value={quote}
              onChangeText={setQuote}
              placeholder={t.quotePlaceholder}
              placeholderTextColor={colors.placeholder}
              multiline
              textAlignVertical="top"
              maxLength={300}
              style={styles.quoteInput}
            />

            <Text style={styles.characterCount}>
              {quote.length}/300
            </Text>
          </View>

          {/* AUTHOR */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {t.author}
            </Text>

            <TextInput
              value={author}
              onChangeText={setAuthor}
              placeholder={t.authorPlaceholder}
              placeholderTextColor={colors.placeholder}
              style={styles.authorInput}
            />

            <Text style={styles.optional}>
              {t.optional}
            </Text>
          </View>

          {/* PREVIEW */}

          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>
              {t.preview}
            </Text>

            <View style={styles.previewCard}>
              <Text style={styles.previewQuote}>
                {quote.trim()
                  ? `"${quote.trim()}"`
                  : t.previewQuote}
              </Text>

              {author.trim() ? (
                <Text style={styles.previewAuthor}>
                  — {author.trim()}
                </Text>
              ) : null}
            </View>
          </View>

          {/* SAVE BUTTON */}

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!quote.trim() || loading}
            onPress={handleContinue}
            style={[
              styles.continueButton,
              (!quote.trim() || loading) &&
                styles.disabledButton,
            ]}
          >
            <Text style={styles.continueText}>
              {loading ? t.saving : t.save}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateOwn;