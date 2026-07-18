// js/data-murid.js

const DataMuridView = ({
  studentsDb,
  downloadExcelTemplate,
  uploadExcelData,
  handleAddStudentModal,
  handleEditStudent,
  handleDeleteStudent
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* HEADER & CONTROLS */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center flex-wrap gap-2">
          <h3 className="text-base font-bold text-slate-800 flex items-center">
            <i className="fas fa-user-graduate mr-2 text-purple-600 bg-purple-50 p-1.5 rounded"></i> Daftar Murid
          </h3>
          <div className="flex items-center space-x-2">
            {/* Download Template Excel */}
            <button 
              type="button" 
              onClick={downloadExcelTemplate} 
              className="w-10 h-10 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl flex items-center justify-center text-slate-600 shadow-sm transition-all" 
              title="Unduh Format Excel Murid"
            >
              <i className="fas fa-file-download text-base"></i>
            </button>
            
            {/* Upload Data Excel */}
            <label 
              className="w-10 h-10 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm cursor-pointer transition-all" 
              title="Unggah Excel Murid"
            >
              <i className="fas fa-file-upload text-base"></i>
              <input type="file" accept=".xlsx, .xls" onChange={uploadExcelData} className="hidden" />
            </label>
            
            {/* Tambah Murid Manual */}
            <button 
              type="button" 
              onClick={handleAddStudentModal} 
              className="w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-purple-200 transition-all active:scale-95" 
              title="Tambah Murid Manual"
            >
              <i className="fas fa-user-plus text-sm"></i>
            </button>
          </div>
        </div>
        
        {/* TABEL DATA MURID */}
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-3 font-bold">Nama Lengkap Murid</th>
                <th className="px-4 py-3 font-bold">Tanggal Lahir</th>
                <th className="px-4 py-3 font-bold">Kelas</th>
                <th className="px-4 py-3 font-bold text-right">Alat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {studentsDb.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-4 py-3 text-slate-800 font-semibold flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                      {String(s.name || 'M').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm">{s.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-sm font-medium">
                    {s.birthDate || '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-700 text-sm font-bold">
                    {s.studentClass || '-'}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                    <button 
                      onClick={() => handleEditStudent(s)} 
                      className="w-7 h-7 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-md transition-colors opacity-50 group-hover:opacity-100" 
                      title="Edit Murid"
                    >
                      <i className="fas fa-edit text-xs"></i>
                    </button>
                    <button 
                      onClick={() => handleDeleteStudent(s.id)} 
                      className="w-7 h-7 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors opacity-50 group-hover:opacity-100" 
                      title="Hapus Murid"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {studentsDb.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 font-medium italic">
                    <i className="fas fa-folder-open text-xl mb-1.5 block opacity-40"></i>
                    Belum ada data murid terdaftar. Silakan tambah manual atau unggah file Excel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};