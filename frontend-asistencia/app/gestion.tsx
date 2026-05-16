import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../constants';

// Campos obligatorios y sus etiquetas legibles
const CAMPOS_REQUERIDOS: { key: string; label: string }[] = [
    { key: 'nombre',       label: 'Nombre del estudiante'      },
    { key: 'apellido',     label: 'Apellido del estudiante'    },
    { key: 'cedula',       label: 'Cédula del estudiante'      },
    { key: 'rep_nombre',   label: 'Nombre del representante'   },
    { key: 'rep_apellido', label: 'Apellido del representante' },
    { key: 'rep_cedula',   label: 'Cédula del representante'   },
    { key: 'rep_telefono', label: 'Teléfono del representante' },
    { key: 'direccion',    label: 'Dirección de vivienda'      },
];

type FormState = {
    nombre: string;
    apellido: string;
    cedula: string;
    mencion: string;
    ano: string;
    rep_nombre: string;
    rep_apellido: string;
    rep_cedula: string;
    rep_telefono: string;
    direccion: string;
};

type Errores = Partial<Record<keyof FormState, string>>;

const FORM_VACIO: FormState = {
    nombre: '',
    apellido: '',
    cedula: '',
    mencion: 'Telemática',
    ano: '1',
    rep_nombre: '',
    rep_apellido: '',
    rep_cedula: '',
    rep_telefono: '',
    direccion: '',
};

// ── CampoTexto definido FUERA del componente para evitar que React lo
// recree en cada render y pierda el foco del teclado letra por letra ──────────
type CampoTextoProps = {
    campo: keyof FormState;
    placeholder: string;
    keyboardType?: any;
    multiline?: boolean;
    value: string;
    error?: string;
    onChange: (campo: keyof FormState, valor: string) => void;
};

const CampoTexto = ({
    campo, placeholder, keyboardType = 'default',
    multiline = false, value, error, onChange,
}: CampoTextoProps) => (
    <View style={styles.campoWrapper}>
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={error ? '#EF444488' : '#475569'}
            style={[
                styles.input,
                !!error && styles.inputError,
                multiline && { minHeight: 70, textAlignVertical: 'top' },
            ]}
            keyboardType={keyboardType}
            multiline={multiline}
            onChangeText={t => onChange(campo, t)}
            value={value}
        />
        {!!error && (
            <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={13} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
            </View>
        )}
    </View>
);
// ─────────────────────────────────────────────────────────────────────────────

