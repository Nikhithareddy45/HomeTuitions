import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function SafeArea ({children}: React.PropsWithChildren<object>) {
    const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {paddingTop:insets.top,paddingBottom:insets.bottom+5}]} className=''>
        {children}
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
})