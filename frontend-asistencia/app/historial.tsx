import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { API_URL } from '../constants';
import Sidebar, { MenuButton } from '../components/Sidebar'; // ajusta la ruta

export default function HistorialScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { rol, menciones_permitidas, usuario, materia } = useLocalSearchParams();
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const [registros, setRegistros] = useState<any[]>([]);
    const [cargando, setCargando] = useState(false);
    const [fecha, setFecha] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [mencionFiltro, setMencionFiltro] = useState('Todas');
    const [anoFiltro, setAnoFiltro] = useState('Todos');

    const etiquetasAno: Record<string, string> = {
        'Todos': 'Todos', '1': '1er Año', '2': '2do Año',
        '3': '3er Año', '4': '4to Año', '5': '5to Año',
    };

    const todosPorRol =
        rol === 'admin' ? ['1', '2', '3', '4', '5']
            : rol === 'docente_manana' ? ['1', '2', '3']
                : rol === 'docente_tarde' ? ['4', '5']
                    : ['1', '2', '3', '4', '5'];

    const mpStr = String(menciones_permitidas ?? '').trim();
    const tieneMenciones = mpStr !== '' && mpStr !== 'null' && mpStr !== 'undefined';

    const anosPermitidos: string[] = tieneMenciones
        ? [...new Set(mpStr.split(',').map(p => p.trim().split(':')[1]).filter(Boolean))].filter(a => todosPorRol.includes(a))
        : todosPorRol;

    const todasLasMenciones = ['Telemática', 'Turismo', 'Administración', 'Contabilidad'];
    const mencionesPermitidas: string[] = tieneMenciones
        ? [...new Set(mpStr.split(',').map(p => p.trim().split(':')[0]).filter(Boolean))].filter(m => todasLasMenciones.includes(m))
        : todasLasMenciones;

    const anosOpciones = ['Todos', ...anosPermitidos];
    const mencionesOpciones = ['Todas', ...mencionesPermitidas];

    const cargarHistorial = async (
        fechaSeleccionada: Date,
        filtroMencion: string = mencionFiltro,
        filtroAno: string = anoFiltro
    ) => {
        setCargando(true);
        try {
            const fechaFormateada = fechaSeleccionada.toLocaleDateString('en-CA'); // YYYY-MM-DD usando reloj local
            const params: any = { fecha: fechaFormateada };
            if (filtroMencion !== 'Todas') params.mencion = filtroMencion;
            if (filtroAno !== 'Todos') params.ano = filtroAno;
            const res = await axios.get(`${API_URL}/historial`, { params });
            setRegistros(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    const cambiarMencion = (m: string) => { setMencionFiltro(m); cargarHistorial(fecha, m, anoFiltro); };
    const cambiarAno = (a: string) => { setAnoFiltro(a); cargarHistorial(fecha, mencionFiltro, a); };

    useEffect(() => { cargarHistorial(fecha); }, []);

    const onChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) { setFecha(selectedDate); cargarHistorial(selectedDate, mencionFiltro, anoFiltro); }
    };

    const registrosConEncabezado = () => {
        const resultado: any[] = [];
        let claveActual = '';
        const ordenados = [...registros].sort((a, b) => {
            if (a.mencion < b.mencion) return -1;
            if (a.mencion > b.mencion) return 1;
            if (Number(a.ano) !== Number(b.ano)) return Number(a.ano) - Number(b.ano);
            return (a.nro_lista ?? 0) - (b.nro_lista ?? 0);
        });
        ordenados.forEach(item => {
            const claveItem = `${item.mencion}-${item.ano}`;
            if (claveItem !== claveActual) {
                claveActual = claveItem;
                resultado.push({ esEncabezado: true, mencion: item.mencion, ano: item.ano, tema: item.tema, clase_inicio: item.clase_inicio, clase_fin: item.clase_fin });
            }
            resultado.push({ ...item, esEncabezado: false });
        });
        return resultado;
    };

    const renderItem = ({ item }: { item: any }) => {
        if (item.esEncabezado) {
            const etiquetaClase = item.clase_inicio && item.clase_fin
                ? (item.clase_inicio === item.clase_fin ? `Clase ${item.clase_inicio}` : `Clases ${item.clase_inicio} y ${item.clase_fin}`)
                : null;
            const etiquetaAno = etiquetasAno[String(item.ano)] ?? `${item.ano}° Año`;
            return (
                <View style={styles.encabezadoMencion}>
                    <View style={styles.encabezadoTop}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.encabezadoNombre}>{item.mencion}</Text>
                            <Text style={styles.encabezadoAno}>{etiquetaAno}</Text>
                        </View>
                        {etiquetaClase ? (
                            <View style={styles.encabezadoBadge}><Text style={styles.encabezadoBadgeText}>{etiquetaClase}</Text></View>
                        ) : null}
                    </View>
                    {item.tema
                        ? <Text style={styles.encabezadoTema}>📚 {item.tema}</Text>
                        : <Text style={styles.encabezadoSinTema}>Sin tema registrado este día</Text>}
                </View>
            );
        }
        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.nombre}>{item.nro_lista ? `${item.nro_lista}. ` : ''}{item.nombre} {item.apellido}</Text>
                    <View style={[styles.badge, {
                        backgroundColor: item.estado === 'Asistido'
                            ? '#00C853'
                            : item.estado === 'Inasistente'
                                ? '#FF3B30'
                                : '#FF9500'
                    }]}>
                        <Text style={styles.badgeText}>{item.estado.charAt(0)}</Text>
                    </View>
                </View>
                {item.observaciones ? (
                    <View style={styles.obsBox}><Text style={styles.obsText}>📝 {item.observaciones}</Text></View>
                ) : null}
            </View>
        );
    };

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
                <Text style={styles.titulo}>Historial de Asistencias</Text>
            </View>

            <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#F8FAFC" />
                <Text style={styles.dateText}>
                    Fecha: {fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#38BDF8" />
            </TouchableOpacity>

            {showDatePicker && <DateTimePicker value={fecha} mode="date" display="default" onChange={onChange} />}

            <Text style={styles.filtroLabel}>AÑO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroScroll} contentContainerStyle={styles.filtroScrollContent}>
                {anosOpciones.map(a => (
                    <TouchableOpacity key={a} onPress={() => cambiarAno(a)} style={[styles.filtroBtn, anoFiltro === a && styles.filtroBtnActivoAno]}>
                        <Text style={[styles.filtroBtnTxt, anoFiltro === a && styles.filtroBtnTxtActivo]}>{etiquetasAno[a] ?? `${a}° Año`}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.filtroLabel}>MENCIÓN</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtroScroll} contentContainerStyle={styles.filtroScrollContent}>
                {mencionesOpciones.map(m => (
                    <TouchableOpacity key={m} onPress={() => cambiarMencion(m)} style={[styles.filtroBtn, mencionFiltro === m && styles.filtroBtnActivo]}>
                        <Text style={[styles.filtroBtnTxt, mencionFiltro === m && styles.filtroBtnTxtActivo]}>{m}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {cargando ? (
                <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={registrosConEncabezado()}
                    keyExtractor={(item, index) => item.esEncabezado ? `enc-${item.mencion}-${item.ano}` : item.id.toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.empty}>No hay registros para esta fecha.</Text>}
                    contentContainerStyle={{ paddingBottom: 30 + insets.bottom }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    // Fondo principal de toda la pantalla — Gris/azul muy claro (entorno de lectura limpio)
    container: { 
        flex: 1, 
        backgroundColor: '#F7F9FC', 
        paddingHorizontal: 20 
    },

    header: { 
        marginTop: 60, 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 20, 
        gap: 15 
    },
    // Color del título "Historial de Asistencias" — Azul muy oscuro para alta legibilidad
    titulo: { 
        fontSize: 24, 
        fontWeight: '900', 
        color: '#1A1A2E' 
    },

    // Fondo del selector de fecha — Blanco puro con borde gris sutil
    dateSelector: { 
        flexDirection: 'row', 
        backgroundColor: '#FFFFFF', 
        padding: 15, 
        borderRadius: 15, 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderWidth: 1, 
        borderColor: '#E0E6ED', 
        marginBottom: 16 
    },
    // Color del texto de la fecha en el selector — Azul muy oscuro
    dateText: { 
        color: '#1A1A2E', 
        fontSize: 16, 
        fontWeight: '700' 
    },

    // Color de las etiquetas "AÑO" y "MENCIÓN" — Gris de apoyo Movistar
    filtroLabel: { 
        color: '#8A9BB0', 
        fontSize: 10, 
        fontWeight: '800', 
        letterSpacing: 1.5, 
        marginBottom: 6, 
        marginLeft: 2 
    },
    filtroScroll: { 
        marginBottom: 14, 
        height: 42, 
        flexGrow: 0, 
        flexShrink: 0 
    },
    filtroScrollContent: { 
        alignItems: 'center', 
        paddingRight: 8 
    },
    
    // Fondo de cada botón de filtro inactivo — Gris suave neutro con borde sutil
    filtroBtn: { 
        height: 36, 
        paddingHorizontal: 16, 
        borderRadius: 20, 
        backgroundColor: '#F2F4F7', 
        marginRight: 8, 
        borderWidth: 1, 
        borderColor: '#E0E6ED', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    // Fondo y borde del botón de filtro de MENCIÓN activo — Azul Movistar principal
    filtroBtnActivo: { 
        backgroundColor: '#009EF7', 
        borderColor: '#009EF7' 
    },
    // Fondo y borde del botón de filtro de AÑO activo — Azul Movistar principal (Unificado para consistencia clara)
    filtroBtnActivoAno: { 
        backgroundColor: '#009EF7', 
        borderColor: '#009EF7' 
    },
    // Texto de los botones de filtro inactivos — Gris de apoyo Movistar
    filtroBtnTxt: { 
        color: '#8A9BB0', 
        fontSize: 13, 
        fontWeight: '700' 
    },
    // Texto de los botones de filtro activos — Blanco puro (alto contraste)
    filtroBtnTxtActivo: { 
        color: '#FFFFFF' 
    },

    // Fondo de cada card de estudiante en el listado — Blanco puro con borde gris sutil
    card: { 
        backgroundColor: '#FFFFFF', 
        padding: 15, 
        borderRadius: 15, 
        marginBottom: 12, 
        borderWidth: 1, 
        borderColor: '#E0E6ED' 
    },
    cardHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    // Color del nombre del estudiante en la card — Azul muy oscuro
    nombre: { 
        color: '#1A1A2E', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    // Círculo de estado (badge) en la card de estudiante
    badge: { 
        width: 24, 
        height: 24, 
        borderRadius: 12, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    // Color de la letra inicial del estado dentro del badge — Blanco puro
    badgeText: { 
        color: '#FFFFFF', 
        fontSize: 12, 
        fontWeight: '900' 
    },
    // Fondo del badge cuando el estado es "Asistido" — Verde Movistar
    bgP: { backgroundColor: '#00C853' },
    // Fondo del badge cuando el estado es "Inasistente" — Rojo Alerta Movistar
    bgA: { backgroundColor: '#FF3B30' },
    // Fondo del badge cuando el estado es "Retirado" — Ámbar Movistar
    bgR: { backgroundColor: '#FF9500' },

    // Fondo del recuadro de observaciones dentro de la card — Gris suave adaptado
    obsBox: { 
        marginTop: 10, 
        backgroundColor: '#F2F4F7', 
        padding: 8, 
        borderRadius: 8 
    },
    // Color del texto de observaciones — Gris de apoyo Movistar
    obsText: { 
        color: '#8A9BB0', 
        fontSize: 12, 
        fontStyle: 'italic' 
    },

    // Color del mensaje "No hay registros..." — Gris de apoyo Movistar
    empty: { 
        color: '#8A9BB0', 
        textAlign: 'center', 
        marginTop: 50, 
        fontSize: 16 
    },

    // Fondo del encabezado de grupo (mención + año) — Blanco puro con borde izquierdo destacado Azul Movistar
    encabezadoMencion: { 
        backgroundColor: '#FFFFFF', 
        borderRadius: 14, 
        padding: 14, 
        marginBottom: 8, 
        marginTop: 8, 
        borderWidth: 1, 
        borderColor: '#E0E6ED', 
        borderLeftWidth: 4, 
        borderLeftColor: '#009EF7' 
    },
    encabezadoTop: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 4 
    },
    // Color del nombre de la mención en el encabezado de grupo — Azul muy oscuro
    encabezadoNombre: { 
        color: '#1A1A2E', 
        fontSize: 16, 
        fontWeight: '900' 
    },
    // Color del texto del año en el encabezado de grupo — Azul Movistar principal
    encabezadoAno: { 
        color: '#009EF7', 
        fontSize: 12, 
        fontWeight: '700', 
        marginTop: 2 
    },
    // Fondo del badge de clase — Azul muy claro Movistar con borde azul principal
    encabezadoBadge: { 
        backgroundColor: '#EAF6FF', 
        paddingHorizontal: 10, 
        paddingVertical: 4, 
        borderRadius: 8, 
        borderWidth: 1, 
        borderColor: '#009EF7' 
    },
    // Color del texto del badge de clase — Azul Movistar principal
    encabezadoBadgeText: { 
        color: '#009EF7', 
        fontSize: 11, 
        fontWeight: '900' 
    },
    // Color del texto del tema de clase registrado — Gris de apoyo Movistar
    encabezadoTema: { 
        color: '#8A9BB0', 
        fontSize: 13, 
        fontStyle: 'italic', 
        marginTop: 6 
    },
    // Color del texto "Sin tema registrado este día" — Gris de apoyo Movistar
    encabezadoSinTema: { 
        color: '#8A9BB0', 
        fontSize: 12, 
        fontStyle: 'italic', 
        marginTop: 6 
    },
});