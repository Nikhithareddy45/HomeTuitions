import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type Address = {
    street: string;
    city: string;
    state: string;
    pin_code: string;
    country: string;
};

interface Props {
    address: Address;
    onChange: (addr: Address) => void;
    selectedLocation: { lat: number; lng: number } | null;
    onLocationChange: (loc: { lat: number; lng: number } | null) => void;
    editable?: boolean;
}

const AddressForm: React.FC<Props> = ({
    address,
    onChange,
    editable = true,
}) => {
    const [loading, setLoading] = useState(false);

    const handleField = (key: keyof Address, value: string) => {
        onChange({ ...address, [key]: value });
    };

    const handleUseLocation = async () => {
        try {
            setLoading(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            const loc = await Location.getCurrentPositionAsync({});
            const geo = await Location.reverseGeocodeAsync(loc.coords);

            if (geo[0]) {
                onChange({
                    street: geo[0].street || '',
                    city: geo[0].city || '',
                    state: geo[0].region || '',
                    pin_code: geo[0].postalCode || '',
                    country: geo[0].country || '',
                });
            }
        } catch {
            Alert.alert('Error', 'Unable to fetch location');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-semibold">Address</Text>
                <Button
                    title={loading ? 'Detecting...' : 'Use Location'}
                    onPress={handleUseLocation}
                    disabled={loading}
                    outline
                />
            </View>

            <Input label="Street" value={address.street} editable={editable} onChangeText={t => handleField('street', t)} iconName='MapPin' />
            <Input label="City" value={address.city} editable={editable} onChangeText={t => handleField('city', t)}  iconName='MapPin'/>
            <Input label="Pin Code" value={address.pin_code} editable={editable} onChangeText={t => handleField('pin_code', t)}  iconName='MapPin'/>
            <Input label="State" value={address.state} editable={editable} onChangeText={t => handleField('state', t)}  iconName='MapPin'/>
            <Input label="Country" value={address.country} editable={editable} onChangeText={t => handleField('country', t)} iconName='MapPin' />
        </View>
    );
};

export default AddressForm;
