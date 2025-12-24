import { View, Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { PhotoMetadata } from '@/types/photo';

interface PhotoMarkerProps {
  photo: PhotoMetadata;
  onPress: (photo: PhotoMetadata) => void;
}

export function PhotoMarker({ photo, onPress }: PhotoMarkerProps) {
  if (!photo.location) return null;

  return (
    <Marker
      coordinate={{
        latitude: photo.location.latitude,
        longitude: photo.location.longitude,
      }}
      onPress={() => onPress(photo)}
    >
      <View style={styles.markerContainer}>
        <Image source={{ uri: photo.uri }} style={styles.markerImage} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
});
