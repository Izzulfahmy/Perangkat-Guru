// js/data-rombel.js

const DataRombelView = ({
  rombelsDb,
  selectedRombel,
  setSelectedRombel,
  handleAddRombelModal,
  handleDeleteRombel,
  availableStudentsForRombel,
  activeRombelStudents,
  handleAddStudentToRombel,
  handleRemoveStudentFromRombel
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
      
      {/* SISI KIRI: TABEL DAFTAR ROMBEL (lg:col-span-5) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-5">
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-800 flex items-center">
            <i className="fas fa-cubes mr-2 text-indigo-600 bg-indigo-50 p-1.5 rounded"></i> Daftar Rombel
          </h3>
          <button 
            type="button" 
            onClick={handleAddRombelModal} 
            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 transition-all active:scale-95" 
            title="Tambah Rombel Baru"
          >
            <i className="fas fa-plus text-sm"></i>
          </button>
        </div>
        
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-3 font-bold">Nama Rombel</th>
                <th className="px-4 py-3 font-bold">Wali Kelas</th>
                <th className="px-4 py-3 font-bold text-right">Alat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rombelsDb.map(r => {
                const isSelected = selectedRombel && selectedRombel.id === r.id;
                return (
                  <tr 
                    key={r.id} 
                    onClick={() => setSelectedRombel(r)} 
                    className={`transition-colors cursor-pointer group ${isSelected ? 'bg-indigo-50/60 hover:bg-indigo-50' : 'hover:bg-slate-50/80'}`}
                  >
                    <td className="px-4 py-3">
                      <p className="text-slate-800 font-bold text-sm">{r.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{r.level}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-semibold">{r.homeroomTeacher}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleDeleteRombel(r.id)} 
                        className="w-7 h-7 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors opacity-50 group-hover:opacity-100" 
                        title="Hapus Rombel"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rombelsDb.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-10 text-center text-slate-400 font-medium italic">
                    <i className="fas fa-box-open text-xl mb-1.5 block opacity-40"></i>Belum ada rombel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SISI KANAN: PENGATURAN ANGGOTA KELAS (lg:col-span-7) */}
      <div className="lg:col-span-7">
        {selectedRombel ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 bg-indigo-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <i className="fas fa-users-cog"></i> Pengaturan Anggota Kelas
                </h3>
                <p className="text-xs text-indigo-200 mt-0.5 font-medium">
                  Rombel Aktif: <b className="text-white font-bold">{selectedRombel.name} ({selectedRombel.level})</b> | Wali: {selectedRombel.homeroomTeacher}
                </p>
              </div>
              <span className="text-[10px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full uppercase">
                ID: {selectedRombel.id.toString().slice(-4)}
              </span>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* PANEL SUB-KIRI: DAFTAR MURID BELUM ADA KELAS */}
              <div className="md:col-span-6 bg-slate-50 rounded-xl border border-slate-200 p-3 h-[380px] flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2 shrink-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Belum Ada Kelas ({availableStudentsForRombel.length})
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar pr-1">
                  {availableStudentsForRombel.map(st => (
                    <div key={st.id} className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm hover:border-indigo-300 group transition-all">
                      <div className="text-left max-w-[75%]">
                        <p className="text-xs font-bold text-slate-800 truncate">{st.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Kls: {st.studentClass || '-'}</p>
                      </div>
                      <button 
                        onClick={() => handleAddStudentToRombel(st.id)} 
                        className="w-6 h-6 bg-slate-100 group-hover:bg-indigo-600 text-slate-500 group-hover:text-white rounded-md flex items-center justify-center transition-colors shadow-sm" 
                        title="Masukkan ke Kelas"
                      >
                        <i className="fas fa-chevron-right text-[10px]"></i>
                      </button>
                    </div>
                  ))}
                  {availableStudentsForRombel.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 text-center px-4 py-8">
                      <i className="fas fa-user-check text-2xl mb-2"></i>
                      <p className="text-xs font-semibold">Semua siswa sudah masuk kelas</p>
                    </div>
                  )}
                </div>
              </div>

              {/* PANEL SUB-KANAN: ANGGOTA KELAS ROMBEL YANG DIPILIH */}
              <div className="md:col-span-6 bg-indigo-50/40 rounded-xl border border-indigo-100 p-3 h-[380px] flex flex-col">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-2 mb-2 shrink-0">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Anggota Rombel ({activeRombelStudents.length})
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar pr-1">
                  {activeRombelStudents.map(st => (
                    <div key={st.id} className="flex items-center justify-between bg-white border border-indigo-100 p-2.5 rounded-lg shadow-sm hover:border-red-300 group transition-all">
                      <button 
                        onClick={() => handleRemoveStudentFromRombel(st.id)} 
                        className="w-6 h-6 bg-slate-100 group-hover:bg-red-500 text-slate-500 group-hover:text-white rounded-md flex items-center justify-center transition-colors shadow-sm" 
                        title="Keluarkan dari Kelas"
                      >
                        <i className="fas fa-chevron-left text-[10px]"></i>
                      </button>
                      <div className="text-right max-w-[75%]">
                        <p className="text-xs font-bold text-slate-800 truncate">{st.name}</p>
                        <p className="text-[10px] text-indigo-400 font-medium">Kls: {st.studentClass || '-'}</p>
                      </div>
                    </div>
                  ))}
                  {activeRombelStudents.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 text-center px-4 py-8">
                      <i className="fas fa-folder-open text-2xl mb-2"></i>
                      <p className="text-xs font-semibold">Belum ada siswa di rombel ini</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl h-[456px] flex flex-col items-center justify-center text-slate-400 p-8">
            <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400 text-2xl shadow-sm">
              <i className="fas fa-mouse-pointer"></i>
            </div>
            <h4 className="text-base font-bold text-slate-700">Manajemen Anggota Kelas</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs text-center font-medium">
              Silakan klik salah satu kelompok rombel di tabel sebelah kiri untuk mengonfigurasi atau memasukkan nama siswa.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};