// js/tahun-pelajaran.js

const TahunPelajaranView = ({
  academicYearsDb,
  setAcademicYearsDb,
  newAcademicYear,
  setNewAcademicYear,
  usersDb,
  handleAddAcademicYear,
  handleSetAcademicYearActive,
  handleDeleteAcademicYear
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* FORM PEMBUATAN TAHUN PELAJARAN BARU */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center">
          <i className="fas fa-graduation-cap mr-2 text-blue-600 bg-blue-50 p-1.5 rounded"></i> Buat Periode Tahun Pelajaran
        </h3>
        <form onSubmit={handleAddAcademicYear} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Tahun Awal</label>
            <input 
              type="number" 
              required 
              value={newAcademicYear.startYear} 
              onChange={e => {
                const start = parseInt(e.target.value) || new Date().getFullYear();
                setNewAcademicYear({
                  ...newAcademicYear, 
                  startYear: start, 
                  endYear: start + 1
                });
              }} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Tahun Akhir</label>
            <input 
              type="number" 
              required 
              value={newAcademicYear.endYear} 
              readOnly 
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-400 outline-none transition-all cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Periode Semester</label>
            <select 
              value={newAcademicYear.semester} 
              onChange={e => setNewAcademicYear({...newAcademicYear, semester: e.target.value})} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Nama Kurikulum</label>
            <input 
              type="text" 
              required 
              value={newAcademicYear.curriculum} 
              onChange={e => setNewAcademicYear({...newAcademicYear, curriculum: e.target.value})} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="Cth: Kurikulum Merdeka"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Kepala Sekolah (Dari Guru)</label>
            <select 
              value={newAcademicYear.headmaster} 
              onChange={e => setNewAcademicYear({...newAcademicYear, headmaster: e.target.value})} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              {usersDb.filter(u => u.role === 'client').map(teacher => (
                <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
              ))}
              {usersDb.filter(u => u.role === 'client').length === 0 && <option value="">Daftarkan Guru Terlebih Dahulu</option>}
            </select>
          </div>
          <div className="md:col-span-5 flex justify-end pt-2">
            <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 text-sm">
              <i className="fas fa-plus mr-2"></i> Tambah Tahun Pelajaran
            </button>
          </div>
        </form>
      </div>

      {/* TABEL DAFTAR KONFIGURASI TAHUN PELAJARAN */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-800">Daftar Konfigurasi Tahun Pelajaran</h3>
          <span className="text-xs font-semibold text-slate-400 italic">*Hanya satu periode yang dapat ditetapkan aktif</span>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-3 font-bold">Tahun Pelajaran</th>
                <th className="px-4 py-3 font-bold">Semester</th>
                <th className="px-4 py-3 font-bold">Kurikulum</th>
                <th className="px-4 py-3 font-bold">Kepala Sekolah</th>
                <th className="px-4 py-3 font-bold text-center">Status</th>
                <th className="px-4 py-3 font-bold text-right">Alat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {academicYearsDb.map(ay => (
                <tr key={ay.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-4 py-3 text-slate-800 font-bold tracking-wide">{ay.year}</td>
                  <td className="px-4 py-3 text-slate-600 font-semibold">{ay.semester}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{ay.curriculum}</td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{ay.headmaster}</td>
                  <td className="px-4 py-3 text-center">
                    {ay.isActive ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-green-200">Aktif</span>
                    ) : (
                      <button 
                        onClick={() => handleSetAcademicYearActive(ay.id)} 
                        className="bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200 transition-colors"
                      >
                        Set Aktif
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button 
                      onClick={() => handleDeleteAcademicYear(ay.id)} 
                      className="w-7 h-7 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors opacity-50 group-hover:opacity-100" 
                      title="Hapus Tahun Pelajaran"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {academicYearsDb.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-slate-400 font-medium italic">
                    <i className="fas fa-folder-open text-xl mb-1.5 block opacity-40"></i>Belum ada data konfigurasi Tahun Pelajaran.
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