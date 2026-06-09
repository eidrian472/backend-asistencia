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
    const [error, setError] = useState(false);

    useEffect(() => {
        obtenerEstadisticas();
    }, []);

    const obtenerEstadisticas = async () => {
        setCargando(true);
        setError(false);
        try {
            const res = await axios.get(`${API_URL}/estadisticas/${mencion}`, {
                params: { ano: anoFiltro }
            });
            setDatos(res.data);
        } catch (err) {
            console.error("Error al cargar estadísticas");
            setError(true);
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

                {/* Barra de progreso visual — solo si hay clases registradas */}
                {item.total_clases > 0 ? (
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
                ) : (
                    <View style={styles.sinClasesBadge}>
                        <Text style={styles.sinClasesText}>Sin clases registradas</Text>
                    </View>
                )}
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
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Ionicons name="cloud-offline-outline" size={52} color="#8A9BB0" />
                    <Text style={styles.errorTitulo}>No se pudo cargar</Text>
                    <Text style={styles.errorDescripcion}>
                        Hubo un problema al conectar con el servidor.{'\n'}Verifica tu conexión e inténtalo de nuevo.
                    </Text>
                    <TouchableOpacity style={styles.reintentarBtn} onPress={obtenerEstadisticas}>
                        <Ionicons name="refresh-outline" size={18} color="#FFFFFF" />
                        <Text style={styles.reintentarText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            ) : datos.length === 0 ? (
                <View style={styles.errorContainer}>
                    <Ionicons name="people-outline" size={52} color="#8A9BB0" />
                    <Text style={styles.errorTitulo}>Sin datos</Text>
                    <Text style={styles.errorDescripcion}>
                        No hay registros de asistencia para esta sección.
                    </Text>
                </View>
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
    // Fondo principal de toda la pantalla — Gris/azul muy claro (Entorno de lectura limpio)
    container: { 
        flex: 1, 
        backgroundColor: '#F7F9FC', 
        paddingHorizontal: 20 
    },

    header: { 
        marginTop: 60, 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 25 
    },
    // Fondo del botón de retroceso (flecha ←) en el header — Azul muy claro Movistar
    backBtn: { 
        backgroundColor: '#EAF6FF', 
        padding: 10, 
        borderRadius: 12, 
        marginRight: 15 
    },
    // Nota: Recuerda que el ícono (arrow-back) dentro de este botón debe llevar color: '#009EF7'

    // Color del título "Rendimiento" — Azul muy oscuro para contraste sobre fondo claro
    titulo: { 
        fontSize: 24, 
        fontWeight: '900', 
        color: '#1A1A2E' 
    },
    // Color del subtítulo (mención + año, ej. "Telemática · 3° Año") — Azul Movistar principal
    subtitulo: { 
        fontSize: 14, 
        color: '#009EF7', 
        fontWeight: 'bold' 
    },

    // Fondo de cada card de estudiante — Blanco puro
    // Borde de la card de estudiante — Gris sutil de la paleta nueva
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    cardHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 15 
    },
    // Color del nombre del estudiante en la card — Azul muy oscuro
    nombre: { 
        color: '#1A1A2E', 
        fontSize: 17, 
        fontWeight: 'bold', 
        flex: 1 
    },
    
    // Color del porcentaje de asistencia en la card — se define inline en el JSX.
    // IMPORTANTE: Actualiza las condiciones de color de tu JSX con los nuevos estados:
    //   '#FF3B30' (Rojo Movistar) si el porcentaje es < 75% (estudiante en riesgo)
    //   '#00C853' (Verde estado Movistar) si el porcentaje es >= 75% (aceptable)
    porcentaje: { 
        fontSize: 18, 
        fontWeight: '900' 
    },

    statsRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginBottom: 15 
    },
    statBox: { 
        alignItems: 'center' 
    },
    // Color del número de Presencias en el statBox — Azul muy oscuro (valor por defecto)
    // Nota inline en tu JSX para los otros números:
    //   Inasistencias se sobreescribe con '#FF3B30' (Rojo Movistar)
    //   Retiros se sobreescribe con '#FF9500' (Ámbar Movistar)
    statNum: { 
        color: '#1A1A2E', 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    // Color de las etiquetas "Pres." / "Inas." / "Ret." debajo de los números — Gris de apoyo Movistar
    statLabel: { 
        color: '#8A9BB0', 
        fontSize: 11, 
        fontWeight: '600' 
    },

    // Fondo del carril (track) de la barra de progreso de asistencia — Gris claro para entorno blanco
    progressBg: { 
        height: 8, 
        backgroundColor: '#E8EDF2', 
        borderRadius: 4, 
        overflow: 'hidden' 
    },
    // Color de relleno de la barra de progreso — se define inline en tu JSX.
    // IMPORTANTE: Modifica tu lógica inline para que pinte estos colores nuevos:
    //   '#FF3B30' (Rojo Movistar) si el porcentaje es < 75%
    //   '#009EF7' (Azul Movistar principal) si el porcentaje es >= 75%
    progressFill: { 
        height: '100%', 
        borderRadius: 4 
    },
    sinClasesBadge: {
        backgroundColor: '#F2F4F7',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    sinClasesText: {
        color: '#8A9BB0',
        fontSize: 11,
        fontWeight: '600',
        fontStyle: 'italic',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingTop: 60,
        gap: 12,
    },
    errorTitulo: {
        color: '#1A1A2E',
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    errorDescripcion: {
        color: '#8A9BB0',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    reintentarBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#009EF7',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 14,
        marginTop: 8,
    },
    reintentarText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
    },
});
