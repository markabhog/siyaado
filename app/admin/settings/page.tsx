"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui";
import { 
  Settings,
  Users,
  Shield,
  Bell,
  Globe,
  Database,
  Mail,
  Key,
  Save,
  Download,
  Upload
} from "lucide-react";

const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ');

// Consistent UI Components
const Card = ({ className = "", ...props }) => (
  <div className={["rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/40", className].join(" ")} {...props} />
);

const CardHeader = ({ className = "", ...props }) => (
  <div className={["px-5 pt-5", className].join(" ")} {...props} />
);

const CardTitle = ({ className = "", ...props }) => (
  <h3 className={["text-base font-semibold text-slate-800 dark:text-slate-100", className].join(" ")} {...props} />
);

const CardContent = ({ className = "", ...props }) => (
  <div className={["px-5 pb-5", className].join(" ")} {...props} />
);

// Settings Section Component
const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  );
};

// User Management Component
const UserManagement = ({ users, onUserUpdate }: { users: any[]; onUserUpdate: (userId: string, updates: any) => void }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-md font-medium text-slate-700">Team Members</h4>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Invite User
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-600">Name</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Email</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Role</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100">
                <td className="py-3 px-4 font-medium text-slate-900">{user.name}</td>
                <td className="py-3 px-4 text-slate-700">{user.email}</td>
                <td className="py-3 px-4">
                  <select
                    value={user.role}
                    onChange={(e) => onUserUpdate(user.id, { role: e.target.value })}
                    className="px-2 py-1 border border-slate-300 rounded text-sm"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Support">Support</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onUserUpdate(user.id, { status: user.status === 'Active' ? 'Disabled' : 'Active' })}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      {user.status === 'Active' ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Store Configuration Component
const StoreConfiguration = ({ config, onConfigUpdate }: { config: any; onConfigUpdate: (updates: any) => void }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Store Name</label>
        <input
          type="text"
          value={config.storeName}
          onChange={(e) => onConfigUpdate({ storeName: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Default Currency</label>
        <select
          value={config.currency}
          onChange={(e) => onConfigUpdate({ currency: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="SOS">SOS</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Store Email</label>
        <input
          type="email"
          value={config.storeEmail}
          onChange={(e) => onConfigUpdate({ storeEmail: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Store Phone</label>
        <input
          type="tel"
          value={config.storePhone}
          onChange={(e) => onConfigUpdate({ storePhone: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-2">Store Address</label>
        <textarea
          value={config.storeAddress}
          onChange={(e) => onConfigUpdate({ storeAddress: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

// Payment Methods Component
const PaymentMethods = ({ paymentMethods, onPaymentUpdate }: { paymentMethods: any; onPaymentUpdate: (updates: any) => void }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-slate-700">Payment Methods</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-sm">💳</span>
            </div>
            <div>
              <div className="font-medium text-slate-900">Credit/Debit Cards</div>
              <div className="text-sm text-slate-500">Visa, Mastercard, American Express</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentMethods.cards}
              onChange={(e) => onPaymentUpdate({ cards: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-sm">📱</span>
            </div>
            <div>
              <div className="font-medium text-slate-900">EVC Plus</div>
              <div className="text-sm text-slate-500">Mobile money payment</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentMethods.evc}
              onChange={(e) => onPaymentUpdate({ evc: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-sm">🏦</span>
            </div>
            <div>
              <div className="font-medium text-slate-900">E-DAHAB</div>
              <div className="text-sm text-slate-500">Bank transfer payment</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentMethods.edahab}
              onChange={(e) => onPaymentUpdate({ edahab: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-sm">💰</span>
            </div>
            <div>
              <div className="font-medium text-slate-900">Cash on Delivery</div>
              <div className="text-sm text-slate-500">Pay when you receive</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={paymentMethods.cod}
              onChange={(e) => onPaymentUpdate({ cod: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

// System Settings Component
const SystemSettings = ({ systemSettings, onSystemUpdate }: { systemSettings: any; onSystemUpdate: (updates: any) => void }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Maintenance Mode</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={systemSettings.maintenanceMode}
            onChange={(e) => onSystemUpdate({ maintenanceMode: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm text-slate-700">
            {systemSettings.maintenanceMode ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Auto Backup</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={systemSettings.autoBackup}
            onChange={(e) => onSystemUpdate({ autoBackup: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm text-slate-700">
            {systemSettings.autoBackup ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Email Notifications</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={systemSettings.emailNotifications}
            onChange={(e) => onSystemUpdate({ emailNotifications: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm text-slate-700">
            {systemSettings.emailNotifications ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>
    </div>
  );
};

export default function AdminSettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [config, setConfig] = useState<any>({});
  const [paymentMethods, setPaymentMethods] = useState<any>({});
  const [systemSettings, setSystemSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  // Mock data for demonstration
  useEffect(() => {
    const mockUsers = [
      { id: 'USR-1', name: 'Admin', email: 'admin@luul.com', role: 'Admin', status: 'Active' },
      { id: 'USR-2', name: 'Manager', email: 'manager@luul.com', role: 'Manager', status: 'Active' },
      { id: 'USR-3', name: 'Support', email: 'support@luul.com', role: 'Support', status: 'Disabled' }
    ];
    
    const mockConfig = {
      storeName: 'Luul',
      currency: 'USD',
      storeEmail: 'info@luul.com',
      storePhone: '+252 61 123 4567',
      storeAddress: 'Mogadishu, Somalia'
    };
    
    const mockPaymentMethods = {
      cards: true,
      evc: true,
      edahab: true,
      cod: false
    };
    
    const mockSystemSettings = {
      maintenanceMode: false,
      autoBackup: true,
      emailNotifications: true
    };
    
    setUsers(mockUsers);
    setConfig(mockConfig);
    setPaymentMethods(mockPaymentMethods);
    setSystemSettings(mockSystemSettings);
    setLoading(false);
  }, []);
  
  const handleUserUpdate = (userId: string, updates: any) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };
  
  const handleConfigUpdate = (updates: Record<string, unknown>) => {
    setConfig((prev: Record<string, unknown>) => ({ ...prev, ...updates }));
  };
  
  const handlePaymentUpdate = (updates: Record<string, unknown>) => {
    setPaymentMethods((prev: Record<string, unknown>) => ({ ...prev, ...updates }));
  };
  
  const handleSystemUpdate = (updates: Record<string, unknown>) => {
    setSystemSettings((prev: Record<string, unknown>) => ({ ...prev, ...updates }));
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save to the database
    console.log('Saving settings...', { config, paymentMethods, systemSettings });
    alert('Settings saved successfully!');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SettingsSection title="Team & Users">
            <UserManagement users={users} onUserUpdate={handleUserUpdate} />
          </SettingsSection>
          
          <SettingsSection title="Store Configuration">
            <StoreConfiguration config={config} onConfigUpdate={handleConfigUpdate} />
          </SettingsSection>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SettingsSection title="Payment Methods">
            <PaymentMethods paymentMethods={paymentMethods} onPaymentUpdate={handlePaymentUpdate} />
          </SettingsSection>
          
          <SettingsSection title="System Settings">
            <SystemSettings systemSettings={systemSettings} onSystemUpdate={handleSystemUpdate} />
          </SettingsSection>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
