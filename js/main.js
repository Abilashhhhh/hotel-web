/* =========================================
   AURUM GRAND HOTEL — MAIN JS (INR ₹)
   ========================================= */
'use strict';

const App = {
  user: null,
  booking: {
    checkIn: '', checkOut: '', guests: 1, roomType: 'any',
    selectedRoom: null, guestDetails: {}, paymentDetails: {},
    bookingId: '', totalCost: 0, nights: 0
  },
  rooms: [
    {
      id: 'R101', type: 'Classic Room', name: 'Classic Deluxe',
      number: '101', floor: 1, price: 8500, capacity: 2,
      size: '35 sqm', bed: 'King Bed', view: 'Garden View',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      amenities: ['Free Wi-Fi', 'Mini Bar', 'Rain Shower', 'Smart TV', 'Safe'],
      badge: 'Available',
      desc: 'A tastefully appointed room offering timeless comfort with contemporary elegance, perfect for the discerning solo traveler or couple.'
    },
    {
      id: 'R205', type: 'Superior Room', name: 'Superior Suite',
      number: '205', floor: 2, price: 14500, capacity: 2,
      size: '52 sqm', bed: 'King Bed', view: 'City View',
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
      amenities: ['Free Wi-Fi', 'Mini Bar', 'Bathtub', 'Smart TV', 'Safe', 'Lounge Area'],
      badge: 'Popular',
      desc: 'Elevated living with sweeping city panoramas, a dedicated lounge area, and premium bath amenities for an unforgettable stay.'
    },
    {
      id: 'R310', type: 'Deluxe Suite', name: 'Grand Deluxe Suite',
      number: '310', floor: 3, price: 22000, capacity: 4,
      size: '78 sqm', bed: '2 King Beds', view: 'Ocean View',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
      amenities: ['Free Wi-Fi', 'Full Bar', 'Jacuzzi', '4K TV', 'Safe', 'Living Room', 'Dining Area'],
      badge: 'Best Value',
      desc: 'Sprawling ocean-view suite with a private jacuzzi, full living and dining room — an oasis of absolute luxury.'
    },
    {
      id: 'R401', type: 'Junior Suite', name: 'Junior Suite',
      number: '401', floor: 4, price: 18000, capacity: 2,
      size: '60 sqm', bed: 'King Bed', view: 'Pool View',
      image: 'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80',
      amenities: ['Free Wi-Fi', 'Mini Bar', 'Bathtub', 'Smart TV', 'Balcony', 'Lounge'],
      badge: 'Available',
      desc: 'An intimate yet expansive suite with private balcony overlooking the pool, blending modern comfort with refined aesthetics.'
    },
    {
      id: 'R502', type: 'Presidential Suite', name: 'Presidential Suite',
      number: '502', floor: 5, price: 55000, capacity: 6,
      size: '180 sqm', bed: '3 King Beds', view: 'Panoramic View',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
      amenities: ['Free Wi-Fi', 'Full Bar', 'Infinity Tub', '8K TV', 'Safe', 'Private Terrace', 'Butler', 'Kitchen'],
      badge: 'Exclusive',
      desc: 'The pinnacle of luxury — a full-floor presidential experience with panoramic vistas, private terrace, full kitchen, and dedicated butler service.'
    },
    {
      id: 'R303', type: 'Classic Room', name: 'Classic Twin',
      number: '303', floor: 3, price: 7500, capacity: 2,
      size: '32 sqm', bed: 'Twin Beds', view: 'Garden View',
      image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80',
      amenities: ['Free Wi-Fi', 'Mini Bar', 'Shower', 'Smart TV', 'Safe'],
      badge: 'Available',
      desc: 'A refined twin room ideal for friends or colleagues, offering classic comforts in an elegantly understated setting.'
    }
  ]
};

