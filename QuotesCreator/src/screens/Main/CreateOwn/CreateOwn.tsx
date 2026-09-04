import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import Header from '@/components/Header/Header';
import { goBack } from '@/utils/NavigationUtils';
import { AppDispatch, RootState } from '@/redux/store';

import { createQuoteThunk } from '@/redux/thunk/createQuoteThunk';
import { saveRecentQuoteThunk } from '@/redux/thunk/saveRecentThunk';

import styles from './styles';

const CreateOwn = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: RootState) => state.auth.token);

  const handleContinue = async () => {
    const trimmedQuote = quote.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedQuote) {
      console.log('❌ Quote is required');
      return;
    }

    if (!token) {
      console.log('❌ Token missing');
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
          language: 'English',
          source: 'user',
          translations: {
            English: trimmedQuote,
            Hindi: trimmedQuote,
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
        throw new Error('Quote ID not found after creating quote');
      }

      // ==========================================
      // 3️⃣ SAVE RECENT QUOTE
      // ==========================================

      console.log('🕘 Calling saveRecentQuoteThunk...');

      const recentResponse = await dispatch(
        saveRecentQuoteThunk(quoteId),
      ).unwrap();

      console.log(
        '✅ SAVE RECENT RESPONSE:',
        JSON.stringify(recentResponse, null, 2),
      );

      // ==========================================
      // 4️⃣ SUCCESS
      // ==========================================

      console.log('✅ Quote created and saved in recent quotes');

      goBack();
    } catch (error: any) {
      console.log(
        '❌ CREATE OWN ERROR:',
        error?.response?.data || error?.message || error,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Create Quote"
        icon="close"
        onMenuPress={goBack}
        showNotification={false}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* TITLE */}

          <View style={styles.headingContainer}>
            <Text style={styles.title}>Write Your Own Quote</Text>

            <Text style={styles.subtitle}>
              Create something inspiring and share your thoughts with the world
            </Text>
          </View>

          {/* QUOTE */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Your Quote</Text>

            <TextInput
              value={quote}
              onChangeText={setQuote}
              placeholder="Write your quote here..."
              placeholderTextColor="#A6A6B0"
              multiline
              textAlignVertical="top"
              maxLength={300}
              style={styles.quoteInput}
            />

            <Text style={styles.characterCount}>{quote.length}/300</Text>
          </View>

          {/* AUTHOR */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Author</Text>

            <TextInput
              value={author}
              onChangeText={setAuthor}
              placeholder="Enter author name (optional)"
              placeholderTextColor="#A6A6B0"
              style={styles.authorInput}
            />

            <Text style={styles.optional}>Optional</Text>
          </View>

          {/* PREVIEW */}

          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Preview</Text>

            <View style={styles.previewCard}>
              <Text style={styles.previewQuote}>
                {quote.trim()
                  ? `"${quote.trim()}"`
                  : '"Your inspiring quote will appear here..."'}
              </Text>

              {author.trim() ? (
                <Text style={styles.previewAuthor}>— {author.trim()}</Text>
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
              (!quote.trim() || loading) && styles.disabledButton,
            ]}
          >
            <Text style={styles.continueText}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateOwn;
