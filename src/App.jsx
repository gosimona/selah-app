import { useState, useEffect, useRef } from "react";


// ── META PIXEL EVENTS ─────────────────────────────────────────
const fbq = (...args) => { if (typeof window !== "undefined" && window.fbq) window.fbq(...args); };

const G = {
  bg:"#FCFAF6", bgCard:"#FAF6EA",
  bgGrad:"linear-gradient(160deg, #FAF6EA 0%, #EAE2F0 50%, #FCFAF6 100%)",
  terra:"#CF8472", terraDark:"#A8614F", terraPale:"#F5EDE9",
  gold:"#CCA473", goldDark:"#A07840",
  lavender:"#EAE2F0", lavMid:"#C9B8DC", roseSand:"#EBDCD3",
  text:"#32251F", textMid:"#6B4C3B", textMuted:"#A08070",
  border:"rgba(207,132,114,0.15)", borderS:"rgba(207,132,114,0.35)",
  white:"#FFFFFF", shadow:"0 4px 24px rgba(50,37,31,0.08)",
  shadowLg:"0 20px 60px rgba(50,37,31,0.13)",
  get rose(){return this.terra;}, get roseDark(){return this.terraDark;},
  get rosePale(){return this.terraPale;}, get lavPale(){return this.lavender;},
};

const QUESTIONS = [
  {id:1,category:"Tu día a día",pregunta:"Cuando te despiertas en la mañana…\n¿cuál es el primer pensamiento que llega?",subtexto:"Sé honesta. Nadie te está juzgando aquí.",opciones:[
    {texto:'"Dios, necesito tu ayuda hoy"',valor:"guerrera",emoji:"🙏"},
    {texto:'"¿Por qué me siento sola aunque estoy rodeada de gente?"',valor:"sanadora",emoji:"💔"},
    {texto:'"Otro día. Ojalá sintiera que importa algo."',valor:"buscadora",emoji:"🌫️"},
    {texto:'"Quiero que este día tenga un propósito real."',valor:"visionaria",emoji:"✨"},
  ]},
  {id:2,category:"Lo que cargas",pregunta:"Hay algo que cargas en silencio\nque casi nadie sabe.",subtexto:"¿Cómo describirías eso?",opciones:[
    {texto:"Un cansancio que no se va ni después de dormir",valor:"sanadora",emoji:"😮‍💨"},
    {texto:"La sensación de que me pierdo algo importante",valor:"buscadora",emoji:"🚪"},
    {texto:"Miedo a que mis oraciones no lleguen a ningún lado",valor:"guerrera",emoji:"🌧️"},
    {texto:"La distancia entre quien soy y quien debería ser",valor:"visionaria",emoji:"🪞"},
  ]},
  {id:3,category:"Tu fe",pregunta:"Si Dios te hablara\nahora mismo…",subtexto:"¿Qué crees que te diría primero?",opciones:[
    {texto:'"Estoy aquí. No te solté."',valor:"sanadora",emoji:"🤍"},
    {texto:'"Sigue. No te rindas todavía."',valor:"guerrera",emoji:"⚔️"},
    {texto:'"Te estaba esperando. Ya es hora."',valor:"buscadora",emoji:"🕊️"},
    {texto:'"Tengo más para ti de lo que imaginas."',valor:"visionaria",emoji:"🌅"},
  ]},
  {id:4,category:"Tu rutina",pregunta:"Intentas tener un momento con Dios\ny la vida te interrumpe.",subtexto:"¿Qué pasa normalmente?",opciones:[
    {texto:"Lo pospongo y me siento culpable el resto del día",valor:"buscadora",emoji:"😞"},
    {texto:"Me frustro — nunca tengo tiempo para lo que importa",valor:"guerrera",emoji:"😤"},
    {texto:"Me rindo fácil, me cuesta concentrarme",valor:"sanadora",emoji:"💭"},
    {texto:"Ese momento con Él es lo único que no negocio",valor:"visionaria",emoji:"🔒"},
  ]},
  {id:5,category:"Momentos que marcan",pregunta:"¿Cuándo fue la última vez\nque sentiste que Dios te veía de verdad?",subtexto:"Algunos momentos nos marcan el alma para siempre.",opciones:[
    {texto:"Hace mucho. A veces dudo si alguna vez lo sentí.",valor:"buscadora",emoji:"🌑"},
    {texto:"En un momento de quiebre, cuando ya no podía más",valor:"sanadora",emoji:"🌊"},
    {texto:"En medio de una batalla que pensé que iba a perder",valor:"guerrera",emoji:"🔥"},
    {texto:"Cuando entendí que mi historia tiene un propósito mayor",valor:"visionaria",emoji:"🗺️"},
  ]},
  {id:6,category:"Lo que todavía duele",pregunta:"¿Hay algo que todavía\nte cuesta entregarle completamente a Dios?",subtexto:"No tienes que nombrarlo. Solo reconocer que existe.",opciones:[
    {texto:"Sí — y a veces siento que Él tampoco lo entiende",valor:"sanadora",emoji:"🩹"},
    {texto:"Sí — me cuesta creer que pueda sanar algo tan profundo",valor:"buscadora",emoji:"🌫️"},
    {texto:"Sí — pero lo peleo cada día en oración aunque duela",valor:"guerrera",emoji:"🛡️"},
    {texto:"Lo entregué — pero aprendo a no tomarlo de vuelta",valor:"visionaria",emoji:"🎁"},
  ]},
  {id:7,category:"Tu voz interior",pregunta:"Cuando nadie te observa,\n¿cómo te hablas a ti misma?",subtexto:"La voz interna dice más sobre nosotras que cualquier otra cosa.",opciones:[
    {texto:"Con dureza. Soy mi crítica más cruel.",valor:"sanadora",emoji:"💔"},
    {texto:'Con duda. "¿Seré suficiente para esto?"',valor:"buscadora",emoji:"❓"},
    {texto:'Con presión. "Tienes que poder. No puedes flaquear."',valor:"guerrera",emoji:"⚡"},
    {texto:'Con expectativa. "Hay algo grande en mí que no ha salido aún."',valor:"visionaria",emoji:"🌟"},
  ]},
  {id:8,category:"Tu comunidad",pregunta:"¿Qué tan acompañada te sientes\nen tu fe?",subtexto:"La fe fue diseñada para no caminarse sola.",opciones:[
    {texto:"Completamente sola. No tengo a nadie con quien hablar de esto.",valor:"buscadora",emoji:"🏝️"},
    {texto:"Tengo personas, pero nadie que entienda lo que cargo.",valor:"sanadora",emoji:"🤐"},
    {texto:"Tengo comunidad pero a veces siento que no encajo.",valor:"guerrera",emoji:"🧩"},
    {texto:"Busco conexiones profundas — no superficiales.",valor:"visionaria",emoji:"🌐"},
  ]},
  {id:9,category:"Tú y la Biblia",pregunta:"Cuando piensas en leer la Biblia,\n¿qué sientes honestamente?",subtexto:'No hay respuesta "correcta". Solo la tuya.',opciones:[
    {texto:"Que no sé por dónde empezar y me abruma",valor:"buscadora",emoji:"📖"},
    {texto:"Que quiero hacerlo pero la vida me gana",valor:"guerrera",emoji:"⏳"},
    {texto:"Que a veces la leo pero no siento que me habla a mí",valor:"sanadora",emoji:"💬"},
    {texto:"Que es mi pan diario pero quiero ir más profundo",valor:"visionaria",emoji:"🔍"},
  ]},
  {id:10,category:"Tu deseo más honesto",pregunta:"Si pudieras cambiar UNA cosa\nen tu vida espiritual mañana mismo…",subtexto:"¿Cuál sería?",opciones:[
    {texto:"Sentir que Dios me escucha cuando oro",valor:"buscadora",emoji:"👂"},
    {texto:"Sanar algo que llevo cargando demasiado tiempo",valor:"sanadora",emoji:"🕊️"},
    {texto:"Tener la disciplina de estar con Él todos los días",valor:"guerrera",emoji:"📅"},
    {texto:"Entender el propósito que Él tiene para mi vida",valor:"visionaria",emoji:"🎯"},
  ]},
  {id:11,category:"Tu futuro",pregunta:"¿Qué mujer quieres ser\ndentro de un año?",subtexto:"Cierra los ojos un segundo antes de responder.",opciones:[
    {texto:"Una mujer en paz — que no carga lo que no le pertenece",valor:"sanadora",emoji:"🌸"},
    {texto:"Una mujer que encontró a Dios y no lo suelta por nada",valor:"buscadora",emoji:"⚓"},
    {texto:"Una mujer de fe que inspira a las que la rodean",valor:"guerrera",emoji:"👑"},
    {texto:"Una mujer viviendo su propósito con claridad y sin miedo",valor:"visionaria",emoji:"🦋"},
  ]},
  {id:12,category:"Este momento",pregunta:"Una última cosa —\n¿qué te trajo hasta aquí hoy?",subtexto:"Nada es casualidad. Especialmente esto.",opciones:[
    {texto:"La curiosidad — algo llamó mi atención",valor:"buscadora",emoji:"🔮"},
    {texto:"El cansancio — ya no puedo seguir igual",valor:"sanadora",emoji:"🏳️"},
    {texto:"La necesidad — sé que necesito más de Dios",valor:"guerrera",emoji:"💡"},
    {texto:"El llamado — siento que este es un paso importante",valor:"visionaria",emoji:"🚪"},
  ]},
];

