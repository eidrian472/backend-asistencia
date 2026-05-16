import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Sidebar, { MenuButton } from '../components/Sidebar';

export default function MenuScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { rol, usuario, anoFiltro: anoFiltroParam, menciones_permitidas, materia } = useLocalSearchParams();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [anoActual, setAnoActual] = useState(String(anoFiltroParam ?? '1'));
    const [showAnoPicker, setShowAnoPicker] = useState(false);

    const todosPorRol =
        rol === 'admin' ? ['1', '2', '3', '4', '5']
            : rol === 'docente_manana' ? ['1', '2', '3']
                : rol === 'docente_tarde' ? ['4', '5']
                    : ['1', '2', '3', '4', '5'];

    const mpStr = String(menciones_permitidas ?? '').trim();
    const tieneMenciones = mpStr !== '' && mpStr !== 'null' && mpStr !== 'undefined';

    const anosPermitidos: string[] = tieneMenciones
        ? [...new Set(mpStr.split(',').map(p => p.trim().split(':')[1]).filter(Boolean))]
            .filter(a => todosPorRol.includes(a))
            .sort((a, b) => Number(a) - Number(b))
        : todosPorRol;

    const etiquetasAno: Record<string, string> = {
        '1': '1er Año', '2': '2do Año', '3': '3er Año', '4': '4to Año', '5': '5to Año',
    };

    // ── Nueva paleta: colores pastel por año ──────────────────────────────────
    const coloresPorAno: Record<string, string> = {
        '1': '#A8DFFE', // azul pastel
        '2': '#A7EDD8', // verde pastel
        '3': '#FDDEA0', // amarillo pastel
        '4': '#C9CBFA', // violeta pastel
        '5': '#FAB8D8', // rosa pastel
    };
    // Colores de texto oscuro para cada año (para contrastar con el pastel)
    const textColorPorAno: Record<string, string> = {
        '1': '#073347',
        '2': '#064033',
        '3': '#5A3600',
        '4': '#1e1b6b',
        '5': '#6b1040',
    };

    const todasLasMenciones = [
        { nombre: 'Telemática',      color: '#A8DFFE', icon: 'code-working' },
        { nombre: 'Turismo',         color: '#A7EDD8', icon: 'airplane'      },
        { nombre: 'Administración',  color: '#FDDEA0', icon: 'business'      },
        { nombre: 'Contabilidad',    color: '#C9CBFA', icon: 'calculator'    },
    ];

    const menciones = tieneMenciones
        ? todasLasMenciones.filter(m => {
            const pares = mpStr.split(',').map(p => p.trim());
            return pares.some(p => {
                const [men, ano] = p.split(':');
                return men.trim() === m.nombre && ano.trim() === anoActual;
            });
        })
        : todasLasMenciones;

    const colorAno = coloresPorAno[anoActual] ?? '#A8DFFE';
    const textColorAno = textColorPorAno[anoActual] ?? '#0D2340';

    return (
        <View style={styles.container}>
            <Sidebar
                visible={sidebarVisible}
                onClose={() => setSidebarVisible(false)}
                rol={String(rol ?? '')}
                usuario={String(usuario ?? '')}
                menciones_permitidas={mpStr}
                materia={String(materia ?? '')}
                anoFiltro={anoActual}
            />

            {/* Modal selector de año */}
            <Modal visible={showAnoPicker} transparent animationType="fade" onRequestClose={() => setShowAnoPicker(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAnoPicker(false)}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Cambiar Año</Text>
                        {anosPermitidos.map(a => (
                            <TouchableOpacity
                                key={a}
                                style={[
                                    styles.modalItem,
                                    anoActual === a && { backgroundColor: coloresPorAno[a] + '66', borderColor: coloresPorAno[a] }
                                ]}
                                onPress={() => { setAnoActual(a); setShowAnoPicker(false); }}
                            >
                                <View style={[styles.modalDot, { backgroundColor: coloresPorAno[a] }]} />
                                <Text style={[styles.modalItemText, anoActual === a && { color: textColorPorAno[a], fontWeight: '900' }]}>
                                    {etiquetasAno[a]}
                                </Text>
                                {anoActual === a && <Ionicons name="checkmark-circle" size={20} color={coloresPorAno[a]} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Top bar */}
            <View style={styles.topBar}>
                <MenuButton onPress={() => setSidebarVisible(true)} />
                <Text style={styles.logoText}>E.T. J.R.G.S</Text>
                <TouchableOpacity
                    onPress={() => router.push({ pathname: '/perfil', params: { usuario, rol } })}
                    style={styles.perfilBtn}
                >
                    <Ionicons name="person-circle-outline" size={32} color="#5A9FDE" />
                </TouchableOpacity>
            </View>

            {/* Banner año activo */}
            <TouchableOpacity
                style={[styles.anoBanner, { borderColor: colorAno }]}
                onPress={() => anosPermitidos.length > 1 && setShowAnoPicker(true)}
                activeOpacity={anosPermitidos.length > 1 ? 0.7 : 1}
            >
                <View style={[styles.anoBadge, { backgroundColor: colorAno }]}>
                    <Ionicons name="school" size={18} color={textColorAno} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.anoLabel}>AÑO ACTIVO</Text>
                    <Text style={[styles.anoValor, { color: textColorAno }]}>
                        {etiquetasAno[anoActual] ?? `${anoActual}° Año`}
                    </Text>
                </View>
                {anosPermitidos.length > 1 && (
                    <View style={[styles.cambiarBtn, { backgroundColor: colorAno + '55' }]}>
                        <Ionicons name="swap-vertical" size={16} color={textColorAno} />
                        <Text style={[styles.cambiarText, { color: textColorAno }]}>Cambiar</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.header}>
                <Text style={styles.saludo}>
                    {rol === 'admin' ? 'Panel Administrativo' : 'Panel de Control'}
                </Text>
                <Text style={styles.subtitulo}>
                    {rol === 'admin'
                        ? 'Consulta listas y gestiona estudiantes:'
                        : 'Selecciona la mención para el pase de lista:'}
                </Text>
            </View>

            <ScrollView contentContainerStyle={[styles.grid, { paddingBottom: 60 + insets.bottom }]}>

                {rol === 'admin' && (
                    <TouchableOpacity style={styles.btnAdmin} onPress={() => router.push('/gestion' as any)}>
                        <View style={styles.cardInfo}>
                            <View style={styles.iconCircleAdmin}>
                                <Ionicons name="person-add" size={24} color="#6B4000" />
                            </View>
                            <View>
                                <Text style={styles.adminTextMain}>Gestión de Matrícula</Text>
                                <Text style={styles.adminTextSub}>Inscribir o editar alumnos</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#6B4000" />
                    </TouchableOpacity>
                )}

                {rol === 'admin' && (
                    <TouchableOpacity style={styles.btnInasistencias} onPress={() => router.push('/inasistencias' as any)}>
                        <View style={styles.cardInfo}>
                            <View style={styles.iconCircleInasistencias}>
                                <Ionicons name="alert-circle" size={24} color="#EF4444" />
                            </View>
                            <View>
                                <Text style={styles.inasistenciasTextMain}>Control de Inasistencias</Text>
                                <Text style={styles.inasistenciasTextSub}>Ausencias, retiros y observaciones</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#EF4444" />
                    </TouchableOpacity>
                )}

                {menciones.map((m) => (
                    <View key={m.nombre} style={[styles.cardContainer, { borderLeftColor: m.color }]}>
                        <TouchableOpacity
                            style={styles.cardMain}
                            onPress={() => router.push({
                                pathname: '/asistencia',
                                params: {
                                    seleccion: m.nombre,
                                    rol,
                                    usuario: usuario ?? '',
                                    anoFiltro: anoActual,
                                    materia: materia ?? '',
                                    menciones_permitidas: mpStr,
                                }
                            })}
                        >
                            <View style={styles.cardInfo}>
                                <View style={[styles.iconMencion, { backgroundColor: m.color + '44' }]}>
                                    <Ionicons name={m.icon as any} size={22} color={m.color.replace('FE','B0').replace('D8','90').replace('A0','70').replace('FA','D0')} />
                                </View>
                                <View>
                                    <Text style={styles.cardText}>{m.nombre}</Text>
                                    <Text style={styles.cardSub}>
                                        {rol === 'admin' ? 'Ver lista de estudiantes' : 'Registrar hoy'}
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name={rol === 'admin' ? 'people-outline' : 'chevron-forward'}
                                size={20}
                                color="#5A80A8"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/estadisticas', params: { mencion: m.nombre, anoFiltro: anoActual } })}
                            style={[styles.statsBtn, { borderTopColor: '#99C4EF' }]}
                        >
                            <Ionicons name="bar-chart" size={16} color="#5A9FDE" />
                            <Text style={styles.statsBtnText}>VER ESTADÍSTICAS</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.btnHistorial}
                    onPress={() => router.push({
                        pathname: '/historial',
                        params: { rol, menciones_permitidas: String(menciones_permitidas ?? '') }
                    })}
                >
                    <Ionicons name="calendar" size={20} color="#5A9FDE" style={{ marginRight: 10 }} />
                    <Text style={styles.btnHistorialText}>Ver Historial de Asistencias</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    // ── Fondo base azul claro
    container: { flex: 1, backgroundColor: '#E4EFFF', padding: 20 },
    topBar: {
        marginTop: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoText: { color: '#5A80A8', fontWeight: 'bold', fontSize: 14 },
    perfilBtn: { padding: 5 },

    // Banner año activo
    anoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 2,
        padding: 14,
        marginBottom: 20,
        gap: 12,
    },
    anoBadge: {
        width: 40, height: 40, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    anoLabel: { color: '#5A80A8', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
    anoValor: { fontSize: 18, fontWeight: '900', marginTop: 1 },
    cambiarBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 10, paddingVertical: 6,
        borderRadius: 10,
    },
    cambiarText: { fontSize: 12, fontWeight: '800' },

    // Modal picker de año
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(13,35,64,0.7)',
        justifyContent: 'center', alignItems: 'center',
    },
    modalCard: {
        backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20,
        width: '80%', borderWidth: 1, borderColor: '#99C4EF',
    },
    modalTitle: {
        color: '#5A80A8', fontSize: 12, fontWeight: '800',
        letterSpacing: 1.5, marginBottom: 14, textAlign: 'center',
    },
    modalItem: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        padding: 14, borderRadius: 14, marginBottom: 8,
        borderWidth: 1, borderColor: '#99C4EF',
    },
    modalDot: { width: 10, height: 10, borderRadius: 5 },
    modalItemText: { color: '#2B5280', fontSize: 16, fontWeight: '700', flex: 1 },

    header: { marginBottom: 20 },
    saludo: { fontSize: 32, fontWeight: '900', color: '#0D2340' },
    subtitulo: { fontSize: 15, color: '#5A80A8', marginTop: 5 },
    grid: { gap: 12 },

    // Botón admin: DORADO
    btnAdmin: {
        backgroundColor: '#F5A800',
        padding: 20,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 5,
    },
    iconCircleAdmin: {
        width: 40, height: 40,
        backgroundColor: 'rgba(255,240,194,0.6)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    adminTextMain: { color: '#6B4000', fontSize: 18, fontWeight: 'bold' },
    adminTextSub: { color: 'rgba(107,64,0,0.6)', fontSize: 11, fontWeight: '600' },

    // Cards de menciones
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        borderLeftWidth: 6,
        borderWidth: 1,
        borderColor: '#99C4EF',
        marginBottom: 10,
        overflow: 'hidden'
    },
    cardMain: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardInfo: { flexDirection: 'row', alignItems: 'center' },
    iconMencion: {
        width: 40, height: 40, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center', marginRight: 15,
    },
    cardText: { color: '#0D2340', fontSize: 18, fontWeight: 'bold' },
    cardSub: { color: '#5A80A8', fontSize: 11, marginTop: 2 },
    statsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        backgroundColor: '#E4EFFF',
        borderTopWidth: 1,
    },
    statsBtnText: { fontSize: 12, fontWeight: 'bold', marginLeft: 8, color: '#5A9FDE' },

    // Historial
    btnHistorial: {
        backgroundColor: '#FFFFFF',
        padding: 18,
        borderRadius: 18,
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 2,
        borderColor: '#5A9FDE',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    btnHistorialText: { color: '#2B5280', fontWeight: '900', fontSize: 16 },

    // Inasistencias
    btnInasistencias: {
        backgroundColor: '#FFF5F5',
        padding: 20,
        borderRadius: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    iconCircleInasistencias: {
        width: 40, height: 40,
        backgroundColor: '#FEE2E2',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    inasistenciasTextMain: { color: '#EF4444', fontSize: 18, fontWeight: 'bold' },
    inasistenciasTextSub: { color: '#5A80A8', fontSize: 11, fontWeight: '600' },
});
