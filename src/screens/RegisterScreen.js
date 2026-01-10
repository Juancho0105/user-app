import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Registro</Text>
      
      {/* Botón para volver atrás en la pila de navegación */}
      <Button 
        title="Volver al Login"
        onPress={() => navigation.goBack()} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa', // Un color diferente para que notes el cambio
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  }
});