import { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { PhotoMetadata } from '@/types/photo';
import { usePhotos } from '@/hooks/use-photos';
import { PhotoMarker } from '@/components/map/photo-marker';
import { PhotoDetailModal } from '@/components/gallery/photo-detail-modal';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorMessage } from '@/components/shared/error-message';

export default function MapScreen() {
  const { photosWithLocation, loading, error, deletePhotoById, refresh } = usePhotos();
  const mapRef = useRef<MapView>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Calculate initial region based on photos
  const getInitialRegion = (): Region | undefined => {
    if (photosWithLocation.length === 0) {
      // Default to San Francisco if no photos
      return {
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
    }

    const latitudes = photosWithLocation.map((p) => p.location!.latitude);
    const longitudes = photosWithLocation.map((p) => p.location!.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = (maxLat - minLat) * 1.5 || 0.0922;
    const lngDelta = (maxLng - minLng) * 1.5 || 0.0421;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  };

  useEffect(() => {
    if (photosWithLocation.length > 0 && mapRef.current) {
      const region = getInitialRegion();
      if (region) {
        mapRef.current.animateToRegion(region, 1000);
      }
    }
  }, [photosWithLocation.length]);

  const handleMarkerPress = (photo: PhotoMetadata) => {
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
    return <LoadingSpinner message="Loading map..." />;
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
          Photos with location data will appear on the map
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={getInitialRegion()}
        showsUserLocation
        showsMyLocationButton
      >
        {photosWithLocation.map((photo) => (
          <PhotoMarker key={photo.id} photo={photo} onPress={handleMarkerPress} />
        ))}
      </MapView>

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
  },
  map: {
    flex: 1,
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
