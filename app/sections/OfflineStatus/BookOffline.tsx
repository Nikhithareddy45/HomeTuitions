'use client';

import { BackButton } from '@/components/ui/BackButton';
import Button from '@/components/ui/Button';
import GenericMultiSelect from '@/components/ui/GenericMultiSelect';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import TimePicker from '@/components/ui/TimePicker';
import { board_options as BOARD_OPTIONS, class_options as CLASS_OPTIONS, language_options as LANGUAGE_OPTIONS, section_options as SECTION_OPTIONS, subject_options as SUBJECT_OPTIONS } from '@/constants/constants';
import { useRefreshStore } from '@/hooks/useRefreshStore';
import { sendEnquiryAPI } from '@/services/enquiry';
import { getCurrentUser } from '@/utils/getUserFromStorage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, View } from 'react-native';

interface FormData {
  username: string;
  email: string;
  mobile_number: string;
  home_address: string;
  board: string[];
  classes: string[];
  subjects: string[];
  teaching_language: string;
  teaching_section: string;
  teaching_starttime: string;
  teaching_endtime: string;
  minimum_price: string;
  maximum_price: string;
  message: string;
  [key: string]: any;
}

const initialFormData: FormData = {
  username: '',
  email: '',
  mobile_number: '',
  home_address: '',
  board: [],
  classes: [],
  subjects: [],
  teaching_language: '',
  teaching_section: '',
  teaching_starttime: '',
  teaching_endtime: '',
  minimum_price: '',
  maximum_price: '',
  message: ''
};

