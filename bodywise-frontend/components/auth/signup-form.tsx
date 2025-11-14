'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type UserRole = 'patient' | 'health_professional' | 'institutional_admin';

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
}

const roles: RoleOption[] = [
  {
    value: 'patient',
    label: 'Patient',
    description: 'Access health assessments, find professionals, and track your wellness journey',
  },
  {
    value: 'health_professional',
    label: 'Health Professional',
    description: 'Provide consultations, manage patients, and share your expertise',
  },
  {
    value: 'institutional_admin',
    label: 'Institution Admin',
    description: 'Manage your health institution and onboard professionals',
  },
];

export function SignupForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    // Patient fields
    username: '',
    // Common fields
    full_name: '',
    phone: '',
    // Patient specific
    date_of_birth: '',
    gender: '',
    // Professional fields
    specialization: '',
    years_of_experience: '',
    bio: '',
    license_number: '',
    // Institution fields
    institution_name: '',
    institution_bio: '',
    institution_location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      };

      if (selectedRole === 'patient') {
        payload.username = formData.username;
        payload.full_name = formData.full_name;
        payload.date_of_birth = formData.date_of_birth;
        payload.gender = formData.gender;
        payload.phone = formData.phone;
      } else if (selectedRole === 'health_professional') {
        payload.full_name = formData.full_name;
        payload.specialization = formData.specialization;
        payload.years_of_experience = parseInt(formData.years_of_experience) || 0;
        payload.bio = formData.bio;
        payload.phone = formData.phone;
        payload.license_number = formData.license_number;
      } else if (selectedRole === 'institutional_admin') {
        payload.full_name = formData.full_name;
        payload.phone = formData.phone;
        payload.institution_name = formData.institution_name;
        payload.institution_bio = formData.institution_bio;
        payload.institution_location = formData.institution_location;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token and redirect
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        document.cookie = `auth_token=${data.token}; path=/; max-age=604800`;
        
        // Redirect based on role
        const redirectMap = {
          'patient': '/user',
          'health_professional': '/doctor',
          'institutional_admin': '/institution',
        };
        
        window.location.href = redirectMap[selectedRole];
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[#6a4a3a] mb-6">Select your account type to get started</p>
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => setSelectedRole(role.value)}
            className="w-full text-left p-5 rounded-2xl border-2 border-[#e6d8ce] bg-white hover:border-[#523329] hover:bg-[#fdf9f6] transition-all group"
          >
            <h3 className="font-semibold text-[#3a2218] mb-1 group-hover:text-[#523329]">
              {role.label}
            </h3>
            <p className="text-sm text-[#80685b]">{role.description}</p>
          </button>
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f9f0e6]">
        <div>
          <p className="text-xs text-[#80685b]">Account type:</p>
          <p className="font-semibold text-[#3a2218]">
            {roles.find(r => r.value === selectedRole)?.label}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSelectedRole(null)}
          className="text-xs font-semibold text-[#6a4a3a] hover:text-[#3a2218]"
        >
          Change
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" requiredIndicator>Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" requiredIndicator>Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="At least 6 characters"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" requiredIndicator>Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        {/* Patient-specific fields */}
        {selectedRole === 'patient' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="username" requiredIndicator>Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Choose a unique username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full rounded-2xl border border-[#d7c6ba] bg-white px-4 py-3 text-sm text-[#3a2218] focus:border-[#6a4a3a] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="+250788123456"
              />
            </div>
          </>
        )}

        {/* Health Professional fields */}
        {selectedRole === 'health_professional' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="full_name" requiredIndicator>Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Dr. Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization" requiredIndicator>Specialization</Label>
              <Input
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="e.g., Clinical Psychology, Nutrition"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years_of_experience">Years of Experience</Label>
              <Input
                id="years_of_experience"
                name="years_of_experience"
                type="number"
                value={formData.years_of_experience}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license_number">License Number</Label>
              <Input
                id="license_number"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="+250788123456"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio / About Me</Label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={isLoading}
                rows={3}
                className="w-full rounded-2xl border border-[#d7c6ba] bg-white px-4 py-3 text-sm text-[#3a2218] focus:border-[#6a4a3a] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
                placeholder="Tell us about your experience and approach..."
              />
            </div>
          </>
        )}

        {/* Institutional Admin fields */}
        {selectedRole === 'institutional_admin' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="full_name" requiredIndicator>Your Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Your Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="+250788123456"
              />
            </div>
            <hr className="border-[#e6d8ce]" />
            <p className="text-sm font-semibold text-[#3a2218]">Institution Details</p>
            <div className="space-y-2">
              <Label htmlFor="institution_name" requiredIndicator>Institution Name</Label>
              <Input
                id="institution_name"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="University Health Center"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution_location">Location</Label>
              <Input
                id="institution_location"
                name="institution_location"
                value={formData.institution_location}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Kigali, Rwanda"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution_bio">Institution Description</Label>
              <textarea
                id="institution_bio"
                name="institution_bio"
                value={formData.institution_bio}
                onChange={handleChange}
                disabled={isLoading}
                rows={3}
                className="w-full rounded-2xl border border-[#d7c6ba] bg-white px-4 py-3 text-sm text-[#3a2218] focus:border-[#6a4a3a] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
                placeholder="Brief description of your institution..."
              />
            </div>
            <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 text-xs text-blue-800">
              <p className="font-semibold mb-1">Verification Required</p>
              <p>Your institution will need to be verified by system administrators before you can access all features.</p>
            </div>
          </>
        )}
      </div>

      <Button
        type="submit"
        variant="secondary"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>

      {selectedRole !== 'patient' && (
        <p className="text-xs text-center text-[#80685b]">
          Your account will be reviewed for verification. You'll receive an email once approved.
        </p>
      )}
    </form>
  );
}
