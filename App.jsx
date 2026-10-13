import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen, GraduationCap, LayoutDashboard, LogIn, LogOut, Search,
  PlayCircle, Clock3, Users, Star, ShieldCheck, Plus, Pencil, Trash2,
  CheckCircle2, CircleHelp, Menu, X, ArrowRight, Sparkles, LockKeyhole,
  Database, Mail, BookMarked, ChevronRight
} from "lucide-react";
import { isConfigured, supabase } from "./supabase";

const demoCourses = [
  { id:"demo-ko-1", title:"Солонгос хэл: анхан шатны суурь", category:"Солонгос хэл", level:"Анхан шат", duration:"5 цаг", lessons:20, students:1240, rating:"4.9", price:0, color:"mint", icon:"한", description:"Хангыл үсэг, зөв дуудлага, мэндчилгээ болон өдөр тутмын энгийн өгүүлбэрийг монгол тайлбартай сур." },
  { id:"demo-ko-2", title:"Солонгос хэл: өдөр тутмын яриа", category:"Солонгос хэл", level:"Анхан шат", duration:"4 цаг", lessons:16, students:980, rating:"4.8", price:0, color:"violet", icon:"가", description:"Кафе, дэлгүүр, сургуульд хэрэглэдэг яриаг видео, текст, дасгалтайгаар дадлага хий." },
  { id:"demo-zh-1", title:"Хятад хэл: пиньинь ба эхний үгс", category:"Хятад хэл", level:"Анхан шат", duration:"5 цаг", lessons:18, students:860, rating:"4.9", price:0, color:"orange", icon:"文", description:"Пиньинь, дөрвөн өнгө, мэндчилгээ болон өдөр тутмын эхний үгсийг монгол тайлбартай сур." },
  { id:"demo-zh-2", title:"Хятад хэл: өдөр тутмын яриа", category:"Хятад хэл", level:"Анхан шат", duration:"4 цаг", lessons:15, students:720, rating:"4.8", price:0, color:"pink", icon:"你好", description:"Өөрийгөө танилцуулах, хоол захиалах, үнэ асуух яриаг видео, текст, дасгалаар сур." },
  { id:"demo-en-1", title:"Англи хэл: анхан шатны суурь", category:"Англи хэл", level:"Анхан шат", duration:"5 цаг", lessons:20, students:1500, rating:"4.9", price:0, color:"blue", icon:"Aa", description:"Үндсэн үгс, өгүүлбэрийн бүтэц, дуудлагыг монгол тайлбар, жишээ болон богино дасгалаар сур." },
  { id:"demo-en-2", title:"Англи хэл: өдөр тутмын яриа", category:"Англи хэл", level:"Анхан шат", duration:"4 цаг", lessons:24, students:980, rating:"4.8", price:0, color:"yellow", icon:"Hi!", description:"Өдөр тутмын нөхцөлд хэрэглэх өгүүлбэр, сонсгол, видео жишээ болон ярианы дасгал." }
];

const categories = ["Бүгд", "Солонгос хэл", "Хятад хэл", "Англи хэл"];

