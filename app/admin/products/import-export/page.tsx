"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui";

const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ');

// Import/Export Component
const ImportExport = () => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      
      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        alert('Products imported successfully!');
        setImportFile(null);
      } else {
        alert('Import failed. Please check your file format.');
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Import failed. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = () => {
    const link = document.createElement('a');
    link.href = `/api/admin/products/export?format=${exportFormat}`;
    link.download = `products-export-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    link.click();
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/api/admin/products/template';
    link.download = 'product-import-template.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Import Products</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {importFile && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-sm text-slate-700">{importFile.name}</span>
                <span className="text-xs text-slate-500">
                  ({(importFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button
              onClick={handleImport}
              disabled={!importFile || importing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {importing ? 'Importing...' : 'Import Products'}
            </Button>
            <Button
              onClick={downloadTemplate}
              variant="outline"
            >
              Download Template
            </Button>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Export Products</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Export Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="csv">CSV</option>
              <option value="xlsx">Excel</option>
              <option value="json">JSON</option>
            </select>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Export includes:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Product details (SKU, title, description, price, stock)</li>
              <li>• Category assignments</li>
              <li>• Product images (URLs)</li>
              <li>• Active status</li>
              <li>• Creation and update dates</li>
            </ul>
          </div>
          
          <Button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Export Products
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-slate-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Import Instructions</h3>
        <div className="space-y-3 text-sm text-slate-700">
          <div>
            <strong>1. Download the template:</strong> Use the "Download Template" button to get the correct CSV format.
          </div>
          <div>
            <strong>2. Fill in your data:</strong> Add your product information following the template structure.
          </div>
          <div>
            <strong>3. Required fields:</strong> SKU, Title, Price, Stock are mandatory.
          </div>
          <div>
            <strong>4. Categories:</strong> Use category IDs separated by semicolons (e.g., "1;2;3").
          </div>
          <div>
            <strong>5. Images:</strong> Provide image URLs separated by semicolons (e.g., "url1;url2;url3").
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;
