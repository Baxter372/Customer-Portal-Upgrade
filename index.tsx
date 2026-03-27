import { useState } from "react";

const BRANCHES = ["Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"];

const subImages = {
  "Field of Heroes": "https://i.ibb.co/39KHyB1c/FHlogo.png",
  "Military Flags": "https://i.ibb.co/sJRfyKZx/Donation-Image.jpg",
  "Home Flags": "https://i.ibb.co/3mpmJVZP/USA-Flag.jpg",
};

const initialSubscriptions = [
  {
    id: 1, name: "Field of Heroes", location: "3434 Hwy 6", flags: 10, price: 50.00,
    status: "pending", validThru: "11-11-2026", subscriptionDate: "11-12-2025 / 11-11-2026",
    heroes: [
      { id: 1, name: "Sgt. James Walker", branch: "Army", story: "Served two tours in Afghanistan.", photo: null },
      { id: 2, name: "Lt. Maria Chen", branch: "Navy", story: "Decorated naval officer.", photo: null },
      ...Array.from({ length: 8 }, (_, i) => ({ id: i + 3, name: "", branch: "", story: "", photo: null }))
    ]
  },
  {
    id: 2, name: "Military Flags", location: "568 Broadway", flags: 1, price: 100.00,
    status: "paid", validThru: "11-11-2026", subscriptionDate: "11-12-2025 / 11-11-2026",
    heroes: [{ id: 1, name: "Col. Robert Davis", branch: "Air Force", story: "30 years of service.", photo: null }]
  },
  {
    id: 3, name: "Home Flags", location: "372 Town Place, Fairview TX 75069", flags: 1, price: 50.00,
    status: "paid", validThru: "11-11-2026", subscriptionDate: "11-12-2025 / 11-11-2026",
    heroesEnabled: false, heroes: []
  },
];

const payments = [
  { id: 1, date: "3-17-2026", type: "CASH", status: "Paid", amount: 40.00, description: "Field of Heroes – Renewal" },
  { id: 2, date: "3-17-2026", type: "CASH", status: "Paid", amount: 3.00, description: "Processing Fee" },
  { id: 3, date: "2-17-2026", type: "CASH", status: "Paid", amount: 100.00, description: "Military Flags – Annual" },
];

const branchColors = {
  "Army": "bg-green-100 text-green-800", "Navy": "bg-blue-100 text-blue-800",
  "Air Force": "bg-sky-100 text-sky-800", "Marines": "bg-red-100 text-red-800",
  "Coast Guard": "bg-orange-100 text-orange-800", "Space Force": "bg-indigo-100 text-indigo-800",
  "": "bg-gray-100 text-gray-400",
};

const tabs = [
  { id: "account", label: "Account Info" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "billing", label: "Cart & Payment", badge: 3 },
  { id: "history", label: "Payment History" },
  { id: "prefs", label: "Preferences" },
];

