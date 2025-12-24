import { FlatList, StyleSheet, View, Text, RefreshControl } from 'react-native';
import { PhotoMetadata } from '@/types/photo';
import { PhotoItem } from './photo-item';

interface PhotoGridProps {
  photos: PhotoMetadata[];
  onPhotoPress: (photo: PhotoMetadata) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function PhotoGrid({ photos, onPhotoPress, onRefresh, refreshing }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📸</Text>
        <Text style={styles.emptyText}>No photos yet</Text>
        <Text style={styles.emptySubtext}>
          Take some photos with the camera to see them here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      renderItem={({ item }) => (
        <PhotoItem photo={item} onPress={() => onPhotoPress(item)} />
      )}
      keyExtractor={(item) => item.id}
      numColumns={3}
      contentContainerStyle={styles.grid}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing || false} onRefresh={onRefresh} />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