const BookOffline = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string | string[]>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { refreshToken, triggerRefresh } = useRefreshStore();
  const [isLoading, setIsLoading] = useState(true);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.mobile_number) {
      newErrors.mobile_number = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = 'Invalid mobile number';
    }
    if (!formData.home_address) newErrors.home_address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string | string[]> = {};
    if (formData.board.length === 0) newErrors.board = 'Please select at least one board';
    if (formData.classes.length === 0) newErrors.classes = 'Please select at least one class';
    if (formData.subjects.length === 0) newErrors.subjects = 'Please select at least one subject';
    if (!formData.teaching_language) newErrors.teaching_language = 'Please select teaching language';
    if (!formData.teaching_section) newErrors.teaching_section = 'Please select teaching section';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setCurrentStep(1);
    setSubmitError(null);
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setFormData(prev => ({
          ...prev,
          username: currentUser.username || '',
          email: currentUser.email || '',
          mobile_number: currentUser.mobile_number || '',
          home_address: currentUser.home_address?.formatted_address || ''
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData, refreshToken]);

 const handleSubmit = async () => {
  try {
    setIsSubmitting(true);
    setSubmitError(null);
    const enquiryData = {
      username: formData.username,
      email: formData.email,
      mobile_number: formData.mobile_number,
      home_address: formData.home_address,

      board: formData.board,
      classes: formData.classes,
      subjects: formData.subjects,

      teaching_language: formData.teaching_language,
      teaching_section: formData.teaching_section,
      teaching_starttime: formData.teaching_starttime,
      teaching_endtime: formData.teaching_endtime,

      minimum_price: formData.minimum_price,
      maximum_price: formData.maximum_price,
      message: formData.message,
    };

    const response = await sendEnquiryAPI(enquiryData);

    triggerRefresh();
    Alert.alert(
      'Success',
      'Your enquiry has been submitted successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            router.push('/(tabs)/student/enquiry');
          },
        },
      ]
    );
  } catch (error) {
    console.error('Enquiry submission error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';
    setSubmitError(errorMessage);
    Alert.alert('Error', errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};


  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleMultiSelect = (field: string, values: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const renderStep1 = () => (
    <View className="space-y-4">
      <Text className="text-lg font-semibold mb-4">Personal Information</Text>

      <Input
        label="Username"
        value={formData.username}
        onChangeText={(text: string) => handleInputChange('username', text)}
        placeholder="Enter your name"
        error={errors.username as string}
        iconName='User'
      />

      <Input
        label="Email Address"
        value={formData.email}
        onChangeText={(text: string) => handleInputChange('email', text)}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        iconName='Mail'
        error={errors.email as string}
      />

      <Input
        label="Mobile Number"
        value={formData.mobile_number}
        onChangeText={(text: string) => handleInputChange('mobile_number', text)}
        placeholder="Enter your mobile number"
        keyboardType="phone-pad"
        maxLength={10}
        error={errors.mobile_number as string}
        iconName='Phone'
      />

      <Textarea
        label="Home Address"
        value={formData.home_address}
        onChangeText={(text: string) => handleInputChange('home_address', text)}
        placeholder="Enter your full home_address"
        error={errors.home_address as string}
        iconName="Home"
        className="mb-4"
      />
    </View>
  );

  const renderStep2 = () => (
    <View className="space-y-1 gap-2">
      <Text className="text-lg font-semibold mb-1">Requirements</Text>

      <View>
        <GenericMultiSelect
          iconName="School"
          label="Board"
          placeholder="Select board"
          options={BOARD_OPTIONS.map((o: any) => o.label)}
          value={formData.board}
          onChange={(values) => handleMultiSelect('board', values)}
          open={openDropdown === 'board'}
          onOpenChange={(open) => setOpenDropdown(open ? 'board' : null)}
        />
        {errors.board && (
          <Text className="text-red-500 text-xs -mt-1 mb-1">{errors.board}</Text>
        )}
      </View>

      <View>
        <GenericMultiSelect
          iconName="BookOpen"
          label="Classes"
          placeholder="Select classes"
          options={CLASS_OPTIONS.map((o: any) => o.label)}
          value={formData.classes}
          onChange={(values) => handleMultiSelect('classes', values)}
          open={openDropdown === 'classes'}
          onOpenChange={(open) => setOpenDropdown(open ? 'classes' : null)}
        />
        {errors.classes && (
          <Text className="text-red-500 text-xs -mt-1 mb-1">{errors.classes}</Text>
        )}
      </View>

      <View>
        <GenericMultiSelect
          iconName="BookOpenText"
          label="Subjects"
          placeholder="Select subjects"
          options={SUBJECT_OPTIONS.map((o: any) => o.label)}
          value={formData.subjects}
          onChange={(values) => handleMultiSelect('subjects', values)}
          open={openDropdown === 'subjects'}
          onOpenChange={(open) => setOpenDropdown(open ? 'subjects' : null)}
        />
        {errors.subjects && (
          <Text className="text-red-500 text-xs -mt-1 mb-1">{errors.subjects}</Text>
        )}
      </View>

      <View>
        <GenericMultiSelect
          iconName="Languages"
          label="Teaching Language"
          placeholder="Select language"
          options={LANGUAGE_OPTIONS.map((o: any) => o.label)}
          value={formData.teaching_language ? [formData.teaching_language] : []}
          onChange={(values) => handleInputChange('teaching_language', values[0])}
          open={openDropdown === 'language'}
          onOpenChange={(open) => setOpenDropdown(open ? 'language' : null)}
        />
        {errors.teaching_language && (
          <Text className="text-red-500 text-xs -mt-1 mb-1">{errors.teaching_language}</Text>
        )}
      </View>

      <View>
        <GenericMultiSelect
          iconName="LayoutGrid"
          label="Available Section"
          placeholder="Select section"
          options={SECTION_OPTIONS.map((o: any) => o.label)}
          value={formData.teaching_section ? [formData.teaching_section] : []}
          onChange={(values) => handleInputChange('teaching_section', values[0])}
          open={openDropdown === 'section'}
          onOpenChange={(open) => setOpenDropdown(open ? 'section' : null)}
        />
        {errors.teaching_section && (
          <Text className="text-red-500 text-xs -mt-1">{errors.teaching_section}</Text>
        )}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="space-y-4">
      <Text className="text-lg font-semibold mb-4">Schedule & Budget</Text>

      <View className="flex-row space-x-4">
        <View className="flex-1">
          <TimePicker
            label="Start Time"
            value={formData.teaching_starttime}
            onChange={(time: string) => handleInputChange('teaching_starttime', time)}
          />
        </View>
        <View className="flex-1">
          <TimePicker
            label="End Time"
            value={formData.teaching_endtime}
            onChange={(time: string) => handleInputChange('teaching_endtime', time)}
          />
        </View>
      </View>

      <View className="flex-row space-x-4 gap-2">
        <View className="flex-1">
          <Input
            label="Minimum Price"
            value={formData.minimum_price}
            onChangeText={(text: string) => handleInputChange('minimum_price', text.replace(/[^0-9]/g, ''))}
            placeholder="Min"
            keyboardType="numeric"
            iconName="IndianRupee"
          />
        </View>
        <View className="flex-1">
          <Input
            label="Maximum Price"
            value={formData.maximum_price}
            onChangeText={(text: string) => handleInputChange('maximum_price', text.replace(/[^0-9]/g, ''))}
            placeholder="Max"
            keyboardType="numeric"
            iconName="IndianRupee"
          />
        </View>
      </View>

      <Textarea
        label="Additional Message"
        value={formData.message}
        onChangeText={(text: string) => handleInputChange('message', text)}
        placeholder="Any additional requirements or notes"
        iconName="MessageCircle"
        className="mb-4"
      />
    </View>
  );

  const renderStepIndicator = () => (
    <View className="flex-row justify-between mb-6">
      {[1, 2, 3].map((step) => (
        <View key={step} className="items-center">
          <View
            className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === step ? 'bg-blue-500' : 'bg-gray-200'
              }`}
          >
            <Text
              className={`font-medium ${currentStep === step ? 'text-white' : 'text-gray-600'
                }`}
            >
              {step}
            </Text>
          </View>
          <Text className="text-xs mt-1">
            {step === 1 ? 'Personal' : step === 2 ? 'Requirements' : 'Schedule'}
          </Text>
        </View>
      ))}
      <View className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
    </View>
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    Alert.alert(
      'Reset Form',
      'Are you sure you want to reset the form? All your changes will be lost.',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setRefreshing(false) },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetForm();
            loadUserData().finally(() => setRefreshing(false));
          }
        }
      ]
    );
  }, [loadUserData, resetForm]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Loading form data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#2563eb']}
          tintColor='#2563eb'
        />
      }
    >
      <View className='p-6'>
        <BackButton />
      </View>
      <View className="px-12">
        <Text className="text-2xl font-bold mb-2">Book Offline Tuition</Text>
        <Text className="text-gray-600 mb-6">Fill in the details to find the best tutor for you</Text>

        {renderStepIndicator()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <View className="flex-row justify-between mt-6">

          <View className="flex-row space-x-2 items-center justify-center w-full">
            {currentStep > 1 && (
              <Button
                title="Back"
                onPress={prevStep}
                outline={true}
                className="w-[40%]"
                icon="arrow-left"  // Changed from "ArrowLeft"
              />

            )}
            <Button
              title={currentStep === 3 ? 'Submit' : 'Next'}
              onPress={nextStep}
              loading={isSubmitting}
              className="w-[40%]"
              icon={currentStep === 3 ? 'send' : 'arrow-right'}  // Changed from 'Send'/'ArrowRight'
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default BookOffline;