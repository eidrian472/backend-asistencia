import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Sidebar, { MenuButton } from '../components/Sidebar'; // ajusta la ruta

export default function AnoScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { rol, usuario, menciones_permitidas, materia } = useLocalSearchParams();
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const todosPorRol =
        rol === 'admin'
            ? ['1', '2', '3', '4', '5']
            : rol === 'docente_manana'
                ? ['1', '2', '3']
                : rol === 'docente_tarde'
                    ? ['4', '5']
                    : ['1', '2', '3', '4', '5'];

    const mpStr = String(menciones_permitidas ?? '').trim();
    const tieneMenciones = mpStr !== '' && mpStr !== 'null' && mpStr !== 'undefined';

    const anosPermitidos = tieneMenciones
        ? [...new Set(
            mpStr
                .split(',')
                .map(p => p.trim().split(':')[1])
                .filter(Boolean)
        )].filter(a => todosPorRol.includes(a)).sort((a, b) => Number(a) - Number(b))
        : todosPorRol;

    const coloresPorAno: Record<string, string> = {
        '1': '#38BDF8', '2': '#10B981', '3': '#F59E0B', '4': '#818CF8', '5': '#F472B6'
    };
    const etiquetasPorAno: Record<string, string> = {
        '1': '1er Año', '2': '2do Año', '3': '3er Año', '4': '4to Año', '5': '5to Año'
    };

    const anosDisponibles = anosPermitidos.map(a => ({
        ano: a,
        label: etiquetasPorAno[a],
        color: coloresPorAno[a],
    }));

    const turno = rol === 'admin' ? 'Acceso Completo' : rol === 'docente_manana' ? 'Mañana' : rol === 'docente_tarde' ? 'Tarde' : 'Docente';

    return (
        <View style={styles.container}>
            <Sidebar
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
                rol={String(rol ?? '')}
                usuario={String(usuario ?? '')}
                menciones_permitidas={mpStr}
                materia={String(materia ?? '')}
            />

            <View style={styles.header}>
                <MenuButton onPress={() => setSidebarVisible(true)} />
                <View>
                    <Text style={styles.titulo}>Seleccionar Año</Text>
                    <Text style={styles.subtitulo}>Turno {turno}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={[styles.grid, { paddingBottom: 40 + insets.bottom }]}>

                {rol === 'admin' && (
                    <TouchableOpacity
                        style={styles.cardAdmin}
                        onPress={() => router.push({
                            pathname: '/asistencia-docentes',
                            params: { usuario },
                        })}
                    >
                        <View style={styles.cardInfo}>
                            <View style={styles.iconCircleAdmin}>
                                <Ionicons name="people" size={24} color="#020617" />
                            </View>
                            <View>
                                <Text style={styles.cardTextAdmin}>Asistencia de Docentes</Text>
                                <Text style={styles.cardSubAdmin}>Control diario del personal</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#020617" />
                    </TouchableOpacity>
                )}

                {rol === 'admin' && (
                    <View style={styles.separador}>
                        <View style={styles.separadorLinea} />
                        <Text style={styles.separadorTexto}>AÑOS ESCOLARES</Text>
                        <View style={styles.separadorLinea} />
                    </View>
                )}

                {anosDisponibles.map((item) => (
                    <TouchableOpacity
                        key={item.ano}
                        style={[styles.card, { borderLeftColor: item.color }]}
                        onPress={() =>
                            router.push({
                                pathname: '/menu',
                                params: {
                                    rol,
                                    usuario,
                                    anoFiltro: item.ano,
                                    menciones_permitidas: mpStr,
                                    materia: String(materia ?? '')
                                },
                            })
                        }
                    >
                        <View style={styles.cardInfo}>
                            <View style={[styles.iconCircle, { backgroundColor: item.color + '22' }]}>
                                <Ionicons name="school" size={24} color={item.color} />
                            </View>
                            <Text style={styles.cardText}>{item.label}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#334155" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617', padding: 20 },
    header: { marginTop: 50, flexDirection: 'row', alignItems: 'center', marginBottom: 35, gap: 15 },
    titulo: { fontSize: 26, fontWeight: '900', color: '#F8FAFC' },
    subtitulo: { fontSize: 13, color: '#64748B', marginTop: 2 },
    grid: { gap: 12 },
    cardAdmin: {
        backgroundColor: '#38BDF8',
        borderRadius: 18,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
    },
    iconCircleAdmin: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgba(2,6,23,0.15)',
        justifyContent: 'center', alignItems: 'center',
        marginRight: 14,
    },
    cardTextAdmin: { color: '#020617', fontSize: 18, fontWeight: '900' },
    cardSubAdmin: { color: 'rgba(2,6,23,0.6)', fontSize: 11, fontWeight: '600', marginTop: 2 },
    separador: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginVertical: 4,
    },
    separadorLinea: { flex: 1, height: 1, backgroundColor: '#1E293B' },
    separadorTexto: { color: '#334155', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
    card: {
        backgroundColor: '#0F172A', borderRadius: 18, borderLeftWidth: 6,
        borderWidth: 1, borderColor: '#1E293B', padding: 20,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    cardInfo: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    cardText: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold' },
});
