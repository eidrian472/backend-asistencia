import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity,
    ActivityIndicator, ScrollView, Linking, Alert,
    Modal, Image, KeyboardAvoidingView, TextInput, Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { API_URL } from '../constants';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface RegistroAusencia {
    id: number;
    nombre: string;
    apellido: string;
    cedula?: string;
    nro_lista: number;
    mencion: string;
    ano: number;
    estado: 'Inasistente' | 'Retirado';
    observaciones: string | null;
    fecha: string;
    materia: string;
}

interface ResumenEstudiante {
    nombre: string;
    apellido: string;
    cedula?: string;
    nro_lista: number;
    mencion: string;
    ano: number;
    totalInasistencias: number;
    totalRetirados: number;
    registros: RegistroAusencia[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const etiquetasAno: Record<string, string> = {
    '1': '1er Año', '2': '2do Año', '3': '3er Año', '4': '4to Año', '5': '5to Año',
};

const coloresMencion: Record<string, string> = {
    'Telemática': '#38BDF8',
    'Turismo': '#10B981',
    'Administración': '#F59E0B',
    'Contabilidad': '#818CF8',
};

// ─── Función para enviar WhatsApp ─────────────────────────────────────────────
/**
 * Busca el teléfono del representante por cédula del estudiante
 * y abre WhatsApp con un mensaje predeterminado según la situación.
 */
const enviarWhatsApp = async (
    cedula: string | undefined,
    nombreEstudiante: string,
    apellidoEstudiante: string,
    items: { estado: string; materia: string; observaciones: string | null; fecha: string }[],
    modo: 'dia' | 'acumulado',
    totalInasistencias?: number,
    totalRetirados?: number
) => {
    if (!cedula) {
        Alert.alert('Sin cédula', 'No se pudo obtener la cédula del estudiante para buscar al representante.');
        return;
    }

    let telefono: string | null = null;
    let repNombre = 'Representante';

    try {
        const res = await axios.get(`${API_URL}/admin/estudiantes/${cedula}`);
        if (res.data.success && res.data.estudiante) {
            const est = res.data.estudiante;
            telefono = est.rep_telefono ?? null;
            repNombre = est.rep_nombre ? `${est.rep_nombre} ${est.rep_apellido ?? ''}`.trim() : 'Representante';
        }
    } catch (e) {
        Alert.alert('Error', 'No se pudo obtener los datos del representante.');
        return;
    }

    if (!telefono) {
        Alert.alert('Sin teléfono', `No hay número de representante registrado para ${nombreEstudiante} ${apellidoEstudiante}.`);
        return;
    }

    // Limpiar teléfono: quitar espacios, guiones, paréntesis y agregar código de Venezuela si es necesario
    let telefonoLimpio = telefono.replace(/[\s\-().]/g, '');
    if (!telefonoLimpio.startsWith('+')) {
        // Asumir Venezuela +58, quitar el 0 inicial si existe
        if (telefonoLimpio.startsWith('0')) telefonoLimpio = telefonoLimpio.substring(1);
        telefonoLimpio = `58${telefonoLimpio}`;
    }

    let mensaje = '';

    if (modo === 'acumulado') {
        // Mensaje para vista acumulada
        mensaje =
            `Estimado/a *${repNombre}*, le informamos que el/la estudiante ` +
            `*${nombreEstudiante} ${apellidoEstudiante}* presenta el siguiente registro acumulado de inasistencias:\n\n` +
            `📋 *Inasistencias:* ${totalInasistencias ?? 0}\n` +
            `🚪 *Retiros:* ${totalRetirados ?? 0}\n` +
            `📊 *Total:* ${(totalInasistencias ?? 0) + (totalRetirados ?? 0)}\n\n` +
            `Le solicitamos comunicarse con la institución para recibir más información.\n\n` +
            `_E.T. J.R.G.S — Sistema de Asistencia_`;
    } else {
        // Mensaje para vista por día — detallar cada registro
        const hoy = items[0]?.fecha
            ? new Date(items[0].fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
            : 'hoy';

        const detalles = items.map(reg => {
            if (reg.estado === 'Inasistente') {
                return `• *No asistió* a la clase de *${reg.materia}*${reg.observaciones ? `\n  📝 ${reg.observaciones}` : ''}`;
            } else if (reg.estado === 'Retirado') {
                return `• Se *retiró anticipadamente* de la clase de *${reg.materia}*${reg.observaciones ? `\n  📝 ${reg.observaciones}` : ''}`;
            }
            return '';
        }).filter(Boolean).join('\n');

        mensaje =
            `Estimado/a *${repNombre}*, le informamos que el día *${hoy}*, ` +
            `el/la estudiante *${nombreEstudiante} ${apellidoEstudiante}* presentó la siguiente situación:\n\n` +
            `${detalles}\n\n` +
            `Si tiene alguna consulta, comuníquese con la institución.\n\n` +
            `_E.T. J.R.G.S — Sistema de Asistencia_`;
    }

    const url = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;

    try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('WhatsApp no disponible', 'No se pudo abrir WhatsApp en este dispositivo.');
        }
    } catch (e) {
        Alert.alert('Error', 'No se pudo abrir WhatsApp.');
    }
};

// ─── Componente principal ─────────────────────────────────────────────────────
export default function InasistenciasScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [modo, setModo] = useState<'dia' | 'acumulado'>('dia');
    const [fecha, setFecha] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [mencionFiltro, setMencionFiltro] = useState('Todas');
    const [anoFiltro, setAnoFiltro] = useState('Todos');

