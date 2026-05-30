import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/slices/profileSlice';
import { toast } from 'react-toastify';
import StepIndicator from '../components/common/StepIndicator';
import ProgressBar from '../components/common/ProgressBar';
import BasicInfoForm from '../features/profile/BasicInfoForm';
import AcademicRecordsForm from '../features/profile/AcademicRecordsForm';
import InterestsForm from '../features/profile/InterestsForm';
import CareerGoalsForm from '../features/profile/CareerGoalsForm';
import StrengthsWeaknessesForm from '../features/profile/StrengthsWeaknessesForm';
import SkillsForm from '../features/profile/SkillsForm';
import CertificationsForm from '../features/profile/CertificationsForm';
import Spinner from '../components/common/Spinner';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const STEPS = [
  { label: 'Basic Info' },
  { label: 'Academics' },
  { label: 'Interests' },
  { label: 'Goals' },
  { label: 'Strengths' },
  { label: 'Skills' },
  { label: 'Certs' },
];

const OPTIONAL_STEPS = [3, 4, 6, 7];

const ProfileWizard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.profile);

  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    basicInfo: {},
    academicRecords: [],
    interests: [],
    careerGoals: [],
    strengthsWeaknesses: { strengths: [], weaknesses: [] },
    skills: [],
    certifications: [],
  });

  const updateStepData = useCallback((step, data) => {
    setWizardData((prev) => {
      const keys = {
        1: 'basicInfo',
        2: 'academicRecords',
        3: 'interests',
        4: 'careerGoals',
        5: 'strengthsWeaknesses',
        6: 'skills',
        7: 'certifications',
      };
      return { ...prev, [keys[step]]: data };
    });
  }, []);

  const calculateCompletion = () => {
    let filled = 0;
    const total = 7;

    if (wizardData.basicInfo.dateOfBirth || wizardData.basicInfo.gender) filled++;
    if (wizardData.academicRecords.length && wizardData.academicRecords[0]?.institution) filled++;
    if (wizardData.interests.length && wizardData.interests[0]?.name) filled++;
    if (wizardData.careerGoals.length && wizardData.careerGoals[0]?.title) filled++;
    if (
      wizardData.strengthsWeaknesses.strengths.length > 0 ||
      wizardData.strengthsWeaknesses.weaknesses.length > 0
    )
      filled++;
    if (wizardData.skills.length && wizardData.skills[0]?.name) filled++;
    if (wizardData.certifications.length && wizardData.certifications[0]?.name) filled++;

    return Math.round((filled / total) * 100);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    if (OPTIONAL_STEPS.includes(currentStep) && currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleComplete = async () => {
    try {
      await dispatch(updateProfile(wizardData)).unwrap();
      toast.success('Profile completed! Welcome to EduGuide AI.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err);
    }
  };

  const renderStep = () => {
    const stepProps = {
      onChange: (data) => updateStepData(currentStep, data),
    };

    switch (currentStep) {
      case 1:
        return <BasicInfoForm data={wizardData.basicInfo} {...stepProps} />;
      case 2:
        return <AcademicRecordsForm data={wizardData.academicRecords} {...stepProps} />;
      case 3:
        return <InterestsForm data={wizardData.interests} {...stepProps} />;
      case 4:
        return <CareerGoalsForm data={wizardData.careerGoals} {...stepProps} />;
      case 5:
        return <StrengthsWeaknessesForm data={wizardData.strengthsWeaknesses} {...stepProps} />;
      case 6:
        return <SkillsForm data={wizardData.skills} {...stepProps} />;
      case 7:
        return <CertificationsForm data={wizardData.certifications} {...stepProps} />;
      default:
        return null;
    }
  };

  const completionPct = calculateCompletion();

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Step {currentStep} of {STEPS.length}
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Build Your Profile</h1>
          <p className="text-gray-400">
            Complete your profile to unlock personalized career guidance.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <ProgressBar percentage={completionPct} label="Profile Completion" size="md" />
        </div>

        {/* Step Indicator */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={(step) => {
              if (step <= currentStep || OPTIONAL_STEPS.includes(step)) {
                setCurrentStep(step);
              }
            }}
          />
        </div>

        {/* Form Card */}
        <div
          className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass overflow-hidden animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="p-6 md:p-8">
            {renderStep()}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div
          className="flex items-center justify-between mt-6 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 font-medium text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {OPTIONAL_STEPS.includes(currentStep) && currentStep < STEPS.length && (
              <button
                type="button"
                onClick={handleSkip}
                className="px-5 py-2.5 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all duration-200 font-medium text-sm"
              >
                Skip
              </button>
            )}

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:from-primary-600 hover:to-secondary-600 active:scale-[0.98] transition-all duration-200 text-sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Complete Profile
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Skip to Dashboard */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-400 transition-colors group"
          >
            I&apos;ll do this later
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileWizard;
