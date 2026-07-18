// js/profil-sekolah.js

const ProfilSekolahView = ({
  settingsDb,
  setSettingsDb,
  isSavingSettings,
  setIsSavingSettings,
  usersDb
}) => {

  const handleToggleLocation = (e) => {
    setSettingsDb({
      ...settingsDb, 
      useLocation: e.target.checked ? 'true' : 'false'
    });
  };

  const handleToggleTime = (e) => {
    setSettingsDb({
      ...settingsDb, 
      useTime: e.target.checked ? 'true' : 'false'
    });
  };

  const handleGetCoordinates = () => {
    Swal.fire({
      title: 'Mencari Lokasi', 
      allowOutsideClick: false, 
      didOpen: () => Swal.showLoading()
    });
    
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const l = `${p.coords.latitude.toFixed(6)}, ${p.coords.longitude.toFixed(6)}`;
        setSettingsDb({ ...settingsDb, lokasi: l });
        Swal.fire({
          icon: 'success', 
          title: 'Lokasi Ditemukan', 
          text: l, 
          timer: 1500, 
          showConfirmButton: false
        });
      }, 
      (err) => {
        Swal.fire('Gagal GPS', err.message, 'error');
      }, 
      { enableHighAccuracy: true }
    );
  };

  const handleAddPj = () => {
    let currentPjs = [];
    try { 
      currentPjs = JSON.parse(settingsDb.penanggungJawab || "[]"); 
    } catch(e) {}
    
    currentPjs.push({ jabatan: '', nama: '', nip: '' });
    setSettingsDb({
      ...settingsDb, 
      penanggungJawab: JSON.stringify(currentPjs)
    });
  };

  const handleRemovePj = (idx) => {
    let currentPjs = [];
    try { 
      currentPjs = JSON.parse(settingsDb.penanggungJawab || "[]"); 
    } catch(e) {}
    
    const np = currentPjs.filter((_, i) => i !== idx);
    setSettingsDb({
      ...settingsDb, 
      penanggungJawab: JSON.stringify(np)
    });
  };

  const handlePjChange = (idx, field, value) => {
    let currentPjs = [];
    try { 
      currentPjs = JSON.parse(settingsDb.penanggungJawab || "[]"); 
    } catch(e) {}
    
    currentPjs[idx][field] = value;
    setSettingsDb({
      ...settingsDb, 
      penanggungJawab: JSON.stringify(currentPjs)
    });
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try { 
      await window.fs.setDoc(window.fs.doc(window.db, "settings", "config"), settingsDb); 
      setIsSavingSettings(false); 
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Pengaturan instansi diperbarui.',
        customClass: { popup: 'swal2-minimalist-popup w-[90%] max-w-sm' }
      }); 
    } catch (error) { 
      setIsSavingSettings(false); 
      Swal.fire('Error', 'Gagal menyimpan pengaturan', 'error'); 
    }
  };

  let pjs = []; 
  try { 
    pjs = JSON.parse(settingsDb.penanggungJawab || "[]"); 
  } catch(e) {}

  return (
    <div className="bg-white p-4 sm:p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 max-w-4xl animate-fadeIn">
      <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center">
        <div className="bg-blue-50 p-2 rounded-xl mr-3">
          <i className="fas fa-building text-blue-600"></i>
        </div>
        Aturan & Profil Sekolah
      </h3>
      
      <form onSubmit={handleSubmitProfile} className="space-y-6">
        {/* NAMA KEGIATAN */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">Nama Kegiatan (Opsional)</label>
          <input 
            type="text" 
            value={settingsDb.namaKegiatan || ''} 
            onChange={e => setSettingsDb({ ...settingsDb, namaKegiatan: e.target.value })} 
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
            placeholder="Contoh: KKN / PKL / Pelatihan Dasar"
          />
        </div>
        
        {/* NAMA INSTANSI */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">Nama Instansi</label>
          <input 
            type="text" 
            required 
            value={settingsDb.namaInstansi} 
            onChange={e => setSettingsDb({ ...settingsDb, namaInstansi: e.target.value })} 
            className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          />
        </div>
        
        {/* TITIK KOORDINAT GPS */}
        <div>
          <div className="flex justify-between items-center mb-2 ml-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Titik Koordinat (Pusat GPS)</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={String(settingsDb.useLocation).toLowerCase() === 'true'} 
                onChange={handleToggleLocation} 
              />
              <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
              <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase">
                {String(settingsDb.useLocation).toLowerCase() === 'true' ? 'Aktif' : 'Nonaktif'}
              </span>
            </label>
          </div>
          <div className={`flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 transition-opacity ${String(settingsDb.useLocation).toLowerCase() !== 'true' ? 'opacity-50 pointer-events-none' : ''}`}>
            <input 
              type="text" 
              required={String(settingsDb.useLocation).toLowerCase() === 'true'} 
              value={settingsDb.lokasi} 
              onChange={e => setSettingsDb({ ...settingsDb, lokasi: e.target.value })} 
              className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-semibold font-mono text-sm text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="Contoh: -6.200000, 106.816666" 
            />
            <button 
              type="button" 
              onClick={handleGetCoordinates} 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center whitespace-nowrap text-sm"
            >
              <i className="fas fa-crosshairs text-blue-600 mr-2"></i> Ambil Titik
            </button>
          </div>
        </div>

        {/* PEMBATASAN WAKTU JAM MASUK & PULANG */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 pt-6 mt-6">
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Batas Jam Masuk</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={String(settingsDb.useTime).toLowerCase() === 'true'} 
                  onChange={handleToggleTime} 
                />
                <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase">
                  {String(settingsDb.useTime).toLowerCase() === 'true' ? 'Aktif' : 'Nonaktif'}
                </span>
              </label>
            </div>
            <div className={`transition-opacity ${String(settingsDb.useTime).toLowerCase() !== 'true' ? 'opacity-50 pointer-events-none' : ''}`}>
              <input 
                type="time" 
                value={settingsDb.jamMasuk} 
                onChange={e => setSettingsDb({ ...settingsDb, jamMasuk: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold text-lg text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <p className="text-[9px] text-slate-400 font-semibold mt-1.5 ml-1 italic">*Lebih dari jam ini status menjadi "Terlambat"</p>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 ml-1">Jam Pulang Default</label>
            <input 
              type="time" 
              value={settingsDb.jamPulang} 
              onChange={e => setSettingsDb({ ...settingsDb, jamPulang: e.target.value })} 
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-bold text-lg text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* ALAMAT LENGKAP INSTANSI */}
        <div className="border-t border-slate-100 pt-6 mt-6">
          <h4 className="text-sm font-bold text-slate-800 flex items-center mb-4">
            <i className="fas fa-map-marked-alt mr-2 text-blue-500"></i> Alamat Lengkap Instansi
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Jalan / Detail Alamat</label>
              <input 
                type="text" 
                value={settingsDb.alamat || ''} 
                onChange={e => setSettingsDb({ ...settingsDb, alamat: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                placeholder="Jl. Kalimantan No. 37"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Desa / Kecamatan</label>
                <input 
                  type="text" 
                  value={settingsDb.desaKecamatan || ''} 
                  onChange={e => setSettingsDb({ ...settingsDb, desaKecamatan: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                  placeholder="Cth: Sumbersari"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Kota / Kabupaten</label>
                <input 
                  type="text" 
                  value={settingsDb.kotaKabupaten || ''} 
                  onChange={e => setSettingsDb({ ...settingsDb, kotaKabupaten: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                  placeholder="Cth: Jember"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Provinsi / Negara</label>
                <input 
                  type="text" 
                  value={settingsDb.negara || ''} 
                  onChange={e => setSettingsDb({ ...settingsDb, negara: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                  placeholder="Cth: Jawa Timur, Indonesia"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Kode Pos</label>
                <input 
                  type="text" 
                  value={settingsDb.kodePos || ''} 
                  onChange={e => setSettingsDb({ ...settingsDb, kodePos: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                  placeholder="Cth: 68121"
                />
              </div>
            </div>
          </div>
        </div>

        {/* INTEGRASI LINK WEBSITE */}
        <div className="border-t border-slate-100 pt-6 mt-6">
          <h4 className="text-sm font-bold text-slate-800 flex items-center mb-4">
            <i className="fas fa-link mr-2 text-blue-500"></i> Integrasi Sistem
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Link Website (Akan digunakan untuk QR Verifikasi PDF)</label>
              <input 
                type="url" 
                value={settingsDb.appScriptUrl || ''} 
                onChange={e => setSettingsDb({ ...settingsDb, appScriptUrl: e.target.value })} 
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                placeholder="Cth: https://username.github.io/perangkat-guru"
              />
              <p className="text-[9px] text-slate-400 font-semibold mt-1.5 ml-1 italic">*Kosongkan jika ingin sistem mendeteksi otomatis URL GitHub Pages Anda.</p>
            </div>
          </div>
        </div>

        {/* PENANGGUNG JAWAB LAPORAN (PJ) */}
        <div className="border-t border-slate-100 pt-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center">
              <i className="fas fa-pen-nib mr-2 text-blue-500"></i> Penanggung Jawab Laporan
            </h4>
            <button 
              type="button" 
              onClick={handleAddPj} 
              className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
            >
              <i className="fas fa-plus mr-1"></i> Tambah PJ
            </button>
          </div>
          
          {pjs.length === 0 ? (
            <p className="text-xs text-slate-400 italic mb-4">Belum ada penanggung jawab. Klik tombol tambah.</p>
          ) : (
            pjs.map((pj, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-3 relative group">
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Jabatan</label>
                  <input 
                    type="text" 
                    value={pj.jabatan} 
                    onChange={e => handlePjChange(idx, 'jabatan', e.target.value)} 
                    placeholder="Cth: Kepala Sekolah" 
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg font-normal text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={pj.nama} 
                    onChange={e => handlePjChange(idx, 'nama', e.target.value)} 
                    placeholder="Cth: Budi Santoso, M.Pd" 
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg font-semibold text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">NIP / NIM / Kustom</label>
                  <input 
                    type="text" 
                    value={pj.nip} 
                    onChange={e => handlePjChange(idx, 'nip', e.target.value)} 
                    placeholder="Cth: NIP. 1980..." 
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg font-semibold text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="sm:col-span-1 flex flex-col justify-end">
                  <button 
                    type="button" 
                    onClick={() => handleRemovePj(idx)} 
                    className="w-full h-[38px] bg-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSavingSettings}
          className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 mt-2 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center text-sm disabled:opacity-50"
        >
          {isSavingSettings ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
          Simpan Pengaturan
        </button>
      </form>
    </div>
  );
};