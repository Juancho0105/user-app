import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function Input({ placeholder, secureTextEntry, value, onChangeText }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[
      styles.container, 
      isFocused && styles.containerFocused // Aplica borde azul si está en foco
    ]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}  // Detecta cuando entras
        onBlur={() => setIsFocused(false)}  // Detecta cuando sales
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,           // Borde base invisible
    borderColor: 'transparent', 
    justifyContent: 'center'
  },
  containerFocused: {
    borderColor: '#3576E0',   // Borde azul al enfocar
    backgroundColor: '#FFFFFF' // Opcional: Fondo blanco al enfocar para más contraste
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937'
  }
});