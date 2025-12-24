import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { PhotoMetadata } from '@/types/photo';

interface MarkerCalloutProps {
  photo: PhotoMetadata;
  onViewDetails: () => void;
}

export function MarkerCallout({ photo, onViewDetails }: MarkerCalloutProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onViewDetails}>
      <Image source={{ uri: photo.uri }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.date}>{formatDate(photo.timestamp)}</Text>
        {photo.location?.address && (
          <Text style={styles.address} numberOfLines={2}>
            {photo.location.address.formattedAddress}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 12,
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: '#333',
  },
});