/* ---- Utilities ---- */
const Utils = {
  formatINR(amount) {
    return '₹' + new Intl.NumberFormat('en-IN').format(Math.round(amount));
  },
  formatDate(d) {
    if (!d) return '—';
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  },
  calcNights(ci, co) {
    if (!ci || !co) return 0;
    const diff = (new Date(co) - new Date(ci)) / 86400000;
    return diff > 0 ? diff : 0;
  },
  generateBookingId() {
    return 'AGH-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
  },
  today() { return new Date().toISOString().split('T')[0]; },
  tomorrow() { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0]; },
  showToast(msg, type='info') {
    const ex = document.querySelector('.toast'); if (ex) ex.remove();
    const t = document.createElement('div');
    t.className = `toast ${type}`; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.4s'; setTimeout(()=>t.remove(),400); }, 3000);
  },
  saveState() {
    sessionStorage.setItem('aurum_booking', JSON.stringify(App.booking));
    sessionStorage.setItem('aurum_user', JSON.stringify(App.user));
  },
  loadState() {
    const b = sessionStorage.getItem('aurum_booking');
    const u = sessionStorage.getItem('aurum_user');
    if (b) Object.assign(App.booking, JSON.parse(b));
    if (u) App.user = JSON.parse(u);
  },
  getPage() { return document.body.dataset.page || 'home'; }
};

/* ---- Navbar ---- */
const Navbar = {
  init() {
    const nb = document.querySelector('.navbar'); if (!nb) return;
    window.addEventListener('scroll', () => nb.classList.toggle('scrolled', scrollY > 50));
    const page = Utils.getPage();
    nb.querySelectorAll('.nav-links a').forEach(a => { if (a.dataset.page === page) a.classList.add('active'); });
    const btn = nb.querySelector('#nav-auth-btn');
    if (btn) {
      if (App.user) { btn.textContent = `Hi, ${App.user.firstName}`; btn.onclick = () => Auth.logout(); }
      else { btn.textContent = 'Sign In'; btn.onclick = () => window.location.href = 'login.html'; }
    }
  }
};

/* ---- Auth ---- */
const Auth = {
  init() {
    const lf = document.getElementById('login-form');
    const rf = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.auth-tab-btn');
    tabs.forEach(btn => btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active')); btn.classList.add('active');
      document.querySelectorAll('.auth-tab-content').forEach(c => c.classList.add('hidden'));
      document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
    }));
    if (lf) lf.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass  = document.getElementById('login-pass').value;
      if (!email || !pass) { Utils.showToast('Please fill all fields.','error'); return; }
      const btn = lf.querySelector('button[type=submit]'); btn.disabled=true; btn.innerHTML='<span class="spinner"></span>';
      setTimeout(() => {
        App.user = { firstName: email.split('@')[0].charAt(0).toUpperCase()+email.split('@')[0].slice(1), email, id:'U'+Date.now() };
        Utils.saveState(); Utils.showToast('Welcome back!','success');
        setTimeout(()=>window.location.href='search.html',800);
      }, 1200);
    });
    if (rf) rf.addEventListener('submit', e => {
      e.preventDefault();
      const fn = document.getElementById('reg-first').value.trim();
      const em = document.getElementById('reg-email').value.trim();
      const pw = document.getElementById('reg-pass').value;
      if (!fn||!em||!pw) { Utils.showToast('Please fill required fields.','error'); return; }
      if (pw.length<6) { Utils.showToast('Password must be at least 6 characters.','error'); return; }
      const btn = rf.querySelector('button[type=submit]'); btn.disabled=true; btn.innerHTML='<span class="spinner"></span>';
      setTimeout(() => {
        App.user = { firstName:fn, lastName:document.getElementById('reg-last').value, email:em, phone:document.getElementById('reg-phone').value, id:'U'+Date.now() };
        Utils.saveState(); Utils.showToast('Account created!','success');
        setTimeout(()=>window.location.href='search.html',800);
      }, 1200);
    });
  },
  logout() {
    App.user=null; App.booking={checkIn:'',checkOut:'',guests:1,roomType:'any',selectedRoom:null,guestDetails:{},paymentDetails:{},bookingId:'',totalCost:0,nights:0};
    sessionStorage.clear(); Utils.showToast('Signed out.');
    setTimeout(()=>window.location.href='index.html',800);
  }
};

