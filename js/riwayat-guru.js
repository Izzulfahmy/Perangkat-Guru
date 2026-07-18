// js/riwayat-guru.js

const RiwayatGuruView = ({ user, attendanceDb }) => {
  const userRecords = React.useMemo(() => {
    return attendanceDb
      .filter(a => a.userId === user?.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [attendanceDb, user]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center">
        <i className="fas fa-history mr-2 text-blue-600"></i>
        <h3 className="text-lg font-bold text-slate-800">Catatan Kehadiran Anda</h3>
      </div>
      <div className="overflow-x-auto p-2">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
              <th className="px-4 py-3 font-bold">Tanggal</th>
              <th className="px-4 py-3 font-bold">Jam Masuk</th>
              <th className="px-4 py-3 font-bold">Jam Pulang</th>
              <th className="px-4 py-3 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {userRecords.length > 0 ? (
              userRecords.map(record => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 text-slate-700 font-semibold">
                    {new Date(record.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-bold tabular-nums">
                    {record.timeIn}
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-bold tabular-nums">
                    {record.timeOut || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      ['Hadir', 'Terlambat'].includes(record.status)
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : record.status === 'Menunggu'
                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-12 text-center text-slate-400 font-medium">
                  <i className="fas fa-folder-open text-2xl mb-2 block opacity-50"></i>
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