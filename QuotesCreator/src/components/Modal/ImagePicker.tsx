import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

 import { ImagePickerModalProps } from '@/types';
import styles from './styles';

const ImagePickerModal = ({
  visible,
  onClose,
  onCamera,
  onGallery,
}: ImagePickerModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.modalContainer}>
          <View style={styles.handle} />

          <Text style={styles.title}>Choose Profile Photo</Text>

          <Text style={styles.subtitle}>
            Select an option to upload your photo
          </Text>

          {/* Camera */}
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
              <Text style={styles.optionTitle}>Take Photo</Text>

              <Text style={styles.optionSubtitle}>
                Capture a new photo with camera
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.arrow.color}
            />
          </TouchableOpacity>

          {/* Gallery */}
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
              <Text style={styles.optionTitle}>Choose from Gallery</Text>

              <Text style={styles.optionSubtitle}>
                Select a photo from your gallery
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.arrow.color}
            />
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImagePickerModal;