    const [registrosDia, setRegistrosDia] = useState<RegistroAusencia[]>([]);
    const [resumenAcumulado, setResumenAcumulado] = useState<ResumenEstudiante[]>([]);
    const [cargando, setCargando] = useState(false);
    const [enviandoWA, setEnviandoWA] = useState<string | null>(null); // key del estudiante en carga

    // ── Estado modal de perfil ────────────────────────────────────────────────
    const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const menciones = ['Todas', 'Telemática', 'Turismo', 'Administración', 'Contabilidad'];
    const anos = ['Todos', '1', '2', '3', '4', '5'];

    // ── Cargar registros del día ──────────────────────────────────────────────
    const cargarDia = async (
        fechaSel: Date = fecha,
        filtroMencion: string = mencionFiltro,
        filtroAno: string = anoFiltro
    ) => {
        setCargando(true);
        try {
            const fechaStr = fechaSel.toISOString().split('T')[0];
            const params: any = { fecha: fechaStr };
            if (filtroMencion !== 'Todas') params.mencion = filtroMencion;
            if (filtroAno !== 'Todos') params.ano = filtroAno;

            const res = await axios.get(`${API_URL}/historial`, { params });
            const ausentes = (res.data as RegistroAusencia[]).filter(
                r => r.estado === 'Inasistente' || r.estado === 'Retirado'
            );
            setRegistrosDia(ausentes);
        } catch (e) {
            console.error('Error al cargar inasistencias del día', e);
        } finally {
            setCargando(false);
        }
    };

    // ── Cargar acumulado ──────────────────────────────────────────────────────
    const cargarAcumulado = async (
        filtroMencion: string = mencionFiltro,
        filtroAno: string = anoFiltro
    ) => {
        setCargando(true);
        try {
            const params: any = {};
            if (filtroMencion !== 'Todas') params.mencion = filtroMencion;
            if (filtroAno !== 'Todos') params.ano = filtroAno;

            const res = await axios.get(`${API_URL}/inasistencias-acumuladas`, { params });
            setResumenAcumulado(res.data);
        } catch (e) {
            console.error('Error al cargar acumulado', e);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (modo === 'dia') cargarDia();
        else cargarAcumulado();
    }, [modo]);

    const cambiarMencion = (m: string) => {
        setMencionFiltro(m);
        if (modo === 'dia') cargarDia(fecha, m, anoFiltro);
        else cargarAcumulado(m, anoFiltro);
    };

    const cambiarAno = (a: string) => {
        setAnoFiltro(a);
        if (modo === 'dia') cargarDia(fecha, mencionFiltro, a);
        else cargarAcumulado(mencionFiltro, a);
    };

