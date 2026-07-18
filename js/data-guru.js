// js/data-guru.js

const DataGuruView = ({
  usersDb,
  newUser,
  setNewUser,
  handleAddUser,
  handleEditUser,
  handleDeleteUser
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* FORM PENDAFTARAN GURU BARU */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center">
          <i className="fas fa-chalkboard-teacher mr-2 text-blue-600 bg-blue-50 p-1.5 rounded"></i> Pendaftaran Guru Baru
        </h3>
        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Nama Lengkap</label>
            <input 
              type="text" 
              required 
              value={newUser.name} 
              onChange={e => setNewUser({ ...newUser, name: e.target.value })} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="Cth: Joko Widodo"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Username Login</label>
            <input 
              type="text" 
              required 
              value={newUser.username} 
              onChange={e => setNewUser({ ...newUser, username: e.target.value })} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="Cth: Joko"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">NIP/NIM</label>
            <input 
              type="text" 
              value={newUser.nim} 
              onChange={e => setNewUser({ ...newUser, nim: e.target.value })} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="Cth: 198210..."
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 h-[42px] text-sm"
          >
            Simpan Data
          </button>
        </form>
      </div>

      {/* TABEL DAFTAR AKUN GURU */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-800">Daftar Akun Guru</h3>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
                <th className="px-4 py-3 font-bold">Nama Lengkap</th>
                <th className="px-4 py-3 font-bold">Username</th>
                <th className="px-4 py-3 font-bold">NIP/NIM</th>
                <th className="px-4 py-3 font-bold text-right">Alat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {usersDb.filter(u => u.role === 'client').map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-4 py-3 text-slate-800 font-semibold flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {String(u.name || 'G').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm">{u.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono">
                      {u.username}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium text-sm">
                    {u.nim || '-'}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap space-x-2">
                    <button 
                      onClick={() => handleEditUser(u)} 
                      className="w-7 h-7 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-md transition-colors opacity-50 group-hover:opacity-100" 
                      title="Edit Akun"
                    >
                      <i className="fas fa-edit text-xs"></i>
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(u.id)} 
                      className="w-7 h-7 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors opacity-50 group-hover:opacity-100" 
                      title="Hapus Akun"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {usersDb.filter(u => u.role === 'client').length === 0 && (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 font-medium italic">
                    <i className="fas fa-folder-open text-xl mb-1.5 block opacity-40"></i>Belum ada data guru terdaftar.
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