/* ---- Room Card ---- */
const RoomCard = {
  render(r) {
    return `
    <div class="room-card" data-room-id="${r.id}">
      <div class="room-card-img">
        <img src="${r.image}" alt="${r.name}" loading="lazy">
        <span class="room-card-badge">${r.badge}</span>
      </div>
      <div class="room-card-body">
        <div class="room-card-type">${r.type}</div>
        <div class="room-card-name">${r.name}</div>
        <p class="room-card-desc">${r.desc}</p>
        <div class="room-amenities">
          ${r.amenities.slice(0,4).map(a=>`<span class="amenity-tag">${a}</span>`).join('')}
          ${r.amenities.length>4?`<span class="amenity-tag">+${r.amenities.length-4} more</span>`:''}
        </div>
        <div class="room-card-footer">
          <div class="room-price">
            <span class="amount">${Utils.formatINR(r.price)}</span>
            <span class="per-night">per night</span>
          </div>
          <button class="btn-primary" style="padding:12px 24px;font-size:0.63rem;"><span>Select Room</span></button>
        </div>
      </div>
    </div>`;
  }
};

/* ---- Home ---- */
const Home = {
  init() {
    this.initSearch(); this.renderRooms(); this.initCounters();
  },
  initSearch() {
    const form = document.getElementById('hero-search-form'); if (!form) return;
    const ci = document.getElementById('hero-checkin');
    const co = document.getElementById('hero-checkout');
    if (ci) ci.min = Utils.today();
    if (co) co.min = Utils.tomorrow();
    if (ci) ci.addEventListener('change', () => {
      const nx = new Date(ci.value); nx.setDate(nx.getDate()+1);
      if (co) { co.min=nx.toISOString().split('T')[0]; if(co.value<=ci.value) co.value=co.min; }
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!ci.value||!co.value) { Utils.showToast('Please select dates.','error'); return; }
      App.booking.checkIn  = ci.value;
      App.booking.checkOut = co.value;
      App.booking.guests   = parseInt(document.getElementById('hero-guests').value)||1;
      App.booking.roomType = document.getElementById('hero-roomtype').value||'any';
      Utils.saveState();
      if (!App.user) { Utils.showToast('Please sign in to continue.','error'); setTimeout(()=>window.location.href='login.html',900); return; }
      window.location.href='search.html';
    });
  },
  renderRooms() {
    const g = document.getElementById('rooms-preview-grid'); if (!g) return;
    g.innerHTML = App.rooms.slice(0,3).map(r=>RoomCard.render(r)).join('');
    g.querySelectorAll('.room-card').forEach(c => c.addEventListener('click', ()=>{
      App.booking.selectedRoom = App.rooms.find(r=>r.id===c.dataset.roomId);
      Utils.saveState();
      if (!App.user) { Utils.showToast('Please sign in to book.','error'); setTimeout(()=>window.location.href='login.html',900); }
      else window.location.href='search.html';
    }));
  },
  initCounters() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const el=en.target, target=parseInt(el.dataset.count), suf=el.dataset.suffix||'';
          let cur=0; const inc=target/60;
          const t=setInterval(()=>{ cur+=inc; if(cur>=target){el.textContent=target+suf;clearInterval(t);}else el.textContent=Math.floor(cur)+suf;},25);
          obs.unobserve(el);
        }
      });
    },{threshold:0.5});
    document.querySelectorAll('[data-count]').forEach(c=>obs.observe(c));
  }
};

