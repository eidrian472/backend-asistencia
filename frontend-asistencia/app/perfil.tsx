import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../constants';

export default function PerfilScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { usuario, rol } = useLocalSearchParams();
    const [docente, setDocente] = useState<any>(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (usuario) obtenerDatos();
        else setCargando(false);
    }, [usuario]);

    const obtenerDatos = async () => {
        try {
            const res = await axios.get(`${API_URL}/perfil/${usuario}`);
            if (res.data.success) setDocente(res.data.datos);
        } catch (e) {
            console.error("Error al obtener datos:", e);
        } finally {
            setCargando(false);
        }
    };

    if (cargando) return (
        <View style={styles.loading}>
            <ActivityIndicator size="large" color="#5A9FDE" />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerNav}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={26} color="#5A9FDE" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>

                {/* Avatar + Nombre */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{ uri: `https://ui-avatars.com/api/?name=${docente?.nombre || 'U'}+${docente?.apellido || ''}&background=5B9BD5&color=ffffff&bold=true&size=200` }}
                            style={styles.avatar}
                        />
                        {/* Badge de rol: dorado */}
                        <View style={styles.rolBadge}>
                            <Ionicons
                                name={rol === 'admin' ? 'shield-checkmark' : 'school'}
                                size={14}
                                color="#6B4000"
                            />
                        </View>
                    </View>
                    <Text style={styles.userName}>
                        {docente ? `${docente.nombre} ${docente.apellido}` : 'Usuario'}
                    </Text>
                    <Text style={styles.userHandle}>{usuario}</Text>
                    <View style={styles.nacionalidadRow}>
                        <Text style={styles.nacionalidadFlag}>
                            {docente?.nacionalidad === 'V' ? '🇻🇪' : docente?.nacionalidad === 'E' ? '🌍' : ''}
                        </Text>
                        <Text style={styles.nacionalidadText}>
                            {docente?.nacionalidad === 'V' ? 'Venezolano/a' : docente?.nacionalidad === 'E' ? 'Extranjero/a' : ''}
                        </Text>
                    </View>
                    <View style={styles.rolPill}>
                        <Text style={styles.rolPillText}>
                            {rol === 'admin' ? 'Administrador del Sistema' : 'Docente de Aula'}
                        </Text>
                    </View>
                </View>

                {/* Tarjeta de información */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Información Personal</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="card-outline" size={18} color="#5A9FDE" />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Cédula</Text>
                            <Text style={styles.infoValue}>{docente?.cedula || '---'}</Text>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="book-outline" size={18} color="#5A9FDE" />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Materia</Text>
                            <Text style={styles.infoValue}>{docente?.materia || 'No especificada'}</Text>
                        </View>
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.infoRow}>
                        <View style={styles.infoIconBox}>
                            <Ionicons name="shield-outline" size={18} color="#5A9FDE" />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Rol en el sistema</Text>
                            <Text style={styles.infoValue}>
                                {rol === 'admin' ? 'Administrador' : 'Docente'}
                            </Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Botón Cerrar Sesión */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
                <View style={{ height: Math.max(40, insets.bottom) }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    // ── Fondo base azul claro
    container: {
        flex: 1,
        backgroundColor: '#E4EFFF',
    },
    loading: {
        flex: 1,
        backgroundColor: '#E4EFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Header
    headerNav: {
        marginTop: 55,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#99C4EF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0D2340',
    },

    // Avatar
    scroll: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#5B9BD5',
    },
    // Badge dorado
    rolBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#F5A800',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    userName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0D2340',
        marginBottom: 4,
    },
    userHandle: {
        fontSize: 14,
        color: '#5A80A8',
        marginBottom: 8,
    },
    nacionalidadRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    nacionalidadFlag: { fontSize: 16 },
    nacionalidadText: {
        color: '#5A80A8',
        fontSize: 13,
        fontWeight: '600',
    },
    // Pill del rol: borde dorado
    rolPill: {
        backgroundColor: '#FFF0C2',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F5A800',
    },
    rolPillText: {
        color: '#C47F00',
        fontSize: 12,
        fontWeight: '700',
    },

    // Info Card
    infoCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#99C4EF',
    },
    infoCardTitle: {
        color: '#5A80A8',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 18,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        paddingVertical: 4,
    },
    infoIconBox: {
        width: 38,
        height: 38,
        backgroundColor: '#E4EFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoLabel: {
        color: '#5A80A8',
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2,
    },
    infoValue: {
        color: '#0D2340',
        fontSize: 15,
        fontWeight: '700',
    },
    separator: {
        height: 1,
        backgroundColor: '#C8DFFF',
        marginVertical: 14,
    },

    // Footer
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#99C4EF',
        paddingTop: 15,
        paddingHorizontal: 20,
        backgroundColor: '#E4EFFF',
    },
    logoutBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFF5F5',
        padding: 16,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    logoutText: {
        color: '#EF4444',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