const ARQUETIPOS = {
  guerrera:{nombre:"La Mujer Guerrera",emoji:"⚔️",tagline:"Tu fe es real y tu corazón lo sabe.\nPero cargas más de lo que deberías sola.",descripcion:["Eres de las que no se rinde. Cuando todo cae, tú te levantas. Cuando otros dudan, tú oras. Pero hay algo que pocas saben de ti: por dentro, hay días en que estás agotada de pelear sola.","Tu relación con Dios es genuina — pero necesita espacio para respirar. Lo que necesitas no es más disciplina. Necesitas un lugar donde la Palabra de Dios te hable directamente a ti."],versiculo:'"El Señor peleará por vosotros; vosotros estaréis tranquilos." — Éxodo 14:14',necesita:["Devocionales que honran tu fortaleza sin ignorar tu vulnerabilidad","Oraciones para los días en que no puedes más","Comunidad de mujeres que entienden lo que es pelear en fe"],analisis:{conexion:82,sanidad:58,proposito:74,comunidad:65,paz:61},regalo:"Plan devocional de la Guerrera — 21 días de fortaleza en fe"},
  sanadora:{nombre:"La Mujer que Sana",emoji:"🌊",tagline:"Cargas heridas que nadie ve.\nY sin embargo, sigues aquí. Eso dice todo de ti.",descripcion:["Hay algo en ti que no todo el mundo tiene: la capacidad de sentir profundo. De amar intensamente. Pero eso mismo que es tu mayor don, a veces se convierte en tu mayor peso.","Dios lo sabe. Y tiene algo específico para ti — encuentros reales con Su presencia que tocan exactamente donde duele. El proceso de sanar empieza cuando dejas de cargar sola."],versiculo:'"Él sana a los quebrantados de corazón y venda sus heridas." — Salmo 147:3',necesita:["Devocionales para el dolor real, no el dolor idealizado","Oraciones de liberación y sanidad interior","Un espacio seguro donde tu historia tiene valor"],analisis:{conexion:68,sanidad:91,proposito:55,comunidad:72,paz:48},regalo:"Plan de sanidad interior — 21 días de encuentro con la presencia de Dios"},
  buscadora:{nombre:"La Mujer Buscadora",emoji:"🕊️",tagline:"Algo en ti siempre supo que había más.\nY ese algo te trajo hasta aquí hoy.",descripcion:["Tal vez te alejaste. Tal vez nunca estuviste del todo cerca. Lo que sí es cierto es que hay una parte de ti que nunca dejó de buscar. Que siente ese vacío cuando todo lo demás está bien pero algo falta.","No tienes que haber tenido todo perfecto para comenzar. El primer paso no es la perfección — es la honestidad. Tú ya diste ese paso hoy."],versiculo:'"Me buscaréis y me encontraréis, porque me buscaréis de todo vuestro corazón." — Jeremías 29:13',necesita:["Introducción a la Biblia sin religiosidad ni complejidad","Devocionales cortos que construyen hábito desde cero","Una guía que acompaña sin juzgar tu punto de partida"],analisis:{conexion:45,sanidad:63,proposito:58,comunidad:40,paz:52},regalo:"Guía de reconexión — 7 primeros pasos para volver a Dios sin culpa"},
  visionaria:{nombre:"La Mujer Visionaria",emoji:"✨",tagline:"Tienes fe. Tienes hambre.\nY sabes que Dios tiene algo más grande para ti.",descripcion:["No te conformas con una fe tibia. Nunca te conformaste. Hay algo en ti que siente que fuiste creada para más — y que ese 'más' tiene que ver con Dios de una manera que todavía no entiendes completamente.","Lo que necesitas no es más información bíblica — es revelación personal. Momentos donde la Palabra de Dios aterrice en tu historia específica y te muestre el camino con claridad."],versiculo:'"Porque yo sé los planes que tengo para vosotros... planes de bienestar y no de mal." — Jeremías 29:11',necesita:["Estudios bíblicos que van más allá de la superficie","Devocionales de propósito y llamado","Comunidad de mujeres que también quieren ir profundo"],analisis:{conexion:88,sanidad:70,proposito:95,comunidad:78,paz:82},regalo:"Plan de propósito — 21 días para descubrir y caminar en tu llamado"},
};

const VALIDATION_SCREENS = {
  3:{emoji:"🤍",titulo:"Acabas de imaginar algo muy real.",texto:"Lo que elegiste no fue al azar. Hay una parte de ti que sabe exactamente qué necesita escuchar de Él. Eso es fe — aunque no se sienta así todos los días.",color:"rose"},
  7:{emoji:"🌸",titulo:"Esa voz que te habla duro...",texto:"No eres la única. La mayoría de mujeres que llegan aquí cargan esa misma voz. Lo que estás haciendo hoy — detenerte, respirar, buscar — es exactamente lo opuesto a lo que esa voz te dice que mereces.",color:"lavender"},
  10:{emoji:"✨",titulo:"Ese deseo que acabas de nombrar...",texto:"No es un sueño lejano. Es una semilla que Dios ya puso en ti. Estamos a solo 2 preguntas de mostrarte exactamente cómo SELAH fue diseñada para eso.",color:"rose"},
};

const ANALISIS_LABELS = {conexion:"Conexión espiritual",sanidad:"Necesidad de sanidad",proposito:"Claridad de propósito",comunidad:"Hambre de comunidad",paz:"Búsqueda de paz interior"};

function calcularArquetipo(resp) {
  const c={guerrera:0,sanadora:0,buscadora:0,visionaria:0};
  resp.forEach(v=>{if(v&&c[v]!==undefined)c[v]++;});
  return Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0];
}

