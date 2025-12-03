import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

type Address = {
    street: string;
    city: string;
    state: string;
    pin_code: string;
    country: string;
};

interface AddressFormProps {
    address: Address;
    onChange: (addr: Address) => void;
    selectedLocation: { lat: number; lng: number } | null;
    onLocationChange: (loc: { lat: number; lng: number } | null) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
    address,
    onChange,
    selectedLocation,
    onLocationChange,
}) => {
    const [loadingLocation, setLoadingLocation] = useState(false);

    const handleFieldChange = (key: keyof Address, value: string) => {
        onChange({ ...address, [key]: value });
    };

    const handleMapPress = (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        onLocationChange({ lat: latitude, lng: longitude });
    };

    const fillAddressFromCoords = async (latitude: number, longitude: number) => {
        try {
            const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
            const first = geocode[0];
            if (!first) return;

            onChange({
                street: [first.name, first.street].filter(Boolean).join(' ') || '',
                city: first.city || first.subregion || '',
                state: first.region || '',
                pin_code: first.postalCode || '',
                country: first.country || '',
            });
        } catch (e) {
            Alert.alert('Error', 'Could not fetch address from location');
        }
    };

    const handleUseCurrentLocation = async () => {
        try {
            setLoadingLocation(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location permission is required to autofill address.');
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = loc.coords;
            onLocationChange({ lat: latitude, lng: longitude });
            await fillAddressFromCoords(latitude, longitude);
        } catch (e: any) {
            Alert.alert('Error', e?.message || 'Failed to get current location');
        } finally {
            setLoadingLocation(false);
        }
    };

    return (
        <View>
            <View className="flex-row justify-between items-center mb-3">
                <Text className="text-xl font-semibold text-black">
                    Address Information
                </Text>
                <Button
                    title={loadingLocation ? 'Detecting...' : 'Use my location'}
                    onPress={handleUseCurrentLocation}
                    outline
                    disabled={loadingLocation}
                    className="px-3 py-2"
                    icon="map-pin"
                />
            </View>

            <View className="flex-1 gap-3">
                <Input
                    icon="MapPin"
                    label="Street"
                    value={address.street}
                    onChangeText={text => handleFieldChange('street', text)}
                    placeholder="Enter your street address"
                    className="mb-4"
                />

                <Input
                    icon="MapPin"
                    label="City"
                    value={address.city}
                    onChangeText={text => handleFieldChange('city', text)}
                    placeholder="Enter city"
                />
                <Input
                    icon="MapPin"
                    label="Pin Code"
                    keyboardType="number-pad"
                    value={address.pin_code}
                    onChangeText={text => handleFieldChange('pin_code', text)}
                    placeholder="Enter pin"
                />
                <Input
                    icon="MapPin"
                    label="State"
                    value={address.state}
                    onChangeText={text => handleFieldChange('state', text)}
                    placeholder="Enter state"
                />
                <Input
                    icon="Globe"
                    label="Country"
                    value={address.country}
                    onChangeText={text => handleFieldChange('country', text)}
                    placeholder="Enter country"
                />
            </View>

            {/* <View className="h-56 rounded-xl overflow-hidden mb-4 bg-gray-200">
                <MapView
                    className="flex-1"
                    initialRegion={{
                        latitude: selectedLocation?.lat || 20.5937,
                        longitude: selectedLocation?.lng || 78.9629,
                        latitudeDelta: 10,
                        longitudeDelta: 10,
                    }}
                    onPress={handleMapPress}
                >
                    {selectedLocation && (
                        <Marker
                            coordinate={{
                                latitude: selectedLocation.lat,
                                longitude: selectedLocation.lng,
                            }}
                            title="Selected Location"
                        />
                    )}
                </MapView>
            </View> */}
        </View>
    );
};

export default AddressForm;
