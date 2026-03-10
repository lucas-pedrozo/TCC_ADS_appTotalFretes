import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useGetUser } from "@/src/hooks/user/useGetUser";
import { useGetFreightUser } from "@/src/hooks/freight/useGetFreightUser";

import { Ionicons } from "@expo/vector-icons";
import { useIconColor, useThemeColors } from "@/src/context/ThemeContext";
import { DetailRow } from "@/src/components/info/DetailRow";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardFreight } from "@/src/components/cards/CardFreight";
import { HeaderPerfil } from "@/src/components/header/HeaderPerfil";
import { CardActivityHome } from "@/src/components/cards/CardActivityHome";
import DetalhesFreteModal from "@/src/components/mapbox/DetalhesFreteModal";


function OngoingFreights() {
    const colors = useThemeColors();
    const iconColor = useIconColor();
    const [refreshKey, setRefreshKey] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDetalhesFreteModalVisible, setIsDetalhesFreteModalVisible] = useState(false);

    const { userData, handleGetUser } = useGetUser();
    const { freightUser, handleGetFreightUser } = useGetFreightUser();

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([handleGetUser(), handleGetFreightUser()]);
            setRefreshKey((prev) => prev + 1);
        } finally {
            setIsRefreshing(false);
        }
    }, [handleGetUser, handleGetFreightUser]);

    useEffect(() => {
        handleGetUser();
        handleGetFreightUser();
    }, [handleGetUser, handleGetFreightUser]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100, paddingTop: 10 }}
                showsVerticalScrollIndicator={false}
                className="flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor={iconColor}
                    />
                }
            >
                <HeaderPerfil
                    name={userData?.name}
                    email={userData?.email}
                    cpf={userData?.cpf}
                />
                <View className="h-7"/>
                
                <CardFreight
                    freight={freightUser}
                />

                <View className="h-7"/>

                <CardActivityHome
                    key={`card-activity-${refreshKey}`}
                    freight={freightUser}
                    AcceptButton={false}
                />

                <View className="h-7"/>

                <TouchableOpacity className="flex-1 py-3 w-full rounded-lg items-center" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.bgTertiary, borderWidth: 1 }} onPress={() => setIsDetalhesFreteModalVisible(true)}>
                    <Text className="text-center font-semibold text-base" style={{ color: colors.text }}>
                        <Ionicons name="map-outline" size={20} color={iconColor} /> Ver mapa
                    </Text>
                </TouchableOpacity>

                <Text className="font-semibold text-base pl-2.5 mb-4 mt-5" style={{ color: colors.text }}>Mais detalhes</Text>
                <DetailRow label="Tipo" value={freightUser?.cargo?.name ?? "---"} />
                <DetailRow label="Categoria" value={freightUser?.cargo?.vehicle_type?.name ?? "---"} />
                <DetailRow label="Peso da carga" value={freightUser?.cargo?.weight ?? "---"} />
                <DetailRow label="Prazo" value={freightUser?.time_limit ?? "---"} />
                <DetailRow label="Data Embarque" value={freightUser?.departure_date ?? "---"} />
                <DetailRow label="Data Desembarque" value={freightUser?.arrival_date ?? "---"} />
            </ScrollView>

            <DetalhesFreteModal
                visible={isDetalhesFreteModalVisible}
                onClose={() => setIsDetalhesFreteModalVisible(false)}
                enderecoCarga={freightUser?.origin_label ?? "---"}
                enderecoDestino={freightUser?.destination_label ?? "---"}
                nomeEmpresa={freightUser?.company?.name ?? "---"}
                rotaSimples={false}
                prazo={freightUser?.time_limit ?? "---"}
            />
        </SafeAreaView>
    )
}

export default OngoingFreights;