const languages = [
  {id:"ko", label:"Солонгос хэл", native:"한국어", flag:"🇰🇷"},
  {id:"zh", label:"Хятад хэл", native:"中文", flag:"🇨🇳"},
  {id:"en", label:"Англи хэл", native:"English", flag:"🇬🇧"}
];
const mediaLessons = [
  {id:"ko-listen-1", kind:"listening", language:"ko", title:"Кафед захиалга өгөх", level:"Анхан шат", duration:"6 мин", format:"Өдөр тутмын яриа", description:"Кафед ундаа захиалах богино харилцан яриаг сонсоод гол хэллэгүүдийг сур.", youtubeId:"", vocabulary:[["아이스 아메리카노","Мөстэй американо"],["주세요","Өгөөч"],["얼마예요?","Хэд вэ?"]], questions:[{q:"'주세요' ямар утгатай вэ?",a:["Өгөөч","Сайн байна уу","Баяртай"],correct:0}]},
  {id:"ko-story-1", kind:"story", language:"ko", title:"작은 토끼와 큰 달", level:"Анхан шат", duration:"5 мин", format:"Хүүхдийн үлгэр", description:"Энгийн өгүүлбэр, давтагдах үгтэй хүүхдийн үлгэрээр солонгос сонсголоо хөгжүүл.", youtubeId:"", vocabulary:[["토끼","Туулай"],["달","Сар"],["친구","Найз"]], questions:[{q:"'친구' гэдэг нь юу вэ?",a:["Найз","Сар","Ой"],correct:0}]},
  {id:"zh-listen-1", kind:"listening", language:"zh", title:"你好！初次见面", level:"Анхан шат", duration:"5 мин", format:"Мэндчилгээ", description:"Хятад хэлээр мэндлэх, өөрийгөө танилцуулах түгээмэл хэллэгүүд.", youtubeId:"", vocabulary:[["你好","Сайн байна уу"],["我叫…","Намайг … гэдэг"],["谢谢","Баярлалаа"]], questions:[{q:"'谢谢' ямар утгатай вэ?",a:["Баярлалаа","Уучлаарай","Сайн уу"],correct:0}]},
  {id:"zh-story-1", kind:"story", language:"zh", title:"小猫找朋友", level:"Анхан шат", duration:"4 мин", format:"Хүүхдийн үлгэр", description:"Муурын зулзагын тухай богино үлгэрээр хятад үг, өгүүлбэр сонсоорой.", youtubeId:"", vocabulary:[["小猫","Муурын зулзага"],["朋友","Найз"],["一起","Хамт"],], questions:[{q:"'朋友' гэдэг нь юу вэ?",a:["Найз","Муур","Ном"],correct:0}]},
  {id:"en-listen-1", kind:"listening", language:"en", title:"Ordering at a café", level:"Beginner", duration:"6 min", format:"Everyday English", description:"Listen to a simple café conversation and practise useful everyday expressions.", youtubeId:"", vocabulary:[["I'd like…","Би … авмаар байна"],["Could I have…?","… авч болох уу?"],["How much is it?","Ямар үнэтэй вэ?"]], questions:[{q:"What does “I'd like…” express?",a:["A polite request","A goodbye","An apology"],correct:0}]},
  {id:"en-story-1", kind:"story", language:"en", title:"The Little Star", level:"Beginner", duration:"5 min", format:"Children's story", description:"A gentle short story with simple English words, listening practice, and a comprehension question.", youtubeId:"", vocabulary:[["star","Од"],["night","Шөнө"],["kind","Сайхан сэтгэлтэй"]], questions:[{q:"What is a “star”?",a:["Од","Сар","Нар"],correct:0}]}
];
const money = (n) => n === 0 ? "Үнэгүй" : `${Number(n).toLocaleString("mn-MN")}₮`;

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState(demoCourses);
  const [enrollments, setEnrollments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("home");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Бүгд");
  const [notice, setNotice] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [saving, setSaving] = useState(false);
  const [courseModal, setCourseModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({title:"",category:"Програмчлал",level:"Анхан шат",duration:"4 цаг",lessons:10,students:0,rating:"5.0",price:0,color:"violet",icon:"✦",description:""});
  const [filterTab, setFilterTab] = useState("all");
  const [mediaLanguage, setMediaLanguage] = useState("ko");
  const [mediaKind, setMediaKind] = useState("all");
  const [mediaLevel, setMediaLevel] = useState("all");
  const [mediaSearch, setMediaSearch] = useState("");
  const [activeMedia, setActiveMedia] = useState(null);
  const [mediaAnswers, setMediaAnswers] = useState({});
  const [mediaChecked, setMediaChecked] = useState(false);

  useEffect(() => {
    if (!isConfigured) return;
    supabase.auth.getSession().then(({data}) => setUser(data.session?.user ?? null));
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isConfigured) return;
    loadCourses();
  }, []);

  useEffect(() => {
    if (!isConfigured || !user) { setProfile(null); setEnrollments([]); setOrders([]); return; }
    loadProfile();
    loadEnrollments();
    loadOrders();
  }, [user]);

  async function loadCourses() {
    const {data,error} = await supabase.from("courses").select("*").order("created_at",{ascending:false});
    if (!error && data?.length) setCourses(data.filter(c => ["Солонгос хэл", "Хятад хэл", "Англи хэл"].includes(c.category)));
  }
  async function loadProfile() {
    const {data} = await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();
    if (data) setProfile(data);
    else {
      const fallback = {id:user.id, full_name:user.user_metadata?.full_name || user.email?.split("@")[0] || "Суралцагч", role:"student"};
      const {data:created} = await supabase.from("profiles").upsert(fallback).select().maybeSingle();
      setProfile(created || fallback);
    }
  }
  async function loadEnrollments() {
    const {data} = await supabase.from("enrollments").select("*, courses(*)").eq("user_id",user.id).order("created_at",{ascending:false});
    setEnrollments(data || []);
  }
  async function loadOrders() {
    const {data} = await supabase.from("orders").select("*, courses(title,price)").order("created_at",{ascending:false});
    setOrders(data || []);
  }
  function flash(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3600);
  }
  async function submitAuth(e) {
    e.preventDefault();
    if (!isConfigured) { flash("Эхлээд Supabase тохиргоог .env файлд оруулна уу."); return; }
    setSaving(true);
    let result;
    if (authMode === "signup") {
      result = await supabase.auth.signUp({email:authEmail,password:authPassword,options:{data:{full_name:authName}}});
    } else {
      result = await supabase.auth.signInWithPassword({email:authEmail,password:authPassword});
    }
    setSaving(false);
    if (result.error) flash(result.error.message);
    else {
      setAuthOpen(false); setAuthPassword("");
      flash(authMode === "signup" ? "Бүртгэл үүсгэлээ. Имэйл баталгаажуулах шаардлагатай байж болно." : "Амжилттай нэвтэрлээ.");
    }
  }
  async function signOut() {
    if (isConfigured) await supabase.auth.signOut();
    setUser(null); setView("home"); flash("Системээс гарлаа.");
  }
  async function enroll(course) {
    if (!user) { setAuthOpen(true); flash("Сургалтад бүртгүүлэхийн тулд нэвтэрнэ үү."); return; }
    if (course.price > 0) {
      if (!isConfigured) { flash("Төлбөрийн захиалга хийхийн тулд backend тохиргоо хэрэгтэй."); return; }
      const {error} = await supabase.from("orders").insert({user_id:user.id,course_id:course.id,amount:course.price,status:"pending"});
      if (error) flash(error.message);
      else { await loadOrders(); flash("Төлбөрийн хүсэлт үүслээ. Админ захиалгыг шалгана."); }
      return;
    }
    if (!isConfigured) { flash("Демо горимд бүртгэл хадгалагдахгүй. Supabase тохируулна уу."); return; }
    const {error} = await supabase.from("enrollments").upsert({user_id:user.id,course_id:course.id},{onConflict:"user_id,course_id"});
    if (error) flash(error.message);
    else { await loadEnrollments(); flash("Сургалтад амжилттай бүртгүүллээ!"); setCourseModal(null); }
  }
  async function saveCourse(e) {
    e.preventDefault();
    if (!isConfigured || profile?.role !== "admin") { flash("Курс удирдахад админ эрх болон Supabase тохиргоо шаардлагатай."); return; }
    setSaving(true);
    const payload = {...form, lessons:Number(form.lessons), students:Number(form.students), price:Number(form.price)};
    const result = editing
      ? await supabase.from("courses").update(payload).eq("id",editing)
      : await supabase.from("courses").insert(payload);
    setSaving(false);
    if (result.error) flash(result.error.message);
    else { setEditing(null); setCourseModal(null); await loadCourses(); flash("Сургалтыг хадгаллаа."); }
  }
  async function deleteCourse(course) {
    if (!confirm(`"${course.title}" сургалтыг устгах уу?`)) return;
    const {error} = await supabase.from("courses").delete().eq("id",course.id);
    if (error) flash(error.message); else { await loadCourses(); flash("Сургалтыг устгалаа."); }
  }
  async function updateOrder(order, status) {
    const {error} = await supabase.from("orders").update({status}).eq("id",order.id);
    if (error) flash(error.message); else { await loadOrders(); flash("Захиалгын төлөв шинэчлэгдлээ."); }
  }
  const isAdmin = profile?.role === "admin";
  const filtered = useMemo(() => courses.filter(c => {
    const matchesText = `${c.title} ${c.description || ""} ${c.category}`.toLowerCase().includes(search.toLowerCase());
    return matchesText && (category === "Бүгд" || c.category === category);
  }), [courses,search,category]);
  const myCourseIds = enrollments.map(e => e.course_id);
  const nav = [
    {id:"home",label:"Нүүр",icon:BookOpen},
    {id:"courses",label:"Сургалтууд",icon:GraduationCap},
    {id:"listening",label:"Listening Lab",icon:PlayCircle},
    {id:"stories",label:"Үлгэрийн видео",icon:Sparkles},
    ...(user ? [{id:"my-learning",label:"Миний сургалт",icon:BookMarked}] : []),
    ...(isAdmin ? [{id:"admin",label:"Админ",icon:LayoutDashboard}] : [])
  ];

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={()=>setView("home")} aria-label="StudyHub нүүр"><span className="brand-mark"><GraduationCap size={23}/></span><span>study<span className="brand-accent">hub</span><small>LEARN • GROW • ACHIEVE</small></span></button>
      <nav className="desktop-nav">{nav.map(n=><button key={n.id} className={view===n.id?"nav-link active":"nav-link"} onClick={()=>setView(n.id)}>{n.label}</button>)}</nav>
      <div className="top-actions">
        {user ? <><span className="user-pill"><span className="avatar">{(profile?.full_name||user.email||"S").slice(0,1).toUpperCase()}</span><span className="user-name">{profile?.full_name || user.email}</span></span><button className="icon-button" onClick={signOut} title="Гарах"><LogOut size={18}/></button></>
          : <button className="button button-dark button-small" onClick={()=>{setAuthMode("login");setAuthOpen(true)}}><LogIn size={16}/> Нэвтрэх</button>}
        <button className="mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X/>:<Menu/>}</button>
      </div>
    </header>
    {mobileOpen && <div className="mobile-nav">{nav.map(n=><button key={n.id} onClick={()=>{setView(n.id);setMobileOpen(false)}}>{n.label}</button>)}</div>}
    {!isConfigured && <div className="demo-banner"><Sparkles size={15}/> Демо горим · Бодит нэвтрэлт, өгөгдөл хадгалалт ажиллуулахын тулд Supabase тохируулна уу.</div>}
    <main>
      {view==="home" && <Home setView={setView} setCourseModal={setCourseModal} courses={courses} setAuthOpen={setAuthOpen}/>}
      {(view==="courses" || view==="home-courses") && <section className="catalog section-wrap">
        <div className="section-heading"><div><span className="eyebrow">СУРГАЛТЫН САН</span><h2>Солонгос, Хятад, Англи хэлээ хөгжүүл</h2><p>Хэлээ сонгоод видео, текстэн хичээл, дасгалаар суралцаарай.</p></div><div className="search-box"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Сургалт хайх..."/></div></div>
        <div className="category-row">{categories.map(c=><button key={c} className={category===c?"chip selected":"chip"} onClick={()=>setCategory(c)}>{c}</button>)}</div>
        <div className="course-grid">{filtered.map(c=><CourseCard key={c.id} course={c} onOpen={()=>setCourseModal(c)} enrolled={myCourseIds.includes(c.id)}/>)}</div>
        {!filtered.length && <div className="empty-state"><Search size={28}/><h3>Сургалт олдсонгүй</h3><p>Өөр түлхүүр үг эсвэл ангилал сонгоно уу.</p></div>}
      </section>}
      {(view==="listening" || view==="stories") && <section className="section-wrap media-section">
        <div className="section-heading"><div><span className="eyebrow">{view==="listening"?"LISTENING LAB":"STORY TIME"}</span><h2>{view==="listening"?"Сонсголоо хөгжүүл":"Үлгэрээр хэл сур"}</h2><p>{view==="listening"?"Богино харилцан яриа, өдөр тутмын хэллэг, сонсголын жижиг тест.":"Хүүхдийн богино үлгэр, шинэ үг, ойлгосон эсэхээ шалгах асуулт."}</p></div><div className="media-search"><Search size={17}/><input value={mediaSearch} onChange={e=>setMediaSearch(e.target.value)} placeholder="Хичээл хайх..."/></div></div>
        <div className="language-selector">{languages.map(l=><button key={l.id} className={mediaLanguage===l.id?"language-pill selected":"language-pill"} onClick={()=>setMediaLanguage(l.id)}><span>{l.flag}</span><span>{l.label}</span><small>{l.native}</small></button>)}</div>
        <div className="media-filter-row"><div className="category-row">{[{id:"all",label:"Бүгд"},{id:"beginner",label:"Анхан шат"},{id:"intermediate",label:"Дунд шат"}].map(x=><button key={x.id} className={mediaLevel===x.id?"chip selected":"chip"} onClick={()=>setMediaLevel(x.id)}>{x.label}</button>)}</div><span className="media-note"><ShieldCheck size={14}/> Хичээл бүр үгсийн сан, тесттэй</span></div>
        <div className="media-grid">{mediaLessons.filter(m=>m.language===mediaLanguage&&(view==="listening"?m.kind==="listening":m.kind==="story")&&(mediaLevel==="all"||(mediaLevel==="beginner"&&m.level.toLowerCase().includes("анхан")||mediaLevel==="beginner"&&m.level.toLowerCase().includes("beginner")))&&(`${m.title} ${m.description} ${m.format}`).toLowerCase().includes(mediaSearch.toLowerCase())).map(m=><MediaCard key={m.id} lesson={m} onOpen={()=>{setActiveMedia(m);setMediaAnswers({});setMediaChecked(false)}}/>)}</div>
        {!mediaLessons.some(m=>m.language===mediaLanguage&&(view==="listening"?m.kind==="listening":m.kind==="story")&&(`${m.title} ${m.description}`).toLowerCase().includes(mediaSearch.toLowerCase()))&&<div className="empty-state"><PlayCircle size={30}/><h3>Энэ ангилалд одоогоор хичээл алга</h3><p>Өөр хэл эсвэл түлхүүр үг сонгоно уу.</p></div>}
        <div className="media-callout"><div className="media-callout-icon"><Sparkles size={23}/></div><div><strong>Өөрийн YouTube хичээлийг нэмэх боломжтой</strong><p>Доорх хувилбарт YouTube видеоны ID оруулж хичээл болгох бүтэц бэлдсэн. Дараагийн алхамд админ самбараас видео URL, хадмал, асуулт нэмдэг болгоно.</p></div></div>
      </section>}
      {view==="my-learning" && <section className="section-wrap page-section"><div className="section-heading"><div><span className="eyebrow">ТАНЫ СУРАЛЦАХ ЗАМ</span><h2>Миний сургалтууд</h2><p>Бүртгүүлсэн сургалтаа эндээс үргэлжлүүлээрэй.</p></div></div>
        {!user ? <SignInPrompt onClick={()=>setAuthOpen(true)}/> : enrollments.length ? <div className="course-grid">{enrollments.map(e=>e.courses && <CourseCard key={e.id} course={e.courses} onOpen={()=>setCourseModal(e.courses)} enrolled/>)}</div> : <div className="empty-state"><BookMarked size={30}/><h3>Одоогоор сургалтгүй байна</h3><p>Сургалтын сангаас өөрт тохирох хичээлээ сонгоорой.</p><button className="button button-dark" onClick={()=>setView("courses")}>Сургалт үзэх <ArrowRight size={16}/></button></div>}
      </section>}
      {view==="admin" && <section className="section-wrap page-section">
        {!isAdmin ? <div className="admin-locked"><div className="lock-icon"><LockKeyhole size={26}/></div><h2>Админ хэсэг</h2><p>Энэ хэсэг зөвхөн админ эрхтэй хэрэглэгчид харагдана. Анхны админ тохируулах заавар README файлд бий.</p><button className="button button-dark" onClick={()=>setView("home")}>Нүүр рүү буцах</button></div> : <>
          <div className="section-heading"><div><span className="eyebrow">УДИРДЛАГЫН САМБАР</span><h2>Админ самбар</h2><p>Сургалт болон захиалгын мэдээллээ удирдана.</p></div><button className="button button-dark" onClick={()=>{setEditing(null);setForm({title:"",category:"Програмчлал",level:"Анхан шат",duration:"4 цаг",lessons:10,students:0,rating:"5.0",price:0,color:"violet",icon:"✦",description:""});setCourseModal({admin:true})}}><Plus size={17}/> Сургалт нэмэх</button></div>
          <div className="stats-grid"><Stat icon={BookOpen} label="Нийт сургалт" value={courses.length}/><Stat icon={Users} label="Суралцагчийн бүртгэл" value={enrollments.length}/><Stat icon={Database} label="Захиалга" value={orders.length}/><Stat icon={Clock3} label="Хүлээгдэж буй" value={orders.filter(o=>o.status==="pending").length}/></div>
          <div className="admin-panel"><div className="panel-title"><h3>Сургалтууд</h3><span>{courses.length} сургалт</span></div><div className="table-wrap"><table><thead><tr><th>Нэр</th><th>Ангилал</th><th>Үнэ</th><th>Үйлдэл</th></tr></thead><tbody>{courses.map(c=><tr key={c.id}><td><strong>{c.title}</strong><small>{c.level}</small></td><td>{c.category}</td><td>{money(c.price)}</td><td><div className="table-actions"><button className="tiny-button" onClick={()=>{setEditing(c.id);setForm({...c});setCourseModal({admin:true})}}><Pencil size={15}/></button><button className="tiny-button danger" onClick={()=>deleteCourse(c)}><Trash2 size={15}/></button></div></td></tr>)}</tbody></table></div></div>
          <div className="admin-panel"><div className="panel-title"><h3>Захиалгууд</h3><span>Төлбөрийн хүсэлтүүд</span></div>{orders.length ? <div className="table-wrap"><table><thead><tr><th>Сургалт</th><th>Дүн</th><th>Төлөв</th><th>Шийдвэр</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td><strong>{o.courses?.title || "Сургалт"}</strong><small>{new Date(o.created_at).toLocaleDateString("mn-MN")}</small></td><td>{money(o.amount)}</td><td><span className={`status status-${o.status}`}>{o.status==="pending"?"Хүлээгдэж буй":o.status==="paid"?"Төлсөн":"Цуцалсан"}</span></td><td><div className="table-actions"><button className="tiny-button success" title="Төлсөн болгох" onClick={()=>updateOrder(o,"paid")}><CheckCircle2 size={15}/></button><button className="tiny-button danger" title="Цуцлах" onClick={()=>updateOrder(o,"cancelled")}><X size={15}/></button></div></td></tr>)}</tbody></table></div> : <p className="panel-empty">Одоогоор захиалга алга.</p>}</div>
        </>}
      </section>}
    </main>
    <footer className="footer"><div className="footer-brand"><span className="brand-mark"><GraduationCap size={20}/></span><strong>study<span className="brand-accent">hub</span></strong></div><p>Суралцах хүсэлтэй хүн бүрт зориулсан шинэ орон зай.</p><span>© 2026 StudyHub. Бүх эрх хуулиар хамгаалагдсан.</span></footer>

    {notice && <div className="toast"><CheckCircle2 size={18}/>{notice}</div>}
    {authOpen && <div className="modal-backdrop" onClick={()=>setAuthOpen(false)}><div className="modal auth-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setAuthOpen(false)}><X size={20}/></button><div className="modal-icon"><GraduationCap size={25}/></div><h2>{authMode==="login"?"Тавтай морил!":"Бүртгэл үүсгэх"}</h2><p>{authMode==="login"?"Суралцах аяллаа үргэлжлүүлэхийн тулд нэвтэрнэ үү.":"StudyHub-д бүртгүүлээд суралцаж эхлээрэй."}</p><form onSubmit={submitAuth} className="stack-form">{authMode==="signup" && <label>Нэр<input required value={authName} onChange={e=>setAuthName(e.target.value)} placeholder="Таны нэр"/></label>}<label>Имэйл<input required type="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="name@example.com"/></label><label>Нууц үг<input required minLength={6} type="password" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder="Хамгийн багадаа 6 тэмдэгт"/></label><button className="button button-dark full" disabled={saving}>{saving?"Түр хүлээнэ үү...":authMode==="login"?"Нэвтрэх":"Бүртгүүлэх"} <ArrowRight size={16}/></button></form><p className="switch-auth">{authMode==="login"?"Бүртгэлгүй юу?":"Бүртгэлтэй юу?"} <button onClick={()=>setAuthMode(authMode==="login"?"signup":"login")}>{authMode==="login"?"Бүртгүүлэх":"Нэвтрэх"}</button></p></div></div>}
    {activeMedia && <div className="modal-backdrop" onClick={()=>setActiveMedia(null)}><div className="modal media-detail-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setActiveMedia(null)}><X size={20}/></button><span className="eyebrow">{languages.find(l=>l.id===activeMedia.language)?.flag} {languages.find(l=>l.id===activeMedia.language)?.label} · {activeMedia.format}</span><h2>{activeMedia.title}</h2><p>{activeMedia.description}</p>
      {activeMedia.youtubeId ? <div className="youtube-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${activeMedia.youtubeId}`} title={activeMedia.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div> : <div className="video-placeholder"><PlayCircle size={38}/><strong>YouTube видео хараахан холбогдоогүй</strong><span>Админ YouTube видео ID нэмэхэд энд тоглоно.</span></div>}
      <div className="lesson-subhead"><h3><BookMarked size={17}/> Шинэ үгс</h3><span>Үгсийн сан</span></div><div className="vocab-list">{activeMedia.vocabulary.map(([word,meaning])=><div key={word}><strong>{word}</strong><span>{meaning}</span></div>)}</div>
      <div className="lesson-subhead"><h3><CircleHelp size={17}/> Ойлгосноо шалга</h3><span>Богино тест</span></div>{activeMedia.questions.map((q,qi)=><div className="lesson-question" key={qi}><strong>{qi+1}. {q.q}</strong>{q.a.map((a,ai)=><label className="quiz-option" key={a}><input type="radio" name={`media-${activeMedia.id}-${qi}`} checked={mediaAnswers[qi]===ai} onChange={()=>{setMediaAnswers({...mediaAnswers,[qi]:ai});setMediaChecked(false)}}/><span>{a}</span></label>)}</div>)}<button className="button button-dark full" onClick={()=>setMediaChecked(true)}>Хариултаа шалгах <CheckCircle2 size={16}/></button>{mediaChecked&&<div className="quiz-result">{activeMedia.questions.filter((q,i)=>mediaAnswers[i]===q.correct).length}/{activeMedia.questions.length} зөв хариуллаа. {activeMedia.questions.every((q,i)=>mediaAnswers[i]===q.correct)?"Маш сайн!":"Дахин сонсоод оролдоорой."}</div>}
    </div></div>}
    {courseModal && (courseModal.admin ? <div className="modal-backdrop" onClick={()=>setCourseModal(null)}><div className="modal course-edit-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setCourseModal(null)}><X size={20}/></button><span className="eyebrow">СУРГАЛТЫН МЭДЭЭЛЭЛ</span><h2>{editing?"Сургалт засах":"Шинэ сургалт нэмэх"}</h2><form className="stack-form" onSubmit={saveCourse}><label>Сургалтын нэр<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><div className="form-row"><label>Ангилал<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.filter(c=>c!=="Бүгд").map(c=><option key={c}>{c}</option>)}</select></label><label>Түвшин<select value={form.level} onChange={e=>setForm({...form,level:e.target.value})}><option>Анхан шат</option><option>Дунд шат</option><option>Ахисан шат</option><option>Их сургуулийн</option><option>Бүх түвшин</option></select></label></div><div className="form-row"><label>Үргэлжлэх хугацаа<input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})}/></label><label>Хичээлийн тоо<input type="number" min="1" value={form.lessons} onChange={e=>setForm({...form,lessons:e.target.value})}/></label></div><label>Үнэ (₮) <input type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>Тайлбар<textarea rows="3" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><button className="button button-dark full" disabled={saving}>{saving?"Хадгалж байна...":"Хадгалах"} <CheckCircle2 size={16}/></button></form></div></div> : <div className="modal-backdrop" onClick={()=>setCourseModal(null)}><div className="modal course-detail-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setCourseModal(null)}><X size={20}/></button><div className={`course-art art-${courseModal.color||"violet"} detail-art`}><span className="art-symbol">{courseModal.icon||"✦"}</span><span className="art-label">{courseModal.category}</span></div><span className="eyebrow">{courseModal.category} · {courseModal.level}</span><h2>{courseModal.title}</h2><p className="detail-description">{courseModal.description}</p><div className="detail-meta"><span><PlayCircle size={16}/>{courseModal.lessons} хичээл</span><span><Clock3 size={16}/>{courseModal.duration}</span><span><Star size={16} fill="currentColor"/>{courseModal.rating||"4.8"}</span></div><div className="detail-bottom"><div><small>Сургалтын үнэ</small><strong>{money(courseModal.price)}</strong></div><button className="button button-dark" onClick={()=>enroll(courseModal)}>{myCourseIds.includes(courseModal.id)?"Бүртгүүлсэн":courseModal.price>0?"Захиалга үүсгэх":"Сургалтад бүртгүүлэх"} <ArrowRight size={16}/></button></div>{courseModal.price>0 && <p className="payment-note"><CircleHelp size={14}/> Энэ демо хувилбарт картын төлбөр шууд авахгүй. Захиалгыг админ баталгаажуулна.</p>}</div></div>)}
  </div>;
}