    const onChangeFecha = (_: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFecha(selectedDate);
            cargarDia(selectedDate, mencionFiltro, anoFiltro);
        }
    };

    // ── Agrupar registros del día por estudiante ──────────────────────────────
    const registrosAgrupados = () => {
        const mapa: Record<string, {
            nombre: string; apellido: string; cedula?: string;
            nro_lista: number; mencion: string; ano: number; items: RegistroAusencia[]
        }> = {};

        const ordenados = [...registrosDia].sort((a, b) => {
            if (a.mencion < b.mencion) return -1;
            if (a.mencion > b.mencion) return 1;
            if (Number(a.ano) !== Number(b.ano)) return Number(a.ano) - Number(b.ano);
            return (a.nro_lista ?? 0) - (b.nro_lista ?? 0);
        });

        ordenados.forEach(r => {
            const key = `${r.mencion}-${r.ano}-${r.nombre}-${r.apellido}`;
            if (!mapa[key]) {
                mapa[key] = {
                    nombre: r.nombre, apellido: r.apellido,
                    cedula: r.cedula,
                    nro_lista: r.nro_lista, mencion: r.mencion, ano: r.ano, items: []
                };
            }
            mapa[key].items.push(r);
        });

        return Object.values(mapa);
    };

    // ── Abrir modal de perfil ─────────────────────────────────────────────────
    const abrirPerfil = async (cedula: string | undefined, nombre: string, apellido: string) => {
        if (!cedula) {
            Alert.alert('Sin cédula', 'Este estudiante no tiene cédula registrada.');
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/admin/estudiantes/${cedula}`);
            if (res.data.success) {
                setEstudianteSeleccionado(res.data.estudiante);
                setModalVisible(true);
            } else {
                Alert.alert('No encontrado', 'No se encontraron datos del estudiante.');
            }
        } catch (e) {
            Alert.alert('Error', 'No se pudo obtener el perfil del estudiante.');
        }
    };

    // ── Renders ───────────────────────────────────────────────────────────────
    const colorMencion = (m: string) => coloresMencion[m] ?? '#64748B';

    const renderCardDia = ({ item }: { item: ReturnType<typeof registrosAgrupados>[0] }) => {
        const esInasistente = item.items.some(i => i.estado === 'Inasistente');
        const esRetirado = item.items.some(i => i.estado === 'Retirado');
        const borderColor = esInasistente ? '#EF4444' : '#F59E0B';
        const color = colorMencion(item.mencion);
        const waKey = `${item.mencion}-${item.ano}-${item.nombre}-${item.apellido}`;
        const cargandoEste = enviandoWA === waKey;

        const handleWhatsApp = async () => {
            setEnviandoWA(waKey);
            await enviarWhatsApp(
                item.cedula,
                item.nombre,
                item.apellido,
                item.items.map(r => ({
                    estado: r.estado,
                    materia: r.materia,
                    observaciones: r.observaciones,
                    fecha: r.fecha,
                })),
                'dia'
            );
            setEnviandoWA(null);
        };

        return (
            <View style={[styles.card, { borderLeftColor: borderColor }]}>
                {/* Encabezado */}
                <View style={styles.cardTop}>
                    <View style={[styles.numBadge, { backgroundColor: borderColor + '22', borderColor }]}>
                        <Text style={[styles.numBadgeTxt, { color: borderColor }]}>{item.nro_lista}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => abrirPerfil(item.cedula, item.nombre, item.apellido)} activeOpacity={0.7}>
                            <Text style={styles.cardNombre}>{item.nombre} {item.apellido}</Text>
                        </TouchableOpacity>
                        <View style={styles.cardMeta}>
                            <View style={[styles.mencionPill, { borderColor: color }]}>
                                <Text style={[styles.mencionPillTxt, { color }]}>{item.mencion}</Text>
                            </View>
                            <Text style={styles.cardAno}>{etiquetasAno[String(item.ano)]}</Text>
                        </View>
                    </View>
                    <View style={styles.estadoBadges}>
                        {esInasistente && (
                            <View style={[styles.estadoPill, { backgroundColor: '#EF444422', borderColor: '#EF4444' }]}>
                                <Text style={[styles.estadoPillTxt, { color: '#EF4444' }]}>Inasistente</Text>
                            </View>
                        )}
                        {esRetirado && (
                            <View style={[styles.estadoPill, { backgroundColor: '#F59E0B22', borderColor: '#F59E0B' }]}>
                                <Text style={[styles.estadoPillTxt, { color: '#F59E0B' }]}>Retirado</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Detalle por materia */}
                {item.items.map((reg, idx) => (
                    <View key={idx} style={styles.detalleRow}>
                        <View style={styles.detalleMateriaBadge}>
                            <Ionicons name="book-outline" size={11} color="#64748B" />
                            <Text style={styles.detalleMateriaText}>{reg.materia}</Text>
                        </View>
                        {reg.observaciones ? (
                            <View style={styles.obsBox}>
                                <Ionicons name="chatbubble-ellipses-outline" size={12} color="#94A3B8" />
                                <Text style={styles.obsText}>{reg.observaciones}</Text>
                            </View>
                        ) : (
                            <Text style={styles.sinObs}>Sin observaciones</Text>
                        )}
                    </View>
                ))}

                {/* ── Botón WhatsApp ── */}
                <TouchableOpacity
                    style={[styles.waBtn, cargandoEste && styles.waBtnCargando]}
                    onPress={handleWhatsApp}
                    disabled={cargandoEste}
                    activeOpacity={0.75}
                >
                    {cargandoEste ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
                    )}
                    <Text style={styles.waBtnText}>
                        {cargandoEste ? 'Buscando representante...' : 'Notificar al representante'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderCardAcumulado = ({ item }: { item: ResumenEstudiante }) => {
        const color = colorMencion(item.mencion);
        const total = item.totalInasistencias + item.totalRetirados;
        const alerta = total >= 5;
        const waKey = `${item.mencion}-${item.ano}-${item.nombre}-${item.apellido}`;
        const cargandoEste = enviandoWA === waKey;

        const handleWhatsApp = async () => {
            setEnviandoWA(waKey);
            await enviarWhatsApp(
                item.cedula,
                item.nombre,
                item.apellido,
                item.registros.map(r => ({
                    estado: r.estado,
                    materia: r.materia,
                    observaciones: r.observaciones,
                    fecha: r.fecha,
                })),
                'acumulado',
                item.totalInasistencias,
                item.totalRetirados
            );
            setEnviandoWA(null);
        };

        return (
            <View style={[styles.card, { borderLeftColor: alerta ? '#EF4444' : '#F59E0B' }]}>
                <View style={styles.cardTop}>
                    <View style={[styles.numBadge, { backgroundColor: (alerta ? '#EF4444' : '#F59E0B') + '22', borderColor: alerta ? '#EF4444' : '#F59E0B' }]}>
                        <Text style={[styles.numBadgeTxt, { color: alerta ? '#EF4444' : '#F59E0B' }]}>{item.nro_lista}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => abrirPerfil(item.cedula, item.nombre, item.apellido)} activeOpacity={0.7}>
                            <Text style={styles.cardNombre}>{item.nombre} {item.apellido}</Text>
                        </TouchableOpacity>
                        <View style={styles.cardMeta}>
                            <View style={[styles.mencionPill, { borderColor: color }]}>
                                <Text style={[styles.mencionPillTxt, { color }]}>{item.mencion}</Text>
                            </View>
                            <Text style={styles.cardAno}>{etiquetasAno[String(item.ano)]}</Text>
                        </View>
                    </View>
                    {alerta && (
                        <Ionicons name="warning" size={20} color="#EF4444" />
                    )}
                </View>

                {/* Contadores */}
                <View style={styles.contadoresRow}>
                    <View style={styles.contadorBox}>
                        <Text style={[styles.contadorNum, { color: '#EF4444' }]}>{item.totalInasistencias}</Text>
                        <Text style={styles.contadorLabel}>Inasistencias</Text>
                    </View>
                    <View style={styles.contadorDivider} />
                    <View style={styles.contadorBox}>
                        <Text style={[styles.contadorNum, { color: '#F59E0B' }]}>{item.totalRetirados}</Text>
                        <Text style={styles.contadorLabel}>Retirados</Text>
                    </View>
                    <View style={styles.contadorDivider} />
                    <View style={styles.contadorBox}>
                        <Text style={[styles.contadorNum, { color: alerta ? '#EF4444' : '#F8FAFC' }]}>{total}</Text>
                        <Text style={styles.contadorLabel}>Total</Text>
                    </View>
                </View>

                {/* Observaciones acumuladas */}
                {item.registros.filter(r => r.observaciones).length > 0 && (
                    <View style={styles.obsAcumContainer}>
                        <Text style={styles.obsAcumTitulo}>OBSERVACIONES REGISTRADAS</Text>
                        {item.registros.filter(r => r.observaciones).map((r, i) => (
                            <View key={i} style={styles.obsAcumRow}>
                                <Text style={styles.obsAcumFecha}>{r.fecha}</Text>
                                <View style={[styles.detalleMateriaBadge, { marginBottom: 4 }]}>
                                    <Text style={styles.detalleMateriaText}>{r.materia}</Text>
                                </View>
                                <Text style={styles.obsAcumTexto}>"{r.observaciones}"</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ── Botón WhatsApp ── */}
                <TouchableOpacity
                    style={[styles.waBtn, cargandoEste && styles.waBtnCargando]}
                    onPress={handleWhatsApp}
                    disabled={cargandoEste}
                    activeOpacity={0.75}
                >
                    {cargandoEste ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Ionicons name="logo-whatsapp" size={16} color="#FFF" />
                    )}
                    <Text style={styles.waBtnText}>
                        {cargandoEste ? 'Buscando representante...' : 'Notificar al representante'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    // ── Resumen del día ───────────────────────────────────────────────────────
    const totalInasistentesHoy = registrosDia.filter(r => r.estado === 'Inasistente').length;
    const totalRetiradosHoy = registrosDia.filter(r => r.estado === 'Retirado').length;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#38BDF8" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.titulo}>Inasistencias</Text>
                    <Text style={styles.subtitulo}>Control de ausencias y retiros</Text>
                </View>
            </View>

            {/* Tabs: Día / Acumulado */}
            <View style={styles.tabsRow}>
                <TouchableOpacity
                    style={[styles.tab, modo === 'dia' && styles.tabActivo]}
                    onPress={() => setModo('dia')}
                >
                    <Ionicons name="calendar-outline" size={15} color={modo === 'dia' ? '#020617' : '#64748B'} />
                    <Text style={[styles.tabTxt, modo === 'dia' && styles.tabTxtActivo]}>Por Día</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, modo === 'acumulado' && styles.tabActivo]}
                    onPress={() => setModo('acumulado')}
                >
                    <Ionicons name="stats-chart" size={15} color={modo === 'acumulado' ? '#020617' : '#64748B'} />
                    <Text style={[styles.tabTxt, modo === 'acumulado' && styles.tabTxtActivo]}>Acumulado</Text>
                </TouchableOpacity>
            </View>

            {/* Selector de fecha (solo en modo día) */}
            {modo === 'dia' && (
                <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
                    <Ionicons name="calendar-outline" size={18} color="#F8FAFC" />
                    <Text style={styles.dateText}>
                        {fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#38BDF8" />
                </TouchableOpacity>
            )}
            {showDatePicker && (
                <DateTimePicker value={fecha} mode="date" display="default" onChange={onChangeFecha} />
            )}

            {/* Filtros */}
            <Text style={styles.filtroLabel}>AÑO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroScroll} contentContainerStyle={{ alignItems: 'center', paddingRight: 8 }}>
                {anos.map(a => (
                    <TouchableOpacity
                        key={a}
                        onPress={() => cambiarAno(a)}
                        style={[styles.filtroBtn, anoFiltro === a && styles.filtroBtnAnoActivo]}
                    >
                        <Text style={[styles.filtroBtnTxt, anoFiltro === a && styles.filtroBtnTxtActivo]}>
                            {a === 'Todos' ? 'Todos' : etiquetasAno[a]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.filtroLabel}>MENCIÓN</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroScroll} contentContainerStyle={{ alignItems: 'center', paddingRight: 8 }}>
                {menciones.map(m => (
                    <TouchableOpacity
                        key={m}
                        onPress={() => cambiarMencion(m)}
                        style={[styles.filtroBtn, mencionFiltro === m && styles.filtroBtnActivo]}
                    >
                        <Text style={[styles.filtroBtnTxt, mencionFiltro === m && styles.filtroBtnTxtActivo]}>{m}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Resumen rápido (solo modo día) */}
            {modo === 'dia' && !cargando && (
                <View style={styles.resumenRow}>
                    <View style={styles.resumenBox}>
                        <Text style={[styles.resumenNum, { color: '#EF4444' }]}>{totalInasistentesHoy}</Text>
                        <Text style={styles.resumenLabel}>Inasistentes</Text>
                    </View>
                    <View style={styles.resumenDivider} />
                    <View style={styles.resumenBox}>
                        <Text style={[styles.resumenNum, { color: '#F59E0B' }]}>{totalRetiradosHoy}</Text>
                        <Text style={styles.resumenLabel}>Retirados</Text>
                    </View>
                    <View style={styles.resumenDivider} />
                    <View style={styles.resumenBox}>
                        <Text style={[styles.resumenNum, { color: '#F8FAFC' }]}>{totalInasistentesHoy + totalRetiradosHoy}</Text>
                        <Text style={styles.resumenLabel}>Total</Text>
                    </View>
                </View>
            )}

            {cargando ? (
                <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 40 }} />
            ) : modo === 'dia' ? (
                <FlatList
                    data={registrosAgrupados()}
                    keyExtractor={(item, i) => `${item.mencion}-${item.ano}-${item.nombre}-${i}`}
                    renderItem={renderCardDia}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="checkmark-circle-outline" size={50} color="#10B981" />
                            <Text style={styles.emptyTitulo}>¡Sin ausencias!</Text>
                            <Text style={styles.emptyTexto}>Todos los estudiantes asistieron este día.</Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 30 + insets.bottom }}
                />
            ) : (
                <FlatList
                    data={resumenAcumulado}
                    keyExtractor={(item, i) => `${item.mencion}-${item.ano}-${item.nombre}-${i}`}
                    renderItem={renderCardAcumulado}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="checkmark-circle-outline" size={50} color="#10B981" />
                            <Text style={styles.emptyTitulo}>Sin registros</Text>
                            <Text style={styles.emptyTexto}>No hay inasistencias acumuladas.</Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 30 + insets.bottom }}
                />
            )}

            {/* ── MODAL DE PERFIL ── */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalCard}>
                            <View style={styles.modalTopBar}>
                                <View style={{ width: 70 }} />
                                <TouchableOpacity
                                    style={styles.modalCloseBtn}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Ionicons name="close" size={22} color="#94A3B8" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                                    <Image
                                        source={{ uri: `https://ui-avatars.com/api/?name=${estudianteSeleccionado?.nombre}+${estudianteSeleccionado?.apellido}&background=1e293b&color=38bdf8&bold=true&size=200` }}
                                        style={styles.modalAvatar}
                                    />
                                    <Text style={styles.modalNombre}>
                                        {estudianteSeleccionado?.nombre} {estudianteSeleccionado?.apellido}
                                    </Text>
                                    <View style={styles.modalMencionPill}>
                                        <Text style={styles.modalMencionText}>{estudianteSeleccionado?.mencion}</Text>
                                    </View>
                                </View>

                                <Text style={styles.modalSeccionTitulo}>DATOS DEL ESTUDIANTE</Text>
                                <View style={styles.modalInfoBox}>
                                    {[
                                        { icono: 'list-outline', label: 'Nro. de Lista', valor: `#${estudianteSeleccionado?.nro_lista ?? '—'}` },
                                        { icono: 'card-outline', label: 'Cédula', valor: estudianteSeleccionado?.cedula || '—' },
                                        { icono: 'school-outline', label: 'Año de Estudio', valor: estudianteSeleccionado?.ano ? `${estudianteSeleccionado.ano}°` : '—' },
                                    ].map((campo, i, arr) => (
                                        <View key={campo.label}>
                                            <View style={styles.modalRow}>
                                                <View style={styles.modalIconBox}>
                                                    <Ionicons name={campo.icono as any} size={16} color="#38BDF8" />
                                                </View>
                                                <View>
                                                    <Text style={styles.modalLabel}>{campo.label}</Text>
                                                    <Text style={styles.modalValue}>{campo.valor}</Text>
                                                </View>
                                            </View>
                                            {i < arr.length - 1 && <View style={styles.modalSep} />}
                                        </View>
                                    ))}
                                </View>

                                <Text style={[styles.modalSeccionTitulo, { marginTop: 16 }]}>DATOS DEL REPRESENTANTE</Text>
                                <View style={styles.modalInfoBox}>
                                    {[
                                        { icono: 'person-outline', label: 'Nombre', valor: estudianteSeleccionado?.rep_nombre ? `${estudianteSeleccionado.rep_nombre} ${estudianteSeleccionado.rep_apellido ?? ''}`.trim() : '—' },
                                        { icono: 'card-outline', label: 'Cédula', valor: estudianteSeleccionado?.rep_cedula || '—' },
                                        { icono: 'call-outline', label: 'Teléfono', valor: estudianteSeleccionado?.rep_telefono || '—' },
                                        { icono: 'location-outline', label: 'Dirección', valor: estudianteSeleccionado?.direccion || '—' },
                                    ].map((campo, i, arr) => (
                                        <View key={campo.label}>
                                            <View style={styles.modalRow}>
                                                <View style={styles.modalIconBox}>
                                                    <Ionicons name={campo.icono as any} size={16} color="#38BDF8" />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.modalLabel}>{campo.label}</Text>
                                                    <Text style={styles.modalValue}>{campo.valor}</Text>
                                                </View>
                                            </View>
                                            {i < arr.length - 1 && <View style={styles.modalSep} />}
                                        </View>
                                    ))}
                                </View>
                                <View style={{ height: 20 }} />
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617', paddingHorizontal: 20 },

    header: { marginTop: 60, flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 14 },
    backBtn: { padding: 10, backgroundColor: '#0F172A', borderRadius: 12 },
    titulo: { fontSize: 24, fontWeight: '900', color: '#F8FAFC' },
    subtitulo: { fontSize: 12, color: '#64748B', marginTop: 2 },

    // Tabs
    tabsRow: { flexDirection: 'row', backgroundColor: '#0F172A', borderRadius: 14, padding: 4, marginBottom: 14, borderWidth: 1, borderColor: '#1E293B' },
    tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
    tabActivo: { backgroundColor: '#38BDF8' },
    tabTxt: { color: '#64748B', fontSize: 13, fontWeight: '700' },
    tabTxtActivo: { color: '#020617' },

    // Selector de fecha
    dateSelector: {
        flexDirection: 'row', backgroundColor: '#0F172A', padding: 12,
        borderRadius: 12, alignItems: 'center', justifyContent: 'space-between',
        borderWidth: 1, borderColor: '#1E293B', marginBottom: 14,
    },
    dateText: { color: '#F8FAFC', fontSize: 15, fontWeight: '700' },

    // Filtros
    filtroLabel: { color: '#475569', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 6, marginLeft: 2 },
    filtroScroll: { marginBottom: 12, height: 40, flexGrow: 0, flexShrink: 0 },
    filtroBtn: { height: 34, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#0F172A', marginRight: 8, borderWidth: 1, borderColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
    filtroBtnActivo: { backgroundColor: '#38BDF8', borderColor: '#38BDF8' },
    filtroBtnAnoActivo: { backgroundColor: '#818CF8', borderColor: '#818CF8' },
    filtroBtnTxt: { color: '#64748B', fontSize: 12, fontWeight: '700' },
    filtroBtnTxtActivo: { color: '#020617' },

    // Resumen rápido
    resumenRow: { flexDirection: 'row', backgroundColor: '#0F172A', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#1E293B', marginBottom: 14, justifyContent: 'space-around' },
    resumenBox: { alignItems: 'center' },
    resumenNum: { fontSize: 22, fontWeight: '900' },
    resumenLabel: { color: '#475569', fontSize: 10, fontWeight: '700', marginTop: 2 },
    resumenDivider: { width: 1, backgroundColor: '#1E293B' },

    // Cards
    card: {
        backgroundColor: '#0F172A', borderRadius: 18, padding: 16,
        marginBottom: 14, borderLeftWidth: 5, borderWidth: 1, borderColor: '#1E293B',
    },
    cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
    numBadge: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    numBadgeTxt: { fontSize: 14, fontWeight: '900' },
    cardNombre: { color: '#F8FAFC', fontSize: 16, fontWeight: '800', marginBottom: 4 },
    cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    mencionPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, borderWidth: 1 },
    mencionPillTxt: { fontSize: 10, fontWeight: '800' },
    cardAno: { color: '#475569', fontSize: 11, fontWeight: '600' },
    estadoBadges: { gap: 4, alignItems: 'flex-end' },
    estadoPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
    estadoPillTxt: { fontSize: 10, fontWeight: '800' },

    // Detalle por materia (modo día)
    detalleRow: { marginBottom: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#1E293B' },
    detalleMateriaBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
    detalleMateriaText: { color: '#475569', fontSize: 11, fontWeight: '700' },
    obsBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, backgroundColor: '#1E293B', padding: 8, borderRadius: 8 },
    obsText: { color: '#94A3B8', fontSize: 12, fontStyle: 'italic', flex: 1 },
    sinObs: { color: '#334155', fontSize: 11, fontStyle: 'italic' },

    // Contadores (modo acumulado)
    contadoresRow: { flexDirection: 'row', backgroundColor: '#020617', borderRadius: 12, padding: 12, marginBottom: 12, justifyContent: 'space-around', borderWidth: 1, borderColor: '#1E293B' },
    contadorBox: { alignItems: 'center' },
    contadorNum: { fontSize: 24, fontWeight: '900' },
    contadorLabel: { color: '#475569', fontSize: 10, fontWeight: '700', marginTop: 2 },
    contadorDivider: { width: 1, backgroundColor: '#1E293B' },

    // Observaciones acumuladas
    obsAcumContainer: { backgroundColor: '#020617', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1E293B' },
    obsAcumTitulo: { color: '#475569', fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10 },
    obsAcumRow: { marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
    obsAcumFecha: { color: '#38BDF8', fontSize: 11, fontWeight: '700', marginBottom: 4 },
    obsAcumTexto: { color: '#94A3B8', fontSize: 12, fontStyle: 'italic' },

    // Empty state
    emptyContainer: { alignItems: 'center', marginTop: 60, gap: 10 },
    emptyTitulo: { color: '#10B981', fontSize: 18, fontWeight: '900' },
    emptyTexto: { color: '#475569', fontSize: 14, textAlign: 'center' },

    // ── WhatsApp ──
    waBtn: {
        marginTop: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#128C7E',
        paddingVertical: 12,
        borderRadius: 12,
    },
    waBtnCargando: {
        backgroundColor: '#0F6B63',
        opacity: 0.8,
    },
    waBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '800',
    },

    // ── Modal de perfil ──
    modalOverlay: { flex: 1, backgroundColor: 'rgba(2, 6, 23, 0.85)', justifyContent: 'flex-end' },
    modalCard: {
        backgroundColor: '#0F172A', borderTopLeftRadius: 30, borderTopRightRadius: 30,
        padding: 28, paddingBottom: 45, maxHeight: '90%', borderTopWidth: 1, borderColor: '#1E293B',
    },
    modalTopBar: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16 },
    modalCloseBtn: { backgroundColor: '#1E293B', borderRadius: 20, padding: 6 },
    modalAvatar: { width: 90, height: 90, borderRadius: 25, borderWidth: 3, borderColor: '#38BDF8', marginBottom: 14 },
    modalNombre: { fontSize: 22, fontWeight: '900', color: '#F8FAFC', textAlign: 'center', marginBottom: 8 },
    modalMencionPill: {
        backgroundColor: '#0F172A', paddingHorizontal: 14, paddingVertical: 5,
        borderRadius: 20, borderWidth: 1, borderColor: '#38BDF8', marginBottom: 18,
    },
    modalMencionText: { color: '#38BDF8', fontSize: 12, fontWeight: '700' },
    modalSeccionTitulo: {
        color: '#64748B', fontSize: 10, fontWeight: '800', letterSpacing: 1.5,
        textTransform: 'uppercase', marginBottom: 8, marginLeft: 4,
    },
    modalInfoBox: {
        width: '100%', backgroundColor: '#020617', borderRadius: 18,
        padding: 16, borderWidth: 1, borderColor: '#1E293B', marginBottom: 8,
    },
    modalRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 4 },
    modalIconBox: {
        width: 34, height: 34, backgroundColor: '#1E293B', borderRadius: 9,
        justifyContent: 'center', alignItems: 'center', marginTop: 2,
    },
    modalLabel: { color: '#64748B', fontSize: 11, fontWeight: '600', marginBottom: 2 },
    modalValue: { color: '#F8FAFC', fontSize: 15, fontWeight: '700' },
    modalSep: { height: 1, backgroundColor: '#1E293B', marginVertical: 10 },
});
