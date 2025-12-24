import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { PhotoMetadata } from "@/types/photo";
import { usePhotos } from "@/hooks/use-photos";
import { PhotoGrid } from "@/components/gallery/photo-grid";
import { PhotoDetailModal } from "@/components/gallery/photo-detail-modal";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { ErrorMessage } from "@/components/shared/error-message";

export default function GalleryScreen() {
  const { photos, loading, error, deletePhotoById, refresh } = usePhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(
    null
  );
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

  return (
    <View style={styles.container}>
      <PhotoGrid
        photos={photos}
        onPhotoPress={handlePhotoPress}
        onRefresh={refresh}
        refreshing={loading}
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
    backgroundColor: "#fff",
  },
});