function ProgressBar({current,total}) {
  const pct=Math.round((current/total)*100);
  return (
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{color:G.textMuted,fontSize:11,letterSpacing:1.5,textTransform:"uppercase"}}>{current} de {total}</span>
        <span style={{color:G.terra,fontSize:11,fontWeight:700}}>{pct}%</span>
      </div>
      <div style={{height:4,background:G.lavender,borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${G.lavMid},${G.terra})`,borderRadius:99,transition:"width 0.5s cubic-bezier(.4,0,.2,1)"}}/>
      </div>
    </div>
  );
}

function ValidationScreen({data,onContinue}) {
  const [visible,setVisible]=useState(false);
  const isLav=data.color==="lavender";
  useEffect(()=>{const t=setTimeout(()=>setVisible(true),80);return()=>clearTimeout(t);},[]);
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:340,textAlign:"center",animation:"slideIn 0.4s ease",padding:"8px 0",position:"relative"}}>
      <div style={{fontSize:56,marginBottom:24,opacity:visible?1:0,transform:visible?"scale(1)":"scale(0.6)",transition:"all 0.5s cubic-bezier(.34,1.56,.64,1)"}}>{data.emoji}</div>
      <div style={{width:40,height:2,background:`linear-gradient(90deg,${isLav?G.lavMid:G.terra},transparent)`,borderRadius:99,marginBottom:20,opacity:visible?1:0,transition:"opacity 0.4s ease 0.2s"}}/>
      <h3 style={{color:G.text,fontSize:"clamp(19px,5vw,24px)",fontFamily:"'Georgia',serif",fontWeight:800,lineHeight:1.3,marginBottom:16,maxWidth:340,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(12px)",transition:"all 0.5s ease 0.15s"}}>{data.titulo}</h3>
      <p style={{color:G.textMid,fontSize:15,lineHeight:1.78,maxWidth:360,marginBottom:36,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(12px)",transition:"all 0.5s ease 0.25s"}}>{data.texto}</p>
      <button onClick={onContinue} style={{padding:"13px 36px",background:isLav?`linear-gradient(135deg,${G.lavMid},#7B6BA8)`:`linear-gradient(135deg,${G.terra},${G.terraDark})`,border:"none",borderRadius:50,color:G.white,fontSize:14.5,fontWeight:700,cursor:"pointer",opacity:visible?1:0,transform:visible?"scale(1)":"scale(0.95)",transition:"all 0.4s ease 0.35s"}}>Continuar →</button>
      <p style={{color:G.textMuted,fontSize:11,marginTop:16,fontStyle:"italic",opacity:visible?1:0,transition:"opacity 0.4s ease 0.5s"}}>Solo unos pasos más para ver tu perfil completo</p>
    </div>
  );
}

function Intro({onStart}) {
  const [visible,setVisible]=useState(false);
  useEffect(()=>{setTimeout(()=>setVisible(true),80);},[]);
  return (
    <div style={{textAlign:"center",padding:"16px 0 8px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:360}}>

      {/* Logo */}
      <div style={{marginBottom:28,opacity:visible?1:0,transition:"opacity 0.5s ease"}}>
        <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg,${G.terraPale},${G.lavender})`,border:`1.5px solid ${G.borderS}`,marginBottom:12,boxShadow:G.shadow}}>
          <span style={{fontSize:24}}>✦</span>
        </div>
        <div style={{color:G.terra,fontSize:10.5,letterSpacing:6,textTransform:"uppercase",fontWeight:700}}>SELAH</div>
      </div>

      {/* Headline — único mensaje */}
      <div style={{opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(14px)",transition:"all 0.6s ease 0.1s",marginBottom:32}}>
        <h1 style={{fontSize:"clamp(26px,7vw,36px)",fontWeight:800,color:G.text,lineHeight:1.2,fontFamily:"'Georgia',serif",marginBottom:12}}>
          Descubre qué necesita<br/>tu alma{" "}
          <span style={{color:G.terra,fontStyle:"italic"}}>hoy.</span>
        </h1>
        <p style={{color:G.textMuted,fontSize:14,lineHeight:1.6}}>
          3 minutos · 12 preguntas
        </p>
      </div>

      {/* CTA único */}
      <div style={{opacity:visible?1:0,transition:"opacity 0.6s ease 0.25s",width:"100%"}}>
        <button onClick={onStart}
          style={{width:"100%",padding:"17px",background:`linear-gradient(135deg,${G.terra},${G.terraDark})`,color:G.white,border:"none",borderRadius:14,fontSize:16.5,fontWeight:700,cursor:"pointer",boxShadow:`0 8px 28px rgba(207,132,114,0.45)`,marginBottom:14}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.02)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          Comenzar →
        </button>
        <p style={{color:G.textMuted,fontSize:11}}>🔒 Gratis · Privado · Sin registro</p>
      </div>

    </div>
  );
}


function Pregunta({q,index,total,onSelect,onValidation}) {
  const [selected,setSelected]=useState(null);
  const [animating,setAnimating]=useState(false);
  const lines=q.pregunta.split("\n");
  const handleSelect=(valor)=>{
    if(animating)return;
    setSelected(valor);setAnimating(true);
    setTimeout(()=>{
      if(VALIDATION_SCREENS[index+1]&&onValidation){onValidation(valor);}
      else{onSelect(valor);}
      setSelected(null);setAnimating(false);
    },500);
  };
  return (
    <div style={{animation:"slideIn 0.35s ease"}}>
      <ProgressBar current={index+1} total={total}/>
      <div style={{background:G.lavender,borderRadius:6,padding:"3px 12px",display:"inline-block",marginBottom:16}}>
        <span style={{color:G.terraDark,fontSize:10,letterSpacing:2.5,textTransform:"uppercase",fontWeight:600}}>{q.category}</span>
      </div>
      <h2 style={{fontSize:"clamp(18px,4.5vw,23px)",color:G.text,fontFamily:"'Georgia',serif",fontWeight:700,lineHeight:1.4,marginBottom:4}}>
        {lines[0]}{lines[1]&&<><br/><span style={{color:G.terraDark}}>{lines[1]}</span></>}
      </h2>
      {q.subtexto&&<p style={{color:G.textMid,fontSize:13,fontStyle:"italic",marginBottom:22,lineHeight:1.5}}>{q.subtexto}</p>}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {q.opciones.map((op,i)=>{
          const isSel=selected===op.valor;
          return (
            <button key={i} onClick={()=>handleSelect(op.valor)} style={{padding:"16px 18px",background:isSel?G.terraPale:G.white,border:`1.5px solid ${isSel?G.terra:G.border}`,borderRadius:16,color:isSel?G.terraDark:G.textMid,fontSize:15,lineHeight:1.5,textAlign:"left",cursor:"pointer",transition:"all 0.2s ease",display:"flex",alignItems:"center",gap:12,transform:isSel?"scale(0.98)":"scale(1)",opacity:animating&&!isSel?0.4:1,WebkitTapHighlightColor:"transparent",touchAction:"manipulation"}}>
              <span style={{fontSize:22,flexShrink:0}}>{op.emoji}</span>
              <span style={{fontWeight:isSel?600:400}}>{op.texto}</span>
              {isSel&&<span style={{marginLeft:"auto",color:G.terra}}>✓</span>}
            </button>
          );
        })}
      </div>
      <p style={{color:G.textMuted,fontSize:11.5,textAlign:"center",marginTop:18,fontStyle:"italic"}}>Toca una opción para continuar</p>
    </div>
  );
}

function Analisis({arquetipo,onDone}) {
  const a=ARQUETIPOS[arquetipo];
  const [barras,setBarras]=useState({conexion:0,sanidad:0,proposito:0,comunidad:0,paz:0});
  const [msgIdx,setMsgIdx]=useState(0);
  const [listo,setListo]=useState(false);
  const msgs=["Analizando tus respuestas...","Identificando tu perfil espiritual...","Preparando algo especial para ti...","¡Tu perfil está listo! ✦"];
  useEffect(()=>{
    [0,900,1800,2700].forEach((d,i)=>setTimeout(()=>setMsgIdx(i),d));
    Object.keys(a.analisis).forEach((key,i)=>{
      setTimeout(()=>{
        let cur=0;const target=a.analisis[key];
        const iv=setInterval(()=>{cur=Math.min(cur+target/25,target);setBarras(p=>({...p,[key]:Math.round(cur)}));if(cur>=target)clearInterval(iv);},24);
      },i*300);
    });
    setTimeout(()=>setListo(true),3500);
  },[]);
  return (
    <div style={{textAlign:"center"}}>
      <div style={{width:68,height:68,borderRadius:"50%",background:`linear-gradient(135deg,${G.terraPale},${G.lavender})`,border:`2px solid ${G.borderS}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",animation:listo?"none":"pulse 1.6s ease-in-out infinite"}}>
        <span style={{fontSize:28}}>{listo?a.emoji:"✦"}</span>
      </div>
      <p style={{color:G.textMid,fontSize:15,fontStyle:"italic",marginBottom:28,minHeight:24}}>{msgs[msgIdx]}</p>
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:20,padding:"22px 20px",boxShadow:G.shadow,textAlign:"left",marginBottom:24}}>
        <p style={{color:G.textMuted,fontSize:10.5,letterSpacing:2,textTransform:"uppercase",marginBottom:20,textAlign:"center",fontWeight:600}}>Análisis de tu perfil</p>
        {Object.entries(ANALISIS_LABELS).map(([key,label])=>(
          <div key={key} style={{marginBottom:15}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:G.textMid,fontSize:13}}>{label}</span>
              <span style={{color:G.terra,fontSize:13,fontWeight:700}}>{barras[key]}%</span>
            </div>
            <div style={{height:7,background:G.lavender,borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${barras[key]}%`,background:`linear-gradient(90deg,${G.lavMid},${G.terra})`,borderRadius:99,transition:"width 0.05s linear"}}/>
            </div>
          </div>
        ))}
      </div>
      {listo&&<button onClick={onDone} style={{width:"100%",padding:"15px",background:`linear-gradient(135deg,${G.terra},${G.terraDark})`,border:"none",borderRadius:14,color:G.white,fontSize:15.5,fontWeight:700,cursor:"pointer",boxShadow:`0 6px 24px rgba(207,132,114,0.45)`,animation:"fadeUp 0.5s ease"}}>Ver mi perfil completo →</button>}
    </div>
  );
}

function CurvaEmocional({arquetipo,onContinue}) {
  const a=ARQUETIPOS[arquetipo];
  const [fase,setFase]=useState(0);
  const [puntoActivo,setPuntoActivo]=useState(null);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    setTimeout(()=>setVisible(true),150);
    setTimeout(()=>setFase(1),800);
    setTimeout(()=>setFase(2),2200);
  },[]);
  const curvas={guerrera:{hoy:-65,d7:-20,d14:30,d21:75,color:G.terra},sanadora:{hoy:-75,d7:-30,d14:20,d21:70,color:"#9B7CC4"},buscadora:{hoy:-70,d7:-25,d14:35,d21:72,color:G.terra},visionaria:{hoy:-50,d7:10,d14:55,d21:88,color:G.gold}};
  const c=curvas[arquetipo]||curvas.buscadora;
  const puntos=[
    {label:"Hoy",valor:c.hoy,desc:"Donde estás ahora mismo",dia:"Día 0",emoji:"🌑"},
    {label:"Día 7",valor:c.d7,desc:"El primer cambio que notarás",dia:"Semana 1",emoji:"🌱"},
    {label:"Día 14",valor:c.d14,desc:"Tu fe empieza a sentirse diferente",dia:"Semana 2",emoji:"🌸"},
    {label:"Día 21",valor:c.d21,desc:"La transformación que te trajo aquí",dia:"Semana 3",emoji:"✨"},
  ];
  const W=280;const H=100;
  const toX=(i)=>(i/3)*(W-20)+10;
  const toY=(v)=>H/2-(v/100)*(H/2-8);
  const smoothPath=()=>{
    const pts=puntos.map((p,i)=>({x:toX(i),y:toY(p.valor)}));
    let d=`M ${pts[0].x} ${pts[0].y}`;
    for(let i=1;i<pts.length;i++){const prev=pts[i-1];const curr=pts[i];const cpx=(prev.x+curr.x)/2;d+=` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;}
    return d;
  };
  const proyecciones={guerrera:["Tu fe dejará de depender del ánimo del día","Empezarás el día desde la fortaleza, no desde el miedo","Las batallas seguirán — pero ya no las pelearás sola"],sanadora:["Lo que cargabas en silencio tendrá un lugar seguro","Empezarás a sentir que Dios toca exactamente donde duele","La sanidad no llega de golpe — pero cada día será menos peso"],buscadora:["Dejarás de sentir que Dios está lejos","Construirás un hábito espiritual sin culpa ni presión","La reconexión que buscabas se vuelve natural"],visionaria:["El propósito que intuías empezará a tener nombre","Tu fe dejará de ser solo domingo — será cada decisión","Vivirás con claridad de dirección, no solo con buenas intenciones"]};
  const proy=proyecciones[arquetipo]||proyecciones.buscadora;
  return (
    <div style={{animation:"slideIn 0.4s ease"}}>
      <div style={{textAlign:"center",marginBottom:24,opacity:visible?1:0,transition:"opacity 0.5s ease"}}>
        <div style={{fontSize:36,marginBottom:10}}>{a.emoji}</div>
        <div style={{color:G.terra,fontSize:10,letterSpacing:4,textTransform:"uppercase",fontWeight:700,marginBottom:8}}>Tu proyección espiritual</div>
        <h3 style={{color:G.text,fontSize:"clamp(18px,4.5vw,22px)",fontFamily:"'Georgia',serif",fontWeight:800,lineHeight:1.35,marginBottom:8}}>Esto es lo que puede pasar<br/>en tus próximos 21 días.</h3>
        <p style={{color:G.textMid,fontSize:14,lineHeight:1.7,maxWidth:340,margin:"0 auto"}}>Basado en tu perfil de <strong style={{color:G.terraDark}}>{a.nombre}</strong> y las respuestas que diste.</p>
      </div>
      <div style={{background:G.white,border:`1px solid ${G.border}`,borderRadius:20,padding:"24px 20px",marginBottom:20,boxShadow:G.shadow,opacity:fase>=1?1:0,transition:"opacity 0.6s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <span style={{color:G.textMuted,fontSize:10,letterSpacing:1}}>ESTADO EMOCIONAL</span>
          <span style={{color:G.textMuted,fontSize:10}}>ESPIRITUAL</span>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H+20}`} style={{display:"block",overflow:"visible",touchAction:"manipulation"}}>
            <line x1="10" y1={toY(0)} x2={W-10} y2={toY(0)} stroke={G.border} strokeWidth="1" strokeDasharray="4,4"/>
            <text x="4" y={toY(0)+4} fill={G.textMuted} fontSize="7">0</text>
            {fase>=1&&<path d={`${smoothPath()} L ${toX(3)} ${toY(0)} L ${toX(0)} ${toY(0)} Z`} fill={`${c.color}18`}/>}
            {fase>=1&&<path d={smoothPath()} fill="none" stroke={c.color} strokeWidth="2.5" strokeLinecap="round"/>}
            {puntos.map((p,i)=>(
              <g key={i}>
                {/* Touch target más grande para móvil */}
                <circle cx={toX(i)} cy={toY(p.valor)} r={22} fill="transparent" style={{cursor:"pointer"}} onClick={()=>setPuntoActivo(puntoActivo===i?null:i)}/>
                <circle cx={toX(i)} cy={toY(p.valor)} r={puntoActivo===i?8:5} fill={i===0?G.textMuted:c.color} stroke={G.white} strokeWidth="2.5" style={{cursor:"pointer",transition:"r 0.2s"}}/>
                <text x={toX(i)} y={H+16} textAnchor="middle" fill={puntoActivo===i?c.color:G.textMuted} fontSize="8" fontWeight={puntoActivo===i?"700":"400"}>{p.label}</text>
                {fase>=2&&<text x={toX(i)} y={toY(p.valor)-12} textAnchor="middle" fontSize="14">{p.emoji}</text>}
              </g>
            ))}
          </svg>

          {/* Tooltip DEBAJO de la gráfica — nunca tapa los puntos */}
          <div style={{
            minHeight:52,
            marginTop:4,
            transition:"all 0.25s ease",
          }}>
            {puntoActivo!==null ? (
              <div style={{
                background:G.text, color:G.white, borderRadius:12,
                padding:"12px 16px", fontSize:13, lineHeight:1.6,
                animation:"fadeUp 0.2s ease",
                display:"flex", alignItems:"center", gap:12,
              }}>
                <span style={{fontSize:20,flexShrink:0}}>{puntos[puntoActivo].emoji}</span>
                <div>
                  <div style={{fontWeight:700,marginBottom:2,color:G.white}}>{puntos[puntoActivo].dia}</div>
                  <div style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{puntos[puntoActivo].desc}</div>
                </div>
                <button onClick={()=>setPuntoActivo(null)} style={{marginLeft:"auto",background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:18,cursor:"pointer",flexShrink:0,lineHeight:1}}>×</button>
              </div>
            ) : (
              <p style={{color:G.textMuted,fontSize:11,textAlign:"center",paddingTop:8,fontStyle:"italic"}}>
                👆 Toca cada punto para ver qué pasa ese día
              </p>
            )}
          </div>
      </div>
      {fase>=2&&(
        <div style={{background:`linear-gradient(160deg,${G.terraPale},${G.lavender})`,border:`1px solid ${G.borderS}`,borderRadius:18,padding:"20px",marginBottom:24,animation:"fadeUp 0.5s ease"}}>
          <p style={{color:G.terraDark,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",fontWeight:700,marginBottom:14}}>Tu proyección de transformación</p>
          {proy.map((t,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<2?12:0}}>
              <span style={{color:G.gold,fontSize:14,flexShrink:0,marginTop:2}}>✦</span>
              <span style={{color:G.textMid,fontSize:14,lineHeight:1.65}}>{t}</span>
            </div>
          ))}
        </div>
      )}
      {fase>=2&&(
        <button onClick={onContinue} style={{width:"100%",padding:"15px",background:`linear-gradient(135deg,${G.terra},${G.terraDark})`,border:"none",borderRadius:14,color:G.white,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:`0 6px 24px rgba(207,132,114,0.45)`,animation:"fadeUp 0.5s ease 0.3s both"}}>
          Quiero esta transformación →
        </button>
      )}
    </div>
  );
}

function CapturaEmail({arquetipo,onSubmit}) {
  const a=ARQUETIPOS[arquetipo];
  const [nombre,setNombre]=useState("");const [email,setEmail]=useState("");
  const valido=nombre.trim().length>1&&email.includes("@");
  return (
    <div style={{animation:"slideIn 0.35s ease"}}>
      <div style={{background:`linear-gradient(160deg,${G.terraPale},${G.lavender})`,border:`1.5px solid ${G.borderS}`,borderRadius:20,padding:"26px 20px",textAlign:"center",marginBottom:24,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backdropFilter:"blur(5px)",background:"rgba(245,237,233,0.65)",borderRadius:20,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:2,gap:8}}>
          <span style={{fontSize:32}}>🔒</span>
          <p style={{color:G.terraDark,fontSize:14,fontWeight:700,maxWidth:240,lineHeight:1.5}}>Tu perfil completo está listo.<br/><span style={{fontWeight:400,color:G.textMid}}>Déjanos tu nombre y correo para verlo.</span></p>
        </div>
        <div style={{filter:"blur(3px)",userSelect:"none",pointerEvents:"none"}}>
          <div style={{fontSize:40,marginBottom:8}}>{a.emoji}</div>
          <div style={{fontSize:18,color:G.text,fontFamily:"'Georgia',serif",fontWeight:700}}>{a.nombre}</div>
          <div style={{fontSize:13,color:G.textMid,marginTop:6}}>Tu versículo · Tu plan · Tu camino</div>
        </div>
      </div>
      <h3 style={{color:G.text,fontSize:19,fontFamily:"'Georgia',serif",fontWeight:700,marginBottom:6,textAlign:"center"}}>¿A dónde enviamos tu perfil?</h3>
      <p style={{color:G.textMuted,fontSize:13.5,textAlign:"center",marginBottom:22,lineHeight:1.6}}>También recibirás tu plan devocional de 7 días personalizado — gratis.</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
        <input type="text" placeholder="Tu nombre" value={nombre} onChange={e=>setNombre(e.target.value)} autoComplete="given-name" style={{padding:"15px 16px",background:G.white,border:`1.5px solid ${G.border}`,borderRadius:12,color:G.text,fontSize:16,outline:"none",width:"100%"}}/>
        <input type="email" placeholder="Tu correo electrónico" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" inputMode="email" style={{padding:"15px 16px",background:G.white,border:`1.5px solid ${G.border}`,borderRadius:12,color:G.text,fontSize:16,outline:"none",width:"100%"}}/>
      </div>
      <button onClick={()=>valido&&onSubmit({nombre:nombre.trim(),email:email.trim(),arquetipo})} disabled={!valido} style={{width:"100%",padding:"15px",background:valido?`linear-gradient(135deg,${G.terra},${G.terraDark})`:G.lavender,border:"none",borderRadius:12,color:valido?G.white:G.textMuted,fontSize:15.5,fontWeight:700,cursor:valido?"pointer":"not-allowed",transition:"all 0.2s",boxShadow:valido?`0 6px 22px rgba(207,132,114,0.45)`:"none"}}>Ver mi perfil completo →</button>
      <p style={{color:G.textMuted,fontSize:11,textAlign:"center",marginTop:10}}>🔒 Sin spam. Cancela cuando quieras.</p>
    </div>
  );
}

// ── RESULTADO + VENTA (página única) ─────────────────────────
function ResultadoVenta({ arquetipo, nombre, onComprar }) {
  const a = ARQUETIPOS[arquetipo];
  const lines = a.tagline.split("\n");
  const [timer, setTimer] = useState(23 * 60 + 47);
  const [faqOpen, setFaqOpen] = useState(null);
  const [exitMostrado, setExitMostrado] = useState(false);
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setTimer(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(iv);
  }, []);

  // Exit intent — desktop + móvil
  useEffect(() => {
    if (exitMostrado) return;
    window.history.pushState({ selah: "venta" }, "", window.location.href);
    const onMouseLeave = (e) => {
      if (e.clientY < 10) { setShowExit(true); setExitMostrado(true); }
    };
    const onPopState = () => {
      window.history.pushState({ selah: "venta" }, "", window.location.href);
      setShowExit(true); setExitMostrado(true);
    };
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const tMins = String(Math.floor(timer / 60)).padStart(2, "0");
  const tSegs = String(timer % 60).padStart(2, "0");

  const faqs = [
    { q: "¿Necesito experiencia previa con la Biblia?", a: "Para nada. SELAH está diseñada para mujeres en cualquier punto de su fe — desde las que están comenzando hasta las que quieren ir más profundo." },
    { q: "¿Cuánto tiempo necesito cada día?", a: "Solo 5 minutos. Un devocional, una oración, un versículo. Diseñado para tu vida real, no para la vida perfecta." },
    { q: "¿Puedo cancelar cuando quiera?", a: "Sí, en cualquier momento, desde tu cuenta, sin formularios ni llamadas. Sin compromisos." },
    { q: "¿Qué pasa si no siento que SELAH es para mí?", a: "Tienes 7 días de garantía total. Si no sientes la diferencia, te devolvemos cada centavo sin preguntas." },
    { q: "¿En qué idioma está el contenido?", a: "Todo en español. Diseñado específicamente para mujeres latinoamericanas." },
  ];

  const transformaciones = {
    guerrera: [
      { antes: "Empiezas el día con el teléfono", despues: "Empiezas el día con Dios" },
      { antes: "Oras pero sientes que no llega", despues: "Tienes oraciones que dicen lo que sientes" },
      { antes: "Tu fe depende de cómo te sientes", despues: "Tu fe es un ancla, no un estado de ánimo" },
      { antes: "Peleas sola tus batallas", despues: "Tienes respaldo espiritual cada día" },
    ],
    sanadora: [
      { antes: "Cargas en silencio lo que duele", despues: "Hay un espacio seguro para tu historia" },
      { antes: "Sientes que Dios no entiende tu dolor", despues: "La Palabra toca exactamente donde duele" },
      { antes: "La sanidad se siente lejana", despues: "Cada día es menos peso" },
      { antes: "Nadie entiende lo que cargas", despues: "Una comunidad que sí entiende" },
    ],
    buscadora: [
      { antes: "Dios se siente lejano", despues: "Sientes Su presencia cada mañana" },
      { antes: "La Biblia te abruma", despues: "Devocionales simples y directos para ti" },
      { antes: "No sabes por dónde empezar", despues: "Un camino claro, paso a paso" },
      { antes: "Tu fe se siente solitaria", despues: "Una comunidad que camina contigo" },
    ],
    visionaria: [
      { antes: "Tienes fe pero sin dirección clara", despues: "Entiendes el propósito que Dios tiene para ti" },
      { antes: "Tu fe es solo de domingos", despues: "Cada decisión está guiada por Él" },
      { antes: "Buscas profundidad pero no sabes dónde", despues: "Estudios bíblicos que van más allá" },
      { antes: "Tu propósito se siente vago", despues: "Claridad y dirección real" },
    ],
  };
  const trans = transformaciones[arquetipo] || transformaciones.buscadora;

  const BloquePrecios = () => (
    <div style={{ background: `linear-gradient(160deg,${G.terraPale},${G.lavender})`, borderRadius: 20, padding: "24px 20px", marginBottom: 16 }}>
      <div style={{ background: G.terra, borderRadius: 50, padding: "5px 16px", display: "inline-block", marginBottom: 14 }}>
        <span style={{ color: G.white, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>🔥 Oferta válida solo hoy</span>
      </div>

      {/* Mensual */}
      <div style={{ background: G.white, borderRadius: 14, padding: "16px 18px", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ color: G.text, fontSize: 14, fontWeight: 600 }}>Plan Mensual</span>
          <div style={{ textAlign: "right" }}>
            <span style={{ color: G.textMuted, fontSize: 13, textDecoration: "line-through", marginRight: 6 }}>$12.99</span>
            <span style={{ color: G.terra, fontSize: 22, fontWeight: 800 }}>$9<span style={{ fontSize: 12, fontWeight: 400, color: G.textMuted }}>/mes</span></span>
          </div>
        </div>
        <button onClick={() => onComprar("mensual")} style={{ width: "100%", padding: "12px", background: G.terraPale, border: `1.5px solid ${G.borderS}`, borderRadius: 10, color: G.terraDark, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Comenzar mensual
        </button>
      </div>

      {/* Anual — destacado */}
      <div style={{ background: G.white, border: `2px solid ${G.terra}`, borderRadius: 14, padding: "16px 18px", position: "relative", boxShadow: `0 6px 24px rgba(207,132,114,0.2)` }}>
        <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${G.terra},${G.terraDark})`, color: G.white, fontSize: 10, fontWeight: 800, padding: "3px 14px", borderRadius: 50, whiteSpace: "nowrap" }}>
          ⭐ MÁS ELEGIDO
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ color: G.text, fontSize: 14, fontWeight: 600 }}>Plan Anual</span>
          <div style={{ textAlign: "right" }}>
            <span style={{ color: G.textMuted, fontSize: 13, textDecoration: "line-through", marginRight: 6 }}>$71.99</span>
            <span style={{ color: G.terra, fontSize: 22, fontWeight: 800 }}>$49.99<span style={{ fontSize: 12, fontWeight: 400, color: G.textMuted }}>/año</span></span>
          </div>
        </div>
        <div style={{ color: G.terra, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Solo $4.16/mes · Ahorras 58%</div>
        <button onClick={() => onComprar("anual")} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg,${G.terra},${G.terraDark})`, border: "none", borderRadius: 10, color: G.white, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: `0 4px 16px rgba(207,132,114,0.4)` }}>
          Activar mi acompañamiento →
        </button>
      </div>

      {/* Contador */}
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <span style={{ color: G.textMuted, fontSize: 12 }}>⏱ Esta oferta expira en</span>
        <span style={{ color: G.terraDark, fontWeight: 800, fontSize: 16, fontFamily: "monospace" }}>{tMins}:{tSegs}</span>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: G.bg, fontFamily: "-apple-system,'Segoe UI',sans-serif" }}>

      {showExit && (
        <ExitIntent
          nombre={nombre}
          onAceptar={() => { setShowExit(false); onComprar("mensualOff"); }}
          onCerrar={() => setShowExit(false)}
        />
      )}

      {/* ── STICKY TOP ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: G.text, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
          ⏱ Oferta expira en <strong style={{ color: G.white, fontFamily: "monospace" }}>{tMins}:{tSegs}</strong>
        </div>
        <button onClick={() => onComprar("anual")} style={{ padding: "8px 18px", background: `linear-gradient(135deg,${G.terra},${G.terraDark})`, color: G.white, border: "none", borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Obtener mi plan →
        </button>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 16px 60px" }}>

        {/* ── 1. PERFIL ── */}
        <div style={{ background: `linear-gradient(160deg,${G.terraPale},${G.lavender})`, borderRadius: "0 0 24px 24px", padding: "32px 20px 28px", textAlign: "center", marginBottom: 28, borderBottom: `1px solid ${G.border}` }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>{a.emoji}</div>
          <div style={{ color: G.terra, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Tu perfil espiritual</div>
          <h2 style={{ color: G.text, fontSize: "clamp(22px,5.5vw,28px)", fontFamily: "'Georgia',serif", fontWeight: 800, margin: "0 0 10px" }}>{a.nombre}</h2>
          <p style={{ color: G.textMid, fontSize: 14.5, fontStyle: "italic", lineHeight: 1.6, maxWidth: 300, margin: "0 auto 14px" }}>
            "{lines[0]}<br/>{lines[1]}"
          </p>
          {nombre && <p style={{ color: G.terra, fontSize: 13, fontWeight: 700 }}>{nombre}, esto es lo que vimos en ti ✦</p>}
        </div>

        {/* Descripción */}
        {a.descripcion.map((p, i) => (
          <p key={i} style={{ color: i === 0 ? G.text : G.textMid, fontSize: 14.5, lineHeight: 1.78, marginBottom: 14, fontWeight: i === 0 ? 500 : 400, padding: "0 4px" }}>{p}</p>
        ))}

        {/* Versículo */}
        <div style={{ background: G.terraPale, border: `1px solid ${G.borderS}`, borderRadius: 14, padding: "16px 18px", marginBottom: 28, textAlign: "center" }}>
          <div style={{ color: G.gold, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>Tu versículo</div>
          <p style={{ color: G.text, fontSize: 14, fontStyle: "italic", lineHeight: 1.7, fontFamily: "'Georgia',serif" }}>{a.versiculo}</p>
        </div>

        {/* ── 2. ANTES / DESPUÉS ── */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ color: G.text, fontSize: 17, fontFamily: "'Georgia',serif", fontWeight: 800, marginBottom: 16, textAlign: "center" }}>
            Lo que cambia en 21 días
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: "rgba(160,128,112,0.08)", borderRadius: 14, padding: "14px 12px" }}>
              <div style={{ color: G.textMuted, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 12, textAlign: "center" }}>Hoy</div>
              {trans.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ color: G.textMuted, fontSize: 13, flexShrink: 0, marginTop: 1 }}>✗</span>
                  <span style={{ color: G.textMid, fontSize: 12.5, lineHeight: 1.5 }}>{t.antes}</span>
                </div>
              ))}
            </div>
            <div style={{ background: G.white, border: `1.5px solid ${G.borderS}`, borderRadius: 14, padding: "14px 12px", boxShadow: G.shadow }}>
              <div style={{ color: G.terra, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 12, textAlign: "center" }}>Con SELAH</div>
              {trans.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ color: G.gold, fontSize: 13, flexShrink: 0, marginTop: 1 }}>✦</span>
                  <span style={{ color: G.text, fontSize: 12.5, lineHeight: 1.5, fontWeight: 500 }}>{t.despues}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. QUÉ INCLUYE ── */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ color: G.text, fontSize: 17, fontFamily: "'Georgia',serif", fontWeight: 800, marginBottom: 16, textAlign: "center" }}>
            Tu plan incluye:
          </h3>
          <div style={{ background: G.white, border: `1px solid ${G.border}`, borderRadius: 18, overflow: "hidden", boxShadow: G.shadow }}>
            {[
              { icon: "📖", title: "Devocionales que te conocen", desc: "Escritos para tu perfil. Hablan de lo que tú vives." },
              { icon: "🙏", title: "Oraciones para cuando no puedes", desc: "Para los días en que no tienes palabras." },
              { icon: "💛", title: "Versículos por emoción", desc: "La Palabra exacta para lo que sientes ahora." },
              { icon: "🎧", title: "Biblia en audio", desc: "Escúchala donde estés, cuando quieras." },
              { icon: "🌸", title: "Comunidad de mujeres", desc: "Un espacio donde tu historia es bienvenida." },
              { icon: "✦", title: `Plan de 21 días: ${a.regalo.split("—")[0].trim()}`, desc: "Acceso inmediato al activar tu plan." },
            ].map((f, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 18px", borderBottom: i < arr.length - 1 ? `1px solid ${G.border}` : "none" }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ color: G.text, fontSize: 13.5, fontWeight: 700 }}>{f.title}</div>
                  <div style={{ color: G.textMuted, fontSize: 12, marginTop: 1 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. PRECIO PRIMERA VEZ ── */}
        <BloquePrecios />

        {/* Garantía */}
        <div style={{ background: G.lavender, borderRadius: 14, padding: "16px 18px", marginBottom: 28, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 32, flexShrink: 0 }}>🛡️</span>
          <div>
            <div style={{ color: G.text, fontSize: 14, fontWeight: 800, marginBottom: 3 }}>Garantía de 7 días sin preguntas</div>
            <div style={{ color: G.textMid, fontSize: 13, lineHeight: 1.55 }}>Si no sientes la diferencia en la primera semana, te devolvemos cada centavo. Sin formularios. Sin preguntas.</div>
          </div>
        </div>

        {/* ── 5. TESTIMONIOS ── */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ color: G.text, fontSize: 17, fontFamily: "'Georgia',serif", fontWeight: 800, marginBottom: 16, textAlign: "center" }}>
            Ellas ya dieron el paso
          </h3>
          {[
            { texto: "Semana 1 todavía dudaba. Semana 3 ya no me despierto con ansiedad. Simplemente abro SELAH y algo en mí se asienta antes de que el día empiece.", nombre: "Valentina M.", lugar: "Bogotá, Colombia", emoji: "🌸", resultado: "3 semanas · Paz matutina" },
            { texto: "Llevaba 4 años alejada de Dios. SELAH fue lo primero que habló de mi historia sin pedirme que primero lo tuviera todo bien.", nombre: "Carolina R.", lugar: "Ciudad de México", emoji: "💜", resultado: "4 años de distancia · Reconexión en semana 1" },
            { texto: "Tengo TDAH y leer la Biblia siempre fue un tormento. El audio de SELAH lo cambió todo. 21 días después soy otra por dentro.", nombre: "Daniela P.", lugar: "Lima, Perú", emoji: "🕊️", resultado: "21 días · Hábito diario establecido" },
          ].map((t, i) => (
            <div key={i} style={{ background: G.white, border: `1px solid ${G.border}`, borderRadius: 16, padding: "18px", marginBottom: 12, boxShadow: G.shadow }}>
              <div style={{ color: G.gold, fontSize: 13, marginBottom: 10, letterSpacing: 2 }}>★★★★★</div>
              <p style={{ color: G.textMid, fontSize: 14, lineHeight: 1.75, fontStyle: "italic", marginBottom: 12 }}>"{t.texto}"</p>
              <div style={{ background: G.terraPale, borderRadius: 6, padding: "4px 10px", display: "inline-block", marginBottom: 12 }}>
                <span style={{ color: G.terraDark, fontSize: 11, fontWeight: 700 }}>✦ {t.resultado}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${G.terraPale},${G.lavender})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{t.emoji}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: G.text }}>{t.nombre}</div>
                  <div style={{ fontSize: 11, color: G.textMuted }}>{t.lugar}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── 6. PRECIO SEGUNDA VEZ ── */}
        <BloquePrecios />

        {/* ── 7. FAQ ── */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ color: G.text, fontSize: 17, fontFamily: "'Georgia',serif", fontWeight: 800, marginBottom: 16, textAlign: "center" }}>
            Preguntas frecuentes
          </h3>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: G.white, border: `1px solid ${G.border}`, borderRadius: 12, marginBottom: 8, overflow: "hidden" }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", padding: "14px 18px", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
                <span style={{ color: G.text, fontSize: 13.5, fontWeight: 600, flex: 1, paddingRight: 12 }}>{f.q}</span>
                <span style={{ color: G.terra, fontSize: 18, flexShrink: 0, transform: faqOpen === i ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
              </button>
              {faqOpen === i && (
                <div style={{ padding: "0 18px 14px", color: G.textMid, fontSize: 13.5, lineHeight: 1.65 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Versículo final */}
        <div style={{ background: G.white, border: `1px solid ${G.border}`, borderRadius: 16, padding: "18px 22px", textAlign: "center", marginBottom: 8 }}>
          <p style={{ color: G.textMid, fontSize: 14, fontStyle: "italic", lineHeight: 1.75, fontFamily: "'Georgia',serif" }}>
            "Venid a mí todos los que estáis trabajados y cargados,<br/>y yo os haré descansar."
          </p>
          <p style={{ color: G.textMuted, fontSize: 11.5, marginTop: 6 }}>— Mateo 11:28</p>
        </div>

      </div>

      {/* Footer */}
      <div style={{ background: G.text, color: "rgba(255,255,255,0.45)", textAlign: "center", padding: "24px 20px", fontSize: 12, lineHeight: 1.9 }}>
        <div style={{ color: "rgba(204,164,115,0.8)", letterSpacing: 4, fontSize: 11, marginBottom: 4, fontWeight: 700 }}>SELAH</div>
        <div>Pausa · Respira · Conecta</div>
        <div style={{ marginTop: 6 }}>© 2026 SELAH · Todos los derechos reservados</div>
      </div>
    </div>
  );
}

// ── EXIT INTENT (popup directo) ───────────────────────────────
function ExitIntent({ nombre, onAceptar, onCerrar }) {
  const [segundos, setSegundos] = useState(15 * 60);
  useEffect(() => {
    const iv = setInterval(() => setSegundos(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(iv);
  }, []);
  const mins = String(Math.floor(segundos / 60)).padStart(2, "0");
  const segs = String(segundos % 60).padStart(2, "0");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(50,37,31,0.82)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: G.white, borderRadius: 24, padding: "32px 24px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 40px 100px rgba(50,37,31,0.4)", position: "relative", animation: "scaleIn 0.35s cubic-bezier(.34,1.56,.64,1)" }}>

        <button onClick={onCerrar} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", color: G.textMuted, fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>

        {/* Badge rojo */}
        <div style={{ background: G.terra, borderRadius: 50, padding: "5px 18px", display: "inline-block", marginBottom: 14 }}>
          <span style={{ color: G.white, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>🎁 Oferta especial · Solo ahora</span>
        </div>

        <h3 style={{ color: G.text, fontSize: "clamp(20px,5vw,24px)", fontFamily: "'Georgia',serif", fontWeight: 800, lineHeight: 1.3, marginBottom: 8 }}>
          ¡No te vayas sin tu<br/>
          <span style={{ color: G.terra }}>acompañamiento!</span>
        </h3>

        <p style={{ color: G.textMid, fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
          Solo para ti y solo ahora,<br/>tu primer mes por:
        </p>

        {/* Precio grande */}
        <div style={{ background: `linear-gradient(160deg,${G.terraPale},${G.lavender})`, borderRadius: 16, padding: "20px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ color: G.textMuted, fontSize: 16, textDecoration: "line-through" }}>$12.99</span>
            <span style={{ color: G.terraDark, fontSize: 44, fontWeight: 800, fontFamily: "'Georgia',serif", lineHeight: 1 }}>$2.99</span>
          </div>
          <div style={{ color: G.textMuted, fontSize: 12 }}>primer mes · luego $9/mes</div>

          {/* Contador */}
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span style={{ color: G.terra, fontSize: 14 }}>⏱</span>
            <span style={{ color: G.textMuted, fontSize: 12 }}>La oferta expira en</span>
            <span style={{ color: G.terraDark, fontWeight: 800, fontSize: 16, fontFamily: "monospace" }}>{mins}:{segs}</span>
          </div>
        </div>

        <div style={{ color: G.textMuted, fontSize: 12, marginBottom: 18, fontStyle: "italic" }}>
          Esta oferta desaparece cuando cierres esta ventana
        </div>

        <button onClick={onAceptar} style={{ width: "100%", padding: "16px", background: `linear-gradient(135deg,${G.terra},${G.terraDark})`, border: "none", borderRadius: 12, color: G.white, fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: `0 6px 24px rgba(207,132,114,0.5)`, marginBottom: 12 }}>
          Sí, quiero mi plan a mitad de precio →
        </button>

        <button onClick={onCerrar} style={{ background: "none", border: "none", color: G.textMuted, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
          No gracias, prefiero pagar el precio completo
        </button>
      </div>
    </div>
  );
}


export default function App() {
  const [pantalla, setPantalla] = useState("intro");
  const [qIndex, setQIndex] = useState(0);
  const [respuestas, setRespuestas] = useState(Array(QUESTIONS.length).fill(null));
  const [arquetipo, setArquetipo] = useState(null);
  const [leadData, setLeadData] = useState(null);
  const [validationPending, setValidationPending] = useState(null);
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [pantalla, qIndex]);

  const handleSelect = (valor) => {
    const n = [...respuestas]; n[qIndex] = valor; setRespuestas(n);
    if (qIndex < QUESTIONS.length - 1) setQIndex(qIndex + 1);
    else { setArquetipo(calcularArquetipo(n)); setPantalla("analisis"); }
  };

  const handleValidation = (valor) => {
    const n = [...respuestas]; n[qIndex] = valor; setRespuestas(n);
    setValidationPending({ valor, screenData: VALIDATION_SCREENS[qIndex + 1] });
    setPantalla("validacion");
  };

  const handleValidationContinue = () => {
    setValidationPending(null); setPantalla("quiz"); setQIndex(qIndex + 1);
  };

  const handleEmail = (data) => {
    setLeadData(data);
    // fbq("track", "Lead", { content_name: data.arquetipo });
    // fetch("TU_WEBHOOK_SYSTEME_IO", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(data) })
    setPantalla("venta");
  };

  const handleCompra = (plan) => {
    // fbq("track", "InitiateCheckout", { value: plan === "anual" ? 49.99 : plan === "mensualOff" ? 2.99 : 9, currency: "USD" });
    // window.open(`https://hotmart.com/selah-${plan}`, "_blank");
    alert("✓ Aquí abres Hotmart — plan: " + plan);
  };

  // Pantalla de venta — full page
  if (pantalla === "venta" && arquetipo && leadData) {
    return (
      <div ref={topRef}>
        <ResultadoVenta arquetipo={arquetipo} nombre={leadData.nombre} onComprar={handleCompra} />
      </div>
    );
  }

  return (
    <div ref={topRef} style={{ minHeight: "100vh", background: G.bgGrad, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "28px 14px 60px", fontFamily: "-apple-system,'Segoe UI',Helvetica,sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 500, background: G.bgCard, borderRadius: 20, padding: "28px 18px", boxShadow: G.shadowLg, border: `1px solid ${G.border}` }}>
        {pantalla === "intro"     && <Intro onStart={() => setPantalla("quiz")} />}
        {pantalla === "validacion" && validationPending && <ValidationScreen data={validationPending.screenData} onContinue={handleValidationContinue} />}
        {pantalla === "quiz"      && <Pregunta q={QUESTIONS[qIndex]} index={qIndex} total={QUESTIONS.length} onSelect={handleSelect} onValidation={VALIDATION_SCREENS[qIndex + 1] ? handleValidation : null} />}
        {pantalla === "analisis"  && arquetipo && <Analisis arquetipo={arquetipo} onDone={() => setPantalla("curva")} />}
        {pantalla === "curva"     && arquetipo && <CurvaEmocional arquetipo={arquetipo} onContinue={() => setPantalla("email")} />}
        {pantalla === "email"     && arquetipo && <CapturaEmail arquetipo={arquetipo} onSubmit={handleEmail} />}
      </div>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { -webkit-text-size-adjust: 100%; }
        input::placeholder { color: ${G.textMuted}; }
        input:focus { border-color: ${G.terra} !important; box-shadow: 0 0 0 3px rgba(207,132,114,0.15) !important; outline: none !important; }
        button { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        @keyframes slideIn { from { opacity:0; transform:translateX(16px) } to { opacity:1; transform:translateX(0) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.06) } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.88) } to { opacity:1; transform:scale(1) } }
      `}</style>
    </div>
  );
}
