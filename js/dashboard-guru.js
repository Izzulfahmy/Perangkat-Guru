// js/dashboard-guru.js

const DashboardGuruView = ({
  user,
  settingsDb,
  currentTime,
  attendanceDb,
  setAttendanceDb,
  holidaysDb,
  usersDb,
  isLocating,
  setIsLocating,
  ensureAllClientsHaveRecord
}) => {
  const todayStr = getLocalYYYYMMDD(currentTime);
  const todayRec = attendanceDb.find(a => a.userId === user?.id && a.date === todayStr);
  const activeRec = todayRec && todayRec.status !== 'Menunggu' ? todayRec : null;

  const performPresensi = async (tipe) => {
    const day = currentTime.getDay();
    const isLiburMinggu = String(settingsDb.liburMinggu).toLowerCase() === 'true';
    const isLiburSabtu = String(settingsDb.liburSabtu).toLowerCase() === 'true';

    if ((isLiburMinggu && day === 0) || (isLiburSabtu && day === 6)) {
      return Swal.fire({ 
        title: 'Hari Libur', 
        text: 'Hari ini ditetapkan sebagai hari libur.', 
        icon: 'info', 
        customClass: { popup: 'swal2-minimalist-popup w-[90%] max-w-sm' }
      });
    }
    if (holidaysDb.find(h => h.date === todayStr)) {
      return Swal.fire({ 
        title: 'Hari Libur', 
        text: 'Hari ini adalah tanggal merah.', 
        icon: 'info', 
        customClass: { popup: 'swal2-minimalist-popup w-[90%] max-w-sm' }
      });
    }

    const executePresensi = async () => {
      const time = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (tipe === 'masuk') {
        let late = false;
        if (String(settingsDb.useTime).toLowerCase() === 'true') {
          const b = settingsDb.jamMasuk.split(':'), a = time.split(':');
          late = parseInt(a[0]) > parseInt(b[0]) || (a[0] === b[0] && parseInt(a[1]) > parseInt(b[1]));
        }
        
        let existingUserRec = attendanceDb.find(a => a.userId === user?.id && a.date === todayStr);
        let updatedRec;

        if (existingUserRec) {
          updatedRec = { ...existingUserRec, timeIn: time, status: late ? 'Terlambat' : 'Hadir' };
          await window.fs.updateDoc(window.fs.doc(window.db, "attendance", updatedRec.id.toString()), { timeIn: time, status: updatedRec.status });
        } else {
          updatedRec = { id: Date.now(), userId: user?.id, date: todayStr, timeIn: time, timeOut: null, status: late ? 'Terlambat' : 'Hadir' };
          await window.fs.setDoc(window.fs.doc(window.db, "attendance", updatedRec.id.toString()), updatedRec);
        }

        const newPlaceholders = await ensureAllClientsHaveRecord(todayStr, user?.id);
        const filteredDb = attendanceDb.filter(a => a.id !== (existingUserRec ? existingUserRec.id : null));
        setAttendanceDb([...filteredDb, updatedRec, ...newPlaceholders]);

        Swal.fire({ 
          icon: 'success', 
          title: 'Berhasil Masuk', 
          text: `Presensi dicatat pukul ${time}`, 
          timer: 2000, 
          showConfirmButton: false, 
          customClass: { popup: 'swal2-minimalist-popup w-[90%] max-w-sm' } 
        });
      
      } else {
        const activeRec = attendanceDb.find(a => a.userId === user?.id && a.date === todayStr && a.status !== 'Menunggu');
        if (activeRec) {
          const up = attendanceDb.map(r => r.id === activeRec.id ? { ...r, timeOut: time } : r);
          setAttendanceDb(up);
          await window.fs.updateDoc(window.fs.doc(window.db, "attendance", activeRec.id.toString()), { timeOut: time });
          Swal.fire({ 
            icon: 'success', 
            title: 'Berhasil Pulang', 
            text: `Sampai jumpa! Dicatat pukul ${time}`, 
            timer: 2000, 
            showConfirmButton: false, 
            customClass: { popup: 'swal2-minimalist-popup w-[90%] max-w-sm' } 
          });
        }
      }
    };

    if (String(settingsDb.useLocation).toLowerCase() === 'true') {
      if (!settingsDb.lokasi || settingsDb.lokasi.includes('Memuat')) {
        return Swal.fire({
          title: 'Error Konfigurasi', 
          text: 'Lokasi sekolah belum diset.', 
          icon: 'warning', 
          customClass: { popup: 'swal2-minimalist-popup w-[90%] max-w-sm' }
        });
      }
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(pos => {
        const off = settingsDb.lokasi.split(',');
        const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, parseFloat(off[0]), parseFloat(off[1]));
        setIsLocating(false);
        if (dist > 100) {
          return Swal.fire({ 
            icon: 'error', 
            title: 'Di Luar Jangkauan', 
            html: `Jarak Anda <b>${Math.round(dist)} meter</b> dari lokasi.<br><span class="text-sm">(Maksimal: 100 meter)</span>`, 
            confirmButtonColor: '#ef4444', 
            customClass: { popup: 'swal2-minimalist-popup w-[90%] max-w-sm' } 
          });
        }
        executePresensi();
      }, err => { 
        setIsLocating(false); 
        Swal.fire({
          title: 'GPS Error', 
          text: 'Pastikan GPS menyala.', 
          icon: 'error', 
          customClass: { popup: 'swal2-minimalist-popup w-[90%] max-w-sm' }
        }); 
      }, { enableHighAccuracy: true });
    } else {
      executePresensi();
    }
  };

  const performIzinSakit = (tipe) => {
    const day = currentTime.getDay();
    const isLiburMinggu = String(settingsDb.liburMinggu).toLowerCase() === 'true';
    const isLiburSabtu = String(settingsDb.liburSabtu).toLowerCase() === 'true';

    if ((isLiburMinggu && day === 0) || (isLiburSabtu && day === 6)) {
      return Swal.fire({ title: 'Hari Libur', text: 'Hari ini ditetapkan libur.', icon: 'info', customClass: { popup: 'swal2-minimalist-popup w-[90%] max-w-sm' } });
    }
    if (holidaysDb.find(h => h.date === todayStr)) {
      return Swal.fire({ title: 'Hari Libur', text: 'Hari ini tanggal merah.', icon: 'info', customClass: { popup: 'swal2-minimalist-popup w-[90%] max-w-sm' } });
    }

    Swal.fire({
      title: `Pengajuan ${tipe}`, 
      text: `Anda akan tercatat ${tipe} untuk hari ini. Lanjutkan?`, 
      icon: 'question',
      showCancelButton: true, 
      confirmButtonColor: '#3b82f6', 
      cancelButtonColor: '#94a3b8', 
      confirmButtonText: 'Ya, Lanjutkan', 
      customClass: { popup: 'swal2-minimalist-popup w-[90%] max-w-sm' }
    }).then(async res => {
      if (res.isConfirmed) {
        const time = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let existingUserRec = attendanceDb.find(a => a.userId === user?.id && a.date === todayStr);
        let updatedRec;

        if (existingUserRec) {
          updatedRec = { ...existingUserRec, timeIn: time, timeOut: '-', status: tipe };
          await window.fs.updateDoc(window.fs.doc(window.db, "attendance", updatedRec.id.toString()), { timeIn: time, timeOut: '-', status: tipe });
        } else {
          updatedRec = { id: Date.now(), userId: user?.id, date: todayStr, timeIn: time, timeOut: '-', status: tipe };
          await window.fs.setDoc(window.fs.doc(window.db, "attendance", updatedRec.id.toString()), updatedRec);
        }

        const newPlaceholders = await ensureAllClientsHaveRecord(todayStr, user?.id);
        const filteredDb = attendanceDb.filter(a => a.id !== (existingUserRec ? existingUserRec.id : null));
        setAttendanceDb([...filteredDb, updatedRec, ...newPlaceholders]);

        Swal.fire({ icon: 'success', title: 'Berhasil', text: `Status ${tipe} berhasil dicatat.`, timer: 2000, showConfirmButton: false, customClass: { popup: 'swal2-minimalist-popup w-[90%] max-w-sm' } });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {/* PANEL AKSI ABSENSI */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center relative overflow-hidden group">
        {isLocating && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
            <i className="fas fa-satellite-dish fa-spin text-4xl text-blue-600 mb-4"></i>
            <p className="font-bold text-slate-800 text-base">Mendeteksi Lokasi GPS...</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Mohon tunggu sebentar</p>
          </div>
        )}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
        <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-200/50 relative z-10 text-white">
          <i className="fas fa-chalkboard-user text-4xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4 relative z-10">Presensi Perangkat Guru</h2>
        <div className="flex flex-col items-center space-y-2.5 mb-8 relative z-10">
          <div className="text-slate-700 font-bold text-sm sm:text-base flex items-center bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <i className="fas fa-user-circle mr-2 text-blue-500 text-lg"></i>{user.name}
          </div>
          <div className="text-slate-500 font-medium text-xs flex items-center bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            <i className="fas fa-building mr-1.5 text-slate-400"></i>{settingsDb.namaInstansi}
          </div>
        </div>
        <div className="w-full relative z-10">
          {!activeRec ? (
            <div className="flex flex-col space-y-3">
              <button onClick={() => performPresensi('masuk')} disabled={isLocating} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-base shadow-lg shadow-blue-200/50 transform transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center">
                <i className="fas fa-sign-in-alt mr-2"></i> Presensi Sekarang
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => performIzinSakit('Izin')} disabled={isLocating} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-purple-200/50 transform transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center">
                  <i className="fas fa-envelope-open-text mr-2"></i> Izin
                </button>
                <button onClick={() => performIzinSakit('Sakit')} disabled={isLocating} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-yellow-200/50 transform transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center">
                  <i className="fas fa-notes-medical mr-2"></i> Sakit
                </button>
              </div>
            </div>
          ) : !activeRec.timeOut && !['Izin', 'Sakit', 'Alpa'].includes(activeRec.status) ? (
            <button onClick={() => performPresensi('pulang')} disabled={isLocating} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-base shadow-lg shadow-orange-200/50 transform transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center">
              <i className="fas fa-sign-out-alt mr-2"></i> Pulang Sekarang
            </button>
          ) : (
            <div className="w-full bg-green-50 text-green-700 p-4 rounded-xl font-bold border border-green-200 flex items-center justify-center space-x-2 text-base">
              <i className="fas fa-check-circle text-xl"></i><span>Tugas Selesai / {activeRec.status}</span>
            </div>
          )}
        </div>
      </div>

      {/* PANEL STATUS REKAPAN REALTIME HARI INI */}
      <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl text-white flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-900/20 to-transparent pointer-events-none"></div>
        <h3 className="text-xl font-bold mb-8 border-b border-slate-800 pb-4 relative z-10 flex items-center">
          <i className="fas fa-clipboard-check mr-3 text-blue-400"></i>Status Kehadiran
        </h3>
        {activeRec ? (
          <div className="space-y-6 relative z-10 flex-1 justify-center flex flex-col">
            <div className="flex justify-between items-center bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
              <div className="space-y-1">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center">
                  <i className="fas fa-door-open mr-1.5 text-slate-500"></i>Jam Masuk
                </p>
                <p className="text-3xl font-black tabular-nums">{activeRec.timeIn}</p>
              </div>
              <span className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide shadow-md ${['Hadir', 'Terlambat'].includes(activeRec.status) ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
                {activeRec.status}
              </span>
            </div>
            <div className="flex justify-between items-center bg-slate-800/50 p-5 rounded-xl border border-slate-700/50">
              <div className="space-y-1">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center">
                  <i className="fas fa-door-closed mr-1.5 text-slate-500"></i>Jam Pulang
                </p>
                <p className="text-3xl font-black tabular-nums">{activeRec.timeOut || '--:--'}</p>
              </div>
              {activeRec.timeOut ? (
                <div className="bg-blue-500/20 p-2.5 rounded-lg border border-blue-500/30">
                  <i className="fas fa-check text-xl text-blue-400"></i>
                </div>
              ) : (
                <span className="text-[10px] font-bold text-orange-400 animate-pulse bg-orange-500/10 px-3 py-1.5 rounded-md border border-orange-500/20">
                  Menunggu
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40 relative z-10 py-6">
            <i className="fas fa-mug-hot text-5xl mb-4"></i>
            <p className="font-semibold text-sm">Belum ada data presensi hari ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};