import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { PhotoMetadata } from '@/types/photo';
import { LocationBadge } from './location-badge';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3 - 8;

interface PhotoItemProps {
  photo: PhotoMetadata;
  onPress: () => void;
}

export function PhotoItem({ photo, onPress }: PhotoItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: photo.uri }} style={styles.image} />
      {photo.location && (
        <LocationBadge location={photo.location} compact />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