function Avatar({ name, photo, size = "md" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm";
  const initials = name ? name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "?";
  return photo
    ? <img src={photo} alt={name} className={`${sz} object-cover flex-shrink-0`} />
    : <div className={`${sz} bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold flex-shrink-0`}>{initials}</div>;
}

function StatusBadge({ status }) {
  return status?.toLowerCase() === "paid"
    ? <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700">✓ Paid</span>
    : <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700">⏳ Pending</span>;
}

function HeroCard({ hero, idx, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...hero });
  const isEmpty = !hero.name;

  const handleSave = () => { onSave(idx, form); setEditing(false); };

  if (editing) return (
    <div className="border-2 border-blue-400 p-4 bg-blue-50 space-y-3">
      <div className="flex items-center gap-3 mb-1">
        <Avatar name={form.name} photo={form.photo} size="lg" />
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">Flag #{idx + 1}</p>
          <input className="w-full border px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Hero Full Name" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>
      </div>
      <select className="w-full border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}>
        <option value="">Select Military Branch</option>
        {BRANCHES.map(b => <option key={b}>{b}</option>)}
      </select>
      <textarea className="w-full border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        rows={3} placeholder="Share this hero's story..." value={form.story}
        onChange={e => setForm(f => ({ ...f, story: e.target.value }))} />
      <div className="flex gap-2 justify-end">
        <button onClick={() => { setForm({ ...hero }); setEditing(false); }}
          className="px-3 py-1.5 text-sm border border-gray-300 text-gray-600 hover:bg-gray-100">Cancel</button>
        <button onClick={handleSave}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 font-medium">Save Hero</button>
      </div>
    </div>
  );

  return (
    <div onClick={() => setEditing(true)}
      className={`border p-4 cursor-pointer transition-all hover:shadow-md hover:border-blue-300 group ${isEmpty ? "border-dashed border-gray-300 bg-gray-50 hover:bg-blue-50" : "border-gray-200 bg-white"}`}>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-2 py-4 text-gray-400">
          <div className="w-10 h-10 border-2 border-dashed border-gray-300 flex items-center justify-center text-lg group-hover:border-blue-400 group-hover:text-blue-400 transition-colors">+</div>
          <p className="text-xs font-medium">Flag #{idx + 1}</p>
          <p className="text-xs text-gray-400">Click to add hero info</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Avatar name={hero.name} photo={hero.photo} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Flag #{idx + 1}</p>
              <p className="font-semibold text-gray-800 text-sm truncate">{hero.name}</p>
            </div>
            <span className="opacity-0 group-hover:opacity-100 text-blue-500 text-xs font-medium transition-opacity">✏️ Edit</span>
          </div>
          {hero.branch && <span className={`inline-block text-xs px-2 py-0.5 font-medium ${branchColors[hero.branch]}`}>{hero.branch}</span>}
          {hero.story && <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{hero.story}</p>}
        </div>
      )}
    </div>
  );
}