/* ---- Search ---- */
const Search = {
  init() { this.prefill(); this.renderRooms(); this.initFilters(); this.updateLabel(); },
  prefill() {
    const ci=document.getElementById('s-checkin'), co=document.getElementById('s-checkout');
    const g=document.getElementById('s-guests'), rt=document.getElementById('s-roomtype');
    if(ci){ci.min=Utils.today();ci.value=App.booking.checkIn||'';}
    if(co){co.min=Utils.tomorrow();co.value=App.booking.checkOut||'';}
    if(g) g.value=App.booking.guests||1;
    if(rt) rt.value=App.booking.roomType||'any';
    if(ci) ci.addEventListener('change',()=>{App.booking.checkIn=ci.value;Utils.saveState();this.renderRooms();});
    if(co) co.addEventListener('change',()=>{App.booking.checkOut=co.value;Utils.saveState();this.renderRooms();});
    if(g)  g.addEventListener('change',()=>{App.booking.guests=parseInt(g.value);Utils.saveState();this.renderRooms();});
    if(rt) rt.addEventListener('change',()=>{App.booking.roomType=rt.value;Utils.saveState();this.renderRooms();});
    const sb=document.getElementById('s-search-btn'); if(sb) sb.addEventListener('click',()=>this.renderRooms());
  },
  getFiltered() {
    let rooms=[...App.rooms];
    const {guests,roomType}=App.booking;
    if(guests) rooms=rooms.filter(r=>r.capacity>=guests);
    if(roomType&&roomType!=='any') rooms=rooms.filter(r=>r.type.toLowerCase().includes(roomType.toLowerCase()));
    const sort=document.getElementById('s-sort');
    if(sort){
      if(sort.value==='price-asc')  rooms.sort((a,b)=>a.price-b.price);
      if(sort.value==='price-desc') rooms.sort((a,b)=>b.price-a.price);
    }
    return rooms;
  },
  renderRooms() {
    const g=document.getElementById('rooms-grid'); if(!g) return;
    const rooms=this.getFiltered();
    const cnt=document.getElementById('rooms-count');
    if(cnt) cnt.textContent=`${rooms.length} room${rooms.length!==1?'s':''} available`;
    if(!rooms.length){g.innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-mid);"><div style="font-size:3rem;margin-bottom:20px;">🔍</div><p style="font-size:0.9rem;">No rooms match your criteria.</p></div>`;return;}
    g.innerHTML=rooms.map(r=>RoomCard.render(r)).join('');
    g.querySelectorAll('.room-card').forEach(c=>c.addEventListener('click',()=>this.showDetail(App.rooms.find(r=>r.id===c.dataset.roomId))));
  },
  showDetail(room) {
    const ov=document.createElement('div'); ov.className='modal-overlay';
    ov.innerHTML=`
      <div class="modal">
        <button class="modal-close" id="mc">✕</button>
        <div style="height:220px;border-radius:2px;overflow:hidden;margin-bottom:24px;">
          <img src="${room.image}" alt="${room.name}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div class="label-text" style="margin-bottom:6px;">${room.type} · Room ${room.number}</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;margin-bottom:14px;">${room.name}</h2>
        <p style="color:var(--text-mid);font-size:0.84rem;line-height:1.8;margin-bottom:22px;">${room.desc}</p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">
          ${[['Size',room.size],['Bed',room.bed],['View',room.view],['Floor','Floor '+room.floor],['Capacity','Up to '+room.capacity+' guests']].map(([k,v])=>`
            <div style="background:var(--dark-3);padding:12px 14px;border:1px solid rgba(201,168,76,0.08);">
              <div class="label-text" style="font-size:0.55rem;margin-bottom:4px;">${k}</div>
              <div style="font-size:0.8rem;color:var(--cream);">${v}</div>
            </div>`).join('')}
        </div>
        <div class="room-amenities" style="margin-bottom:24px;">${room.amenities.map(a=>`<span class="amenity-tag">${a}</span>`).join('')}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:20px;border-top:1px solid rgba(201,168,76,0.15);">
          <div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:2rem;color:var(--gold-light);">${Utils.formatINR(room.price)}</div>
            <span style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-mid);">per night + taxes</span>
          </div>
          <button class="btn-primary" id="mb"><span>Book This Room</span></button>
        </div>
      </div>`;
    document.body.appendChild(ov);
    ov.querySelector('#mc').onclick=()=>ov.remove();
    ov.addEventListener('click',e=>{if(e.target===ov)ov.remove();});
    ov.querySelector('#mb').onclick=()=>{
      if(!App.booking.checkIn||!App.booking.checkOut){Utils.showToast('Please select dates first.','error');ov.remove();return;}
      App.booking.selectedRoom=room;
      App.booking.nights=Utils.calcNights(App.booking.checkIn,App.booking.checkOut);
      App.booking.totalCost=room.price*App.booking.nights;
      Utils.saveState(); window.location.href='guest-details.html';
    };
  },
  initFilters() {
    const s=document.getElementById('s-sort'); if(s) s.addEventListener('change',()=>this.renderRooms());
  },
  updateLabel() {
    const el=document.getElementById('search-dates-label'); if(!el) return;
    if(App.booking.checkIn&&App.booking.checkOut)
      el.textContent=`${Utils.formatDate(App.booking.checkIn)} → ${Utils.formatDate(App.booking.checkOut)} · ${App.booking.guests} Guest${App.booking.guests>1?'s':''}`;
  }
};

