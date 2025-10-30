"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui";

const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ');

// Bulk Actions Page
export default function BulkActionsPage() {
  // Mock data - in a real app, this would come from URL params or state management
  const [selectedProducts] = useState<string[]>([]);
  
  const handleBulkAction = (action: string, data?: unknown) => {
    console.log('Bulk action:', action, data);
    // Handle bulk action logic here
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bulk Product Actions</h1>
      <BulkActions selectedProducts={selectedProducts} onBulkAction={handleBulkAction} />
    </div>
  );
}

// Bulk Actions Component
const BulkActions = ({ selectedProducts, onBulkAction }: {
  selectedProducts: string[];
  onBulkAction: (action: string, data?: unknown) => void;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState('');
  const [bulkData, setBulkData] = useState<Record<string, unknown>>({});

  const handleBulkAction = (actionType: string) => {
    setAction(actionType);
    setShowModal(true);
  };

  const executeBulkAction = () => {
    onBulkAction(action, bulkData);
    setShowModal(false);
    setBulkData({});
  };

  if (selectedProducts.length === 0) return null;

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-blue-600 font-semibold">
              {selectedProducts.length} products selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleBulkAction('activate')}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Activate All
            </Button>
            <Button
              onClick={() => handleBulkAction('deactivate')}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Deactivate All
            </Button>
            <Button
              onClick={() => handleBulkAction('updatePrice')}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Price
            </Button>
            <Button
              onClick={() => handleBulkAction('updateStock')}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Update Stock
            </Button>
            <Button
              onClick={() => handleBulkAction('delete')}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete All
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Action Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Bulk {action.charAt(0).toUpperCase() + action.slice(1)}
            </h3>
            
            {action === 'updatePrice' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={String(bulkData.price || '')}
                  onChange={(e) => setBulkData({ ...bulkData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            
            {action === 'updateStock' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Stock Quantity
                </label>
                <input
                  type="number"
                  value={String(bulkData.stock || '')}
                  onChange={(e) => setBulkData({ ...bulkData, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            
            {action === 'delete' && (
              <div className="text-red-600">
                <p className="font-semibold">⚠️ Warning</p>
                <p>This will permanently delete {selectedProducts.length} products. This action cannot be undone.</p>
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={() => setShowModal(false)} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={executeBulkAction}
                className={`${
                  action === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {action === 'delete' ? 'Delete All' : 'Apply Changes'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
