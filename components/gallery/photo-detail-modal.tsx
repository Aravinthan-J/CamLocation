import {
  Modal,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Alert,
  Share,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PhotoMetadata } from '@/types/photo';
import { LocationBadge } from './location-badge';

const { width, height } = Dimensions.get('window');

interface PhotoDetailModalProps {
  visible: boolean;
  photo: PhotoMetadata | null;
  onClose: () => void;
  onDelete: (photoId: string) => Promise<void>;
}

export function PhotoDetailModal({
  visible,
  photo,
  onClose,
  onDelete,
}: PhotoDetailModalProps) {
  if (!photo) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: photo.location?.address?.formattedAddress || 'Check out this photo!',
        url: photo.uri,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await onDelete(photo.id);
            onClose();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete photo');
          }
        },
      },
    ]);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Photo */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo.uri }} style={styles.image} resizeMode="contain" />
        </View>

        {/* Details */}
        <ScrollView style={styles.details}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.detailText}>Captured: {formatDate(photo.timestamp)}</Text>

          {photo.location && (
            <>
              <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Location</Text>
              <LocationBadge location={photo.location} />
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  imageContainer: {
    width,
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  sectionSpacing: {
    marginTop: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});
