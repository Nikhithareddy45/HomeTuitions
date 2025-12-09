
import { GetAllTutorData } from "@/types/tutor";
import { router } from "expo-router";
import React from "react";
import { Star, GraduationCap, BookCopy, Clock7 } from 'lucide-react-native';
import { Image, View, Text } from "react-native";
import Button from "../ui/Button";
const TutorCard = ({ tutor }: { tutor: GetAllTutorData }) => {
    const address = tutor.user.address;
    const iconSize = 16;

    return (
        <View className="bg-tranparent border-2 border-gray-100 drop-shadow-lg mx-auto rounded-xl p-5 my-3 w-[95%] gap-1">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center" style={{ flex: 1, minWidth: 0 }}>
                    <Image
                        source={
                            tutor.image
                                ? { uri: tutor.image }
                                : require('@/assets/images/tutor-profile-default.jpg')
                        }
                        className="w-14 h-14 rounded-full mr-3"
                    />
                    <View style={{ flex: 1, minWidth: 0 }}>
                        <Text className="text-xl text-gray-900 font-bold">
                            {tutor.user.username}
                        </Text>
                        <Text
                            className="text-sm font-regular text-gray-900"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {address
                                ? `${address.street}, ${address.city}, ${address.state}`
                                : 'No address available'}
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center ml-2">
                    <Star />
                </View>
            </View>

            <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{ lineHeight: 14, fontSize: 10 }}
                className="text-sm font-regular text-gray-900"
            >
                {tutor.about ?? ' '}
            </Text>

            <View className="flex-row items-center gap-2">
                <GraduationCap size={iconSize} />
                <Text className="text-sm font-medium text-gray-700 mb-1">
                    {tutor.experience != null
                        ? `${tutor.experience} years experience`
                        : 'Experience not specified'}
                </Text>
            </View>

            <View className="flex-row items-center gap-2">
                <BookCopy size={iconSize} />
                <Text className="font-medium text-sm text-gray-700 mb-1">
                    {`${tutor.subjects.join(', ')} (Classes: ${tutor.classes.join(', ')})`}
                </Text>
            </View>

            <View className="flex-row items-center gap-2">
                <Clock7 size={iconSize} />
                <Text className="text-md font-bol mb-1">
                    {tutor.price != null ? `${tutor.price}/hr` : 'Price not set'}
                </Text>
            </View>

            <View className="flex-row justify-between mt-1 gap-3 w-full overflow-hidden">
                <Button
                    onPress={() => router.push('/')}
                    title="Book Demo"
                    className="bg-primary w-[44%]"
                />
                <Button
                    outline
                    onPress={() =>
                        router.push({
                            pathname: '/',
                            params: { tutorId: String(tutor.id) },
                        })
                    }
                    title="See Profile"
                    className="border border-primary w-[44%]"
                />
            </View>
        </View>
    );
};


export default TutorCard;