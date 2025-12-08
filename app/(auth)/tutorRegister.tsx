import AddressForm from '@/components/AddressComp';
import { BackButton } from '@/components/ui/BackButton';
import Button from '@/components/ui/Button';
import GenericMultiSelect from '@/components/ui/GenericMultiSelect';
import Input from '@/components/ui/Input';
import RadioGroup from '@/components/ui/RadioGroup';
import Textarea from '@/components/ui/Textarea';
import TimePicker from '@/components/ui/TimePicker';
import { board_options, class_options, gender_options, section_options, subject_options } from '@/constants/constants';
import { registerTutor } from '@/services/auth';
import { useFormReset } from '@/utils/useFormReset';
import {
  aboutValidation,
  boardValidation,
  classesValidation,
  confirmPasswordValidation,
  educationQualificationValidation,
  emailValidation,
  experienceValidation,
  genderValidation,
  languageValidation,
  mobileNumberValidation,
  passwordValidation,
  priceValidation,
  subjectsValidation,
  tutorRegistrationSchema,
  usernameValidation
} from '@/utils/validationYup';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View
} from 'react-native';

const TutorRegister: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    username: 'tutor',
    email: 'tutor@gmail.com',
    mobile_number: '9876543210',
    password: '',
    confirm_password: '',
    gender: '',
    language: 'English',
    image: null as File | null,

    subjects: [] as string[],
    classes: [] as string[],
    board: [] as string[],

    education_qualification: '',
    experience: '3',
    price: '300',
    availabilities: [] as { section: string; start_time: string; end_time: string }[],
    about: 'Well experienced tutor',

    address: {
      street: '',
      city: '',
      state: '',
      pin_code: '',
      country: '',
    },
  });

  // for GenericMultiSelect options (labels only)
  const [subjectOptions, setSubjectOptions] = useState(subject_options.map(o => o.label));
  const [classOptions, setClassOptions] = useState(class_options.map(o => o.label));
  const [boardOptions, setBoardOptions] = useState(board_options.map(o => o.label));
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const resetForm = () => {
    setFormData({
      username: 'tutor',
      email: 'tutor@gmail.com',
      mobile_number: '9876543210',
      password: '123456',
      confirm_password: '123456',
      gender: 'Male',
      language: 'English',
      image: null,
      subjects: [],
      classes: [],
      board: [],
      education_qualification: '',
      experience: '3',
      price: '300',
      availabilities: [
        { section: "Morning", start_time: "09:00:00", end_time: "11:00:00" },
        { section: "Evening", start_time: "16:00:00", end_time: "18:00:00" },
      ],
      about: 'Well experienced tutor',
      address: {
        street: '',
        city: '',
        state: '',
        pin_code: '',
        country: '',
      },
    });
    setErrors({});
    setSelectedLocation(null);
    setStep(1);
  };

  useFormReset(resetForm);

  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    console.log("picker")
   };
  const addAvailability = () => {
    setFormData(prev => ({
      ...prev,
      availabilities: [...prev.availabilities, { section: '', start_time: '', end_time: '' }],
    }));
  };

  const updateAvailability = (index: number, key: 'section' | 'startTime' | 'endTime', value: string) => {
    setFormData(prev => {
      const arr = [...prev.availabilities];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, availabilities: arr };
    });
  };

  const removeAvailability = (index: number) => {
    setFormData(prev => {
      const arr = [...prev.availabilities];
      arr.splice(index, 1);
      return { ...prev, availabilities: arr };
    });
  };


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        mobile_number: formData.mobile_number,
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        pin_code: formData.address.pin_code,
        country: formData.address.country,
        subjects: formData.subjects,
        board: formData.board,
        classes: formData.classes,
        education_qualification: formData.education_qualification,
        certificates: '',
        price: Number(formData.price || 0),
        experience: Number(formData.experience || 0),
        image: formData.image, // Only send File object if available
        availabilities: formData.availabilities.map(slot => ({
          section: slot.section,
          start_time: slot.start_time,
          end_time: slot.end_time,
        })),
        about: formData.about,
        gender: formData.gender,
        language: formData.language,
      };

      // Validate entire form using schema
      try {
        await tutorRegistrationSchema.validate(payload, { abortEarly: false });
      } catch (validationErr: any) {
        const newErrors: Record<string, string> = {};
        if (validationErr.inner && validationErr.inner.length > 0) {
          validationErr.inner.forEach((err: any) => {
            if (err.path) {
              newErrors[err.path] = err.message;
            }
          });
        }
        setErrors(newErrors);
        const errorMessages = Object.entries(newErrors)
          .map(([field, message]) => `❌ ${message}`)
          .join('\n');
        Alert.alert(
          '⚠️ Validation Errors',
          `\n${errorMessages}\n\nPlease fix all errors before submitting.`,
          [{ text: 'OK', onPress: () => { } }],
        );
        setLoading(false);
        return;
      }

      const response = await registerTutor(payload as any);
      console.log('Tutor register response', response);

      Alert.alert('Success', 'Tutor registered successfully');

      setFormData({
        username: 'tutor',
        email: 'tutor@gmail.com',
        mobile_number: '9876543210',
        password: '123456',
        confirm_password: '123456',
        gender: 'Male',
        language: 'English',
        image: null,
        subjects: [],
        classes: [],
        board: [],
        education_qualification: '',
        experience: '3',
        price: '300',
        availabilities: [],
        about: 'Well experienced tutor',
        address: {
          street: '',
          city: '',
          state: '',
          pin_code: '',
          country: '',
        },
      });
      setErrors({});
      setSelectedLocation(null);
      setStep(1);
    } catch (err: any) {
      console.log('Register tutor error', err?.response?.data || err);
      const errorData = err?.response?.data;
      if (errorData && typeof errorData === 'object') {
        const fieldErrors: Record<string, string> = {};
        Object.entries(errorData).forEach(([field, val]) => {
          const msg = Array.isArray(val) ? val.join(' ') : String(val);
          fieldErrors[field] = msg;
        });
        const errorMessages = Object.entries(fieldErrors)
          .map(([field, msg]) => `❌ ${msg}`)
          .join('\n');
        Alert.alert('Registration Error', `\n${errorMessages}`);
      } else {
        Alert.alert(
          'Error',
          err?.response?.data?.message || err.message || 'Registration failed',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const goNextFromStep1 = async () => {
    setStep(2);
  };

  const goNextFromStep2 = async () => {
    setStep(3);
  };

  const goPrev = () => setStep(prev => (prev === 1 ? 1 : (prev - 1) as 1 | 2 | 3));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 70}
      className="flex-1 w-[90%] mx-auto"
    >
      <BackButton />
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingTop: 3 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-primary text-center mb-2">
            Tutor Registration
          </Text>
          <Text className="text-lg text-gray-600 text-center">
            {step === 1
              ? 'Personal Information'
              : step === 2
                ? 'Teaching Details'
                : 'Address Information'}
          </Text>
        </View>

        {/* step indicator */}
        <View className="flex-row justify-center mb-8">
          <View className="flex-row items-center">
            {[1, 2, 3].map(n => (
              <React.Fragment key={n}>
                {n > 1 && <View className="w-6 h-1 bg-gray-300 mx-1" />}
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${step === n ? 'bg-primary' : 'bg-gray-300'
                    }`}
                >
                  <Text className="text-white font-bold">{n}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* STEP 1 */}
        {step === 1 && (
          <View className="gap-3">
            <Input
              label="Username"
              iconName="User"
              value={formData.username}
              onChangeText={text => handleChange('username', text)}
              placeholder="Enter your username"
              error={errors.username}
            />
            <Input
              label="Email Address"
              iconName="Mail"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
              placeholder="your.email@example.com"
              error={errors.email}
            />
            <Input
              label="Mobile Number"
              iconName="Phone"
              keyboardType="phone-pad"
              value={formData.mobile_number}
              onChangeText={text => handleChange('mobile_number', text)}
              placeholder="Enter mobile number"
              error={errors.mobile_number}
            />
            <Input
              label="Password"
              iconName="Lock"
              secureTextEntry
              value={formData.password}
              onChangeText={text => handleChange('password', text)}
              placeholder="Enter password"
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              iconName="Lock"
              secureTextEntry
              value={formData.confirm_password}
              onChangeText={text => handleChange('confirm_password', text)}
              placeholder="Confirm password"
              error={errors.confirm_password}
            />

            <RadioGroup
              iconName="Venus"
              label="Gender"
              options={gender_options}
              value={formData.gender || null}
              onChange={val => handleChange('gender', val)}
              direction="row"
            />
            {errors.gender && (
              <Text className="text-xs text-red-500 mt-1">{errors.gender}</Text>
            )}

            <Input
              label="Language"
              iconName="Globe"
              value={formData.language}
              onChangeText={text => handleChange('language', text)}
              placeholder="e.g., English, Hindi"
              error={errors.language}
            />

            {/* Profile Image Picker */}
            <View className="w-[90%] mx-auto">
              <Text className="mb-2 text-sm font-medium text-primary">
                Profile Image
              </Text>
              <Pressable
                onPress={pickImage}
                className="w-full items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-8"
              >
                <View className="items-center flex-row justify-center gap-2">
                  <Text className="text-2xl">📷</Text>
                  <Text className="mt-2 text-sm font-medium text-gray-600">
                    Tap to pick image
                  </Text>
                </View>
              </Pressable>
            </View>

            <Button
              title="Next"
              onPress={goNextFromStep1}
              icon="arrow-right"
              className="mt-4"
            />
          </View>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <View className="gap-4">
            <GenericMultiSelect
              iconName='LibraryBig'
              label="Subjects"
              placeholder="Select subjects"
              options={subjectOptions}
              value={formData.subjects}
              onChange={vals => handleChange('subjects', vals)}
              onOptionsChange={setSubjectOptions}

              open={openDropdown === "subjects"}
              onOpenChange={(open) => setOpenDropdown(open ? "subjects" : null)}
            />
            {errors.subjects && (
              <Text className="text-xs text-red-500 mt-1">{errors.subjects}</Text>
            )}


            <GenericMultiSelect
              iconName='School'
              label="Board"
              placeholder="Select board"
              options={boardOptions}
              value={formData.board}
              onChange={vals => handleChange('board', vals)}
              onOptionsChange={setBoardOptions}

              open={openDropdown === "board"}
              onOpenChange={(open) => setOpenDropdown(open ? "board" : null)}
            />
            {errors.board && (
              <Text className="text-xs text-red-500 mt-1">{errors.board}</Text>
            )}


            <GenericMultiSelect
              iconName='Presentation'
              label="Classes"
              placeholder="Select classes"
              options={classOptions}
              value={formData.classes}
              onChange={vals => handleChange('classes', vals)}
              onOptionsChange={setClassOptions}

              open={openDropdown === "classes"}
              onOpenChange={(open) => setOpenDropdown(open ? "classes" : null)}
            />
            {errors.classes && (
              <Text className="text-xs text-red-500 mt-1">{errors.classes}</Text>
            )}


            <Input
              label="Education Qualification"
              iconName="Book"
              value={formData.education_qualification}
              onChangeText={text => handleChange('education_qualification', text)}
              placeholder="e.g., B.Sc, M.Sc, B.Ed"
              error={errors.education_qualification}
            />

            <Input
              label="Experience (in years)"
              iconName="Briefcase"
              keyboardType="numeric"
              value={formData.experience}
              onChangeText={text => handleChange('experience', text)}
              placeholder="e.g., 3"
              error={errors.experience}
            />

            <Input
              label="Price per Hour"
              iconName="DollarSign"
              keyboardType="numeric"
              value={formData.price}
              onChangeText={text => handleChange('price', text)}
              placeholder="e.g., 500"
              error={errors.price}
            />

            {/* Availabilities */}
            <View className='flex-col'>
              <Text className="mb-3 text-lg font-semibold text-slate-900">
                Availabilities
              </Text>
              {formData.availabilities.map((slot, idx) => (
                <View
                  key={idx}
                  className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200"
                >
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-sm font-semibold text-slate-700">
                      Slot {idx + 1}
                    </Text>
                    <Pressable
                      onPress={() => removeAvailability(idx)}
                      className="p-2 rounded-lg active:bg-red-100"
                    >
                      <Text className="text-red-500 font-semibold">Remove</Text>
                    </Pressable>
                  </View>

                  <GenericMultiSelect
                    label="Section"
                    placeholder="Select section"
                    options={section_options.map(o => o.label)}
                    value={slot.section ? [slot.section] : []}
                    onChange={vals => updateAvailability(idx, 'section', vals[0] || '')}

                    open={openDropdown === `section-${idx}`}
                    onOpenChange={(open) =>
                      setOpenDropdown(open ? `section-${idx}` : null)
                    }
                  />


                  <TimePicker
                    label="Start Time"
                    iconName="Clock"
                    value={slot.start_time}
                    onChange={time => updateAvailability(idx, 'startTime', time)}
                  />

                  <TimePicker
                    label="End Time"
                    iconName="Clock"
                    value={slot.end_time}
                    onChange={time => updateAvailability(idx, 'endTime', time)}
                  />
                </View>
              ))}
              <Button
                title="+ Add Availability Slot"
                outline
                className="mt-2"
                onPress={addAvailability}
              />
            </View>

            {/* About */}
            <Textarea
              label="About Yourself"
              iconName="FileText"
              rows={4}
              placeholder="Write about your teaching style, experience, and what students can expect..."
              value={formData.about}
              onChangeText={text => handleChange('about', text)}
              error={errors.about}
            />
            <Text className="text-xs text-gray-500 -mt-3 mb-3">
              {formData.about.length}/20 characters minimum
            </Text>

            <View className="flex-row justify-between mt-4">
              <View className="flex-1 mr-3">
                <Button
                  title="Previous"
                  outline
                  onPress={goPrev}
                  icon="arrow-left"
                />
              </View>
              <View className="flex-1 ml-3">
                <Button
                  title="Next"
                  onPress={goNextFromStep2}
                  icon="arrow-right"
                />
              </View>
            </View>
          </View>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <View>
            <AddressForm
              address={formData.address}
              onChange={addr => setFormData(prev => ({ ...prev, address: addr }))}
              selectedLocation={selectedLocation}
              onLocationChange={loc => setSelectedLocation(loc)}
            />

            <View className="flex-row justify-between mt-4">
              <View className="flex-1 mr-3">
                <Button
                  title="Previous"
                  outline
                  onPress={goPrev}
                  icon="arrow-left"
                />
              </View>
              <View className="flex-1 ml-3">
                <Button
                  title="Register"
                  loading={loading}
                  onPress={handleSubmit}
                  icon="check"
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TutorRegister;