function SubscriptionPanel({ sub, onHeroSave }) {
  const [open, setOpen] = useState(false);
  const hasHeroes = sub.heroesEnabled !== false;
  const filled = hasHeroes ? sub.heroes.filter(h => h.name).length : 0;
  const pct = hasHeroes ? Math.round((filled / sub.flags) * 100) : 0;

  return (
    <div className={`overflow-hidden shadow-sm border transition-all ${open ? "border-blue-300 shadow-md" : "border-gray-200"}`}>
      <div
        className={`flex items-center gap-4 px-5 py-4 bg-white transition-colors ${hasHeroes ? "cursor-pointer hover:bg-gray-50" : ""}`}
        onClick={() => hasHeroes && setOpen(o => !o)}
      >
        <img src={subImages[sub.name]} alt={sub.name} className="w-11 h-11 object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-800">{sub.name}</h3>
            <StatusBadge status={sub.status} />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">📍 {sub.location} &nbsp;·&nbsp; Valid thru {sub.validThru}</p>
        </div>
        <div className="hidden sm:block text-right flex-shrink-0">
          <p className="font-bold text-gray-800">${sub.price.toFixed(2)}</p>
          <p className="text-xs text-gray-400">{sub.flags} flag{sub.flags > 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {hasHeroes ? (
            <>
              <div className="text-center">
                <p className="text-sm font-bold text-blue-600">{filled}/{sub.flags}</p>
                <p className="text-xs text-gray-400">Heroes</p>
              </div>
              <div className={`transition-transform duration-200 text-gray-400 text-xs ${open ? "rotate-180" : ""}`}>▼</div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-sm font-bold text-blue-600">{sub.flags}</p>
              <p className="text-xs text-gray-400">Flag{sub.flags > 1 ? "s" : ""}</p>
            </div>
          )}
        </div>
      </div>

      {hasHeroes && filled < sub.flags && (
        <div className="bg-amber-50 border-t border-amber-100 px-5 py-2 flex items-center gap-2">
          <span className="text-amber-500">⚠️</span>
          <p className="text-xs text-amber-700 font-medium">{sub.flags - filled} hero slot{sub.flags - filled > 1 ? "s" : ""} need info — click to complete your tribute.</p>
        </div>
      )}

      {hasHeroes && open && (
        <div className="border-t border-gray-100 bg-gray-50 p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-700 text-sm">Honored Heroes</h4>
            <span className="text-xs text-gray-400">{pct}% complete</span>
          </div>
          <div className="w-full bg-gray-200 h-2 mb-5">
            <div className="bg-blue-600 h-2 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sub.heroes.map((hero, idx) => (
              <HeroCard key={hero.id} hero={hero} idx={idx}
                onSave={(i, data) => onHeroSave(sub.id, i, data)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CartPaymentTab() {
  const [flagCounts, setFlagCounts] = useState({ 0: 1, 1: 1 });
  const [years, setYears] = useState("2");
  const [autoPay, setAutoPay] = useState(true);
  const [donation, setDonation] = useState("none");
  const [payMethod, setPayMethod] = useState("cc");
  const [smsOptIn, setSmsOptIn] = useState(true);
  const [cardName, setCardName] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [zip, setZip] = useState("");
  const [mm, setMm] = useState("01");
  const [yyyy, setYyyy] = useState("2026");
  const [cvv, setCvv] = useState("");

  const subPrice = 50.00;
  const numYears = parseInt(years);
  const multiYearDiscount = numYears >= 2 ? 10.00 : 0;
  const donationAmt = donation === "none" || donation === "other" || donation === "Not Now" ? 0 : parseFloat(donation.replace("$",""));
  const totalFlags = Object.values(flagCounts).reduce((a, b) => a + b, 0);
  const volumeDiscount = totalFlags >= 4 ? 2.00 : 0;
  const subs = Array.from({ length: numYears }, (_, i) => ({ label: `Subscription: 11/11/${2025+i} – 11/10/${2026+i}`, price: subPrice }));
  const subtotalFlags = subPrice * numYears;
  const totalMultiYear = multiYearDiscount * numYears;
  const subtotal = subtotalFlags - totalMultiYear - volumeDiscount + donationAmt;
  const donationOptions = ["$20", "$40", "$60", "$80", "$100", "Other", "Not Now"];

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      {/* LEFT */}
      <div className="flex-1 min-w-0 space-y-4">
        <div className="bg-white shadow-sm border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 font-bold text-gray-800">🛒 Shopping Cart (1)</div>
            <button className="flex items-center gap-1.5 text-sm font-medium border border-gray-300 px-3 py-1.5 hover:bg-gray-50 transition-colors">➕ Add Another Location</button>
            <span className="text-sm font-semibold text-gray-600 ml-auto pl-4">Price</span>
          </div>
          <div className="p-5">
            <div className="flex gap-4">
              <input type="checkbox" defaultChecked className="mt-1 accent-blue-600 flex-shrink-0" />
              <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=120&q=80" alt="flags" className="w-20 h-16 object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-blue-700 text-sm">Home Flag Delivery Membership</span>
                    <span className="text-xs text-gray-500 ml-1">(New Subscription)</span>
                  </div>
                  <span className="font-bold text-gray-800 flex-shrink-0">$100.00</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Friends of Fairview, assisted by local community groups, will place a 3'x 5' flag in your front yard for 6 holidays per year. <span className="text-blue-500 cursor-pointer hover:underline">Read more</span></p>
                <p className="text-xs text-gray-500 mt-1">📍 4251 Irving Ave</p>
                <p className="text-xs text-blue-600 font-medium mt-0.5">Your first delivery will be Veterans Day 2026</p>
                <p className="text-xs text-gray-500">Subscription Period: Nov 12, 2025 – Nov 11, 2027</p>
              </div>
            </div>
            <div className="mt-4 space-y-3 pl-6">
              {subs.map((s, i) => (
                <div key={i} className="flex items-center gap-3 border border-gray-200 px-4 py-3 bg-gray-50">
                  <input type="checkbox" defaultChecked className="accent-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{s.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Flag Count:</span>
                      <button onClick={() => setFlagCounts(f => ({ ...f, [i]: Math.max(1, (f[i]||1)-1) }))} className="w-5 h-5 border border-gray-300 text-gray-600 text-xs flex items-center justify-center hover:bg-gray-200">−</button>
                      <span className="text-sm font-semibold w-4 text-center">{flagCounts[i]||1}</span>
                      <button onClick={() => setFlagCounts(f => ({ ...f, [i]: (f[i]||1)+1 }))} className="w-5 h-5 border border-gray-300 text-gray-600 text-xs flex items-center justify-center hover:bg-gray-200">+</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-sm">${s.price.toFixed(2)}</span>
                    <span className="text-gray-400 cursor-pointer hover:text-red-500 text-sm">🗑️</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pl-6">
              <p className="text-sm text-gray-600 mb-2">Upgrade your subscription – add another year</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {["1","2","3","4","5","6","7","8","9","10"].map(y => (
                  <label key={y} className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="radio" name="years" value={y} checked={years===y} onChange={()=>setYears(y)} className="accent-blue-600" />
                    Buy {y} Year{y!=="1"?"s":""}
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs text-blue-500 hover:underline cursor-pointer">Auto-Pay may be disabled at any time on the preference tab</span>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-600">Auto-Pay</span>
                  <button onClick={()=>setAutoPay(a=>!a)} className={`relative w-10 h-5 transition-colors ${autoPay?"bg-blue-600":"bg-gray-300"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white shadow transition-all ${autoPay?"left-5":"left-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 pl-6">
              <span className="text-sm text-gray-600">First Delivery:</span>
              <span className="text-sm font-semibold text-gray-800">Veterans Day 2026</span>
            </div>
          </div>
        </div>

        {/* Add Another Product */}
        <div className="bg-white shadow-sm border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm">Add Another Product</h3>
            <p className="text-xs text-gray-500 mt-0.5">Check out our other products</p>
          </div>
          <div className="grid grid-cols-3 gap-0 divide-x divide-gray-100">
            {[
              { name: "Field of Heroes", desc: "Honor a veteran with a flag displayed at our Field of Heroes event.", img: "https://i.ibb.co/39KHyB1c/FHlogo.png" },
              { name: "Military Flags", desc: "Proudly display a military flag at your home or business address.", img: "https://i.ibb.co/sJRfyKZx/Donation-Image.jpg" },
              { name: "Home Flags", desc: "Have a 3'x5' flag placed in your yard for 6 holidays per year.", img: "https://i.ibb.co/3mpmJVZP/USA-Flag.jpg" },
            ].map(p => (
              <div key={p.name} className="flex flex-col items-center text-center p-4 gap-3 hover:bg-blue-50 transition-colors cursor-pointer group aspect-square justify-between">
                <img src={p.img} alt={p.name} className="w-full h-24 object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-700 transition-colors">{p.name}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{p.desc}</p>
                </div>
                <button className="text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 transition-colors w-full">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Donation */}
        <div className="bg-white shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-500 text-xl">✨</span>
            <h3 className="font-bold text-blue-700 text-sm">Please Consider An Additional Donation To:</h3>
          </div>
          <div className="flex gap-4">
            <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=120&q=80" alt="donation" className="w-16 h-16 object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">Test Donation Label for Testing VB</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">This is the test additional donation description... <span className="text-blue-500 cursor-pointer hover:underline">read more</span></p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {donationOptions.map(opt => (
              <label key={opt} className={`flex items-center gap-1.5 px-3 py-1.5 border text-sm cursor-pointer transition-colors ${donation===opt?"bg-blue-600 border-blue-600 text-white":"border-gray-300 text-gray-700 hover:border-blue-400"}`}>
                <input type="radio" name="donation" value={opt} checked={donation===opt} onChange={()=>setDonation(opt)} className="hidden" />
                {opt}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-72 flex-shrink-0 space-y-4">
        <div className="bg-blue-50 border border-blue-200 overflow-hidden shadow-sm">
          <div className="bg-blue-700 px-5 py-3">
            <h3 className="font-bold text-white text-sm">Shopping Cart Summary</h3>
          </div>
          <div className="px-5 py-4 space-y-2">
            <p className="font-semibold text-gray-800 text-sm">Home Flag Delivery Membership</p>
            {subs.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs text-gray-600"><span>{s.label}</span><span className="font-medium">${s.price.toFixed(2)}</span></div>
                {multiYearDiscount > 0 && <div className="flex justify-between text-xs text-red-500"><span>Multi-Year Discount (min. 2 years)</span><span>−${multiYearDiscount.toFixed(2)}</span></div>}
              </div>
            ))}
            <div className="border-t border-blue-200 pt-2 space-y-1.5 mt-2">
              <div className="flex justify-between text-sm text-gray-700"><span>Total Flag Subscriptions</span><span className="font-semibold">${subtotalFlags.toFixed(2)}</span></div>
              {volumeDiscount > 0 && <div className="flex justify-between text-sm text-red-500"><span>Total Volume Discount</span><span>−${volumeDiscount.toFixed(2)}</span></div>}
              {totalMultiYear > 0 && <div className="flex justify-between text-sm text-red-500"><span>Total Multi-Year Discount</span><span>−${totalMultiYear.toFixed(2)}</span></div>}
              <div className="flex justify-between text-sm text-gray-700"><span>Additional Donation</span><span>${donationAmt.toFixed(2)}</span></div>
            </div>
            <div className="border-t border-blue-200 pt-2 space-y-1">
              <div className="flex justify-between text-sm font-semibold text-gray-800"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-blue-700 text-base"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Volume Discount applied automatically based on flag count per subscription.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-blue-700 px-5 py-3">
            <h3 className="font-bold text-white text-sm">Payment Method</h3>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div className="flex gap-4">
              {[["cc","💳 Credit Card"],["echeck","🏦 eCheck"]].map(([val,label])=>(
                <label key={val} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="radio" name="pay" value={val} checked={payMethod===val} onChange={()=>setPayMethod(val)} className="accent-blue-600" />{label}
                </label>
              ))}
            </div>
            {[{label:"Cardholder's Name",val:cardName,set:setCardName,ph:"e.g. John Smith"},{label:"Card Number",val:cardNum,set:setCardNum,ph:"0000000000000000"}].map(f=>(
              <div key={f.label}>
                <label className="text-xs text-gray-500 font-medium">{f.label}</label>
                <input className="w-full border border-gray-300 px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)} />
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-500 font-medium">Billing Zip</label>
              <input className="w-full border border-gray-300 px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="00000" value={zip} onChange={e=>setZip(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-medium">MM</label>
                <select className="w-full border border-gray-300 px-2 py-2 text-sm mt-1" value={mm} onChange={e=>setMm(e.target.value)}>
                  {Array.from({length:12},(_,i)=>String(i+1).padStart(2,"0")).map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-medium">YYYY</label>
                <select className="w-full border border-gray-300 px-2 py-2 text-sm mt-1" value={yyyy} onChange={e=>setYyyy(e.target.value)}>
                  {Array.from({length:10},(_,i)=>String(2025+i)).map(y=><option key={y}>{y}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-medium">CVV</label>
                <input className="w-full border border-gray-300 px-2 py-2 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="000" value={cvv} onChange={e=>setCvv(e.target.value)} maxLength={4} />
              </div>
            </div>
            <p className="text-xs text-gray-400">After submitting your payment you will receive an e-mail receipt to the address registered above.</p>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={smsOptIn} onChange={()=>setSmsOptIn(s=>!s)} className="accent-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-600"><strong>Don't miss delivery notifications</strong> – Opt-In to SMS Text Messaging. Reply <strong>HELP</strong> for help, <strong>STOP</strong> to cancel.</span>
            </label>
            <p className="text-xs text-red-500 text-center font-medium">Click "Place my Order" only once</p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 transition-colors text-sm shadow">Place my Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentHistoryTab() {
  const total = payments.reduce((s, p) => s + p.amount, 0);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Paid", value: `$${total.toFixed(2)}`, icon: "💰", color: "text-emerald-600" },
          { label: "Transactions", value: payments.length, icon: "📄", color: "text-blue-600" },
          { label: "Last Payment", value: payments[0].date, icon: "📅", color: "text-gray-700" },
        ].map(s => (
          <div key={s.label} className="bg-white p-4 shadow-sm border border-gray-200 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Payment Details</h3>
          <button className="text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 px-4 py-2 transition-colors">📬 Reach out to Flag Manager</button>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-5 gap-4 px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <span>Date</span><span className="col-span-2">Description</span><span>Type</span><span className="text-right">Amount</span>
          </div>
          {payments.map(p => (
            <div key={p.id} className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
              <div><p className="text-sm font-medium text-gray-800">{p.date}</p><StatusBadge status={p.status} /></div>
              <div className="col-span-2"><p className="text-sm text-gray-700">{p.description}</p></div>
              <div><span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5">{p.type}</span></div>
              <div className="text-right flex items-center justify-end gap-2">
                <p className="font-bold text-gray-800">${p.amount.toFixed(2)}</p>
                <button className="text-gray-400 hover:text-blue-600 transition-colors text-sm">📄</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
            <p className="text-lg font-bold text-gray-800">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return status?.toLowerCase() === "paid"
    ? <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700">✓ Paid</span>
    : <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700">⏳ Pending</span>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("billing");
  const [subs, setSubs] = useState(initialSubscriptions);

  const handleHeroSave = (subId, heroIdx, data) => {
    setSubs(prev => prev.map(s => s.id !== subId ? s : {
      ...s, heroes: s.heroes.map((h, i) => i === heroIdx ? { ...h, ...data } : h)
    }));
  };

  const totalHeroes = subs.reduce((acc, s) => acc + s.heroes.filter(h => h.name).length, 0);
  const totalPending = subs.filter(s => s.status === "pending").reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Top nav */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">🏠 Friends of Fairview</div>
          <div className="flex items-center gap-4 text-sm">
            <span className="opacity-80 hover:opacity-100 cursor-pointer">🌐 Club Website</span>
            <span className="opacity-80 hover:opacity-100 cursor-pointer">❓ Help</span>
            <span className="opacity-80 hover:opacity-100 cursor-pointer">↪️ Sign Out</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="h-20 bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#fff_0,#fff_1px,transparent_0,transparent_50%)] bg-[length:10px_10px]" />
        <div className="max-w-5xl mx-auto px-6 h-full flex items-center">
          <p className="text-white text-sm font-medium opacity-70 italic">Honoring those who served 🇺🇸</p>
        </div>
      </div>

      {/* Account header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name="Emma Romero" size="md" />
            <div>
              <p className="font-bold text-gray-800">Emma Romero</p>
              <p className="text-xs text-gray-400">Customer since 02-17-2026</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm text-blue-700 font-semibold border border-blue-200 px-4 py-2 hover:bg-blue-50 transition-colors">
            🛒 Cart <span className="bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center">3</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === t.id ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
              <span>{t.label}</span>
              {t.badge && <span className="bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center">{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">

        {activeTab === "account" && (
          <div className="space-y-4">
            <div className="bg-white p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-800 text-lg">Account Details</h2>
                <button className="text-sm text-blue-600 hover:underline">Edit All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Customer Information", icon: "👤", lines: ["Emma Romero","(555) 555-5555","mygesy@webcodegenie.net"] },
                  { label: "Billing Information", icon: "📍", lines: ["Halla Santana","hezyfik@mailinator.com","Possimus suscipit N, 20418"] },
                  { label: "Credit Card", icon: "💳", lines: ["Status: ✅ Valid","Auto Pay: OFF"] },
                ].map(card => (
                  <div key={card.label} className="border border-gray-200 p-4 hover:border-blue-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-gray-700">{card.icon} {card.label}</p>
                      <button className="text-xs text-blue-500 hover:underline font-medium">Edit</button>
                    </div>
                    {card.lines.map((l, i) => <p key={i} className="text-sm text-gray-600 leading-relaxed">{l}</p>)}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-5 shadow-sm border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-red-700 text-sm">Close Account</p>
                  <p className="text-xs text-gray-500 mt-0.5">Cancel all subscriptions and permanently close your account.</p>
                </div>
                <button className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors font-medium">Cancel & Close</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "subscriptions" && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Active Subscriptions", value: subs.length, icon: "📋", color: "text-blue-700" },
                { label: "Heroes Honored", value: totalHeroes, icon: "🏅", color: "text-indigo-700" },
                { label: "Amount Pending", value: `$${totalPending.toFixed(2)}`, icon: "⏳", color: "text-amber-600" },
              ].map(s => (
                <div key={s.label} className="bg-white p-4 shadow-sm border border-gray-200 text-center">
                  <p className="text-2xl mb-1">{s.icon}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {subs.map(sub => <SubscriptionPanel key={sub.id} sub={sub} onHeroSave={handleHeroSave} />)}
            </div>
            <button className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors">
              + Add Another Flag Location
            </button>
          </>
        )}

        {activeTab === "billing" && <CartPaymentTab />}
        {activeTab === "history" && <PaymentHistoryTab />}

        {activeTab === "prefs" && (
          <div className="bg-white p-12 shadow-sm border border-gray-200 text-center text-gray-400">
            <p className="text-4xl mb-3">🚧</p>
            <p className="font-semibold text-gray-600">Preferences tab content</p>
            <p className="text-sm mt-1">This section would display here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