/* ---- Guest Details ---- */
const GuestDetails = {
  init() {
    if(!App.user){Utils.showToast('Please sign in.','error');setTimeout(()=>window.location.href='login.html',800);return;}
    if(!App.booking.selectedRoom){Utils.showToast('Please select a room.','error');setTimeout(()=>window.location.href='search.html',800);return;}
    this.prefill(); SummaryWidget.render('guest-summary');
    const form=document.getElementById('guest-form');
    if(form) form.addEventListener('submit',e=>{
      e.preventDefault();
      const data={};
      new FormData(form).forEach((v,k)=>data[k]=v);
      if(!data.firstName||!data.lastName||!data.email||!data.phone){Utils.showToast('Please fill all required fields.','error');return;}
      App.booking.guestDetails=data; Utils.saveState(); window.location.href='payment.html';
    });
  },
  prefill() {
    if(!App.user) return;
    const fn=document.getElementById('gd-firstname'), em=document.getElementById('gd-email');
    if(fn&&!fn.value) fn.value=App.user.firstName||'';
    if(em&&!em.value) em.value=App.user.email||'';
  }
};

/* ---- Payment ---- */
const Payment = {
  init() {
    if(!App.user){window.location.href='login.html';return;}
    if(!App.booking.selectedRoom){window.location.href='search.html';return;}
    if(!App.booking.guestDetails.email){window.location.href='guest-details.html';return;}
    SummaryWidget.render('payment-summary');
    this.initTabs(); this.initCardFormat();
    const form=document.getElementById('payment-form');
    if(form) form.addEventListener('submit',e=>{e.preventDefault();this.process();});
  },
  initTabs() {
    const tabs=document.querySelectorAll('.pay-tab');
    const panels=document.querySelectorAll('.pay-panel');
    tabs.forEach(tab=>tab.addEventListener('click',()=>{
      tabs.forEach(t=>t.classList.remove('active')); tab.classList.add('active');
      panels.forEach(p=>p.classList.add('hidden'));
      const tp=document.getElementById('pay-'+tab.dataset.method); if(tp) tp.classList.remove('hidden');
    }));
  },
  initCardFormat() {
    const cn=document.getElementById('card-number');
    const ex=document.getElementById('card-expiry');
    const cv=document.getElementById('card-cvv');
    const nm=document.getElementById('card-name');
    const dn=document.getElementById('card-display-num');
    const dh=document.getElementById('card-display-name');
    if(cn){cn.addEventListener('input',()=>{let v=cn.value.replace(/\D/g,'').slice(0,16);cn.value=v.replace(/(.{4})/g,'$1 ').trim();if(dn)dn.textContent=cn.value||'•••• •••• •••• ••••';});}
    if(ex){ex.addEventListener('input',()=>{let v=ex.value.replace(/\D/g,'').slice(0,4);if(v.length>=2)v=v.slice(0,2)+'/'+v.slice(2);ex.value=v;});}
    if(cv){cv.addEventListener('input',()=>{cv.value=cv.value.replace(/\D/g,'').slice(0,4);});}
    if(nm&&dh){nm.addEventListener('input',()=>{dh.textContent=nm.value.toUpperCase()||'YOUR NAME';});}
  },
  process() {
    const at=document.querySelector('.pay-tab.active');
    const method=at?at.dataset.method:'card';
    if(method==='card'){
      const num=document.getElementById('card-number')?.value.replace(/\s/g,'');
      const exp=document.getElementById('card-expiry')?.value;
      const cvv=document.getElementById('card-cvv')?.value;
      const name=document.getElementById('card-name')?.value;
      if(!num||num.length<16){Utils.showToast('Please enter a valid 16-digit card number.','error');return;}
      if(!exp||!exp.includes('/')){Utils.showToast('Please enter a valid expiry date.','error');return;}
      if(!cvv||cvv.length<3){Utils.showToast('Please enter a valid CVV.','error');return;}
      if(!name){Utils.showToast('Please enter cardholder name.','error');return;}
      App.booking.paymentDetails={method:'Credit/Debit Card',last4:num.slice(-4),name};
    } else if(method==='upi'){
      const uid=document.getElementById('upi-id')?.value.trim();
      if(!uid){Utils.showToast('Please enter your UPI ID.','error');return;}
      App.booking.paymentDetails={method:'UPI',upiId:uid};
    } else if(method==='netbanking'){
      const sel=document.querySelector('.bank-btn.selected');
      if(!sel){Utils.showToast('Please select your bank.','error');return;}
      App.booking.paymentDetails={method:'Net Banking',bank:sel.textContent};
    }
    const btn=document.getElementById('pay-btn');
    if(btn){btn.disabled=true;btn.innerHTML='<span class="spinner"></span><span> Processing Payment...</span>';}
    setTimeout(()=>{
      App.booking.bookingId=Utils.generateBookingId();
      App.booking.nights=Utils.calcNights(App.booking.checkIn,App.booking.checkOut);
      App.booking.totalCost=App.booking.selectedRoom.price*App.booking.nights;
      Utils.saveState(); window.location.href='confirmation.html';
    },2200);
  }
};

