import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { moderateScale } from 'react-native-size-matters';

import IMAGES from '@/assets/images';
import COLORS from '@/constants/Colors';

import { DailyQuoteCardProps } from '@/types';

import styles from './styles';

const DailyQuote = ({
  quote,
  onFavoritePress,
  onSharePress,
}: DailyQuoteCardProps) => {
  return (
    <View style={styles.card}>
      {/* QUOTE ICON */}

      <Image source={IMAGES.QUOTES} style={styles.quoteIcon} />

      {/* QUOTE CONTENT */}

      <View style={styles.content}>
        <Text style={styles.title}>{quote.title}</Text>

        <Text style={styles.body}>{quote.body}</Text>
      </View>

      {/* BOTTOM ROW */}

      <View style={styles.bottomRow}>
        {/* DATE */}

        <Text style={styles.date}>
          {quote.createdAt
            ? moment(quote.createdAt).format('DD MMM YYYY • h:mm A')
            : ''}
        </Text>

        {/* ACTIONS */}

        <View style={styles.actions}>
          {/* FAVORITE */}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onFavoritePress}
            style={styles.actionButton}
            hitSlop={{
              top: 8,
              bottom: 8,
              left: 8,
              right: 8,
            }}
          >
            <Ionicons
              name="heart-outline"
              size={moderateScale(22)}
              color={COLORS.black}
            />
          </TouchableOpacity>

          {/* SHARE */}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSharePress}
            style={styles.actionButton}
            hitSlop={{
              top: 8,
              bottom: 8,
              left: 8,
              right: 8,
            }}
          >
            <Ionicons
              name="share-social-outline"
              size={moderateScale(22)}
              color={COLORS.black}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DailyQuote;
