import React, { useState } from 'react';
import { Lock, Key, Shield } from 'lucide-react';
import useStore from '../store/diaryStore';
import { generateEncryptionKey } from '../utils/encryption';

export function EncryptionSetup() {
  const { settings, updateSettings } = useStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSetupEncryption = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const encryptionKey = await generateEncryptionKey(password);
      await updateSettings({ encryptionKey });
      setPassword('');
      setConfirmPassword('');
      setError('');
    } catch (err) {
      setError('Failed to setup encryption');
    }
  };

  if (settings.encryptionKey) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-center gap-3">
        <Shield className="w-5 h-5 text-green-500" />
        <p className="text-green-700 dark:text-green-300">
          Your diary is encrypted and secure
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-3 mb-4">
        <Lock className="w-6 h-6 text-blue-500" />
        <h3 className="text-lg font-semibold">Setup Encryption</h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Protect your diary entries with end-to-end encryption. Choose a strong password to secure your content.
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              placeholder="Enter your encryption password"
            />
            <Key className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              placeholder="Confirm your password"
            />
            <Key className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          onClick={handleSetupEncryption}
          disabled={!password || !confirmPassword}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Shield className="w-4 h-4" />
          Setup Encryption
        </button>
      </div>
    </div>
  );
}