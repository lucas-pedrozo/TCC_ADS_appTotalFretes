import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { MAPBOX_PUBLIC_TOKEN } from '@env';

// Importe o seu novo hook (ajuste o caminho conforme sua estrutura de pastas)
import { useHookGetMapBox } from '@/src/hooks/mapBox/hookGetMapBox';

Mapbox.setAccessToken(MAPBOX_PUBLIC_TOKEN);

// Tipagem das Props que o Modal vai receber
interface DetalhesFreteModalProps {
  visible: boolean;
  onClose: () => void;
  enderecoCarga?: string;
  enderecoDestino?: string;
  nomeEmpresa?: string;
  rotaSimples?: boolean;
}

export default function DetalhesFreteModal({
  visible,
  onClose,
  enderecoCarga = 'Rua São Paulo 4512, Campo Mourão',
  enderecoDestino = 'Juranda',
  nomeEmpresa = 'Coamo',
  rotaSimples = false,
}: DetalhesFreteModalProps) {
  const { rotaData, loadingRota, handleGetMapBox } = useHookGetMapBox();

  useEffect(() => {
    if (visible) {
      const destino = rotaSimples ? enderecoDestino : `${nomeEmpresa}, ${enderecoDestino}`;
      handleGetMapBox(enderecoCarga, destino, { rotaSimples });
    }
  }, [visible, enderecoCarga, enderecoDestino, nomeEmpresa, rotaSimples, handleGetMapBox]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <View style={styles.modalHeader}>
            <Text style={styles.tituloHeader}>Rota</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>

          {/* MAPA */}
          <View style={styles.mapContainer}>
            <Mapbox.MapView style={styles.map}>
              <Mapbox.Camera
                zoomLevel={8}
                centerCoordinate={[-52.3833, -24.0458]} 
              />

              {/* Só desenha a linha se tiver a geometria retornada do Hook */}
              {rotaData?.geometria && (
                <Mapbox.ShapeSource id="rotaSource" shape={rotaData.geometria}>
                  <Mapbox.LineLayer
                    id="rotaLinha"
                    style={{
                      lineColor: '#2ECC71',
                      lineWidth: 5,
                      lineCap: 'round',
                      lineJoin: 'round',
                    }}
                  />
                </Mapbox.ShapeSource>
              )}
            </Mapbox.MapView>
          </View>

          {/* PAINEL DE INFORMAÇÕES */}
          <View style={styles.infoContainer}>
            <Text style={styles.titulo}>Mais Detalhes</Text>
            
            {/* Feedback visual enquanto busca a rota */}
            {loadingRota ? (
              <ActivityIndicator size="large" color="#3498db" style={{ marginVertical: 20 }} />
            ) : (
              <>
                <View style={styles.linhaInfo}>
                  <Text style={styles.labelInfo}>Distância</Text>
                  <Text style={styles.valorInfo}>
                    {rotaData?.distancia_total_km ? `${rotaData.distancia_total_km} km` : 'Calculando...'}
                  </Text>
                </View>
                
                <View style={styles.linhaInfo}>
                  <Text style={styles.labelInfo}>Saída</Text>
                  <Text style={styles.valorInfo}>{enderecoCarga.split(',')[0]}</Text>
                </View>

                <View style={styles.linhaInfo}>
                  <Text style={styles.labelInfo}>Destino</Text>
                  <Text style={styles.valorInfo}>{enderecoDestino}</Text>
                </View>

                <View style={styles.linhaInfo}>
                  <Text style={styles.labelInfo}>Empresa Dest</Text>
                  <Text style={styles.valorInfo}>{nomeEmpresa}</Text>
                </View>

                <View style={styles.linhaInfo}>
                  <Text style={styles.labelInfo}>Prazo</Text>
                  <Text style={styles.valorInfo}>10/09/2025</Text>
                </View>
              </>
            )}
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tituloHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ffe6e6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 250,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 20,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  linhaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelInfo: {
    color: '#7f8c8d',
  },
  valorInfo: {
    fontWeight: '500',
  }
});