// js/kalender-akademik.js

const CalendarComponent = ({ 
  userRole, 
  settingsDb, 
  setSettingsDb, 
  holidaysDb, 
  setHolidaysDb, 
  isSavingSettings, 
  setIsSavingSettings, 
  attendanceDb, 
  usersDb 
}) => {
  const [viewDate, setViewDate] = React.useState(new Date());

  const days = React.useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    let firstDay = new Date(year, month, 1).getDay() - 1;
    if (firstDay === -1) firstDay = 6;
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    let dateArr = [];
    for (let i = 0; i < firstDay; i++) dateArr.push(null);
    for (let i = 1; i <= lastDate; i++) dateArr.push(new Date(year, month, i));
    return dateArr;
  }, [viewDate]);

  const changeMonth = (offset) => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));

  const handleDateClick = async (date) => {
    if (userRole !== 'admin') return;
    if (!date) return;
    const dateStr = getLocalYYYYMMDD(date);
    const formattedDateTitle = date.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});

    const updateSwalListDOM = (currentHolidays) => {
      const listContainer = document.getElementById('swal-holiday-list-container');
      if (!listContainer) return;
      
      if (currentHolidays.length === 0) {
        listContainer.innerHTML = `<p class="text-xs text-slate-400 italic px-1 py-2 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200">Belum ada agenda libur khusus</p>`;
      } else {
        listContainer.innerHTML = currentHolidays.map(h => `
          <div id="holiday-item-${h.id}" class="flex items-center justify-between bg-red-50/60 border border-red-100 p-3 rounded-xl">
            <span class="text-xs font-semibold text-slate-700">${h.description}</span>
            <button type="button" onclick="window.deleteHolidayEvent(${h.id})" class="w-6 h-6 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-lg flex items-center justify-center transition-colors shadow-sm">
              <i class="fas fa-times text-[10px]"></i>
            </button>
          </div>
        `).join('');
      }
      const labelCounter = document.getElementById('swal-holiday-counter-label');
      if (labelCounter) labelCounter.innerText = `Acara Aktif (${currentHolidays.length})`;
    };

    Swal.fire({
      title: `<h2 class="text-lg font-bold text-slate-800">Agenda Hari Libur</h2><p class="text-xs text-slate-400 mt-0.5">${formattedDateTitle}</p>`,
      html: `
        <div class="text-left mt-4 space-y-4">
          <div class="space-y-2">
            <label id="swal-holiday-counter-label" class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Acara Aktif (0)</label>
            <div id="swal-holiday-list-container" class="space-y-2">
            </div>
          </div>
          <hr class="border-slate-100" />
          <div class="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2">
            <div class="flex-1">
              <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Tambah Acara Baru</label>
              <input type="text" id="swal-new-holiday" class="w-full bg-transparent outline-none font-bold text-slate-700 text-sm placeholder-slate-400" placeholder="Cth: Idul Fitri / Libur Semester">
            </div>
            <button type="button" onclick="window.addHolidayEvent('${dateStr}')" class="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-md shadow-blue-100 shrink-0">
              <i class="fas fa-plus text-sm"></i>
            </button>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Tutup',
      buttonsStyling: false,
      customClass: {
        popup: 'swal2-minimalist-popup w-[90%] max-w-md',
        cancelButton: 'w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl transition-all text-sm mt-2'
      },
      didOpen: () => {
        let currentLocalHolidays = [...window.getLatestHolidaysByDate(dateStr)];
        updateSwalListDOM(currentLocalHolidays);

        window.deleteHolidayEvent = async (id) => {
          const targetDOM = document.getElementById(`holiday-item-${id}`);
          if (targetDOM) targetDOM.style.opacity = "0.4"; 

          try {
            await window.fs.deleteDoc(window.fs.doc(window.db, "holidays", id.toString()));
            setHolidaysDb(prev => {
              const updated = prev.filter(h => h.id !== id);
              currentLocalHolidays = updated.filter(h => h.date === dateStr);
              updateSwalListDOM(currentLocalHolidays);
              return updated;
            });
          } catch (e) {
            if (targetDOM) targetDOM.style.opacity = "1";
            alert("Gagal menghapus data di Firestore");
          }
        };

        window.addHolidayEvent = async (targetDate) => {
          const inputField = document.getElementById('swal-new-holiday');
          const val = inputField ? inputField.value.trim() : "";
          if (!val) return alert("Keterangan libur tidak boleh kosong!");
          
          if (inputField) inputField.disabled = true;

          const added = { id: Date.now(), date: targetDate, description: val };
          try {
            await window.fs.setDoc(window.fs.doc(window.db, "holidays", added.id.toString()), added);
            if (inputField) { inputField.disabled = false; inputField.value = ""; }
            
            setHolidaysDb(prev => {
              const updated = [...prev, added];
              currentLocalHolidays = updated.filter(h => h.date === dateStr);
              updateSwalListDOM(currentLocalHolidays);
              return updated;
            });
          } catch (e) {
            if (inputField) inputField.disabled = false;
            alert("Gagal menyimpan data baru");
          }
        };
      },
      didClose: () => {
        delete window.deleteHolidayEvent;
        delete window.addHolidayEvent;
      }
    });
  };

  React.useEffect(() => {
    window.getLatestHolidaysByDate = (dStr) => holidaysDb.filter(h => h.date === dStr);
    return () => { delete window.getLatestHolidaysByDate; };
  }, [holidaysDb]);

  const handleSaveRoutineSettings = async () => {
    setIsSavingSettings(true);
    try {
      await window.fs.setDoc(window.fs.doc(window.db, "settings", "config"), settingsDb);
      setIsSavingSettings(false);
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Aturan libur diperbarui.', timer: 1500, showConfirmButton: false });
    } catch (error) {
      setIsSavingSettings(false);
      Swal.fire('Error', 'Gagal menyimpan aturan', 'error');
    }
  };

  const isLiburMinggu = String(settingsDb.liburMinggu).toLowerCase() === 'true';
  const isLiburSabtu = String(settingsDb.liburSabtu).toLowerCase() === 'true';

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center justify-between w-full md:w-auto bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <button onClick={() => changeMonth(-1)} className="p-3 md:p-2 bg-white hover:bg-slate-200 rounded-lg shadow-sm transition-all shrink-0">
              <i className="fas fa-chevron-left text-slate-600 text-sm"></i>
            </button>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 text-center tracking-tight flex-1 md:min-w-[160px]">
              {viewDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={() => changeMonth(1)} className="p-3 md:p-2 bg-white hover:bg-slate-200 rounded-lg shadow-sm transition-all shrink-0">
              <i className="fas fa-chevron-right text-slate-600 text-sm"></i>
            </button>
          </div>

          {userRole === 'admin' ? (
            <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl border border-slate-200 flex-wrap sm:flex-nowrap gap-y-2">
              <label className="flex items-center space-x-2 cursor-pointer group px-2">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                  checked={isLiburMinggu} onChange={e => setSettingsDb({...settingsDb, liburMinggu: e.target.checked ? 'true' : 'false'})} />
                <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Minggu Libur</span>
              </label>
              <div className="h-5 w-px bg-slate-300 hidden sm:block"></div>
              <label className="flex items-center space-x-2 cursor-pointer group px-2">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                  checked={isLiburSabtu} onChange={e => setSettingsDb({...settingsDb, liburSabtu: e.target.checked ? 'true' : 'false'})} />
                <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Sabtu Libur</span>
              </label>
              <button onClick={handleSaveRoutineSettings} disabled={isSavingSettings} 
                className="sm:ml-2 w-full sm:w-auto bg-slate-800 text-white text-xs px-4 py-2 rounded-lg hover:bg-blue-600 transition-all font-bold shadow-sm disabled:opacity-50">
                {isSavingSettings ? <i className="fas fa-spinner fa-spin"></i> : 'Update'}
              </button>
            </div>
          ) : (
            <div className="flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100">
              <i className="fas fa-info-circle mr-2"></i>
              <span className="text-xs font-bold">Mode Hanya Lihat</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, i) => (
            <div key={day} className={`pb-2 text-center text-[10px] font-bold uppercase tracking-wider ${i === 6 ? 'text-red-500' : 'text-slate-400'}`}>
              {day}
            </div>
          ))}
          {days.map((date, idx) => {
            if (!date) return <div key={`p-${idx}`} className="h-20 sm:h-32 bg-slate-50/50 rounded-xl opacity-40"></div>;
            
            const dateStr = getLocalYYYYMMDD(date);
            const dayOfWeek = date.getDay();
            const isRoutineHoliday = (dayOfWeek === 0 && isLiburMinggu) || (dayOfWeek === 6 && isLiburSabtu);
            
            const specialHolidays = holidaysDb.filter(h => h.date === dateStr);
            const isToday = dateStr === getLocalYYYYMMDD(new Date());

            const dailyRecords = attendanceDb.filter(a => a.date === dateStr && ['Hadir', 'Terlambat'].includes(a.status));
            const attendedNames = dailyRecords.map(r => {
              const u = usersDb.find(user => user.id === r.userId);
              return u ? u.username : null; 
            }).filter(Boolean);

            return (
              <div key={dateStr} onClick={() => handleDateClick(date)}
                className={`relative h-20 sm:h-32 p-1.5 sm:p-2 rounded-xl border transition-all flex flex-col overflow-hidden
                  ${isToday ? 'border-blue-500 ring-2 ring-blue-100 z-10 bg-white' : 'border-transparent hover:border-slate-300 hover:shadow-sm'}
                  ${isRoutineHoliday || specialHolidays.length > 0 ? 'bg-red-50/30 hover:bg-red-50/60' : 'bg-slate-50 hover:bg-white'}
                  ${userRole === 'admin' ? 'cursor-pointer group' : ''}
                `}>
                <div className="flex justify-between items-start mb-1 shrink-0">
                  <span className={`text-xs sm:text-sm font-bold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors z-10
                    ${isToday ? 'bg-blue-600 text-white shadow-sm' : (isRoutineHoliday || specialHolidays.length > 0 ? 'text-red-500' : 'text-slate-700')}
                  `}>{date.getDate()}</span>
                  {specialHolidays.length > 0 && <div className="bg-red-500 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse shadow-sm shadow-red-300 z-10 mt-1 mr-1 shrink-0"></div>}
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-0.5 z-10 relative text-left min-h-[20px]">
                  {attendedNames.map((name, i) => (
                    <div key={i} className="text-[7px] sm:text-[9px] bg-blue-100/80 text-blue-700 px-1 py-0.5 rounded truncate font-semibold leading-tight">
                      {name}
                    </div>
                  ))}
                </div>
                
                <div className="mt-1 z-10 relative shrink-0 pt-1 border-t border-slate-200/50 space-y-0.5">
                  {isRoutineHoliday && specialHolidays.length === 0 && <span className="text-[7px] sm:text-[9px] text-red-400 font-medium uppercase tracking-wider opacity-80 block">Libur</span>}
                  {specialHolidays.map((sh, sIdx) => (
                    <div key={sh.id || sIdx} className="bg-red-500 text-white px-1 py-0.5 rounded shadow-sm">
                      <p className="text-[7px] sm:text-[9px] leading-tight font-medium line-clamp-1">{sh.description}</p>
                    </div>
                  ))}
                </div>

                {userRole === 'admin' && (
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors flex items-center justify-center pointer-events-none">
                    <i className="fas fa-plus-circle text-blue-600 opacity-0 group-hover:opacity-20 text-xl transform scale-50 group-hover:scale-100 transition-all"></i>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 pt-4 justify-center">
          <div className="flex items-center space-x-1.5"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span>Libur Nasional</span></div>
          <div className="flex items-center space-x-1.5"><div className="w-3 h-3 bg-red-5 border border-red-200 rounded"></div><span>Libur</span></div>
          <div className="flex items-center space-x-1.5"><div className="w-3 h-3 bg-blue-600 rounded-full"></div><span>Hari Ini</span></div>
        </div>
      </div>
    </div>
  );
};