/* ---- Confirmation ---- */
const Confirmation = {
  init() {
    if(!App.booking.bookingId){window.location.href='index.html';return;}
    this.render(); this.confetti();
  },
  render() {
    const {bookingId,selectedRoom:r,checkIn,checkOut,nights,totalCost,guestDetails:gd,paymentDetails:pd}=App.booking;
    const s=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
    const tax=totalCost*0.18; const grand=totalCost+tax;
    s('conf-booking-id',bookingId);
    s('conf-room',r?`${r.name} (Room ${r.number})`:'—');
    s('conf-guest',gd?`${gd.firstName} ${gd.lastName}`:'—');
    s('conf-email',gd?.email||'—');
    s('conf-phone',gd?.phone||'—');
    s('conf-checkin',Utils.formatDate(checkIn));
    s('conf-checkout',Utils.formatDate(checkOut));
    s('conf-nights',nights+(nights===1?' Night':' Nights'));
    s('conf-guests-count',App.booking.guests+(App.booking.guests>1?' Guests':' Guest'));
    s('conf-room-rate',Utils.formatINR(r?r.price:0)+' / night');
    s('conf-subtotal',Utils.formatINR(totalCost));
    s('conf-tax',Utils.formatINR(tax));
    s('conf-total',Utils.formatINR(grand));
    s('conf-payment',pd?.method||'—');
    const img=document.getElementById('conf-room-img'); if(img&&r) img.src=r.image;
    const pb=document.getElementById('print-btn'); if(pb) pb.onclick=()=>window.print();
    const nb=document.getElementById('new-booking-btn'); if(nb) nb.onclick=()=>{
      App.booking={checkIn:'',checkOut:'',guests:1,roomType:'any',selectedRoom:null,guestDetails:{},paymentDetails:{},bookingId:'',totalCost:0,nights:0};
      Utils.saveState(); window.location.href='index.html';
    };
  },
  confetti() {
    const canvas=document.getElementById('confetti-canvas'); if(!canvas) return;
    const ctx=canvas.getContext('2d');
    canvas.width=window.innerWidth; canvas.height=window.innerHeight;
    const colors=['#C9A84C','#E2C97E','#A0762B','#F7F3EC','#FFFFFF'];
    const ps=Array.from({length:80},()=>({x:Math.random()*canvas.width,y:-10,r:Math.random()*5+2,d:Math.random()*3+1,color:colors[Math.floor(Math.random()*colors.length)],tilt:Math.random()*10-5,ts:(Math.random()*0.1+0.05)*(Math.random()<.5?1:-1)}));
    let f=0;
    const animate=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ps.forEach(p=>{p.y+=p.d;p.tilt+=p.ts;ctx.beginPath();ctx.fillStyle=p.color+'CC';ctx.ellipse(p.x,p.y,p.r,p.r*1.8,p.tilt,0,Math.PI*2);ctx.fill();});f++;if(f<180)requestAnimationFrame(animate);else ctx.clearRect(0,0,canvas.width,canvas.height);};
    animate();
  }
};

