// js/dashboard-admin.js

const DashboardAdminView = ({
  usersDb,
  attendanceDb,
  studentsDb,
  holidaysDb,
  settingsDb,
  filterMonth,
  setFilterMonth,
  todayStr,
  currentTime,
  availableMonthsOptions,
  monthlyClientSummaries
}) => {

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 3 COUNTER CARDS UTAMA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Card Total Guru */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-5 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-inner relative z-10">
            <i className="fas fa-chalkboard-teacher text-xl"></i>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total Guru</p>
            <h3 className="text-3xl font-black text-slate-800">
              {usersDb.filter(u => u.role === 'client').length}
            </h3>
          </div>
        </div>

        {/* Card Guru Hadir Hari Ini */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-5 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-20 h-20 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shadow-inner relative z-10">
            <i className="fas fa-check-double text-xl"></i>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Guru Hadir Hari Ini</p>
            <h3 className="text-3xl font-black text-slate-800">
              {attendanceDb.filter(a => a.date === todayStr && ['Hadir', 'Terlambat'].includes(a.status)).length}
            </h3>
          </div>
        </div>

        {/* Card Total Murid */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-5 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-20 h-20 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shadow-inner relative z-10">
            <i className="fas fa-user-graduate text-xl"></i>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Murid</p>
            <h3 className="text-3xl font-black text-slate-800">{studentsDb.length}</h3>
          </div>
        </div>
      </div>

      {/* TABEL RINGKASAN AKUMULASI BULANAN GURU */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center">
              <i className="fas fa-chart-bar mr-2 text-blue-600"></i>Ringkasan Akumulasi Kehadiran Bulanan Guru
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Total akumulasi kehadiran pada periode aktif: <b className="text-blue-600">{filterMonth}</b>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide hidden sm:block">Pilih Periode:</label>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm">
              {availableMonthsOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-3 font-bold">Nama Lengkap</th>
                <th className="px-4 py-3 font-bold text-center text-green-600">Hadir</th>
                <th className="px-4 py-3 font-bold text-center text-purple-600">Izin</th>
                <th className="px-4 py-3 font-bold text-center text-yellow-600">Sakit</th>
                <th className="px-4 py-3 font-bold text-center text-red-600">Alpa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {monthlyClientSummaries.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors font-medium">
                  <td className="px-4 py-3 font-bold text-slate-800 flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs uppercase">{c.name.charAt(0)}</div>
                    <div>
                      <span>{c.name}</span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{c.nim || '-'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums text-green-600 font-bold bg-green-50/20">{c.hadir}</td>
                  <td className="px-4 py-3 text-center tabular-nums text-purple-600 font-bold bg-purple-50/20">{c.izin}</td>
                  <td className="px-4 py-3 text-center tabular-nums text-yellow-600 font-bold bg-yellow-50/20">{c.sakit}</td>
                  <td className="px-4 py-3 text-center tabular-nums text-red-600 font-bold bg-red-50/20">{c.alpa}</td>
                </tr>
              ))}
              {monthlyClientSummaries.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-400 font-medium italic">
                    <i className="fas fa-folder-open text-xl mb-1.5 block opacity-40"></i>Belum ada data guru terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STATUS KEHADIRAN REALTIME HARI INI (GURU) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center">
              <i className="fas fa-clipboard-list mr-2 text-blue-600"></i>Status Kehadiran Hari Ini (Guru)
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Daftar rekap kehadiran real-time per tanggal {currentTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-wide tracking-tight tabular-nums">Hari Aktif</span>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-3 font-bold">Nama Lengkap</th>
                <th className="px-4 py-3 font-bold">Jam Masuk</th>
                <th className="px-4 py-3 font-bold">Jam Pulang</th>
                <th className="px-4 py-3 font-bold text-right">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {usersDb.filter(u => u.role === 'client').map(client => {
                const record = attendanceDb.find(a => a.userId === client.id && a.date === todayStr);
                const status = record ? record.status : 'Belum Absen';
                const timeIn = record ? record.timeIn : '-';
                const timeOut = record ? record.timeOut || '-' : '-';

                return (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-800 flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs uppercase">{client.name.charAt(0)}</div>
                      <div>
                        <span>{client.name}</span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{client.nim || '-'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-700 tabular-nums">{timeIn}</td>
                    <td className="px-4 py-3 font-bold text-slate-700 tabular-nums">{timeOut}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ['Hadir', 'Terlambat'].includes(status) ? 'bg-green-100 text-green-700 border border-green-200' :
                        ['Izin', 'Sakit'].includes(status) ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                        status === 'Belum Absen' ? 'bg-yellow-5 text-yellow-700 border border-yellow-200/60 animate-pulse' :
                        'bg-red-100 text-red-700 border border-red-200'
                      }`}>{status}</span>
                    </td>
                  </tr>
                );
              })}
              {usersDb.filter(u => u.role === 'client').length === 0 && (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 font-medium italic">
                    <i className="fas fa-folder-open text-xl mb-1.5 block opacity-40"></i>Belum ada personil guru yang terdaftar di database.
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