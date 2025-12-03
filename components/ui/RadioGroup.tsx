// components/ui/RadioGroup.tsx
import IconComp from '@/components/ui/IconComp';
import { RadioGroupProps } from '@/types/common';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const RadioGroup: React.FC<RadioGroupProps> = ({
    iconName = "Venus",
    label,
    options,
    value,
    onChange,
    direction = 'column',
}) => {
    return (
        <View className="gap-3 mb-2">
            <View className='flex-row  '>
                {iconName && (
                    <View className="mr-3">
                        <IconComp
                            name={iconName}
                            size={18}
                            color="#115bca"
                        />
                    </View>
                )}
                {label && (
                    <Text className="text-md font-semibold text-primary">
                        {label}
                    </Text>
                )}
            </View>

            <View className={direction === 'row' ? 'flex-row flex-wrap gap-3' : 'flex-col gap-2'}>
                {options.map(option => {
                    const selected = value === option.value;
                    return (
                        <Pressable
                            key={option.value}
                            onPress={() => onChange(option.value)}
                            className="flex-row items-center px-3 py-2 rounded-xl border border-gray-300 active:bg-gray-50"
                        >
                            <View
                                className={`
                  w-4 h-4 rounded-full mr-2 items-center justify-center 
                  ${selected ? 'border-primary bg-primary' : 'border bg-white'}
                `}
                            >
                                {selected && <IconComp name="Check" size={10} color="#ffffff" />}
                            </View>
                            <Text className="text-md text-gray-300">{option.label}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

export default RadioGroup;
