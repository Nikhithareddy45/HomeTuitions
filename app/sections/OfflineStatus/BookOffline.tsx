'use client';

import { BackButton } from '@/components/ui/BackButton';
import Button from '@/components/ui/Button';
import GenericMultiSelect from '@/components/ui/GenericMultiSelect';
import Input from '@/components/ui/Input';
import TimePicker from '@/components/ui/TimePicker';
import { board_options as BOARD_OPTIONS, class_options as CLASS_OPTIONS, language_options as LANGUAGE_OPTIONS, section_options as SECTION_OPTIONS, subject_options as SUBJECT_OPTIONS } from '@/constants/constants';
import { sendEnquiryAPI } from '@/services/enquiry';
import { useRefreshStore } from '@/store/useRefreshStore';
import { getCurrentUser } from '@/utils/getUserFromStorage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, View } from 'react-native';
import Textarea from '@/components/ui/Textarea';

interface FormData {
  username: string;
  email: string;
  mobileNumber: string;
  address: string;
  boards: string[];
  classes: string[];
  subjects: string[];
  teachingLanguage: string;
  teachingSection: string;
  startTime: string;
  endTime: string;
  minPrice: string;
  maxPrice: string;
  additionalMessage: string;
  [key: string]: any;
}

const initialFormData: FormData = {
  username: '',
  email: '',
  mobileNumber: '',
  address: '',
  boards: [],
  classes: [],
  subjects: [],
  teachingLanguage: '',
  teachingSection: '',
  startTime: '',
  endTime: '',
  minPrice: '',
  maxPrice: '',
  additionalMessage: ''
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
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number';
    }
    if (!formData.address) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string | string[]> = {};
    if (formData.boards.length === 0) newErrors.boards = 'Please select at least one board';
    if (formData.classes.length === 0) newErrors.classes = 'Please select at least one class';
    if (formData.subjects.length === 0) newErrors.subjects = 'Please select at least one subject';
    if (!formData.teachingLanguage) newErrors.teachingLanguage = 'Please select teaching language';
    if (!formData.teachingSection) newErrors.teachingSection = 'Please select teaching section';

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
          mobileNumber: currentUser.mobile_number || '',
          address: currentUser.address?.formatted_address || ''
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

      const response = await sendEnquiryAPI(formData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit enquiry. Please try again.');
      }
      if (response.ok) {
        // Trigger refresh in parent components
        triggerRefresh();

        // Show success message before redirecting
        Alert.alert(
          'Success',
          'Your enquiry has been submitted successfully!',
          [{
            text: 'OK',
            onPress: () => {
              resetForm();
              router.push("/(tabs)/student/enquiry");
            }
          }]
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Enquiry submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
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

    // Only update errors if the field has an error
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
      />

      <Input
        label="Email Address"
        value={formData.email}
        onChangeText={(text: string) => handleInputChange('email', text)}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email as string}
      />

      <Input
        label="Mobile Number"
        value={formData.mobileNumber}
        onChangeText={(text: string) => handleInputChange('mobileNumber', text)}
        placeholder="Enter your mobile number"
        keyboardType="phone-pad"
        maxLength={10}
        error={errors.mobileNumber as string}
      />

      <Textarea
        label="Home Address"
        value={formData.address}
        onChangeText={(text: string) => handleInputChange('address', text)}
        placeholder="Enter your full address"
        error={errors.address as string}
        iconName="Home"
        className="mb-4"
      />
    </View>
  );

  const renderStep2 = () => (
    <View className="space-y-4">
      <Text className="text-lg font-semibold mb-4">Requirements</Text>

      <View>
        <Text className="text-sm font-medium mb-1">Board (Select multiple)</Text>
        <GenericMultiSelect
          iconName="School"
          label="Board"
          placeholder="Select board"
          options={BOARD_OPTIONS.map((o: any) => o.label)}
          value={formData.boards}
          onChange={(values) => handleMultiSelect('boards', values)}
          open={openDropdown === 'boards'}
          onOpenChange={(open) => setOpenDropdown(open ? 'boards' : null)}
        />
        {errors.boards && (
          <Text className="text-red-500 text-xs mt-1">{errors.boards}</Text>
        )}
      </View>

      <View>
        <Text className="text-sm font-medium mb-1">Classes (Select multiple)</Text>
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
          <Text className="text-red-500 text-xs mt-1">{errors.classes}</Text>
        )}
      </View>

      <View>
        <Text className="text-sm font-medium mb-1">Subjects (Select multiple)</Text>
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
          <Text className="text-red-500 text-xs mt-1">{errors.subjects}</Text>
        )}
      </View>

      <View>
        <Text className="text-sm font-medium mb-1">Teaching Language</Text>
        <GenericMultiSelect
          iconName="Languages"
          label="Language"
          placeholder="Select language"
          options={LANGUAGE_OPTIONS.map((o: any) => o.label)}
          value={formData.teachingLanguage ? [formData.teachingLanguage] : []}
          onChange={(values) => handleInputChange('teachingLanguage', values[0] || '')}
          open={openDropdown === 'language'}
          onOpenChange={(open) => setOpenDropdown(open ? 'language' : null)}
        />
        {errors.teachingLanguage && (
          <Text className="text-red-500 text-xs mt-1">{errors.teachingLanguage}</Text>
        )}
      </View>

      <View>
        <Text className="text-sm font-medium mb-1">Teaching Section</Text>
        <GenericMultiSelect
          iconName="LayoutGrid"
          label="Section"
          placeholder="Select section"
          options={SECTION_OPTIONS.map((o: any) => o.label)}
          value={formData.teachingSection ? [formData.teachingSection] : []}
          onChange={(values) => handleInputChange('teachingSection', values[0] || '')}
          open={openDropdown === 'section'}
          onOpenChange={(open) => setOpenDropdown(open ? 'section' : null)}
        />
        {errors.teachingSection && (
          <Text className="text-red-500 text-xs mt-1">{errors.teachingSection}</Text>
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
            value={formData.startTime}
            onChange={(time: string) => handleInputChange('startTime', time)}
          />
        </View>
        <View className="flex-1">
          <TimePicker
            label="End Time"
            value={formData.endTime}
            onChange={(time: string) => handleInputChange('endTime', time)}
          />
        </View>
      </View>

      <View className="flex-row space-x-4">
        <View className="flex-1">
          <Input
            label="Minimum Price"
            value={formData.minPrice}
            onChangeText={(text: string) => handleInputChange('minPrice', text.replace(/[^0-9]/g, ''))}
            placeholder="Min"
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <Input
            label="Maximum Price"
            value={formData.maxPrice}
            onChangeText={(text: string) => handleInputChange('maxPrice', text.replace(/[^0-9]/g, ''))}
            placeholder="Max"
            keyboardType="numeric"
          />
        </View>
      </View>

      <Textarea
        label="Additional Message"
        value={formData.additionalMessage}
        onChangeText={(text: string) => handleInputChange('additionalMessage', text)}
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
    loadUserData().finally(() => setRefreshing(false));
  }, [loadUserData]);

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
            <Button
              title="Reset"
              onPress={() => {
                Alert.alert(
                  'Reset Form',
                  'Are you sure you want to reset the form? All your changes will be lost.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Reset',
                      style: 'destructive',
                      onPress: () => {
                        resetForm();
                        setCurrentStep(1);
                      }
                    }
                  ]
                );
              }}
              outline={true}
              className="w-[40%]"
            />
            <Button
              title={currentStep === 3 ? 'Submit Enquiry' : 'Next'}
              onPress={nextStep}
              loading={isSubmitting}
              className="w-[40%]"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default BookOffline;