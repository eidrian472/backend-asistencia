import AsyncStorage from '@react-native-async-storage/async-storage';

export let API_URL = "https://backend-asistencia-production-706c.up.railway.app";

export const cargarApiUrl = async () => {
  const guardada = await AsyncStorage.getItem('api_url');
  if (guardada) API_URL = guardada;
};

export const setApiUrl = async (nuevaIp: string) => {
  API_URL = nuevaIp.startsWith('http') ? nuevaIp : `http://${nuevaIp}:3000`;
  await AsyncStorage.setItem('api_url', API_URL);
};

export const getApiUrl = async (): Promise<string> => {
  const guardada = await AsyncStorage.getItem('api_url');
  if (guardada) {
    API_URL = guardada;
    return guardada;
  }
  return API_URL;
};