export default function GestionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [form, setForm] = useState<FormState>(FORM_VACIO);
    const [errores, setErrores] = useState<Errores>({});
    const [intentoGuardar, setIntentoGuardar] = useState(false);
    const [cedulaBorrar, setCedulaBorrar] = useState('');

    // ── Validación ────────────────────────────────────────────────────────────
    const validar = (): Errores => {
        const nuevosErrores: Errores = {};
        CAMPOS_REQUERIDOS.forEach(({ key, label }) => {
            if (!form[key as keyof FormState].trim()) {
                nuevosErrores[key as keyof FormState] = `${label} es obligatorio`;
            }
        });
        // Validación extra: cédula sólo números
        if (form.cedula.trim() && !/^\d+$/.test(form.cedula.trim())) {
            nuevosErrores.cedula = 'La cédula debe contener solo números';
        }
        if (form.rep_cedula.trim() && !/^\d+$/.test(form.rep_cedula.trim())) {
            nuevosErrores.rep_cedula = 'La cédula debe contener solo números';
        }
        return nuevosErrores;
    };

    // Limpiar error de un campo cuando el usuario empieza a escribir
    const actualizarCampo = (key: keyof FormState, valor: string) => {
        setForm(prev => ({ ...prev, [key]: valor }));
        if (intentoGuardar && errores[key]) {
            setErrores(prev => {
                const copia = { ...prev };
                delete copia[key];
                return copia;
            });
        }
    };

    const guardarEstudiante = async () => {
        setIntentoGuardar(true);
        const nuevosErrores = validar();
        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }
        setErrores({});

        // Convertir el número de año (ej. '1') al nombre de grado que tiene la DB (ej. '1er Año')
        const gradoMapUI: Record<string, string> = {
            '1': '1er Año', '2': '2do Año', '3': '3er Año',
            '4': '4to Año', '5': '5to Año', '6': '6to Año',
        };
        const anoNombre = gradoMapUI[form.ano] || form.ano;

        try {
            const res = await axios.post(`${API_URL}/admin/estudiantes`, {
                ...form,
                ano: anoNombre,     // nombre de grado para que el backend resuelva el ID
            });
            if (res.data.success) {
                Alert.alert('✅ Éxito', `Estudiante guardado — Nro. ${res.data.nro_lista}`);
                setForm(FORM_VACIO);
                setIntentoGuardar(false);
            } else {
                Alert.alert('Error', res.data.error || 'No se pudo guardar.');
            }
        } catch (e: any) {
            const msg = e?.response?.data?.error || 'No se pudo conectar al servidor.';
            Alert.alert('Error', msg);
        }
    };

    // ── Eliminación ───────────────────────────────────────────────────────────
    const confirmarEliminacion = async () => {
        if (!cedulaBorrar) return;
        try {
            const info = await axios.get(`${API_URL}/admin/estudiantes/${cedulaBorrar}`);
            if (info.data.success) {
                const est = info.data.estudiante;
                Alert.alert(
                    '¿Eliminar Estudiante?',
                    `Nombre: ${est.nombre} ${est.apellido}\nAño: ${est.ano}° - ${est.mencion}\nCédula: V-${cedulaBorrar}`,
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        { text: 'SÍ, ELIMINAR', style: 'destructive', onPress: borrarRealmente },
                    ]
                );
            } else {
                Alert.alert('No encontrado', 'Esa cédula no existe.');
            }
        } catch {
            Alert.alert('Error', 'Error de red al buscar.');
        }
    };

    const borrarRealmente = async () => {
        try {
            const res = await axios.delete(`${API_URL}/admin/estudiantes/${cedulaBorrar}`);
            if (res.data.success) {
                Alert.alert('Eliminado', 'Registro borrado correctamente.');
                setCedulaBorrar('');
            }
        } catch {
            Alert.alert('Error', 'No se pudo eliminar.');
        }
    };

    const cantidadErrores = Object.keys(errores).length;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 + insets.bottom }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.back}>
                    <Ionicons name="arrow-back" size={24} color="#38BDF8" />
                </TouchableOpacity>
                <Text style={styles.titulo}>Administrar Matrícula</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Inscripción de Alumnos</Text>

                {/* Banner de errores resumen */}
                {intentoGuardar && cantidadErrores > 0 && (
                    <View style={styles.errorBanner}>
                        <Ionicons name="warning" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                        <Text style={styles.errorBannerText}>
                            {cantidadErrores === 1
                                ? '1 campo obligatorio sin completar'
                                : `${cantidadErrores} campos obligatorios sin completar`}
                        </Text>
                    </View>
                )}

                {/* Año */}
                <Text style={styles.label}>Año de Estudio:</Text>
                <View style={styles.row}>
                    {['1', '2', '3', '4', '5', '6'].map(a => (
                        <TouchableOpacity
                            key={a}
                            onPress={() => actualizarCampo('ano', a)}
                            style={[styles.miniTab, form.ano === a && styles.miniTabA]}
                        >
                            <Text style={{ color: form.ano === a ? '#020617' : '#94A3B8', fontWeight: 'bold' }}>{a}°</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Mención */}
                <Text style={styles.label}>Mención:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                    {['Telemática', 'Turismo', 'Administración', 'Contabilidad'].map(m => (
                        <TouchableOpacity
                            key={m}
                            onPress={() => actualizarCampo('mencion', m)}
                            style={[styles.mTab, form.mencion === m && styles.mTabA]}
                        >
                            <Text style={{ color: form.mencion === m ? '#020617' : '#94A3B8', fontSize: 12, fontWeight: 'bold' }}>{m}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* ── Datos del estudiante ── */}
                <Text style={styles.seccionLabel}>DATOS DEL ESTUDIANTE</Text>
                <CampoTexto campo="nombre"   placeholder="Nombre"   value={form.nombre}   error={errores.nombre}   onChange={actualizarCampo} />
                <CampoTexto campo="apellido" placeholder="Apellido" value={form.apellido} error={errores.apellido} onChange={actualizarCampo} />
                <CampoTexto campo="cedula"   placeholder="Cédula"   value={form.cedula}   error={errores.cedula}   onChange={actualizarCampo} keyboardType="numeric" />

                {/* ── Datos del representante ── */}
                <Text style={[styles.seccionLabel, { marginTop: 6 }]}>DATOS DEL REPRESENTANTE</Text>
                <CampoTexto campo="rep_nombre"   placeholder="Nombre del Representante"   value={form.rep_nombre}   error={errores.rep_nombre}   onChange={actualizarCampo} />
                <CampoTexto campo="rep_apellido" placeholder="Apellido del Representante" value={form.rep_apellido} error={errores.rep_apellido} onChange={actualizarCampo} />
                <CampoTexto campo="rep_cedula"   placeholder="Cédula del Representante"   value={form.rep_cedula}   error={errores.rep_cedula}   onChange={actualizarCampo} keyboardType="numeric" />
                <CampoTexto campo="rep_telefono" placeholder="Teléfono del Representante" value={form.rep_telefono} error={errores.rep_telefono} onChange={actualizarCampo} keyboardType="phone-pad" />
                <CampoTexto campo="direccion"    placeholder="Dirección de Vivienda"       value={form.direccion}    error={errores.direccion}    onChange={actualizarCampo} multiline />

                <TouchableOpacity style={styles.btnG} onPress={guardarEstudiante}>
                    <Ionicons name="save-outline" size={18} color="#020617" style={{ marginRight: 8 }} />
                    <Text style={styles.btnText}>GUARDAR ESTUDIANTE</Text>
                </TouchableOpacity>
            </View>

            {/* ── Baja de estudiante ── */}
            <View style={[styles.card, { marginTop: 20, borderColor: '#7F1D1D' }]}>
                <Text style={[styles.cardTitle, { color: '#EF4444' }]}>Baja de Estudiante</Text>
                <TextInput
                    placeholder="Cédula a buscar"
                    placeholderTextColor="#475569"
                    style={styles.input}
                    keyboardType="numeric"
                    onChangeText={setCedulaBorrar}
                    value={cedulaBorrar}
                />
                <TouchableOpacity style={styles.btnB} onPress={confirmarEliminacion}>
                    <Ionicons name="search" size={20} color="#FFF" style={{ marginRight: 10 }} />
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>BUSCAR Y ELIMINAR</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617', padding: 20 },
    header: { marginTop: 50, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    back: { padding: 10, backgroundColor: '#0F172A', borderRadius: 12, marginRight: 15 },
    titulo: { fontSize: 22, color: '#FFF', fontWeight: '900' },
    card: { backgroundColor: '#0F172A', padding: 20, borderRadius: 25, borderWidth: 1, borderColor: '#1E293B' },
    cardTitle: { color: '#38BDF8', fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    label: { color: '#64748B', fontSize: 11, fontWeight: 'bold', marginBottom: 8 },
    seccionLabel: {
        color: '#475569',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 10,
        marginTop: 4,
    },
    row: { flexDirection: 'row', gap: 8, marginBottom: 15 },
    miniTab: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center' },
    miniTabA: { backgroundColor: '#38BDF8' },
    mTab: { padding: 12, borderRadius: 12, backgroundColor: '#1E293B', marginRight: 8 },
    mTabA: { backgroundColor: '#38BDF8' },

    // Campo con wrapper para mensaje de error
    campoWrapper: { marginBottom: 4 },
    input: {
        backgroundColor: '#1E293B',
        color: '#FFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 4,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: '#EF4444',
        backgroundColor: '#1E0A0A',
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 8,
        marginLeft: 4,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: '600',
    },

    // Banner resumen de errores
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E0A0A',
        borderWidth: 1,
        borderColor: '#7F1D1D',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    errorBannerText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 13,
        flex: 1,
    },

    btnG: {
        backgroundColor: '#38BDF8',
        padding: 18,
        borderRadius: 15,
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btnB: {
        backgroundColor: '#7F1D1D',
        padding: 18,
        borderRadius: 15,
        marginTop: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    btnText: { color: '#020617', fontWeight: '900' },
});
