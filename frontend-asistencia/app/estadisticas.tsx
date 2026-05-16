import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../constants';

export default function EstadisticasScreen() {
    const { mencion, anoFiltro } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [datos, setDatos] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        obtenerEstadisticas();
    }, []);

    const obtenerEstadisticas = async () => {
        try {
            const res = await axios.get(`${API_URL}/estadisticas/${mencion}`, {
                params: { ano: anoFiltro }
            });
            setDatos(res.data);
        } catch (error) {
            console.error("Error al cargar estadísticas");
        } finally {
            setCargando(false);
        }
    };

    const renderEstudiante = ({ item }: { item: any }) => {
        // Cálculo de porcentaje de asistencia como número entero
        const porcentajeNum: number = item.total_clases > 0
            ? Math.round((item.totales_p / item.total_clases) * 100)
            : 0;

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.nombre}>{item.nro_lista}. {item.nombre} {item.apellido}</Text>
                    <Text style={[styles.porcentaje, { color: porcentajeNum < 75 ? '#EF4444' : '#10B981' }]}>
                        {porcentajeNum}%
                    </Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNum}>{item.totales_p}</Text>
                        <Text style={styles.statLabel}>Pres.</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statNum, { color: '#EF4444' }]}>{item.totales_a}</Text>
                        <Text style={styles.statLabel}>Inas.</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statNum, { color: '#F59E0B' }]}>{item.totales_r}</Text>
                        <Text style={styles.statLabel}>Ret.</Text>
                    </View>
                </View>

                {/* Barra de progreso visual */}
                <View style={styles.progressBg}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${porcentajeNum}%` as `${number}%`,
                                backgroundColor: porcentajeNum < 75 ? '#EF4444' : '#38BDF8',
                            },
                        ]}
                    />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#38BDF8" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.titulo}>Rendimiento</Text>
                    <Text style={styles.subtitulo}>{mencion} · {anoFiltro}° Año</Text>
                </View>
            </View>

            {cargando ? (
                <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={datos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderEstudiante}
                    contentContainerStyle={{ paddingBottom: 30 + insets.bottom }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617', paddingHorizontal: 20 },
    header: { marginTop: 60, flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    backBtn: { backgroundColor: '#0F172A', padding: 10, borderRadius: 12, marginRight: 15 },
    titulo: { fontSize: 24, fontWeight: '900', color: '#FFF' },
    subtitulo: { fontSize: 14, color: '#38BDF8', fontWeight: 'bold' },
    card: {
        backgroundColor: '#0F172A',
        borderRadius: 20,
        padding: 18,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    nombre: { color: '#F8FAFC', fontSize: 17, fontWeight: 'bold', flex: 1 },
    porcentaje: { fontSize: 18, fontWeight: '900' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
    statBox: { alignItems: 'center' },
    statNum: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    statLabel: { color: '#64748B', fontSize: 11, fontWeight: '600' },
    progressBg: { height: 8, backgroundColor: '#1E293B', borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 4 },
});
