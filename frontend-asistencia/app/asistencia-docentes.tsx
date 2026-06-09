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
    bloque_clase: number | null;
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
    const [guardadoExitoso, setGuardadoExitoso] = useState<Record<number, boolean>>({});

    const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

    useEffect(() => {
        cargarDocentes();
    }, []);

    const cargarDocentes = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/docentes`);
            setDocentes(res.data);
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
            // Feedback unificado: check verde 2 segundos (no interrumpe el flujo)
            setGuardadoExitoso(prev => ({ ...prev, [docenteId]: true }));
            setTimeout(() => {
                setGuardadoExitoso(prev => ({ ...prev, [docenteId]: false }));
            }, 2000);
        } catch (e) {
            Alert.alert('Error', 'No se pudo guardar. Verifica la conexión.');
        } finally {
            setGuardando(prev => ({ ...prev, [docenteId]: false }));
        }
    };

    // Colores de estado aplicados dinámicamente en el render (badge, borde izquierdo del card, botón activo)
    const colorEstado: Record<EstadoDocente, string> = {
        Presente: '#10B981', // Verde esmeralda — estado "Presente": borde izquierdo del card, badge de estado, botón P activo
        Ausente: '#EF4444',  // Rojo — estado "Ausente": borde izquierdo del card, badge de estado, botón A activo
        Tardanza: '#F59E0B', // Ámbar — estado "Tardanza": borde izquierdo del card, badge de estado, botón T activo
    };

    const renderDocente = ({ item }: { item: any }) => {
        const reg = registros[item.id];
        const estado = reg?.estado ?? null;
        const bloque = reg?.bloque_clase ?? null;

        // borderColor dinámico: verde/rojo/ámbar según estado; gris oscuro si sin marcar
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
                        // backgroundColor y borderColor dinámicos: verde/rojo/ámbar con opacidad 13% (sufijo '22' en hex)
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
                                    // Activo: fondo y borde toman el color del estado (verde/rojo/ámbar)
                                    ? { backgroundColor: colorEstado[e], borderColor: colorEstado[e] }
                                    // Inactivo: usa btnEstadoOff → fondo y borde gris oscuro #1E293B
                                    : styles.btnEstadoOff,
                            ]}
                        >
                            <Text style={[
                                styles.btnEstadoTxt,
                                // Activo: texto azul marino oscuro #020617 (contraste sobre el color del estado)
                                estado === e && { color: '#020617' }
                            ]}>
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
                                // Activo: aplica bloqueBtnActivo → fondo violeta con 13% opacidad + borde violeta #818CF8
                                bloque === b.id && styles.bloqueBtnActivo,
                            ]}
                        >
                            <Text style={[
                                styles.bloqueBtnLabel,
                                // Activo: texto violeta #818CF8; inactivo: gris slate #64748B
                                bloque === b.id && styles.bloqueBtnLabelActivo
                            ]}>
                                {b.label}
                            </Text>
                            <Text style={[
                                styles.bloqueBtnHoras,
                                // Activo: texto violeta #818CF8; inactivo: gris oscuro #334155
                                bloque === b.id && styles.bloqueBtnHorasActivo
                            ]}>
                                {b.horas}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Observaciones */}
                <TextInput
                    style={styles.inputObs}
                    placeholder="Observaciones (opcional)..."
                    placeholderTextColor="#475569" // Gris slate medio — texto placeholder del campo de observaciones
                    value={reg?.observaciones ?? ''}
                    onChangeText={t => setObs(item.id, t)}
                    multiline
                />

                {/* Botón guardar */}
                <TouchableOpacity
                    style={[
                        styles.btnGuardar,
                        (!estado || guardando[item.id]) && { opacity: 0.5 },
                        guardadoExitoso[item.id] && { backgroundColor: '#10B981' },
                    ]}
                    onPress={() => guardarRegistro(item.id)}
                    disabled={!estado || guardando[item.id]}
                >
                    <Ionicons
                        name={guardadoExitoso[item.id] ? 'checkmark-circle' : 'save-outline'}
                        size={18}
                        color={guardadoExitoso[item.id] ? '#FFFFFF' : '#020617'}
                    />
                    <Text style={[styles.btnGuardarTxt, guardadoExitoso[item.id] && { color: '#FFFFFF' }]}>
                        {guardando[item.id] ? 'GUARDANDO...' : guardadoExitoso[item.id] ? 'GUARDADO ✓' : 'GUARDAR'}
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
                    <Ionicons name="arrow-back" size={24} color="#38BDF8" /> {/* Celeste sky — ícono flecha volver en el header */}
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.titulo}>Asistencia Docentes</Text>
                    <Text style={styles.subtitulo}>{hoy}</Text>
                </View>
            </View>

            {/* Horario de referencia */}
            <View style={styles.horarioCard}>
                <Text style={styles.horarioTitulo}>
                    <Ionicons name="time-outline" size={13} color="#38BDF8" /> {/* Celeste sky — ícono reloj en el título de bloques */}
                    BLOQUES DEL DÍA
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
                    <Ionicons name="cafe-outline" size={13} color="#F59E0B" /> {/* Ámbar — ícono café del receso */}
                    <Text style={styles.recesoTxt}>{RECESO.label}: {RECESO.horas}</Text>
                </View>
            </View>

            {/* Resumen */}
            <View style={styles.resumen}>
                <View style={styles.resumenItem}>
                    <Text style={[styles.resumenNum, { color: '#10B981' }]}>{totalPresentes}</Text> {/* Verde esmeralda — número de docentes presentes en el resumen */}
                    <Text style={styles.resumenLabel}>Presentes</Text>
                </View>
                <View style={styles.resumenItem}>
                    <Text style={[styles.resumenNum, { color: '#EF4444' }]}>{totalAusentes}</Text> {/* Rojo — número de docentes ausentes en el resumen */}
                    <Text style={styles.resumenLabel}>Ausentes</Text>
                </View>
                <View style={styles.resumenItem}>
                    <Text style={[styles.resumenNum, { color: '#F59E0B' }]}>{totalTardanza}</Text> {/* Ámbar — número de docentes con tardanza en el resumen */}
                    <Text style={styles.resumenLabel}>Tardanza</Text>
                </View>
                <View style={styles.resumenItem}>
                    <Text style={[styles.resumenNum, { color: '#64748B' }]}>{docentes.length - totalPresentes - totalAusentes - totalTardanza}</Text> {/* Gris slate — número de docentes sin marcar en el resumen */}
                    <Text style={styles.resumenLabel}>Sin marcar</Text>
                </View>
            </View>

            {cargando ? (
                <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 50 }} /> // Celeste sky — spinner de carga mientras se obtienen los docentes
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
    // ─── Pantalla base ───────────────────────────────────────────────────────
    // Fondo principal — Gris/azul muy claro oficial (Línea Mi Movistar)
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC', 
        paddingHorizontal: 20,
    },

    // ─── Header ──────────────────────────────────────────────────────────────
    header: {
        marginTop: 60, 
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: 16, 
        gap: 14,
    },
    // Fondo del botón de retroceso — Gris sutil suave
    backBtn: {
        padding: 10,
        backgroundColor: '#F2F4F7', 
        borderRadius: 12,
    },
    // Título "Asistencia Docentes" — Azul muy oscuro para máximo contraste
    titulo: {
        fontSize: 24, 
        fontWeight: '900',
        color: '#1A1A2E', 
    },
    // Subtítulo de la fecha — Gris de apoyo Movistar
    subtitulo: {
        fontSize: 12,
        color: '#8A9BB0', 
        marginTop: 2, 
        textTransform: 'capitalize',
    },

    // ─── Tarjeta de horario de referencia ────────────────────────────────────
    // Fondo blanco puro con borde gris suave estructurado
    horarioCard: {
        backgroundColor: '#FFFFFF', 
        borderRadius: 16, 
        padding: 14,
        borderWidth: 1,
        borderColor: '#E0E6ED', 
        marginBottom: 14,
    },
    // Encabezado "BLOQUES DEL DÍA" — Azul Movistar destacado en mayúsculas
    horarioTitulo: {
        color: '#009EF7', 
        fontSize: 10, 
        fontWeight: '800', 
        letterSpacing: 1.2, 
        marginBottom: 10,
    },
    horarioGrid: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 8 
    },
    horarioBloque: { 
        alignItems: 'center', 
        flex: 1 
    },
    // Nombre del bloque ("1ra Clase"...) — Azul muy oscuro
    horarioBloqueLabel: {
        color: '#1A1A2E', 
        fontSize: 11, 
        fontWeight: '800', 
        marginBottom: 3,
    },
    // Horas de los bloques — Gris de apoyo Movistar
    horarioBloqueH1: {
        color: '#8A9BB0', 
        fontSize: 10, 
        fontWeight: '600',
    },
    horarioBloqueH2: {
        color: '#8A9BB0', 
        fontSize: 10, 
        fontWeight: '600',
    },
    recesoRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 6, 
        marginTop: 2 
    },
    // Texto del receso — Ámbar oficial de la marca
    recesoTxt: {
        color: '#FF9500', 
        fontSize: 11, 
        fontWeight: '700',
    },

    // ─── Barra de resumen superior ───────────────────────────────────────────
    // Fondo blanco puro con divisiones sutiles
    resumen: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF', 
        borderRadius: 14, 
        padding: 12,
        borderWidth: 1,
        borderColor: '#E0E6ED', 
        marginBottom: 16, 
        justifyContent: 'space-around',
    },
    resumenItem: { 
        alignItems: 'center' 
    },
    // Nota JSX: resumenNum mantiene la lógica inline reemplazando por: #00C853 | #FF3B30 | #FF9500 | #8A9BB0
    resumenNum: {
        fontSize: 22, 
        fontWeight: '900',
    },
    // Etiquetas de conteos ("Presentes"...) — Gris de apoyo Movistar
    resumenLabel: {
        color: '#8A9BB0', 
        fontSize: 10, 
        fontWeight: '700', 
        marginTop: 2,
    },

    // ─── Card de cada docente ─────────────────────────────────────────────────
    // Fondo blanco puro con borde lateral dinámico
    card: {
        backgroundColor: '#FFFFFF', 
        borderRadius: 20, 
        padding: 18, 
        marginBottom: 16,
        borderLeftWidth: 5,
        borderWidth: 1,
        borderColor: '#E0E6ED', 
    },
    cardTop: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 12, 
        marginBottom: 16 
    },
    // Círculo contenedor de iniciales — Gris suave neutro
    avatarCircle: {
        width: 48, 
        height: 48, 
        borderRadius: 24,
        backgroundColor: '#F2F4F7', 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    // Iniciales del docente — Azul Movistar principal
    avatarTxt: {
        color: '#009EF7', 
        fontSize: 16, 
        fontWeight: '900',
    },
    // Nombre del docente — Azul muy oscuro
    nombreDocente: {
        color: '#1A1A2E', 
        fontSize: 17, 
        fontWeight: '800',
    },
    // Asignatura dictada — Gris de apoyo Movistar
    materiaDocente: {
        color: '#8A9BB0', 
        fontSize: 12, 
        fontWeight: '600', 
        marginTop: 2,
    },
    // Badge de estado actual en la cabecera del card
    estadoBadge: {
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 20, 
        borderWidth: 1,
    },
    estadoBadgeTxt: {
        fontSize: 11, 
        fontWeight: '900',
    },

    // ─── Botones de selección de estado ──────────────────────────────────────
    botonesEstado: { 
        flexDirection: 'row', 
        gap: 8, 
        marginBottom: 16 
    },
    btnEstado: {
        flex: 1, 
        height: 40, 
        borderRadius: 12, 
        justifyContent: 'center',
        alignItems: 'center', 
        borderWidth: 1,
    },
    // Botón de estado deseleccionado — Gris suave neutro con borde limpio
    btnEstadoOff: {
        backgroundColor: '#F2F4F7', 
        borderColor: '#E0E6ED', 
    },
    // Texto de botón deseleccionado — Gris de apoyo Movistar
    // Nota JSX: Al activarse, sobrescribir inline con color: '#FFFFFF' (Blanco puro para contrastar)
    btnEstadoTxt: {
        color: '#8A9BB0', 
        fontSize: 12, 
        fontWeight: '800',
    },

    // ─── Botones de pase de salida (Bloques horarios) ────────────────────────
    // Etiqueta de la sección — Gris de apoyo Movistar
    secLabel: {
        color: '#8A9BB0', 
        fontSize: 10, 
        fontWeight: '800', 
        letterSpacing: 1.2, 
        marginBottom: 8,
    },
    bloqueScroll: { 
        marginBottom: 14, 
        height: 64, 
        flexGrow: 0, 
        flexShrink: 0 
    },
    bloqueScrollContent: { 
        alignItems: 'center', 
        paddingRight: 8 
    },
    // Bloque inactivo — Gris suave neutro
    bloqueBtn: {
        height: 56, 
        paddingHorizontal: 14, 
        borderRadius: 14,
        backgroundColor: '#F2F4F7', 
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E0E6ED', 
        justifyContent: 'center', 
        alignItems: 'center',
    },
    // Bloque activo seleccionado — Azul claro traslúcido con borde Azul Movistar
    bloqueBtnActivo: {
        backgroundColor: '#EAF6FF', 
        borderColor: '#009EF7', 
    },
    // Texto de bloque inactivo — Gris de apoyo Movistar
    bloqueBtnLabel: {
        color: '#8A9BB0', 
        fontSize: 12, 
        fontWeight: '800',
    },
    // Texto de bloque activo — Azul Movistar principal
    bloqueBtnLabelActivo: {
        color: '#009EF7', 
    },
    // Horas de bloque inactivo — Gris estructurado intermedio
    bloqueBtnHoras: {
        color: '#B2C0CD', 
        fontSize: 10, 
        fontWeight: '600', 
        marginTop: 3,
    },
    // Horas de bloque activo — Azul Movistar principal
    bloqueBtnHorasActivo: {
        color: '#009EF7', 
    },

    // ─── Campo de entrada de observaciones ───────────────────────────────────
    // Diseño limpio: Fondo gris suave con texto legible azul oscuro
    inputObs: {
        backgroundColor: '#F2F4F7', 
        borderRadius: 12, 
        padding: 12,
        color: '#1A1A2E', 
        fontSize: 13, 
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E0E6ED', 
        minHeight: 50, 
        textAlignVertical: 'top',
    },

    // ─── Botón Guardar Cambios ───────────────────────────────────────────────
    // Botón Premium — Azul oficial Movistar
    btnGuardar: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#009EF7', 
        padding: 14, 
        borderRadius: 14,
    },
    // Texto de guardado — Blanco puro para máxima visualización
    btnGuardarTxt: {
        color: '#FFFFFF', 
        fontWeight: '900', 
        fontSize: 14,
    },
});