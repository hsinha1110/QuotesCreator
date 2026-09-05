import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { useSelector } from 'react-redux';

import { ImagePickerModalProps } from '@/types';
import { RootState } from '@/redux/store';
import { translations } from '@/language';

import styles from './styles';

const ImagePickerModal = ({
  visible,
  onClose,
  onCamera,
  onGallery,
}: ImagePickerModalProps) => {
  // ==========================================
  // LANGUAGE
  // ==========================================

  const language = useSelector((state: RootState) => state.language.language);

  const t = translations[language].IMAGE_PICKER;

  // ==========================================
  // UI
  // ==========================================

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* BACKDROP */}

        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContainer}>
          {/* HANDLE */}

          <View style={styles.handle} />

          {/* TITLE */}

          <Text style={styles.title}>{t.TITLE}</Text>

          {/* SUBTITLE */}

          <Text style={styles.subtitle}>{t.SUBTITLE}</Text>

          {/* ======================================
              CAMERA
          ====================================== */}

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={onCamera}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="camera-outline"
                size={24}
                color={styles.icon.color}
              />
            </View>

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{t.TAKE_PHOTO}</Text>

              <Text style={styles.optionSubtitle}>
                {t.TAKE_PHOTO_DESCRIPTION}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.arrow.color}
            />
          </TouchableOpacity>

          {/* ======================================
              GALLERY
          ====================================== */}

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={onGallery}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name="images-outline"
                size={24}
                color={styles.icon.color}
              />
            </View>

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{t.CHOOSE_FROM_GALLERY}</Text>

              <Text style={styles.optionSubtitle}>
                {t.CHOOSE_FROM_GALLERY_DESCRIPTION}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.arrow.color}
            />
          </TouchableOpacity>

          {/* ======================================
              CANCEL
          ====================================== */}

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>{t.CANCEL}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImagePickerModal;