/* ---- Summary Widget ---- */
const SummaryWidget = {
  render(containerId) {
    const el=document.getElementById(containerId); if(!el) return;
    const {selectedRoom:r,checkIn,checkOut}=App.booking;
    if(!r) return;
    const n=Utils.calcNights(checkIn,checkOut);
    const sub=r.price*n; const tax=sub*0.18; const grand=sub+tax;
    el.innerHTML=`
      <div class="summary-card">
        <div class="summary-title">Booking Summary</div>
        <div class="summary-room-img"><img src="${r.image}" alt="${r.name}" loading="lazy"></div>
        <div class="label-text" style="margin-bottom:6px;">${r.type}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:var(--cream);margin-bottom:16px;">${r.name}</div>
        <div class="summary-row"><span class="summary-key">Room No.</span><span class="summary-val">${r.number}</span></div>
        <div class="summary-row"><span class="summary-key">Check-In</span><span class="summary-val">${Utils.formatDate(checkIn)}</span></div>
        <div class="summary-row"><span class="summary-key">Check-Out</span><span class="summary-val">${Utils.formatDate(checkOut)}</span></div>
        <div class="summary-row"><span class="summary-key">Nights</span><span class="summary-val">${n}</span></div>
        <div class="summary-row"><span class="summary-key">Guests</span><span class="summary-val">${App.booking.guests}</span></div>
        <div class="summary-row"><span class="summary-key">Rate/Night</span><span class="summary-val">${Utils.formatINR(r.price)}</span></div>
        <div class="summary-row"><span class="summary-key">Subtotal</span><span class="summary-val">${Utils.formatINR(sub)}</span></div>
        <div class="summary-row"><span class="summary-key">GST (18%)</span><span class="summary-val">${Utils.formatINR(tax)}</span></div>
        <div class="summary-total">
          <span class="total-label">Total</span>
          <span class="total-amount">${Utils.formatINR(grand)}</span>
        </div>
      </div>`;
  }
};

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  Utils.loadState(); Navbar.init();
  const page=Utils.getPage();
  switch(page){
    case 'home':         Home.init();         break;
    case 'login':        Auth.init();         break;
    case 'search':       Search.init();       break;
    case 'guest':        GuestDetails.init(); break;
    case 'payment':      Payment.init();      break;
    case 'confirmation': Confirmation.init(); break;
  }
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){en.target.style.opacity='1';en.target.style.transform='translateY(0)';}
    });
  },{threshold:0.1});
  document.querySelectorAll('[data-anim]').forEach(el=>{
    el.style.opacity='0';el.style.transform='translateY(30px)';el.style.transition='opacity 0.6s ease,transform 0.6s ease';
    obs.observe(el);
  });
});