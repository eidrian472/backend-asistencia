import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Sidebar, { MenuButton } from '../components/Sidebar';

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

    // Si es docente (no admin) y NO tiene menciones asignadas, es un error de configuración
    const esDocente = rol === 'docente_manana' || rol === 'docente_tarde';
    const sinMencionesDocente = esDocente && !tieneMenciones;

    const anosPermitidos = tieneMenciones
        ? [...new Set(
            mpStr
                .split(',')
                .map(p => p.trim().split(':')[1])
                .filter(Boolean)
        )].filter(a => todosPorRol.includes(a)).sort((a, b) => Number(a) - Number(b))
        : esDocente
            ? [] // docente sin menciones → lista vacía (no mostrar todos)
            : todosPorRol; // admin sin menciones → todos

    // Colores de acento para cada año — aplicados como borde izquierdo del card y tinte del ícono
    const coloresPorAno: Record<string, string> = {
        '1': '#38BDF8', // Celeste sky — color de acento del card de 1er Año
        '2': '#10B981', // Verde esmeralda — color de acento del card de 2do Año
        '3': '#F59E0B', // Ámbar — color de acento del card de 3er Año
        '4': '#818CF8', // Violeta índigo — color de acento del card de 4to Año
        '5': '#F472B6', // Rosa — color de acento del card de 5to Año
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

            {/* Advertencia de configuración incorrecta — solo docentes sin menciones */}
            {sinMencionesDocente ? (
                <View style={styles.sinMencionesContainer}>
                    <Text style={styles.sinMencionesIcon}>⚠️</Text>
                    <Text style={styles.sinMencionesTitulo}>Sin secciones asignadas</Text>
                    <Text style={styles.sinMencionesDescripcion}>
                        Tu cuenta no tiene secciones configuradas en el sistema.{'\n\n'}
                        Contacta al administrador para que asigne las menciones y años que te corresponden.
                        {'\n\n'}
                        <Text style={{ fontFamily: 'monospace', fontSize: 11, color: '#B0BEC5' }}>
                            (Valor recibido: '{mpStr || 'vacío'}')
                        </Text>
                    </Text>
                </View>
            ) : (

            <ScrollView contentContainerStyle={[styles.grid, { paddingBottom: 40 + insets.bottom }]}>

                {/* Card especial de Asistencia Docentes — solo visible para admin */}
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
                                <Ionicons name="people" size={24} color="#020617" /> {/* Azul marino casi negro — ícono "people" dentro del círculo del card admin */}
                            </View>
                            <View>
                                <Text style={styles.cardTextAdmin}>Asistencia de Docentes</Text>
                                <Text style={styles.cardSubAdmin}>Control diario del personal</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#020617" /> {/* Azul marino casi negro — ícono de flecha al final del card admin */}
                    </TouchableOpacity>
                )}

                {/* Separador "AÑOS ESCOLARES" — solo visible para admin */}
                {rol === 'admin' && (
                    <View style={styles.separador}>
                        <View style={styles.separadorLinea} />
                        <Text style={styles.separadorTexto}>AÑOS ESCOLARES</Text>
                        <View style={styles.separadorLinea} />
                    </View>
                )}

                {/* Cards de cada año disponible */}
                {anosDisponibles.map((item) => (
                    <TouchableOpacity
                        key={item.ano}
                        style={[styles.card, { borderLeftColor: item.color }]}
                        // borderLeftColor dinámico: celeste/verde/ámbar/violeta/rosa según el año
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
                            <View style={[
                                styles.iconCircle,
                                { backgroundColor: item.color + '22' } // Color del año con ~13% de opacidad — fondo del círculo de ícono de cada card de año
                            ]}>
                                <Ionicons name="school" size={24} color={item.color} /> {/* Color del año (celeste/verde/ámbar/violeta/rosa) — ícono de escuela en el card de cada año */}
                            </View>
                            <Text style={styles.cardText}>{item.label}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#334155" /> {/* Gris azulado medio — ícono de flecha al final de cada card de año */}
                    </TouchableOpacity>
                ))}
            </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    // ─── Pantalla base ───────────────────────────────────────────────────────
    // Fondo principal de toda la pantalla — Gris/azul muy claro oficial
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC', 
        padding: 20,
    },

    // ─── Header ──────────────────────────────────────────────────────────────
    header: {
        marginTop: 50, 
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: 35, 
        gap: 15,
    },
    // Color del título "Seleccionar Año" — Azul muy oscuro de alta legibilidad
    titulo: {
        fontSize: 26, 
        fontWeight: '900',
        color: '#1A1A2E', 
    },
    // Color del subtítulo (Turno / Acceso) — Gris de apoyo Movistar
    subtitulo: {
        fontSize: 13,
        color: '#8A9BB0', 
        marginTop: 2,
    },

    // ─── Lista de cards ───────────────────────────────────────────────────────
    grid: { gap: 12 },

    // ─── Card especial: Asistencia de Docentes (Modo Admin Premium) ──────────
    // Rediseñado: Tarjeta blanca con borde sutil y línea destacada azul Movistar a la izquierda
    cardAdmin: {
        backgroundColor: '#FFFFFF', 
        borderRadius: 18, 
        padding: 20,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E6ED',
        borderLeftWidth: 6,
        borderLeftColor: '#009EF7', // Acento Azul Movistar principal
        elevation: 2, // Sombra sutilizada para entorno claro
        shadowColor: '#1A1A2E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    // Fondo del círculo del ícono admin — Azul muy claro de alta armonía
    iconCircleAdmin: {
        width: 44, 
        height: 44, 
        borderRadius: 22,
        backgroundColor: '#EAF6FF', 
        justifyContent: 'center', 
        alignItems: 'center',
        marginRight: 14,
    },
    // Nota JSX: Asegúrate de que el ícono (ej. Ionicons) dentro de este círculo use color: '#009EF7'
    
    // Texto "Asistencia de Docentes" — Azul muy oscuro
    cardTextAdmin: {
        color: '#1A1A2E', 
        fontSize: 18, 
        fontWeight: '900',
    },
    // Subtítulo del card admin — Gris de apoyo Movistar
    cardSubAdmin: {
        color: '#8A9BB0', 
        fontSize: 11, 
        fontWeight: '600', 
        marginTop: 2,
    },

    // ─── Separador entre el card admin y los cards de año ────────────────────
    separador: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10, 
        marginVertical: 12,
    },
    // Líneas horizontales divisorias — Gris sutil de estructura
    separadorLinea: {
        flex: 1, 
        height: 1,
        backgroundColor: '#E0E6ED', 
    },
    // Texto "AÑOS ESCOLARES" — Gris de apoyo Movistar en mayúsculas
    separadorTexto: {
        color: '#8A9BB0', 
        fontSize: 10, 
        fontWeight: '800', 
        letterSpacing: 1.5,
    },

    // ─── Card de cada año escolar ─────────────────────────────────────────────
    // Fondo de cada card de año — Blanco puro con borde gris sutil
    // Nota JSX: borderLeftColor se maneja dinámico en tu código (usa los nuevos tonos claros de la marca)
    card: {
        backgroundColor: '#FFFFFF', 
        borderRadius: 18,
        borderLeftWidth: 6,
        borderWidth: 1,
        borderColor: '#E0E6ED', 
        padding: 20,
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    cardInfo: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 15 
    },
    // Círculo del ícono dinámico del año
    // Nota JSX: El backgroundColor se inyecta inline (recuerda cambiar la opacidad vieja '22' por '1A' para fondo claro)
    iconCircle: {
        width: 44, 
        height: 44, 
        borderRadius: 22,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    // Etiqueta del año ("1er Año", "2do Año"…) — Azul muy oscuro
    cardText: {
        color: '#1A1A2E', 
        fontSize: 20, 
        fontWeight: 'bold',
    },
    sinMencionesContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingBottom: 60,
        gap: 10,
    },
    sinMencionesIcon: {
        fontSize: 48,
    },
    sinMencionesTitulo: {
        color: '#1A1A2E',
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
    },
    sinMencionesDescripcion: {
        color: '#8A9BB0',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
    },
});