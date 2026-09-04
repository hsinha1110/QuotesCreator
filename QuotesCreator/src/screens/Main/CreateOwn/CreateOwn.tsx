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
import { goBack, navigate } from '@/utils/NavigationUtils';
import { AppDispatch, RootState } from '@/redux/store';

import { createQuoteThunk } from '@/redux/thunk/createQuoteThunk';

import styles from './styles';
import { saveRecentQuoteThunk } from '@/redux/thunk/saveRecentThunk';

const CreateOwn = () => {
  // ==========================================
  // STATES
  // ==========================================

  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  // ==========================================
  // AUTH TOKEN
  // ==========================================

  const token = useSelector((state: RootState) => state.auth.token);

  console.log('========== CREATE OWN ==========');
  console.log('TOKEN:', !!token);

  // ==========================================
  // SAVE
  // ==========================================

  const handleContinue = async () => {
    const trimmedQuote = quote.trim();
    const trimmedAuthor = author.trim();

    // Quote validation
    if (!trimmedQuote) {
      console.log('❌ Quote is required');
      return;
    }

    // Token validation
    if (!token) {
      console.log('❌ Token missing');
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // 1️⃣ CREATE CUSTOM QUOTE
      // ==========================================

      console.log('📝 Creating custom quote...');

      const response = await dispatch(
        createQuoteThunk({
          text: trimmedQuote,
          author: trimmedAuthor || 'Unknown',
          language: 'English',
          source: 'user',
        }),
      ).unwrap();

      console.log('✅ CREATE QUOTE RESPONSE:', response);

      // ==========================================
      // 2️⃣ GET NEWLY CREATED QUOTE ID
      // ==========================================

      const quoteId = response?.quote?._id;

      console.log('✅ CREATED QUOTE ID:', quoteId);

      if (!quoteId) {
        console.log('❌ Quote ID not found in create response');
        return;
      }

      console.log('Saving recent quote...');

      const recentResponse = await dispatch(
        saveRecentQuoteThunk(quoteId),
      ).unwrap();

      console.log(' SAVE RECENT QUOTE RESPONSE:', recentResponse);

      // navigate('Editor', {
      //   quote: trimmedQuote,
      //   author: trimmedAuthor || 'Unknown',
      //   quoteId: quoteId,
      //   isCustomQuote: true,
      // });
    } catch (error: any) {
      console.log('❌ CREATE OWN ERROR:', error?.response?.data || error);
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
          {/* ==================================
              TITLE
          ================================== */}

          <View style={styles.headingContainer}>
            <Text style={styles.title}>Write Your Own Quote</Text>

            <Text style={styles.subtitle}>
              Create something inspiring and share your thoughts with the world
            </Text>
          </View>

          {/* ==================================
              QUOTE
          ================================== */}

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

          {/* ==================================
              AUTHOR
          ================================== */}

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

          {/* ==================================
              PREVIEW
          ================================== */}

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

          {/* ==================================
              SAVE BUTTON
          ================================== */}

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
