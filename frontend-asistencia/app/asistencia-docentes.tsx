import React, { useEffect, useState } from 'react';
import {
    StyleSheet, Text, View, FlatList, ActivityIndicator,
    TouchableOpacity, TextInput, Alert, Platform, ToastAndroid, ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../constants';

// ─── Bloques horarios del turno tarde ────────────────────────────────────────
const BLOQUES = [
    { id: 1, label: '1ra Clase',  horas: '12:45 – 2:05',  h1: '12:45–1:25', h2: '1:25–2:05'  },
    { id: 2, label: '2da Clase',  horas: '2:05 – 3:25',   h1: '2:05–2:45',  h2: '2:45–3:25'  },
    { id: 3, label: '3ra Clase',  horas: '3:35 – 4:55',   h1: '3:35–4:15',  h2: '4:15–4:55'  },
    { id: 4, label: '4ta Clase',  horas: '4:55 – 6:15',   h1: '4:55–5:35',  h2: '5:35–6:15'  },
];

const RECESO = { label: 'Receso', horas: '3:25 – 3:35' };

type EstadoDocente = 'Presente' | 'Ausente' | 'Tardanza';

interface RegistroDocente {
    estado: EstadoDocente | null;
    bloque_clase: number | null;   // 1‑4, cuál clase dictó (pase de salida)
    observaciones: string;
}

export default function AsistenciaDocentesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { usuario } = useLocalSearchParams();

    const [docentes, setDocentes] = useState<any[]>([]);
    const [cargando, setCargando] = useState(true);
    const [registros, setRegistros] = useState<Record<number, RegistroDocente>>({});
    const [guardando, setGuardando] = useState<Record<number, boolean>>({});

    const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

    useEffect(() => {
        cargarDocentes();
    }, []);

    const cargarDocentes = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/docentes`);
            setDocentes(res.data);
            // Intentar cargar registros de hoy si ya existen
            const resHoy = await axios.get(`${API_URL}/asistencia-docentes/hoy`);
            const mapa: Record<number, RegistroDocente> = {};
            resHoy.data.forEach((r: any) => {
                mapa[r.docente_id] = {
                    estado: r.estado,
                    bloque_clase: r.bloque_clase,
                    observaciones: r.observaciones || '',
                };
            });
            setRegistros(mapa);
        } catch (e) {
            console.error('Error al cargar docentes', e);
        } finally {
            setCargando(false);
        }
    };

    const setEstado = (docenteId: number, estado: EstadoDocente) => {
        setRegistros(prev => ({
            ...prev,
            [docenteId]: {
                estado,
                bloque_clase: prev[docenteId]?.bloque_clase ?? null,
                observaciones: prev[docenteId]?.observaciones ?? '',
            },
        }));
    };

    const setBloque = (docenteId: number, bloque: number | null) => {
        setRegistros(prev => ({
            ...prev,
            [docenteId]: {
                ...prev[docenteId],
                bloque_clase: prev[docenteId]?.bloque_clase === bloque ? null : bloque,
            },
        }));
    };

    const setObs = (docenteId: number, texto: string) => {
        setRegistros(prev => ({
            ...prev,
            [docenteId]: { ...prev[docenteId], observaciones: texto },
        }));
    };

    const guardarRegistro = async (docenteId: number) => {
        const reg = registros[docenteId];
        if (!reg?.estado) return Alert.alert('Atención', 'Selecciona el estado del docente antes de guardar.');
        setGuardando(prev => ({ ...prev, [docenteId]: true }));
        try {
            await axios.post(`${API_URL}/asistencia-docentes`, {
                docente_id: docenteId,
                estado: reg.estado,
                bloque_clase: reg.bloque_clase ?? null,
                observaciones: reg.observaciones || null,
            });
            if (Platform.OS === 'android') ToastAndroid.show('Guardado ✓', ToastAndroid.SHORT);
            else Alert.alert('✅ Guardado', 'Asistencia registrada correctamente.');
        } catch (e) {
            Alert.alert('Error', 'No se pudo guardar. Verifica la conexión.');
        } finally {
            setGuardando(prev => ({ ...prev, [docenteId]: false }));
        }
    };

    const colorEstado: Record<EstadoDocente, string> = {
        Presente: '#10B981',
        Ausente: '#EF4444',
        Tardanza: '#F59E0B',
    };

    const renderDocente = ({ item }: { item: any }) => {
        const reg = registros[item.id];
        const estado = reg?.estado ?? null;
        const bloque = reg?.bloque_clase ?? null;

        const borderColor = estado ? colorEstado[estado] : '#1E293B';

        return (
            <View style={[styles.card, { borderLeftColor: borderColor }]}>
                {/* Nombre y rol */}
                <View style={styles.cardTop}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarTxt}>
                            {(item.nombre?.[0] ?? '?').toUpperCase()}{(item.apellido?.[0] ?? '').toUpperCase()}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.nombreDocente}>{item.nombre} {item.apellido}</Text>
                        <Text style={styles.materiaDocente}>{item.materia || 'Sin materia asignada'}</Text>
                    </View>
                    {estado && (
                        <View style={[styles.estadoBadge, { backgroundColor: colorEstado[estado] + '22', borderColor: colorEstado[estado] }]}>
                            <Text style={[styles.estadoBadgeTxt, { color: colorEstado[estado] }]}>{estado}</Text>
                        </View>
                    )}
                </View>

                {/* Botones P / A / T */}
                <View style={styles.botonesEstado}>
                    {(['Presente', 'Ausente', 'Tardanza'] as EstadoDocente[]).map(e => (
                        <TouchableOpacity
                            key={e}
                            onPress={() => setEstado(item.id, e)}
                            style={[
                                styles.btnEstado,
                                estado === e
                                    ? { backgroundColor: colorEstado[e], borderColor: colorEstado[e] }
                                    : styles.btnEstadoOff,
                            ]}
                        >
                            <Text style={[styles.btnEstadoTxt, estado === e && { color: '#020617' }]}>
                                {e === 'Presente' ? 'Presente' : e === 'Ausente' ? 'Ausente' : 'Tardanza'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Pase de salida: ¿hasta qué clase estuvo? */}
                <Text style={styles.secLabel}>PASE DE SALIDA — Dio clases hasta:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bloqueScroll} contentContainerStyle={styles.bloqueScrollContent}>
                    {BLOQUES.map(b => (
                        <TouchableOpacity
                            key={b.id}
                            onPress={() => setBloque(item.id, b.id)}
                            style={[
                                styles.bloqueBtn,
                                bloque === b.id && styles.bloqueBtnActivo,
                            ]}
                        >
                            <Text style={[styles.bloqueBtnLabel, bloque === b.id && styles.bloqueBtnLabelActivo]}>
                                {b.label}
                            </Text>
                            <Text style={[styles.bloqueBtnHoras, bloque === b.id && styles.bloqueBtnHorasActivo]}>
                                {b.horas}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Observaciones */}
                <TextInput
                    style={styles.inputObs}
                    placeholder="Observaciones (opcional)..."
                    placeholderTextColor="#475569"
                    value={reg?.observaciones ?? ''}
                    onChangeText={t => setObs(item.id, t)}
                    multiline
                />

                {/* Botón guardar */}
                <TouchableOpacity
                    style={[styles.btnGuardar, (!estado || guardando[item.id]) && { opacity: 0.5 }]}
                    onPress={() => guardarRegistro(item.id)}
                    disabled={!estado || guardando[item.id]}
                >
                    <Ionicons name="save-outline" size={18} color="#020617" />
                    <Text style={styles.btnGuardarTxt}>
                        {guardando[item.id] ? 'GUARDANDO...' : 'GUARDAR'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    // ─── Resumen del día ──────────────────────────────────────────────────────
    const totalPresentes = Object.values(registros).filter(r => r.estado === 'Presente').length;
    const totalAusentes  = Object.values(registros).filter(r => r.estado === 'Ausente').length;
    const totalTardanza  = Object.values(registros).filter(r => r.estado === 'Tardanza').length;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#38BDF8" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.titulo}>Asistencia Docentes</Text>
                    <Text style={styles.subtitulo}>{hoy}</Text>
                </View>
            </View>

            {/* Horario de referencia */}
            <View style={styles.horarioCard}>
                <Text style={styles.horarioTitulo}>
                    <Ionicons name="time-outline" size={13} color="#38BDF8" /> BLOQUES DEL DÍA
                </Text>
                <View style={styles.horarioGrid}>
                    {BLOQUES.map(b => (
                        <View key={b.id} style={styles.horarioBloque}>
                            <Text style={styles.horarioBloqueLabel}>{b.label}</Text>
                            <Text style={styles.horarioBloqueH1}>{b.h1}</Text>
                            <Text style={styles.horarioBloqueH2}>{b.h2}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.recesoRow}>
                    <Ionicons name="cafe-outline" size={13} color="#F59E0B" />
                    <Text style={styles.recesoTxt}>{RECESO.label}: {RECESO.horas}</Text>
                </View>
            </View>

            {/* Resumen */}
            <View style={styles.resumen}>
                <View style={styles.resumenItem}>
                    <Text style={[styles.resumenNum, { color: '#10B981' }]}>{totalPresentes}</Text>
                    <Text style={styles.resumenLabel}>Presentes</Text>
                </View>
                <View style={styles.resumenItem}>
                    <Text style={[styles.resumenNum, { color: '#EF4444' }]}>{totalAusentes}</Text>
                    <Text style={styles.resumenLabel}>Ausentes</Text>
                </View>
                <View style={styles.resumenItem}>
                    <Text style={[styles.resumenNum, { color: '#F59E0B' }]}>{totalTardanza}</Text>
                    <Text style={styles.resumenLabel}>Tardanza</Text>
                </View>
                <View style={styles.resumenItem}>
                    <Text style={[styles.resumenNum, { color: '#64748B' }]}>{docentes.length - totalPresentes - totalAusentes - totalTardanza}</Text>
                    <Text style={styles.resumenLabel}>Sin marcar</Text>
                </View>
            </View>

            {cargando ? (
                <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={docentes}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderDocente}
                    contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617', paddingHorizontal: 20 },

    header: {
        marginTop: 60, flexDirection: 'row', alignItems: 'center',
        marginBottom: 16, gap: 14,
    },
    backBtn: { padding: 10, backgroundColor: '#0F172A', borderRadius: 12 },
    titulo: { fontSize: 24, fontWeight: '900', color: '#F8FAFC' },
    subtitulo: { fontSize: 12, color: '#64748B', marginTop: 2, textTransform: 'capitalize' },

    // Horario de referencia
    horarioCard: {
        backgroundColor: '#0F172A', borderRadius: 16, padding: 14,
        borderWidth: 1, borderColor: '#1E293B', marginBottom: 14,
    },
    horarioTitulo: { color: '#38BDF8', fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 10 },
    horarioGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    horarioBloque: { alignItems: 'center', flex: 1 },
    horarioBloqueLabel: { color: '#F8FAFC', fontSize: 11, fontWeight: '800', marginBottom: 3 },
    horarioBloqueH1: { color: '#64748B', fontSize: 10, fontWeight: '600' },
    horarioBloqueH2: { color: '#64748B', fontSize: 10, fontWeight: '600' },
    recesoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
    recesoTxt: { color: '#F59E0B', fontSize: 11, fontWeight: '700' },

    // Resumen
    resumen: {
        flexDirection: 'row', backgroundColor: '#0F172A', borderRadius: 14,
        padding: 12, borderWidth: 1, borderColor: '#1E293B',
        marginBottom: 16, justifyContent: 'space-around',
    },
    resumenItem: { alignItems: 'center' },
    resumenNum: { fontSize: 22, fontWeight: '900' },
    resumenLabel: { color: '#475569', fontSize: 10, fontWeight: '700', marginTop: 2 },

    // Card docente
    card: {
        backgroundColor: '#0F172A', borderRadius: 20, padding: 18,
        marginBottom: 16, borderLeftWidth: 5, borderWidth: 1, borderColor: '#1E293B',
    },
    cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    avatarCircle: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center',
    },
    avatarTxt: { color: '#38BDF8', fontSize: 16, fontWeight: '900' },
    nombreDocente: { color: '#F8FAFC', fontSize: 17, fontWeight: '800' },
    materiaDocente: { color: '#475569', fontSize: 12, fontWeight: '600', marginTop: 2 },
    estadoBadge: {
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1,
    },
    estadoBadgeTxt: { fontSize: 11, fontWeight: '900' },

    // Botones P/A/T
    botonesEstado: { flexDirection: 'row', gap: 8, marginBottom: 16 },
    btnEstado: {
        flex: 1, height: 40, borderRadius: 12, justifyContent: 'center',
        alignItems: 'center', borderWidth: 1,
    },
    btnEstadoOff: { backgroundColor: '#1E293B', borderColor: '#1E293B' },
    btnEstadoTxt: { color: '#64748B', fontSize: 12, fontWeight: '800' },

    // Bloques de pase de salida
    secLabel: {
        color: '#475569', fontSize: 10, fontWeight: '800',
        letterSpacing: 1.2, marginBottom: 8,
    },
    bloqueScroll: { marginBottom: 14, height: 64, flexGrow: 0, flexShrink: 0 },
    bloqueScrollContent: { alignItems: 'center', paddingRight: 8 },
    bloqueBtn: {
        height: 56, paddingHorizontal: 14, borderRadius: 14,
        backgroundColor: '#1E293B', marginRight: 8,
        borderWidth: 1, borderColor: '#1E293B',
        justifyContent: 'center', alignItems: 'center',
    },
    bloqueBtnActivo: { backgroundColor: '#818CF822', borderColor: '#818CF8' },
    bloqueBtnLabel: { color: '#64748B', fontSize: 12, fontWeight: '800' },
    bloqueBtnLabelActivo: { color: '#818CF8' },
    bloqueBtnHoras: { color: '#334155', fontSize: 10, fontWeight: '600', marginTop: 3 },
    bloqueBtnHorasActivo: { color: '#818CF8' },

    // Observaciones
    inputObs: {
        backgroundColor: '#020617', borderRadius: 12, padding: 12,
        color: '#F1F5F9', fontSize: 13, marginBottom: 14,
        borderWidth: 1, borderColor: '#1E293B', minHeight: 50,
        textAlignVertical: 'top',
    },

    // Guardar
    btnGuardar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, backgroundColor: '#38BDF8', padding: 14, borderRadius: 14,
    },
    btnGuardarTxt: { color: '#020617', fontWeight: '900', fontSize: 14 },
});
