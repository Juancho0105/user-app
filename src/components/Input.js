import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function Input({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  errorMessage,
  rightElement, // <- opcional (ej: botón ojo)
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const { colors } = useTheme();

  const borderColor = errorMessage
    ? '#EF4444'
    : (isFocused ? colors.primary : colors.border);

  return (
    <View style={{ width: '100%' }}>
      <View style={[
        styles.container,
        { backgroundColor: colors.inputBackground, borderColor }
      ]}>
        <TextInput
          style={[styles.input, { color: colors.text }, rightElement && { paddingRight: 6 }]}
          placeholder={placeholder}
          placeholderTextColor={colors.inputPlaceholder}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {!!rightElement && <View style={styles.right}>{rightElement}</View>}
      </View>

      {!!errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    width: '100%',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  right: {
    marginLeft: 10,
  },
  errorText: {
    marginTop: 6,
    marginLeft: 6,
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  }
});