function Home({setView,setCourseModal,courses,setAuthOpen}) {
  return <><section className="hero"><div className="hero-glow glow-one"></div><div className="hero-glow glow-two"></div><div className="hero-copy"><div className="hero-badge"><Sparkles size={15}/> ТАНЫ ӨСӨЛТ ЭНДЭЭС ЭХЭЛНЭ</div><h1>Шинэ хэлээ<br/><span>өнөөдөр</span> сурч эхэл.</h1><p>Солонгос, Хятад, Англи хэлийг монгол тайлбартай видео, текстэн хичээл, дасгалаар сураарай.</p><div className="hero-buttons"><button className="button button-lime" onClick={()=>setView("courses")}>Сургалт үзэх <ArrowRight size={17}/></button><button className="button button-glass" onClick={()=>setAuthOpen(true)}>Үнэгүй бүртгүүлэх</button></div><div className="hero-proof"><div className="avatar-stack"><span>Б</span><span>А</span><span>Н</span><span>+</span></div><div><strong>5,000+ суралцагч</strong><small>Өдөр бүр өсөн нэмэгдэж байна</small></div><div className="proof-stars"><Star size={14} fill="currentColor"/> 4.9/5</div></div></div><div className="hero-visual"><div className="floating-card card-progress"><div className="float-icon lime"><CheckCircle2 size={18}/></div><div><strong>Өдөр бүр ахицтай</strong><small>Өнөөдрийн зорилго биелсэн!</small></div><span className="mini-check">✓</span></div><div className="hero-orbit"><div className="orbit-ring ring-a"></div><div className="orbit-ring ring-b"></div><div className="hero-cap"><GraduationCap size={76} strokeWidth={1.4}/><span>SH</span></div><div className="orbit-dot dot-a"><BookOpen size={22}/></div><div className="orbit-dot dot-b"><Sparkles size={21}/></div><div className="orbit-dot dot-c"><PlayCircle size={22}/></div></div><div className="floating-card card-lessons"><div className="lesson-icon"><PlayCircle size={20}/></div><div><strong>Сонирхолтой хичээл</strong><small>Таны дараагийн алхам</small></div><ChevronRight size={18}/></div><div className="hero-note"><span>✦</span><div><strong>Бага багаар.</strong><br/>Гэхдээ өдөр бүр.</div></div></div><div className="hero-bottom-line"><span>СУРАЛЦАХАД ХЯЗГААР ҮГҮЙ</span><span>01 — 06</span></div></section>
    <section className="feature-strip"><div><span className="feature-icon"><PlayCircle/></span><div><strong>Өөрийн хурдаар</strong><p>Хэзээ ч, хаанаас ч суралц</p></div></div><div><span className="feature-icon"><BookOpen/></span><div><strong>Чанартай агуулга</strong><p>Тодорхой бүтэцтэй хичээлүүд</p></div></div><div><span className="feature-icon"><Users/></span><div><strong>Өсөлтөө хяна</strong><p>Суралцах замаа төлөвлө</p></div></div><div><span className="feature-icon"><ShieldCheck/></span><div><strong>Найдвартай орчин</strong><p>Таны суралцах орон зай</p></div></div></section>
    <section className="section-wrap featured-section"><div className="section-heading"><div><span className="eyebrow">ЭХЛЭХЭД ТОХИРОМЖТОЙ</span><h2>Онцлох хэлний хичээлүүд</h2><p>Монгол тайлбартай хичээлээ сонгоод эхлээрэй.</p></div><button className="text-link" onClick={()=>setView("courses")}>Бүх сургалт <ArrowRight size={16}/></button></div><div className="course-grid">{courses.slice(0,3).map(c=><CourseCard key={c.id} course={c} onOpen={()=>setCourseModal(c)}/>)}</div></section>
    <section className="cta-wrap"><div className="cta-card"><div className="cta-decoration">✳</div><div><span className="eyebrow">ДАРААГИЙН АЛХАМ ЧИНИЙХ</span><h2>Ирээдүйдээ хөрөнгө оруул.</h2><p>Шинэ чадвар бүр шинэ боломжийн эхлэл.</p></div><button className="button button-lime" onClick={()=>setView("courses")}>Одоо эхлэх <ArrowRight size={17}/></button></div></section>
  </>;
}
function MediaCard({lesson,onOpen}) {
  const language = languages.find(l=>l.id===lesson.language);
  const story = lesson.kind==="story";
  return <article className="media-card"><button className={`media-art ${story?"story-art":"listen-art"} media-${lesson.language}`} onClick={onOpen}><span className="media-art-orbit"></span><span className="media-art-emoji">{story?"📖":"🎧"}</span><span className="media-duration"><Clock3 size={12}/>{lesson.duration}</span><span className="media-play"><PlayCircle size={26}/></span><span className="media-art-lang">{language?.flag} {language?.native}</span></button><div className="media-card-body"><div className="media-card-kicker"><span>{story?"ХҮҮХДИЙН ҮЛГЭР":"LISTENING"}</span><span>{lesson.level}</span></div><h3>{lesson.title}</h3><p>{lesson.description}</p><div className="media-card-bottom"><span><BookOpen size={14}/>{lesson.vocabulary.length} шинэ үг</span><span><CircleHelp size={14}/>{lesson.questions.length} тест</span></div><button className="media-start" onClick={onOpen}>Хичээл эхлүүлэх <ArrowRight size={15}/></button></div></article>;
}
function CourseCard({course,onOpen,enrolled=false}) {
  return <article className="course-card"><button className="course-card-main" onClick={onOpen}><div className={`course-art art-${course.color||"violet"}`}><span className="art-symbol">{course.icon||"✦"}</span><span className="art-label">{course.category}</span><span className="art-open"><ArrowRight size={18}/></span></div><div className="course-info"><div className="course-tags"><span>{course.level}</span>{enrolled&&<span className="enrolled-tag"><CheckCircle2 size={12}/> Бүртгүүлсэн</span>}</div><h3>{course.title}</h3><p>{course.description}</p><div className="course-meta"><span><PlayCircle size={15}/>{course.lessons} хичээл</span><span><Clock3 size={15}/>{course.duration}</span></div><div className="course-footer"><div className="rating"><Star size={14} fill="currentColor"/><strong>{course.rating||"4.8"}</strong><span>({Number(course.students||0).toLocaleString()} суралцагч)</span></div><strong className="course-price">{money(course.price)}</strong></div></div></button><button className="card-enroll" onClick={onOpen}>{enrolled?"Үргэлжлүүлэх":"Дэлгэрэнгүй"} <ArrowRight size={15}/></button></article>;
}
function Stat({icon:Icon,label,value}) { return <div className="stat-card"><span><Icon size={19}/></span><div><small>{label}</small><strong>{value}</strong></div></div>; }
function SignInPrompt({onClick}) { return <div className="empty-state"><LogIn size={30}/><h3>Нэвтрэх шаардлагатай</h3><p>Өөрийн сургалтуудыг харахын тулд нэвтэрнэ үү.</p><button className="button button-dark" onClick={onClick}>Нэвтрэх</button></div>; }

export default App;
