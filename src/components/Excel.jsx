import React, { useState } from "react";
import { toast } from "sonner";  // Updated import
import * as XLSX from "xlsx";
import api from "../services/api";
import { FiUpload, FiDownload } from "react-icons/fi";

const Excel = ({ onDataLoaded }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [exportType, setExportType] = useState("all");

  const LEAD_MODEL_FIELDS = [
    'name',
    'phone',
    'purpose',
    'remarks',
    'potential',
    'budget',
    'source',
    'requirement',
    'status',
    'associatedCp',
    'referenceName'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".xlsx")) {
        toast.error("Invalid file format", {
          description: "Please upload a valid Excel (.xlsx) file"
        });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File too large", {
          description: "File size exceeds 10MB limit"
        });
        return;
      }
      setFile(selectedFile);
      previewExcelFile(selectedFile);
    }
  };

  const previewExcelFile = async (file) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const userName = localStorage.getItem('userName');
      const formattedData = jsonData.map(row => {
        const formattedRow = {};
        
        LEAD_MODEL_FIELDS.forEach(field => {
          if (row[field]) {
            formattedRow[field] = row[field];
          }
        });

        formattedRow.date = new Date().toISOString().split('T')[0];
        formattedRow.createdBy = userName;
        formattedRow.favourite = false;
        formattedRow.remarkHistory = [];
        
        if (formattedRow.potential) {
          formattedRow.potential = [formattedRow.potential];
        }

        return formattedRow;
      });

      setPreviewData(formattedData.slice(0, 5));
    } catch (error) {
      console.error('Excel read error:', error);
      toast.error('Error reading Excel file:\n' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const userName = localStorage.getItem('userName');
      const formattedData = jsonData.map(row => {
        const formattedRow = {};
        
        LEAD_MODEL_FIELDS.forEach(field => {
          if (row[field]) {
            formattedRow[field] = row[field];
          }
        });

        formattedRow.date = new Date().toISOString().split('T')[0];
        formattedRow.createdBy = userName;
        formattedRow.favourite = false;
        formattedRow.remarkHistory = [];
        
        if (formattedRow.potential) {
          formattedRow.potential = [formattedRow.potential];
        }

        return formattedRow;
      });

      const response = await api.post('/excel/upload', formattedData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      toast.success("Upload complete", {
        description: "File uploaded successfully!"
      });
      onDataLoaded(response.data);
    } catch (err) {
      console.error('Upload error:', err);
      let errorMessage = 'Error uploading file. Please try again.';
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
          `Server error: ${err.response.status}`;
      } else {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/leads/export?type=${exportType}`);
      
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${exportType}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Export complete", {
        description: "File downloaded successfully!"
      });
    } catch (err) {
      console.error('Export error:', err);
      let errorMessage = 'Error exporting file. Please try again.';
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
          `Server error: ${err.response.status}`;
      } else {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 flex items-center justify-center bg-green-50 rounded-full">
            <FiDownload className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-lg font-medium text-gray-900">
            Export Data
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Select Data to Export
            </label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
            >
              <option value="all">All Leads</option>
              <option value="favorite">Favorite Leads</option>
              <option value="hot">Hot Leads</option>
              <option value="warm">Warm Leads</option>
              <option value="cold">Cold Leads</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            disabled={isLoading}
            className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <FiDownload className="w-4 h-4" />
                Export
              </>
            )}
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-full">
            <FiUpload className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-medium text-gray-900">
            Import Data
          </h2>
        </div>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg">
                <FiUpload className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {file ? file.name : "Drag & drop your file here"}
                </h3>
                <p className="text-sm text-gray-500">
                  or{" "}
                  <label
                    htmlFor="excelFile"
                    className="text-blue-600 hover:text-blue-700 cursor-pointer underline"
                  >
                    browse
                  </label>
                </p>
              </div>
            </div>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="hidden"
              id="excelFile"
            />
          </div>

          {previewData && (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Preview Data</h3>
              <div className="space-y-2">
                {previewData.map((row, index) => (
                  <div key={index} className="flex flex-wrap gap-4">
                    {Object.entries(row).map(([key, value]) => (
                      <div key={key} className="text-sm text-gray-600">
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="mt-4 space-y-4">
              <div className="relative rounded-full h-2 bg-gray-200">
                <div
                  className="absolute top-0 left-0 h-2 bg-blue-600 transition-all duration-200 ease-linear"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{uploadProgress}% Complete</p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div className="text-sm text-gray-500">
              <p>Supported file types: .xlsx</p>
              <p>Maximum file size: 10MB</p>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !file}
              className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {uploadProgress === 100 ? "Processing..." : "Uploading..."}
                </>
              ) : (
                <>
                  <FiUpload className="w-4 h-4" />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Excel;
