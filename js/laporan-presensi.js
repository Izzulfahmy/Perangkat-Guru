// js/laporan-presensi.js

const LaporanPresensiView = ({
  filterMonth,
  setFilterMonth,
  filteredAttendanceData,
  usersDb,
  currentVerif,
  hasData,
  handleAddBulkAttendance,
  handleGenerateVerif,
  handleDownloadPDF,
  handleEditAttendance,
  handleDeleteAttendance,
  availableMonthsOptions
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
      {/* HEADER DAN LOGIKA KONTROL AKSI */}
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <i className="fas fa-file-signature mr-2 text-blue-600"></i>Rekapitulasi Kehadiran
        </h3>
        <div className="flex items-center space-x-2.5 w-full md:w-auto justify-end flex-wrap gap-y-2">
          {/* Input Filter Bulan Periode Laporan */}
          <input 
            type="month" 
            value={filterMonth} 
            onChange={e => setFilterMonth(e.target.value)} 
            className="flex-1 md:flex-none bg-white border border-slate-300 text-slate-700 font-bold py-2 px-3 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all h-[38px]" 
          />
          
          {/* Tombol Aksi Presensi Massal */}
          <button 
            onClick={handleAddBulkAttendance} 
            className="bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 p-2.5 rounded-lg transition-all flex items-center justify-center shadow-sm h-[38px]" 
            title="Tambah Presensi Massal"
          >
            <i className="fas fa-calendar-plus text-lg"></i>
          </button>
          
          {/* Tautan Navigasi Verifikasi Resmi Jika Sudah Digenerate */}
          {hasData && currentVerif && (
            <a 
              href={currentVerif.url} 
              target="_blank" 
              rel="noreferrer" 
              className="bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-500 p-2.5 rounded-lg transition-all flex items-center justify-center shadow-sm h-[38px]" 
              title="Buka Halaman Verifikasi Resmi"
            >
              <i className="fas fa-external-link-alt text-lg"></i>
            </a>
          )}
          
          {/* Generate Link Verifikasi Dokumen Baru */}
          {hasData && !currentVerif && (
            <button 
              onClick={handleGenerateVerif} 
              className="bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white border border-blue-200 hover:border-blue-500 p-2.5 rounded-lg transition-all flex items-center justify-center shadow-sm h-[38px]" 
              title="Generate Tautan Verifikasi Baru"
            >
              <i className="fas fa-link text-lg"></i>
            </button>
          )}
          
          {/* Tombol Cetak PDF Laporan */}
          {hasData && (
            <button 
              onClick={handleDownloadPDF} 
              className="bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 p-2.5 rounded-lg transition-all flex items-center justify-center shadow-sm h-[38px]" 
              title="Unduh Laporan Format PDF Resmi"
            >
              <i className="fas fa-file-pdf text-lg"></i>
            </button>
          )}
        </div>
      </div>

      {/* TABEL REKAP DATA ABSENSI BULANAN */}
      <div className="overflow-x-auto p-2">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
              <th className="px-4 py-3 font-bold">Tanggal</th>
              <th className="px-4 py-3 font-bold">Nama Lengkap</th>
              <th className="px-4 py-3 font-bold">Jam Masuk</th>
              <th className="px-4 py-3 font-bold">Jam Pulang</th>
              <th className="px-4 py-3 font-bold">Status Kehadiran</th>
              <th className="px-4 py-3 font-bold text-right">Alat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredAttendanceData.length > 0 ? (
              filteredAttendanceData
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(record => {
                  const u = usersDb.find(user => user.id === record.userId);
                  if (!u) return null;
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-3 text-slate-600 font-semibold text-xs">
                        {new Date(record.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800 text-sm">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-bold tabular-nums text-sm">
                        {record.timeIn}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-bold tabular-nums text-sm">
                        {record.timeOut || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          ['Hadir', 'Terlambat'].includes(record.status)
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : record.status === 'Menunggu'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : 'bg-purple-100 text-purple-700 border border-purple-200'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                        <button 
                          onClick={() => handleEditAttendance(record)} 
                          className="w-7 h-7 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-md transition-colors opacity-50 group-hover:opacity-100" 
                          title="Edit Presensi Manual"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button 
                          onClick={() => handleDeleteAttendance(record.id)} 
                          className="w-7 h-7 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors opacity-50 group-hover:opacity-100" 
                          title="Hapus Rekaman Presensi"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-400 font-medium">
                  <i className="fas fa-box-open text-2xl mb-2 block opacity-50"></i>
                  Belum ada data presensi pada bulan ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};