import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { PhotoMetadata } from '@/types/photo';
import { usePhotos } from '@/hooks/use-photos';
import { PhotoDetailModal } from '@/components/gallery/photo-detail-modal';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorMessage } from '@/components/shared/error-message';
import { LocationBadge } from '@/components/gallery/location-badge';

export default function MapScreen() {
  const { photosWithLocation, loading, error, deletePhotoById, refresh } = usePhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePhotoPress = (photo: PhotoMetadata) => {
    setSelectedPhoto(photo);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPhoto(null);
  };

  const handleDeletePhoto = async (photoId: string) => {
    await deletePhotoById(photoId);
  };

  if (loading) {
    return <LoadingSpinner message="Loading photos..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  if (photosWithLocation.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🗺️</Text>
        <Text style={styles.emptyText}>No geotagged photos</Text>
        <Text style={styles.emptySubtext}>
          Photos with location data will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.webNotice}>
        <Text style={styles.webNoticeText}>
          📍 Interactive map is available on iOS and Android apps
        </Text>
      </View>

      <FlatList
        data={photosWithLocation}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.photoCard} onPress={() => handlePhotoPress(item)}>
            <Image source={{ uri: item.uri }} style={styles.thumbnail} />
            <View style={styles.cardContent}>
              <LocationBadge location={item.location} />
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />

      <PhotoDetailModal
        visible={modalVisible}
        photo={selectedPhoto}
        onClose={handleCloseModal}
        onDelete={handleDeletePhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webNotice: {
    backgroundColor: '#007AFF',
    padding: 12,
    alignItems: 'center',
  },
  webNoticeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    padding: 16,
  },
  photoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
