import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, Plus, Trash2, Edit2, BookOpen, Briefcase, Award, 
  MapPin, Calendar, Trash, Check, Sparkles, X, Globe, Save, HelpCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Modal from '../components/common/Modal';
import { 
  fetchProfile, updateProfile, 
  addAcademicRecord, deleteAcademicRecord,
  addInterest, removeInterest,
  addCareerGoal, removeCareerGoal, updateCareerGoal,
  addStrength, removeStrength,
  addWeakness, removeWeakness,
  addSkill, removeSkill, searchSkills,
  addCertification, removeCertification
} from '../store/slices/profileSlice';
import { setUser } from '../store/slices/authSlice';


const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, academicRecords, interests, careerGoals, strengths, weaknesses, skills, certifications, loading } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);

  // Search skills state
  const [skillQuery, setSkillQuery] = useState('');
  const [searchedSkillsList, setSearchedSkillsList] = useState([]);
  const [searchingSkills, setSearchingSkills] = useState(false);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'basic', 'academic', 'interest', 'goal', 'strength', 'weakness', 'skill', 'cert'
  const [editingItem, setEditingItem] = useState(null);

  // Modal forms states
  const [basicForm, setBasicForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    bio: ''
  });

  const [academicForm, setAcademicForm] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    year: 'FRESHMAN',
    startYear: new Date().getFullYear() - 3,
    endYear: new Date().getFullYear(),
    gpa: '',
    percentage: '',
    isCurrent: false
  });

  const [interestForm, setInterestForm] = useState({
    name: '',
    category: 'Technology',
    level: 5
  });

  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    targetYear: new Date().getFullYear() + 2,
    priority: 5
  });

  const [strengthForm, setStrengthForm] = useState({
    name: '',
    category: 'General',
    evidence: ''
  });

  const [weaknessForm, setWeaknessForm] = useState({
    name: '',
    category: 'General',
    evidence: ''
  });

  const [skillForm, setSkillForm] = useState({
    skillId: '',
    name: '', // for label
    level: 5,
    yearsExp: 1
  });

  const [certForm, setCertForm] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialUrl: ''
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Sync basic info form when profile loaded
  useEffect(() => {
    if (profile) {
      setBasicForm({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        gender: profile.gender || 'OTHER',
        phoneNumber: profile.phoneNumber || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || 'India',
        bio: profile.bio || ''
      });
    }
  }, [profile, user]);

  // Search Skills logic
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (skillQuery.trim().length > 1) {
        setSearchingSkills(true);
        try {
          const res = await dispatch(searchSkills(skillQuery)).unwrap();
          setSearchedSkillsList(res || []);
        } catch (err) {
          toast.error('Error searching skills');
        } finally {
          setSearchingSkills(false);
        }
      } else {
        setSearchedSkillsList([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [skillQuery, dispatch]);

  const handleOpenBasicModal = () => {
    setActiveModal('basic');
  };

  const handleSaveBasicInfo = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile({
        firstName: basicForm.firstName || undefined,
        lastName: basicForm.lastName || undefined,
        dateOfBirth: basicForm.dateOfBirth || undefined,
        gender: basicForm.gender,
        phoneNumber: basicForm.phoneNumber || undefined,
        bio: basicForm.bio || undefined,
        city: basicForm.city || undefined,
        state: basicForm.state || undefined,
        country: basicForm.country || undefined,
        address: basicForm.address || undefined,
      })).unwrap();

      // Sync the user display name in authentication state
      dispatch(setUser({
        ...user,
        firstName: basicForm.firstName,
        lastName: basicForm.lastName
      }));

      toast.success('Basic profile updated!');
      setActiveModal(null);
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to update info');
    }
  };

  const handleAddAcademic = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...academicForm,
        gpa: academicForm.gpa ? parseFloat(academicForm.gpa) : undefined,
        percentage: academicForm.percentage ? parseFloat(academicForm.percentage) : undefined,
        startYear: parseInt(academicForm.startYear),
        endYear: academicForm.endYear ? parseInt(academicForm.endYear) : undefined
      };
      await dispatch(addAcademicRecord(payload)).unwrap();
      toast.success('Academic history added!');
      setActiveModal(null);
      setAcademicForm({
        institution: '', degree: '', fieldOfStudy: '', year: 'FRESHMAN',
        startYear: new Date().getFullYear() - 3, endYear: new Date().getFullYear(),
        gpa: '', percentage: '', isCurrent: false
      });
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to add academic record');
    }
  };

  const handleDeleteAcademic = async (id) => {
    if (window.confirm('Delete this academic record?')) {
      try {
        await dispatch(deleteAcademicRecord(id)).unwrap();
        toast.success('Academic record removed.');
        dispatch(fetchProfile());
      } catch (err) {
        toast.error(err || 'Error deleting record');
      }
    }
  };

  const handleAddInterest = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addInterest({
        ...interestForm,
        level: parseInt(interestForm.level)
      })).unwrap();
      toast.success('Interest added!');
      setActiveModal(null);
      setInterestForm({ name: '', category: 'Technology', level: 5 });
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to add interest');
    }
  };

  const handleRemoveInterest = async (id) => {
    try {
      await dispatch(removeInterest(id)).unwrap();
      toast.success('Interest removed.');
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to remove interest');
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...goalForm,
        targetYear: goalForm.targetYear ? parseInt(goalForm.targetYear) : undefined,
        priority: parseInt(goalForm.priority)
      };
      await dispatch(addCareerGoal(payload)).unwrap();
      toast.success('Career goal added!');
      setActiveModal(null);
      setGoalForm({ title: '', description: '', targetYear: new Date().getFullYear() + 2, priority: 5 });
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to add goal');
    }
  };

  const handleRemoveGoal = async (id) => {
    try {
      await dispatch(removeCareerGoal(id)).unwrap();
      toast.success('Career goal removed.');
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to remove goal');
    }
  };

  const handleAddStrength = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addStrength(strengthForm)).unwrap();
      toast.success('Strength added!');
      setActiveModal(null);
      setStrengthForm({ name: '', category: 'General', evidence: '' });
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to add strength');
    }
  };

  const handleRemoveStrength = async (id) => {
    try {
      await dispatch(removeStrength(id)).unwrap();
      toast.success('Strength removed.');
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to remove strength');
    }
  };

  const handleAddWeakness = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addWeakness(weaknessForm)).unwrap();
      toast.success('Weakness added!');
      setActiveModal(null);
      setWeaknessForm({ name: '', category: 'General', evidence: '' });
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to add weakness');
    }
  };

  const handleRemoveWeakness = async (id) => {
    try {
      await dispatch(removeWeakness(id)).unwrap();
      toast.success('Weakness removed.');
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to remove weakness');
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!skillForm.skillId) {
      toast.warning('Please select a skill from the search results.');
      return;
    }
    try {
      await dispatch(addSkill({
        skillId: skillForm.skillId,
        level: parseInt(skillForm.level),
        yearsExp: parseInt(skillForm.yearsExp)
      })).unwrap();
      toast.success('Skill added portfolio!');
      setActiveModal(null);
      setSkillForm({ skillId: '', name: '', level: 5, yearsExp: 1 });
      setSkillQuery('');
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (id) => {
    try {
      await dispatch(removeSkill(id)).unwrap();
      toast.success('Skill removed from portfolio.');
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to remove skill');
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...certForm,
        issueDate: certForm.issueDate || undefined,
        expiryDate: certForm.expiryDate || undefined,
        credentialUrl: certForm.credentialUrl || undefined
      };
      await dispatch(addCertification(payload)).unwrap();
      toast.success('Certification added!');
      setActiveModal(null);
      setCertForm({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialUrl: '' });
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to add certificate');
    }
  };

  const handleRemoveCert = async (id) => {
    try {
      await dispatch(removeCertification(id)).unwrap();
      toast.success('Certification removed.');
      dispatch(fetchProfile());
    } catch (err) {
      toast.error(err || 'Failed to remove certificate');
    }
  };

  const inputClass = 'w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 hover:border-white/20 text-sm';
  const selectClass = 'w-full py-2.5 px-4 rounded-xl bg-gray-900 border border-white/10 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 hover:border-white/20 text-sm cursor-pointer';

  if (loading && !profile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Spinner size="xl" className="mx-auto text-primary-500" />
          <p className="text-gray-400 text-sm animate-pulse font-semibold">Loading your Profile Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in pb-12">
      {/* Upper header profile card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-base-950 p-6 sm:p-8 shadow-glass backdrop-blur-xl">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-secondary-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary-500/20">
              {user?.firstName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-500/10 border border-primary-500/20 text-primary-300">
                <Sparkles className="w-3 h-3 text-primary-400" /> Student Profile
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                {profile?.city ? `${profile.city}, ${profile.state || ''} (${profile.country || 'India'})` : 'Location not set'}
              </p>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <button
              onClick={handleOpenBasicModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 text-xs shadow-md"
            >
              <Edit2 className="w-4 h-4 text-primary-400" />
              Edit Basic Profile
            </button>
          </div>
        </div>

        {profile?.bio && (
          <div className="relative z-10 mt-6 pt-5 border-t border-white/5 text-gray-300 text-sm leading-relaxed max-w-2xl bg-white/[0.02] p-4 rounded-xl border border-white/5 italic">
            &ldquo;{profile.bio}&rdquo;
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Hand: Personal Info, Strengths & Weaknesses, Interests */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Personal Details */}
          <Card header={
            <div className="flex items-center gap-2">
              <User className="w-4.5 h-4.5 text-primary-400" />
              <span className="font-bold text-white text-sm">Personal Info</span>
            </div>
          }>
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Gender</span>
                <span className="font-semibold text-gray-300">{profile?.gender || 'Not Specified'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Date of Birth</span>
                <span className="font-semibold text-gray-300">
                  {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-500">Phone Number</span>
                <span className="font-semibold text-gray-300">{profile?.phoneNumber || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500">Email</span>
                <span className="font-semibold text-gray-300 truncate max-w-[180px]">{user?.email}</span>
              </div>
            </div>
          </Card>

          {/* Interests Form */}
          <Card header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-secondary-400" />
                <span className="font-bold text-white text-sm">Interests & Passions</span>
              </div>
              <button 
                onClick={() => setActiveModal('interest')}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          }>
            {interests.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-2">No interests set. Add what you love!</p>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {interests.map((int) => (
                  <div 
                    key={int.id}
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary-500/10 border border-secondary-500/20 text-secondary-300 text-xs font-semibold"
                  >
                    <span>{int.name}</span>
                    <span className="text-[10px] bg-secondary-500/20 px-1 rounded text-secondary-400">Lv.{int.level}</span>
                    <button 
                      onClick={() => handleRemoveInterest(int.id)}
                      className="text-secondary-400 hover:text-red-400 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Strengths vs Weaknesses columns */}
          <Card header={
            <div className="flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-emerald-400" />
              <span className="font-bold text-white text-sm">Strengths & Weaknesses</span>
            </div>
          }>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Strengths */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-xs font-bold text-emerald-400">Strengths</span>
                  <button 
                    onClick={() => setActiveModal('strength')}
                    className="w-5 h-5 rounded-md bg-white/5 hover:bg-emerald-500/10 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {strengths.length === 0 ? (
                  <p className="text-[10px] text-gray-500 italic py-1">None added</p>
                ) : (
                  <div className="space-y-2">
                    {strengths.map((str) => (
                      <div key={str.id} className="group relative flex items-center justify-between bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/5">
                        <span className="text-[11px] text-gray-300 truncate max-w-[80px]" title={str.name}>{str.name}</span>
                        <button 
                          onClick={() => handleRemoveStrength(str.id)}
                          className="text-gray-500 hover:text-red-400 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Weaknesses */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                  <span className="text-xs font-bold text-rose-400">Areas to Grow</span>
                  <button 
                    onClick={() => setActiveModal('weakness')}
                    className="w-5 h-5 rounded-md bg-white/5 hover:bg-rose-500/10 flex items-center justify-center text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {weaknesses.length === 0 ? (
                  <p className="text-[10px] text-gray-500 italic py-1">None added</p>
                ) : (
                  <div className="space-y-2">
                    {weaknesses.map((wk) => (
                      <div key={wk.id} className="group relative flex items-center justify-between bg-white/[0.03] px-2.5 py-1.5 rounded-lg border border-white/5">
                        <span className="text-[11px] text-gray-300 truncate max-w-[80px]" title={wk.name}>{wk.name}</span>
                        <button 
                          onClick={() => handleRemoveWeakness(wk.id)}
                          className="text-gray-500 hover:text-red-400 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </Card>
        </div>

        {/* Right Hand: Academics, Skills Portfolio, Career Goals, Certifications */}
        <div className="lg:col-span-2 space-y-6">

          {/* Academic Records */}
          <Card header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
                <span className="font-bold text-white text-sm">Academic History</span>
              </div>
              <button 
                onClick={() => setActiveModal('academic')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25 transition text-xs font-bold shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Academic Record
              </button>
            </div>
          }>
            {academicRecords.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl">
                <BookOpen className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No academic history records added yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {academicRecords.map((rec) => (
                  <div key={rec.id} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white leading-snug">{rec.institution}</h4>
                        {rec.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Current</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-300 font-medium">{rec.degree} in {rec.fieldOfStudy}</p>
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-indigo-400" /> {rec.startYear} &ndash; {rec.endYear || 'Present'}</span>
                        <span className="bg-white/5 px-2 py-0.5 rounded text-gray-400 font-bold uppercase">{rec.year}</span>
                        {rec.gpa && <span>GPA: {rec.gpa}/10</span>}
                        {rec.percentage && <span>Percentage: {rec.percentage}%</span>}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteAcademic(rec.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition"
                      title="Delete record"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Skills Portfolio */}
          <Card header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-primary-400" />
                <span className="font-bold text-white text-sm">Skills Portfolio</span>
              </div>
              <button 
                onClick={() => setActiveModal('skill')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500/15 border border-primary-500/30 text-primary-300 hover:bg-primary-500/25 transition text-xs font-bold shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </button>
            </div>
          }>
            {skills.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl">
                <Briefcase className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No professional skills loaded. Build your stack!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.map((sk) => (
                  <div 
                    key={sk.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-xs font-bold text-white truncate">{sk.skill?.name || 'Skill'}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{sk.skill?.category || 'General'}</p>
                      
                      {/* Level Progress Bar */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" 
                            style={{ width: `${sk.level * 10}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap">Lv.{sk.level}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {sk.yearsExp && (
                        <span className="text-[9px] font-bold bg-white/5 border border-white/5 px-2 py-1 rounded text-gray-400 uppercase tracking-wide">
                          {sk.yearsExp} Yr{sk.yearsExp > 1 ? 's' : ''}
                        </span>
                      )}
                      <button 
                        onClick={() => handleRemoveSkill(sk.id)}
                        className="p-1 rounded-lg text-gray-500 hover:text-red-400 transition"
                        title="Remove skill"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Career Goals */}
          <Card header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4.5 h-4.5 text-emerald-400" />
                <span className="font-bold text-white text-sm">Career Goals</span>
              </div>
              <button 
                onClick={() => setActiveModal('goal')}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          }>
            {careerGoals.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-2">No career goals set yet.</p>
            ) : (
              <div className="space-y-3.5">
                {careerGoals.map((goal) => (
                  <div 
                    key={goal.id}
                    className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">{goal.title}</h4>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase">
                          Priority {goal.priority}
                        </span>
                      </div>
                      {goal.description && <p className="text-[11px] text-gray-400 leading-relaxed">{goal.description}</p>}
                      {goal.targetYear && (
                        <div className="text-[10px] text-gray-500 pt-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Target Year: {goal.targetYear}
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => handleRemoveGoal(goal.id)}
                      className="p-1 rounded text-gray-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Certifications */}
          <Card header={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-secondary-400" />
                <span className="font-bold text-white text-sm">Professional Certifications</span>
              </div>
              <button 
                onClick={() => setActiveModal('cert')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary-500/15 border border-secondary-500/30 text-secondary-300 hover:bg-secondary-500/25 transition text-xs font-bold shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certificate
              </button>
            </div>
          }>
            {certifications.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl">
                <Award className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-400">No certifications loaded. Add your verified badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <div 
                    key={cert.id}
                    className="flex items-start justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition"
                  >
                    <div className="space-y-1 max-w-[80%]">
                      <h4 className="text-xs font-bold text-white leading-tight truncate" title={cert.name}>{cert.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium truncate">{cert.issuer}</p>
                      
                      {cert.issueDate && (
                        <p className="text-[9px] text-gray-500 pt-1">
                          Issued: {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      )}

                      {cert.credentialUrl && (
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline pt-1.5 transition"
                        >
                          <Globe className="w-3 h-3" /> View Credential
                        </a>
                      )}
                    </div>

                    <button 
                      onClick={() => handleRemoveCert(cert.id)}
                      className="p-1 rounded text-gray-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

        </div>

      </div>

      {/* ────────────────────────────────────────────────────────
         MODALS POPUPS
         ──────────────────────────────────────────────────────── */}

      {/* Basic Profile Info Modal */}
      <Modal
        isOpen={activeModal === 'basic'}
        onClose={() => setActiveModal(null)}
        title="Edit Basic Profile Details"
        size="md"
      >
        <form onSubmit={handleSaveBasicInfo} className="space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">First Name</label>
              <input 
                type="text" 
                value={basicForm.firstName} 
                onChange={(e) => setBasicForm({...basicForm, firstName: e.target.value})}
                className={inputClass} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
              <input 
                type="text" 
                value={basicForm.lastName} 
                onChange={(e) => setBasicForm({...basicForm, lastName: e.target.value})}
                className={inputClass} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Gender</label>
              <select 
                value={basicForm.gender} 
                onChange={(e) => setBasicForm({...basicForm, gender: e.target.value})}
                className={selectClass}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date of Birth</label>
              <input 
                type="date" 
                value={basicForm.dateOfBirth} 
                onChange={(e) => setBasicForm({...basicForm, dateOfBirth: e.target.value})}
                className={inputClass} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
            <input 
              type="text" 
              placeholder="e.g. +91 9988776655"
              value={basicForm.phoneNumber} 
              onChange={(e) => setBasicForm({...basicForm, phoneNumber: e.target.value})}
              className={inputClass} 
            />
          </div>

          <div className="grid grid-cols-3 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">City</label>
              <input 
                type="text" 
                placeholder="City"
                value={basicForm.city} 
                onChange={(e) => setBasicForm({...basicForm, city: e.target.value})}
                className={inputClass} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">State</label>
              <input 
                type="text" 
                placeholder="State"
                value={basicForm.state} 
                onChange={(e) => setBasicForm({...basicForm, state: e.target.value})}
                className={inputClass} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Country</label>
              <input 
                type="text" 
                placeholder="Country"
                value={basicForm.country} 
                onChange={(e) => setBasicForm({...basicForm, country: e.target.value})}
                className={inputClass} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Address Line</label>
            <input 
              type="text" 
              placeholder="Full street address"
              value={basicForm.address} 
              onChange={(e) => setBasicForm({...basicForm, address: e.target.value})}
              className={inputClass} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bio Statement</label>
            <textarea 
              placeholder="Tell us about yourself..."
              value={basicForm.bio} 
              onChange={(e) => setBasicForm({...basicForm, bio: e.target.value})}
              className={`${inputClass} min-h-[90px] resize-none`} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setActiveModal(null)} 
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4.5 py-2 text-xs font-black uppercase tracking-wider bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl transition active:scale-95 shadow-md"
            >
              Save Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Academic Record Modal */}
      <Modal
        isOpen={activeModal === 'academic'}
        onClose={() => setActiveModal(null)}
        title="Add Academic Record"
        size="md"
      >
        <form onSubmit={handleAddAcademic} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Institution / School</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Stanford University or Delhi Public School"
              value={academicForm.institution} 
              onChange={(e) => setAcademicForm({...academicForm, institution: e.target.value})}
              className={inputClass} 
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Degree / Standard</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Bachelor of Science or High School"
                value={academicForm.degree} 
                onChange={(e) => setAcademicForm({...academicForm, degree: e.target.value})}
                className={inputClass} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Field of Study</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Computer Science or Science stream"
                value={academicForm.fieldOfStudy} 
                onChange={(e) => setAcademicForm({...academicForm, fieldOfStudy: e.target.value})}
                className={inputClass} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Academic Year</label>
              <select 
                value={academicForm.year} 
                onChange={(e) => setAcademicForm({...academicForm, year: e.target.value})}
                className={selectClass}
              >
                <option value="FRESHMAN">Freshman / 1st Year</option>
                <option value="SOPHOMORE">Sophomore / 2nd Year</option>
                <option value="JUNIOR">Junior / 3rd Year</option>
                <option value="SENIOR">Senior / 4th Year</option>
                <option value="GRADUATE">Graduate Program</option>
                <option value="POST_GRADUATE">Post-Graduate Program</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</label>
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 cursor-pointer h-10 select-none">
                <input 
                  type="checkbox" 
                  checked={academicForm.isCurrent}
                  onChange={(e) => setAcademicForm({...academicForm, isCurrent: e.target.checked})}
                  className="rounded border-white/20 bg-white/5 text-primary-500 focus:ring-offset-0" 
                />
                Currently studying here
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Start Year</label>
              <input 
                type="number" 
                required
                min="1950" 
                max="2100"
                value={academicForm.startYear} 
                onChange={(e) => setAcademicForm({...academicForm, startYear: e.target.value})}
                className={inputClass} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">End Year (Planned)</label>
              <input 
                type="number" 
                min="1950" 
                max="2100"
                value={academicForm.endYear} 
                onChange={(e) => setAcademicForm({...academicForm, endYear: e.target.value})}
                className={inputClass} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">GPA (out of 10.0)</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="10"
                placeholder="e.g. 9.15"
                value={academicForm.gpa} 
                onChange={(e) => setAcademicForm({...academicForm, gpa: e.target.value})}
                className={inputClass} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Or Percentage (%)</label>
              <input 
                type="number" 
                step="0.1" 
                min="0" 
                max="100"
                placeholder="e.g. 88.5"
                value={academicForm.percentage} 
                onChange={(e) => setAcademicForm({...academicForm, percentage: e.target.value})}
                className={inputClass} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setActiveModal(null)} 
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4.5 py-2 text-xs font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition active:scale-95 shadow-md"
            >
              Add Record
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Interest Modal */}
      <Modal
        isOpen={activeModal === 'interest'}
        onClose={() => setActiveModal(null)}
        title="Add Interest"
        size="sm"
      >
        <form onSubmit={handleAddInterest} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Interest / Topic</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Machine Learning, Philosophy"
              value={interestForm.name} 
              onChange={(e) => setInterestForm({...interestForm, name: e.target.value})}
              className={inputClass} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
            <select 
              value={interestForm.category} 
              onChange={(e) => setInterestForm({...interestForm, category: e.target.value})}
              className={selectClass}
            >
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="Business">Business</option>
              <option value="Art & Design">Art & Design</option>
              <option value="Humanities">Humanities</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <span>Passion Level</span>
              <span className="text-secondary-400">Level {interestForm.level}/10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={interestForm.level}
              onChange={(e) => setInterestForm({...interestForm, level: parseInt(e.target.value)})}
              className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-secondary-500" 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setActiveModal(null)} 
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4.5 py-2 text-xs font-black uppercase tracking-wider bg-secondary-600 hover:bg-secondary-500 text-white rounded-xl transition active:scale-95 shadow-md"
            >
              Add Interest
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Career Goal Modal */}
      <Modal
        isOpen={activeModal === 'goal'}
        onClose={() => setActiveModal(null)}
        title="Add Career Goal"
        size="md"
      >
        <form onSubmit={handleAddGoal} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Goal Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Become a Lead ML Engineer or Land an Internship"
              value={goalForm.title} 
              onChange={(e) => setGoalForm({...goalForm, title: e.target.value})}
              className={inputClass} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Description</label>
            <textarea 
              placeholder="Describe your roadmap or key results needed..."
              value={goalForm.description} 
              onChange={(e) => setGoalForm({...goalForm, description: e.target.value})}
              className={`${inputClass} min-h-[70px] resize-none`} 
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Target Accomplishment Year</label>
              <input 
                type="number" 
                min="2026" 
                max="2100"
                value={goalForm.targetYear} 
                onChange={(e) => setGoalForm({...goalForm, targetYear: e.target.value})}
                className={inputClass} 
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Priority Priority</span>
                <span className="text-emerald-400">Score {goalForm.priority}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={goalForm.priority}
                onChange={(e) => setGoalForm({...goalForm, priority: parseInt(e.target.value)})}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setActiveModal(null)} 
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4.5 py-2 text-xs font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition active:scale-95 shadow-md"
            >
              Add Goal
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Strength Modal */}
      <Modal
        isOpen={activeModal === 'strength'}
        onClose={() => setActiveModal(null)}
        title="Add Strength Parameter"
        size="sm"
      >
        <form onSubmit={handleAddStrength} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Strength Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Critical Thinking, Public Speaking"
              value={strengthForm.name} 
              onChange={(e) => setStrengthForm({...strengthForm, name: e.target.value})}
              className={inputClass} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
            <input 
              type="text" 
              placeholder="e.g. Technical, Interpersonal"
              value={strengthForm.category} 
              onChange={(e) => setStrengthForm({...strengthForm, category: e.target.value})}
              className={inputClass} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Evidence / Proof</label>
            <input 
              type="text" 
              placeholder="e.g. Led 4 college project hackathons"
              value={strengthForm.evidence} 
              onChange={(e) => setStrengthForm({...strengthForm, evidence: e.target.value})}
              className={inputClass} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition">Cancel</button>
            <button type="submit" className="px-4.5 py-2 text-xs font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition active:scale-95 shadow-md">Add Strength</button>
          </div>
        </form>
      </Modal>

      {/* Add Weakness Modal */}
      <Modal
        isOpen={activeModal === 'weakness'}
        onClose={() => setActiveModal(null)}
        title="Add Growth Parameter"
        size="sm"
      >
        <form onSubmit={handleAddWeakness} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Growth Area / Weakness</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Time Management, Public Speaking"
              value={weaknessForm.name} 
              onChange={(e) => setWeaknessForm({...weaknessForm, name: e.target.value})}
              className={inputClass} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
            <input 
              type="text" 
              placeholder="e.g. Behavioral, Technical"
              value={weaknessForm.category} 
              onChange={(e) => setWeaknessForm({...weaknessForm, category: e.target.value})}
              className={inputClass} 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Evidence / Proof</label>
            <input 
              type="text" 
              placeholder="e.g. Easily get distracted on side projects"
              value={weaknessForm.evidence} 
              onChange={(e) => setWeaknessForm({...weaknessForm, evidence: e.target.value})}
              className={inputClass} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition">Cancel</button>
            <button type="submit" className="px-4.5 py-2 text-xs font-black uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition active:scale-95 shadow-md">Add growth area</button>
          </div>
        </form>
      </Modal>

      {/* Add Skill Modal with Live Search */}
      <Modal
        isOpen={activeModal === 'skill'}
        onClose={() => setActiveModal(null)}
        title="Add Skill to Portfolio"
        size="md"
      >
        <form onSubmit={handleAddSkill} className="space-y-4">
          <div className="space-y-1.5 relative">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Search Skills database</label>
            <input 
              type="text" 
              placeholder="Type to search (e.g. React, Python, Management)..."
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
              className={inputClass} 
            />
            {searchingSkills && (
              <span className="absolute right-3.5 top-9.5 text-xs text-gray-500 flex items-center gap-1.5 animate-pulse">
                <Spinner size="sm" /> Searching...
              </span>
            )}
            
            {/* Search Dropdown Results */}
            {searchedSkillsList.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-gray-900 border border-white/10 rounded-xl p-2 z-50 shadow-2xl scrollbar-thin">
                {searchedSkillsList.map((sk) => (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => {
                      setSkillForm({...skillForm, skillId: sk.id, name: sk.name});
                      setSkillQuery(sk.name);
                      setSearchedSkillsList([]);
                    }}
                    className="w-full text-left px-3.5 py-2 rounded-lg text-xs hover:bg-white/5 text-gray-300 hover:text-white transition flex items-center justify-between"
                  >
                    <span className="font-bold">{sk.name}</span>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-500">{sk.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {skillForm.skillId && (
            <div className="p-3.5 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-between text-xs text-primary-300">
              <span>Selected: <strong className="text-white text-sm">{skillForm.name}</strong></span>
              <button 
                type="button" 
                onClick={() => setSkillForm({...skillForm, skillId: '', name: ''})}
                className="text-red-400 hover:text-white transition"
              >
                Clear
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Years of Experience</label>
              <input 
                type="number" 
                required
                min="0" 
                max="50"
                value={skillForm.yearsExp} 
                onChange={(e) => setSkillForm({...skillForm, yearsExp: parseInt(e.target.value)})}
                className={inputClass} 
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Skill Level</span>
                <span className="text-primary-400">Lv.{skillForm.level}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={skillForm.level}
                onChange={(e) => setSkillForm({...skillForm, level: parseInt(e.target.value)})}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary-500 mt-2" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => {
                setActiveModal(null);
                setSkillForm({ skillId: '', name: '', level: 5, yearsExp: 1 });
                setSkillQuery('');
              }} 
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4.5 py-2 text-xs font-black uppercase tracking-wider bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition active:scale-95 shadow-md"
            >
              Add Skill
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Certification Modal */}
      <Modal
        isOpen={activeModal === 'cert'}
        onClose={() => setActiveModal(null)}
        title="Add Professional Certification"
        size="md"
      >
        <form onSubmit={handleAddCert} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Certification / Badge Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. AWS Certified Cloud Practitioner"
              value={certForm.name} 
              onChange={(e) => setCertForm({...certForm, name: e.target.value})}
              className={inputClass} 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Issuer / Institution</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Amazon Web Services, Google, Coursera"
              value={certForm.issuer} 
              onChange={(e) => setCertForm({...certForm, issuer: e.target.value})}
              className={inputClass} 
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Issue Date</label>
              <input 
                type="date" 
                value={certForm.issueDate} 
                onChange={(e) => setCertForm({...certForm, issueDate: e.target.value})}
                className={inputClass} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Expiry Date (If applicable)</label>
              <input 
                type="date" 
                value={certForm.expiryDate} 
                onChange={(e) => setCertForm({...certForm, expiryDate: e.target.value})}
                className={inputClass} 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Verification Credential URL</label>
            <input 
              type="url" 
              placeholder="e.g. https://www.credly.com/badges/your-badge-id"
              value={certForm.credentialUrl} 
              onChange={(e) => setCertForm({...certForm, credentialUrl: e.target.value})}
              className={inputClass} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={() => setActiveModal(null)} 
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4.5 py-2 text-xs font-black uppercase tracking-wider bg-secondary-600 hover:bg-secondary-500 text-white rounded-xl transition active:scale-95 shadow-md"
            >
              Add Certification
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ProfilePage;
