import { useState, useEffect, useRef } from "react";


// ── META PIXEL EVENTS ─────────────────────────────────────────
const fbq = (...args) => { if (typeof window !== "undefined" && window.fbq) window.fbq(...args); };

const track = (evento, params = {}) => {
  fbq("trackCustom", evento, params);
  console.log("[SELAH Track]", evento, params);
};

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

  // ── ETAPA 1: SEGMENTACIÓN Y ACTIVACIÓN (1-4) ─────────────────
  // Función: declarar identidad, primer micro-compromiso

  {id:1, category:"Tu momento espiritual",
   pregunta:"Antes de empezar —\n¿cómo describirías tu fe hoy?",
   subtexto:"No hay respuesta correcta. Solo la tuya.",
   opciones:[
    {texto:"Activa pero agotada — creo, pero estoy cansada de pelear sola",valor:"guerrera",emoji:"⚔️"},
    {texto:"Dormida — siento que Dios está lejos y no sé cómo acercarlo",valor:"buscadora",emoji:"🌫️"},
    {texto:"Herida — hay algo entre Él y yo que todavía no he podido soltar",valor:"sanadora",emoji:"💔"},
    {texto:"Hambrienta — tengo fe pero sé que hay mucho más para mí",valor:"visionaria",emoji:"✨"},
  ]},

  {id:2, category:"Tu momento espiritual",
   pregunta:"¿Cuándo fue la última vez que sentiste\nque Dios te hablaba directamente a ti?",
   subtexto:"No a través de un sermón. A ti. A tu historia.",
   opciones:[
    {texto:"Esta semana — tengo momentos pero son escasos",valor:"guerrera",emoji:"🌤️"},
    {texto:"Hace meses — ha sido un tiempo de silencio",valor:"buscadora",emoji:"🌑"},
    {texto:"En un momento de quiebre — cuando más lo necesitaba",valor:"sanadora",emoji:"🌊"},
    {texto:"Lo siento seguido pero quiero ir más profundo",valor:"visionaria",emoji:"🔍"},
  ]},

  {id:3, category:"Tu momento espiritual",
   pregunta:"¿Has intentado crear una rutina espiritual\ny la has abandonado?",
   subtexto:"Sé honesta. Esto no te define — nos ayuda a entenderte.",
   opciones:[
    {texto:"Varias veces — empiezo bien y a los días desaparece",valor:"buscadora",emoji:"📅"},
    {texto:"Sí, una vez — y me quedé con culpa",valor:"sanadora",emoji:"😔"},
    {texto:"Lo intento pero la vida siempre gana",valor:"guerrera",emoji:"⏳"},
    {texto:"Tengo rutina pero quiero que sea más significativa",valor:"visionaria",emoji:"🌱"},
  ]},

  {id:4, category:"Tu momento espiritual",
   pregunta:"¿Sabías que las mujeres con un momento espiritual diario reportan 47% menos ansiedad crónica que las que no lo tienen?",
   subtexto:"Investigación de la Universidad de Harvard, 2023.",
   opciones:[
    {texto:"No lo sabía — y me hace querer empezar hoy",valor:"buscadora",emoji:"💡"},
    {texto:"Lo intuía — por eso estoy aquí",valor:"guerrera",emoji:"🙏"},
    {texto:"Lo sé pero no he podido mantenerlo",valor:"sanadora",emoji:"💭"},
    {texto:"Ya lo practico — quiero profundizar más",valor:"visionaria",emoji:"📖"},
  ]},

  // ── ETAPA 2: DIAGNÓSTICO DEL DOLOR (5-9) ─────────────────────
  // Función: activar la herida central, crear urgencia emocional

  {id:5, category:"Lo que cargas",
   pregunta:"¿Con qué frecuencia sientes que tu fe\ndepende de cómo te sientes ese día?",
   subtexto:"Si el ánimo está bien, oras. Si no, desapareces.",
   opciones:[
    {texto:"Siempre — mi fe es muy inconsistente",valor:"buscadora",emoji:"🎭"},
    {texto:"Seguido — los días difíciles me alejan de Dios",valor:"sanadora",emoji:"🌧️"},
    {texto:"A veces — pero me pesa cuando pasa",valor:"guerrera",emoji:"😮‍💨"},
    {texto:"Casi nunca — mi fe es mi ancla aunque no me sienta bien",valor:"visionaria",emoji:"⚓"},
  ]},

  {id:6, category:"Lo que cargas",
   pregunta:"¿Cargas algo que no le has contado\na nadie?",
   subtexto:"Ni a tu familia. Ni a tu mejor amiga. Ni a tu pastor.\nSolo tú lo sabes.",
   opciones:[
    {texto:"Sí — hay algo que llevo sola hace mucho tiempo",valor:"sanadora",emoji:"🤐"},
    {texto:"Sí — y me pesa más de lo que muestro",valor:"guerrera",emoji:"🏋️"},
    {texto:"Sí — y a veces siento que Dios tampoco lo entiende",valor:"buscadora",emoji:"❓"},
    {texto:"Lo cargo pero lo estoy aprendiendo a soltar",valor:"visionaria",emoji:"🕊️"},
  ]},

  {id:7, category:"Lo que cargas",
   pregunta:"Cuando oras, ¿cómo te sientes\nla mayoría de las veces?",
   subtexto:"Honestidad total aquí.",
   opciones:[
    {texto:"Como si las palabras llegaran al techo y volvieran",valor:"buscadora",emoji:"🌫️"},
    {texto:"Con alivio — pero la carga vuelve al rato",valor:"sanadora",emoji:"🔄"},
    {texto:"Con fuerza — pero necesito más consistencia",valor:"guerrera",emoji:"💪"},
    {texto:"Con conexión — pero quiero conversaciones más profundas",valor:"visionaria",emoji:"🌊"},
  ]},

  {id:8, category:"Lo que cargas",
   pregunta:"¿Cuáles de estos describes como\ntus desafíos espirituales?",
   subtexto:"Selecciona el que más te represente hoy.",
   opciones:[
    {texto:"La culpa — siento que no soy suficientemente buena cristiana",valor:"sanadora",emoji:"😞"},
    {texto:"La distancia — Dios se siente lejano e inalcanzable",valor:"buscadora",emoji:"🏝️"},
    {texto:"El agotamiento — mi fe es real pero estoy cansada",valor:"guerrera",emoji:"😮‍💨"},
    {texto:"La superficialidad — quiero más que solo rituales",valor:"visionaria",emoji:"🔮"},
  ]},

  {id:9, category:"Lo que cargas",
   pregunta:"¿Sabías que el perfil espiritual de una mujer cambia completamente cada 3 a 5 años según sus experiencias de vida — duelos, relaciones, logros y fe?",
   subtexto:"Lo que funcionaba antes puede no funcionar hoy.",
   opciones:[
    {texto:"Esto explica por qué lo que antes me funcionaba ya no funciona",valor:"buscadora",emoji:"💡"},
    {texto:"Lo intuía — siento que soy una persona diferente espiritualmente",valor:"sanadora",emoji:"🦋"},
    {texto:"Sí — y quiero entender quién soy en este nuevo momento",valor:"guerrera",emoji:"🗺️"},
    {texto:"Lo sé — por eso busco algo que crezca conmigo",valor:"visionaria",emoji:"🌳"},
  ]},

  // ── ETAPA 3: VISIÓN E IDENTIDAD (10-15) ──────────────────────
  // Función: construir el sueño, instalar la identidad deseada

  {id:10, category:"Lo que tu alma necesita",
   pregunta:"Si tu relación con Dios fuera exactamente\ncomo la deseas —\n¿cómo te sentirías cada mañana?",
   subtexto:"Cierra los ojos un segundo antes de responder.",
   opciones:[
    {texto:"En paz — empezando el día desde la calma, no desde el caos",valor:"sanadora",emoji:"🌅"},
    {texto:"Fuerte — sabiendo que no estoy sola en mis batallas",valor:"guerrera",emoji:"⚔️"},
    {texto:"Conectada — sintiendo que Dios me conoce y me habla",valor:"buscadora",emoji:"🤍"},
    {texto:"Clara — sabiendo hacia dónde voy y por qué",valor:"visionaria",emoji:"🎯"},
  ]},

  {id:11, category:"Lo que tu alma necesita",
   pregunta:"¿Qué tan acompañada te sientes\nen tu fe hoy?",
   subtexto:"La fe fue diseñada para no caminarse sola.",
   opciones:[
    {texto:"Completamente sola — no tengo a nadie con quien hablar de esto",valor:"buscadora",emoji:"🏝️"},
    {texto:"Tengo personas pero nadie que entienda lo que realmente cargo",valor:"sanadora",emoji:"🤐"},
    {texto:"Tengo comunidad pero a veces siento que no encajo",valor:"guerrera",emoji:"🧩"},
    {texto:"Busco conexiones más profundas — no conversaciones superficiales",valor:"visionaria",emoji:"🌐"},
  ]},

  {id:12, category:"Lo que tu alma necesita",
   pregunta:"¿Qué es lo que más necesita\ntu alma en este momento?",
   subtexto:"No lo que debería necesitar. Lo que realmente necesita.",
   opciones:[
    {texto:"Sanidad — soltar algo que cargo hace demasiado tiempo",valor:"sanadora",emoji:"🩹"},
    {texto:"Reconexión — volver a sentir que Dios está presente en mi vida",valor:"buscadora",emoji:"🔌"},
    {texto:"Fortaleza — sostenerme en la fe cuando todo se cae",valor:"guerrera",emoji:"🛡️"},
    {texto:"Propósito — entender para qué estoy aquí y qué hacer con eso",valor:"visionaria",emoji:"🗺️"},
  ]},

  {id:13, category:"Lo que tu alma necesita",
   pregunta:"Cuando piensas en leer la Biblia,\n¿qué sientes honestamente?",
   subtexto:'No hay respuesta correcta. Solo la tuya.',
   opciones:[
    {texto:"Que no sé por dónde empezar y me abruma",valor:"buscadora",emoji:"📖"},
    {texto:"Que quiero hacerlo pero la vida siempre gana",valor:"guerrera",emoji:"⏳"},
    {texto:"Que la leo pero no siento que me habla a mí específicamente",valor:"sanadora",emoji:"💬"},
    {texto:"Que es mi pan diario pero quiero ir más profundo",valor:"visionaria",emoji:"🔍"},
  ]},

  {id:14, category:"Lo que tu alma necesita",
   pregunta:"¿Cómo te hablas a ti misma\ncuando nadie te escucha?",
   subtexto:"La voz interior dice más sobre nosotras que cualquier otra cosa.",
   opciones:[
    {texto:"Con dureza — soy mi crítica más cruel",valor:"sanadora",emoji:"💔"},
    {texto:"Con duda — ¿seré suficiente para esto?",valor:"buscadora",emoji:"❓"},
    {texto:"Con presión — tienes que poder, no puedes flaquear",valor:"guerrera",emoji:"⚡"},
    {texto:"Con expectativa — hay algo grande en mí que todavía no ha salido",valor:"visionaria",emoji:"🌟"},
  ]},

  {id:15, category:"Lo que tu alma necesita",
   pregunta:"¿Qué mujer quieres ser\ndentro de 21 días?",
   subtexto:"Sé específica. Esto es para ti.",
   opciones:[
    {texto:"Una mujer en paz — que no carga lo que no le pertenece",valor:"sanadora",emoji:"🌸"},
    {texto:"Una mujer reconectada — que encontró a Dios y no lo suelta",valor:"buscadora",emoji:"⚓"},
    {texto:"Una mujer de fe firme — que inspira a las que la rodean",valor:"guerrera",emoji:"👑"},
    {texto:"Una mujer en su propósito — viviendo con claridad y sin miedo",valor:"visionaria",emoji:"🦋"},
  ]},

  // ── ETAPA 4: COMPROMISO Y CIERRE (16-20) ─────────────────────
  // Función: eliminar objeciones, crear urgencia, comprometer

  {id:16, category:"Casi lo tienes",
   pregunta:"¿Qué estrategias espirituales\nte gustaría tener?",
   subtexto:"Selecciona la que más resuena contigo.",
   opciones:[
    {texto:"Cómo crear un hábito espiritual que dure — sin culpa si fallo",valor:"buscadora",emoji:"🌱"},
    {texto:"Cómo orar cuando no tengo palabras ni fuerzas",valor:"sanadora",emoji:"🙏"},
    {texto:"Cómo mantener mi fe firme cuando todo se cae",valor:"guerrera",emoji:"⚔️"},
    {texto:"Cómo entender el propósito que Dios tiene para esta etapa de mi vida",valor:"visionaria",emoji:"🎯"},
  ]},

  {id:17, category:"Casi lo tienes",
   pregunta:"¿Tienes algún momento importante\npróximamente?",
   subtexto:"A veces hay fechas que nos dan el empuje que necesitamos.",
   opciones:[
    {texto:"Sí — cumpleaños, aniversario o fecha especial",valor:"visionaria",emoji:"🎂"},
    {texto:"Sí — un proceso difícil que necesito atravesar con fe",valor:"sanadora",emoji:"🌊"},
    {texto:"Sí — una decisión importante que necesito tomar",valor:"guerrera",emoji:"🗺️"},
    {texto:"No en particular — pero siento que este es el momento",valor:"buscadora",emoji:"⏰"},
  ]},

  {id:18, category:"Casi lo tienes",
   pregunta:"¿Sueles terminar lo que empiezas\ncuando algo realmente importa?",
   subtexto:"Sé honesta — esto determina cómo personalizamos tu plan.",
   opciones:[
    {texto:"Sí — cuando algo me importa de verdad, lo termino",valor:"guerrera",emoji:"✅"},
    {texto:"Depende — si hay apoyo y estructura, sí",valor:"buscadora",emoji:"🤝"},
    {texto:"A veces me cuesta — especialmente cuando el dolor es grande",valor:"sanadora",emoji:"💭"},
    {texto:"Siempre — la disciplina es algo que trabajo activamente",valor:"visionaria",emoji:"🔥"},
  ]},

  {id:19, category:"Casi lo tienes",
   pregunta:"¿Cuánto tiempo estás dispuesta\na dedicar a tu vida espiritual cada día?",
   subtexto:"Recuerda: el hábito más poderoso es el que puedes sostener.",
   opciones:[
    {texto:"5 minutos — necesito algo simple y real",valor:"buscadora",emoji:"⏱️"},
    {texto:"10 minutos — puedo hacer espacio si vale la pena",valor:"sanadora",emoji:"🕐"},
    {texto:"15 minutos — quiero que sea parte real de mi mañana",valor:"guerrera",emoji:"🌅"},
    {texto:"20+ minutos — esto es prioridad para mí",valor:"visionaria",emoji:"📖"},
  ]},

  {id:20, category:"Casi lo tienes",
   pregunta:"Una última cosa —\n¿qué te trajo hasta aquí hoy?",
   subtexto:"Nada es casualidad. Especialmente esto.",
   opciones:[
    {texto:"La curiosidad — algo llamó mi atención",valor:"buscadora",emoji:"🔮"},
    {texto:"El cansancio — ya no puedo seguir igual",valor:"sanadora",emoji:"🏳️"},
    {texto:"La necesidad — sé que necesito más de Dios en mi vida",valor:"guerrera",emoji:"💡"},
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
  9:{emoji:"🌊",titulo:"Eso que llevas cargando...",texto:"No eres la primera mujer que llega aquí con eso. Lo que has vivido — todo — es exactamente lo que SELAH fue diseñada para acompañar. No tienes que seguir cargándolo sola.",color:"lavender"},
  14:{emoji:"✨",titulo:"La mujer que describiste...",texto:"Esa que habla con dureza de sí misma, que duda, que siente presión — ella es quien más merece un espacio de paz. Y ya está dando el primer paso. Quedan solo 6 preguntas.",color:"rose"},


};

const ANALISIS_LABELS = {conexion:"Conexión espiritual",sanidad:"Necesidad de sanidad",proposito:"Claridad de propósito",comunidad:"Hambre de comunidad",paz:"Búsqueda de paz interior"};

function calcularArquetipo(resp) {
  const c={guerrera:0,sanadora:0,buscadora:0,visionaria:0};
  resp.forEach(v=>{if(v&&c[v]!==undefined)c[v]++;});
  return Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0];
}

// Mapa de secciones del quiz
const SECCIONES = {
  1:  { nombre:"Tu momento espiritual", emoji:"🌿", rango:"1 — 4" },
  5:  { nombre:"Lo que cargas", emoji:"🌊", rango:"5 — 9" },
  10: { nombre:"Lo que tu alma necesita", emoji:"✦", rango:"10 — 15" },
  16: { nombre:"Casi lo tienes", emoji:"🌸", rango:"16 — 20" },
};

function ProgressBar({current,total}) {
  const pct=Math.round((current/total)*100);
  // Detectar si es inicio de nueva sección
  const seccion = SECCIONES[current];
  return (
    <div style={{marginBottom:20}}>
      {/* Badge de sección cuando cambia */}
      {seccion&&(
        <div style={{background:`linear-gradient(135deg,${G.terraPale},${G.lavender})`,border:`1px solid ${G.borderS}`,borderRadius:10,padding:"8px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:8,animation:"fadeUp 0.4s ease"}}>
          <span style={{fontSize:16}}>{seccion.emoji}</span>
          <div>
            <div style={{color:G.terra,fontSize:9,letterSpacing:2,textTransform:"uppercase",fontWeight:700}}>Preguntas {seccion.rango}</div>
            <div style={{color:G.text,fontSize:13,fontWeight:700}}>{seccion.nombre}</div>
          </div>
        </div>
      )}
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

  // Tipo de UI por pregunta
  const UI_TYPES={1:"cards",2:"timeline",3:"cards",4:"cards",5:"big",6:"cards",7:"cards",8:"big",9:"cards",10:"big",11:"cards",12:"big",13:"cards",14:"cards",15:"big",16:"cards",17:"big",18:"cards",19:"timeline",20:"cards"};
  const uiType=UI_TYPES[index+1]||"cards";

  const handleSelect=(valor)=>{
    if(animating)return;
    setSelected(valor);setAnimating(true);
    setTimeout(()=>{
      if(VALIDATION_SCREENS[index+1]&&onValidation){onValidation(valor);}
      else{onSelect(valor);}
      setSelected(null);setAnimating(false);
    },500);
  };

  const lines=q.pregunta.split("\n");

  const renderOpciones=()=>{
    if(uiType==="big") return (
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {q.opciones.map((op,i)=>{
          const isSel=selected===op.valor;
          return (
            <button key={i} onClick={()=>handleSelect(op.valor)}
              style={{padding:"20px 14px",background:isSel?`linear-gradient(135deg,${G.terra},${G.terraDark})`:G.white,border:`2px solid ${isSel?G.terra:G.border}`,borderRadius:18,color:isSel?G.white:G.textMid,cursor:"pointer",transition:"all 0.2s",display:"flex",flexDirection:"column",alignItems:"center",gap:8,transform:isSel?"scale(0.97)":"scale(1)",opacity:animating&&!isSel?0.4:1,WebkitTapHighlightColor:"transparent",touchAction:"manipulation",boxShadow:isSel?`0 6px 20px rgba(207,132,114,0.4)`:G.shadow}}>
              <span style={{fontSize:28}}>{op.emoji}</span>
              <span style={{fontSize:12.5,fontWeight:isSel?700:400,lineHeight:1.4,textAlign:"center"}}>{op.texto}</span>
            </button>
          );
        })}
      </div>
    );

    if(uiType==="timeline") return (
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {q.opciones.map((op,i)=>{
          const isSel=selected===op.valor;
          return (
            <button key={i} onClick={()=>handleSelect(op.valor)}
              style={{padding:"14px 18px",background:isSel?G.terraPale:G.white,border:`1.5px solid ${isSel?G.terra:G.border}`,borderRadius:14,cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",gap:14,opacity:animating&&!isSel?0.4:1,WebkitTapHighlightColor:"transparent",touchAction:"manipulation"}}>
              {/* Número de línea de tiempo */}
              <div style={{width:36,height:36,borderRadius:"50%",background:isSel?G.terra:G.lavender,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"background 0.2s"}}>
                <span style={{fontSize:16}}>{op.emoji}</span>
              </div>
              <span style={{color:isSel?G.terraDark:G.textMid,fontSize:14,fontWeight:isSel?700:400,lineHeight:1.45,textAlign:"left",flex:1}}>{op.texto}</span>
              {isSel&&<span style={{color:G.terra,fontSize:18,flexShrink:0}}>✓</span>}
            </button>
          );
        })}
      </div>
    );

    // Default: cards
    return (
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {q.opciones.map((op,i)=>{
          const isSel=selected===op.valor;
          return (
            <button key={i} onClick={()=>handleSelect(op.valor)}
              style={{padding:"16px 18px",background:isSel?G.terraPale:G.white,border:`1.5px solid ${isSel?G.terra:G.border}`,borderRadius:16,color:isSel?G.terraDark:G.textMid,fontSize:15,lineHeight:1.5,textAlign:"left",cursor:"pointer",transition:"all 0.2s ease",display:"flex",alignItems:"center",gap:12,transform:isSel?"scale(0.98)":"scale(1)",opacity:animating&&!isSel?0.4:1,WebkitTapHighlightColor:"transparent",touchAction:"manipulation"}}>
              <span style={{fontSize:22,flexShrink:0}}>{op.emoji}</span>
              <span style={{fontWeight:isSel?600:400,flex:1}}>{op.texto}</span>
              {isSel&&<span style={{color:G.terra,flexShrink:0}}>✓</span>}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{animation:"slideIn 0.35s ease"}}>
      <ProgressBar current={index+1} total={total}/>
      <div style={{background:G.lavender,borderRadius:6,padding:"3px 12px",display:"inline-block",marginBottom:14}}>
        <span style={{color:G.terraDark,fontSize:10,letterSpacing:2.5,textTransform:"uppercase",fontWeight:600}}>{q.category}</span>
      </div>
      <h2 style={{fontSize:"clamp(17px,4.5vw,22px)",color:G.text,fontFamily:"'Georgia',serif",fontWeight:700,lineHeight:1.4,marginBottom:4}}>
        {lines[0]}{lines[1]&&<><br/><span style={{color:G.terraDark}}>{lines[1]}</span></>}
      </h2>
      {q.subtexto&&<p style={{color:G.textMid,fontSize:13,fontStyle:"italic",marginBottom:18,lineHeight:1.5}}>{q.subtexto}</p>}
      {renderOpciones()}
      <p style={{color:G.textMuted,fontSize:11,textAlign:"center",marginTop:14,fontStyle:"italic"}}>
        {uiType==="big"?"Toca la que más te representa":"Toca una opción para continuar"}
      </p>
    </div>
  );
}

function Analisis({arquetipo,onDone}) {
  const a=ARQUETIPOS[arquetipo];
  const BARRA_KEYS=["conexion","sanidad","proposito","comunidad","paz"];
  const [barras,setBarras]=useState({conexion:0,sanidad:0,proposito:0,comunidad:0,paz:0});
  const [barraActiva,setBarraActiva]=useState(-1); // qué barra está animando
  const [msgIdx,setMsgIdx]=useState(0);
  const [listo,setListo]=useState(false);
  const [testiIdx,setTestiIdx]=useState(0);
  const [popupBarra,setPopupBarra]=useState(null); // null | índice de barra
  const [popupsRespondidos,setPopupsRespondidos]=useState([]);

  const barraPopups=[
    {pregunta:"¿Sientes que tu conexión con Dios podría ser más profunda?",si:"Sí, quiero más",no:"Estoy bien así"},
    {pregunta:"¿Hay algo que necesitas sanar y que llevas cargando sola?",si:"Sí, hay algo",no:"No realmente"},
    {pregunta:"¿Tienes claridad de cuál es tu propósito en esta etapa de vida?",si:"Sí, lo tengo",no:"Eso es lo que busco"},
    {pregunta:"¿Tienes mujeres con quienes hablar profundo de tu fe?",si:"Sí, las tengo",no:"Me siento sola en eso"},
    {pregunta:"¿Buscas una paz espiritual que no dependa de las circunstancias?",si:"Sí, la necesito",no:"Nunca lo había pensado"},
  ];

  const interstitials=[
    {pregunta:"¿Has sentido que tu fe se aleja en los momentos más difíciles?",si:"Sí, lo he sentido",no:"No tanto"},
    {pregunta:"¿Crees que mereces sentirte acompañada espiritualmente cada día?",si:"Sí, lo merezco",no:"No estoy segura"},
    {pregunta:"¿Estás lista para dar este paso hoy?",si:"Sí, estoy lista",no:"Necesito pensarlo"},
  ];

  const testimonios=[
    {texto:"Semana 3 y ya no me despierto con ansiedad. Algo en mí se asienta antes de que el día empiece.",nombre:"Valentina M.",lugar:"Bogotá"},
    {texto:"Llevaba 4 años alejada de Dios. SELAH fue lo primero que habló de mi historia sin pedirme perfección.",nombre:"Carolina R.",lugar:"Ciudad de México"},
    {texto:"El audio de SELAH lo cambió todo. Lo escucho haciendo el desayuno. 21 días después soy otra por dentro.",nombre:"Daniela P.",lugar:"Lima"},
    {texto:"Por primera vez siento que un devocional fue escrito para mí. Para lo que yo vivo, no para alguien ideal.",nombre:"Marcela V.",lugar:"Buenos Aires"},
    {texto:"No sabía que podía tener una rutina espiritual real con solo 5 minutos al día. SELAH me lo demostró.",nombre:"Andrea S.",lugar:"Medellín"},
  ];

  const msgs=["Analizando tus respuestas...","Identificando tu perfil espiritual...","Construyendo tu perfil único...","Preparando algo especial para ti...","¡Tu perfil está listo! ✦"];
  const DELAY_POR_BARRA = 2200; // ms por barra — más lento y premium
  const TOTAL_TIEMPO = BARRA_KEYS.length * DELAY_POR_BARRA + 1000;

  useEffect(()=>{
    // Mensajes distribuidos
    const msgTiempos = [0, 2000, 5000, 8000, TOTAL_TIEMPO - 500];
    msgTiempos.forEach((d,i)=>setTimeout(()=>setMsgIdx(i),d));

    // Animar barras secuencialmente — esperar respuesta de popup
    let barraIdx = 0;
    const animarSiguienteBarra = () => {
      if(barraIdx >= BARRA_KEYS.length) {
        setBarraActiva(-1);
        setListo(true);
        return;
      }
      const key = BARRA_KEYS[barraIdx];
      const i = barraIdx;
      setBarraActiva(i);
      let cur = 0;
      const target = a.analisis[key];
      const iv = setInterval(()=>{
        cur = Math.min(cur + target/40, target);
        setBarras(p=>({...p,[key]:Math.round(cur)}));
        if(cur >= target){
          clearInterval(iv);
          // Mostrar popup y esperar respuesta
          setTimeout(()=>{
            setPopupBarra(i);
            barraIdx++;
          }, 300);
        }
      }, 40);
    };
    // Referencia para llamar desde fuera del efecto
    window._selahAnimarBarra = animarSiguienteBarra;
    animarSiguienteBarra();

    // Rotar testimonios cada 2.5s
    const iv=setInterval(()=>setTestiIdx(idx=>(idx+1)%testimonios.length),2500);
    return()=>clearInterval(iv);
  },[]);

  const t=testimonios[testiIdx];

  const responderPopupBarra=(respuesta)=>{
    if(typeof window!=="undefined"&&window.fbq){
      window.fbq("trackCustom","PopupBarraRespuesta",{barra:popupBarra,respuesta});
    }
    setPopupsRespondidos(p=>[...p,{barra:popupBarra,respuesta}]);
    setPopupBarra(null);
    // Continuar con la siguiente barra después de responder
    setTimeout(()=>{
      if(window._selahAnimarBarra) window._selahAnimarBarra();
    }, 400);
  };

  return (
    <div style={{textAlign:"center",position:"relative"}}>

      {/* Popup por barra */}
      {popupBarra!==null&&!listo&&(
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(50,37,31,0.75)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",animation:"fadeUp 0.3s ease"}}>
          <div style={{background:G.white,borderRadius:20,padding:"28px 22px",maxWidth:360,width:"100%",textAlign:"center",boxShadow:G.shadowLg,animation:"scaleIn 0.3s ease"}}>
            {/* Barra completada */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:16}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:G.terraPale,border:`1.5px solid ${G.borderS}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✦</div>
              <span style={{color:G.terra,fontSize:11,fontWeight:700,letterSpacing:1}}>{Object.values(ANALISIS_LABELS)[popupBarra]?.toUpperCase()}</span>
            </div>
            <p style={{color:G.text,fontSize:16,fontFamily:"'Georgia',serif",fontWeight:700,lineHeight:1.5,marginBottom:24}}>
              {barraPopups[popupBarra]?.pregunta}
            </p>
            {/* Progreso de barras */}
            <div style={{display:"flex",justifyContent:"center",gap:5,marginBottom:20}}>
              {BARRA_KEYS.map((_,i)=>(
                <div key={i} style={{width:28,height:4,borderRadius:99,background:i<=popupBarra?G.terra:G.border,transition:"background 0.3s"}}/>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button onClick={()=>responderPopupBarra("si")}
                style={{padding:"14px",background:`linear-gradient(135deg,${G.terra},${G.terraDark})`,border:"none",borderRadius:12,color:G.white,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 16px rgba(207,132,114,0.4)`}}>
                {barraPopups[popupBarra]?.si}
              </button>
              <button onClick={()=>responderPopupBarra("no")}
                style={{padding:"14px",background:G.terraPale,border:`1.5px solid ${G.borderS}`,borderRadius:12,color:G.terraDark,fontSize:15,fontWeight:600,cursor:"pointer"}}>
                {barraPopups[popupBarra]?.no}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{width:68,height:68,borderRadius:"50%",background:`linear-gradient(135deg,${G.terraPale},${G.lavender})`,border:`2px solid ${G.borderS}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",animation:listo?"none":"pulse 1.6s ease-in-out infinite"}}>
        <span style={{fontSize:28}}>{listo?a.emoji:"✦"}</span>
      </div>
      <p style={{color:G.textMid,fontSize:15,fontStyle:"italic",marginBottom:20,minHeight:24}}>{msgs[msgIdx]}</p>

      {/* Testimonio rotando */}
      {!listo&&(
        <div style={{background:`linear-gradient(135deg,${G.terraPale},${G.lavender})`,border:`1px solid ${G.borderS}`,borderRadius:14,padding:"14px 16px",marginBottom:20,animation:"fadeUp 0.4s ease",textAlign:"left"}}>
          <div style={{color:G.gold,fontSize:11,letterSpacing:2,marginBottom:6}}>★★★★★</div>
          <p style={{color:G.text,fontSize:13,lineHeight:1.65,fontStyle:"italic",marginBottom:8}}>"{t.texto}"</p>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:G.terra,display:"flex",alignItems:"center",justifyContent:"center",color:G.white,fontSize:12,fontWeight:800,flexShrink:0}}>{t.nombre[0]}</div>
            <div>
              <div style={{color:G.text,fontSize:12,fontWeight:700}}>{t.nombre}</div>
              <div style={{color:G.textMuted,fontSize:11}}>{t.lugar}</div>
            </div>
          </div>
          {/* Dots indicadores */}
          <div style={{display:"flex",justifyContent:"center",gap:4,marginTop:10}}>
            {testimonios.map((_,i)=>(
              <div key={i} style={{width:5,height:5,borderRadius:"50%",background:i===testiIdx?G.terra:G.border,transition:"background 0.3s"}}/>
            ))}
          </div>
        </div>
      )}

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
            {/* Grid line cero */}
            <line x1="10" y1={toY(0)} x2={W-10} y2={toY(0)} stroke={G.border} strokeWidth="1" strokeDasharray="4,4"/>
            <text x="4" y={toY(0)+4} fill={G.textMuted} fontSize="7">0</text>

            {/* Área bajo la curva — aparece con animación CSS */}
            {fase>=1&&(
              <path
                d={`${smoothPath()} L ${toX(3)} ${toY(0)} L ${toX(0)} ${toY(0)} Z`}
                fill={`${c.color}18`}
                style={{
                  animation:"fadeUp 1.5s ease forwards",
                  opacity:0,
                  animationFillMode:"forwards"
                }}
              />
            )}

            {/* Línea principal con stroke-dasharray para animación de dibujo */}
            {fase>=1&&(
              <path
                d={smoothPath()}
                fill="none"
                stroke={c.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 600,
                  strokeDashoffset: fase>=1 ? 0 : 600,
                  transition: "stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            )}

            {/* Puntos — aparecen uno a uno */}
            {puntos.map((p,i)=>(
              <g key={i} style={{opacity: fase>=1 ? 1:0, transition:`opacity 0.4s ease ${0.4+i*0.4}s`}}>
                {/* Pulso en el punto activo */}
                {puntoActivo===i&&(
                  <circle cx={toX(i)} cy={toY(p.valor)} r={14} fill={`${c.color}25`}
                    style={{animation:"pulse 1.5s ease-in-out infinite"}}/>
                )}
                {/* Touch target */}
                <circle cx={toX(i)} cy={toY(p.valor)} r={22} fill="transparent"
                  style={{cursor:"pointer"}} onClick={()=>setPuntoActivo(puntoActivo===i?null:i)}/>
                {/* Punto */}
                <circle cx={toX(i)} cy={toY(p.valor)} r={puntoActivo===i?9:6}
                  fill={i===0?G.textMuted:c.color} stroke={G.white} strokeWidth="2.5"
                  style={{cursor:"pointer",transition:"r 0.25s cubic-bezier(.34,1.56,.64,1)"}}/>
                {/* Label día */}
                <text x={toX(i)} y={H+16} textAnchor="middle"
                  fill={puntoActivo===i?c.color:G.textMuted}
                  fontSize="8" fontWeight={puntoActivo===i?"700":"400"}>
                  {p.label}
                </text>
                {/* Emoji — aparece después */}
                {fase>=2&&(
                  <text x={toX(i)} y={toY(p.valor)-13} textAnchor="middle" fontSize="14"
                    style={{animation:`fadeUp 0.5s ease ${i*0.2}s both`}}>
                    {p.emoji}
                  </text>
                )}
              </g>
            ))}
          </svg>

          {/* Info semanas — siempre visible debajo */}
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
              {puntos.map((p, i) => (
                <div key={i} onClick={() => setPuntoActivo(puntoActivo === i ? null : i)}
                  style={{ background: puntoActivo === i ? G.text : G.terraPale, borderRadius: 10, padding: "8px 6px", textAlign: "center", cursor: "pointer", transition: "all 0.2s", border: puntoActivo === i ? `1.5px solid ${G.terra}` : `1px solid ${G.border}` }}>
                  <div style={{ fontSize: 16, marginBottom: 3 }}>{p.emoji}</div>
                  <div style={{ color: puntoActivo === i ? G.white : G.terraDark, fontSize: 10, fontWeight: 700 }}>{p.label}</div>
                  <div style={{ color: puntoActivo === i ? "rgba(255,255,255,0.8)" : G.textMuted, fontSize: 9, lineHeight: 1.4, marginTop: 2 }}>{p.desc}</div>
                </div>
              ))}
            </div>
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
    {
      q: "He empezado devocionales antes y siempre los abandono. ¿Por qué SELAH sería diferente?",
      a: "Porque los anteriores no hablaban de ti. Un devocional genérico no sabe si eres La Mujer Guerrera o La Mujer Buscadora. SELAH sí. Cuando algo habla de tu historia real, no lo abandonas."
    },
    {
      q: "No tengo tiempo. Mi día ya está completamente lleno.",
      a: "SELAH está diseñada para 5 minutos. Puedes escuchar el audio mientras haces el desayuno o el trayecto al trabajo. No pedimos que cambies tu día — pedimos 5 minutos de él."
    },
    {
      q: "¿Funcionará para mi situación específica?",
      a: "Tu perfil espiritual — el que acabas de descubrir — es exactamente el punto de partida. SELAH no da respuestas genéricas. Cada mujer recibe contenido basado en su arquetipo: sus heridas, sus fortalezas y su momento de vida específico."
    },
    {
      q: "¿Necesito saber mucho de la Biblia para empezar?",
      a: "No. SELAH funciona igual si llevas 30 años en la fe o si hace tiempo que no abres una Biblia. El punto de partida es donde estás hoy, no donde crees que deberías estar."
    },
    {
      q: "¿Qué pasa si no siento que es para mí?",
      a: "Tienes 7 días de garantía total. Si en la primera semana no sientes que SELAH habla de tu historia, te devolvemos cada centavo. Sin formularios. Sin preguntas. Sin vueltas."
    },
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

      {/* Badge oferta */}
      <div style={{ background: G.terra, borderRadius: 50, padding: "5px 16px", display: "inline-block", marginBottom: 16 }}>
        <span style={{ color: G.white, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>🔥 Oferta válida solo hoy</span>
      </div>

      {/* Precio único — impactante */}
      <div style={{ background: G.white, border: `2px solid ${G.terra}`, borderRadius: 20, padding: "22px 18px", marginBottom: 14, boxShadow: `0 8px 32px rgba(207,132,114,0.25)` }}>

        {/* Precio con contexto */}
        <div style={{ textAlign: "center", marginBottom: 16, padding: "16px", background: `linear-gradient(160deg,${G.terraPale},${G.lavender})`, borderRadius: 14 }}>
          <div style={{ color: G.textMuted, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6, fontWeight: 600 }}>Acceso completo · Un solo pago · Acceso de por vida</div>
          <div style={{ textAlign:"center", marginBottom:8 }}>
            <span style={{ background:G.terra, color:G.white, fontSize:11, fontWeight:800, padding:"3px 12px", borderRadius:50, letterSpacing:1 }}>= $0.05 por día durante un año</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 4 }}>
            <span style={{ color: G.textMuted, fontSize: 18, textDecoration: "line-through" }}>$37</span>
            <span style={{ color: G.terraDark, fontSize: 52, fontWeight: 800, fontFamily: "'Georgia',serif", lineHeight: 1 }}>$19</span>
          </div>
          <div style={{ color: G.terra, fontSize: 13, fontWeight: 700 }}>Acceso de por vida · Sin pagos futuros</div>
          <div style={{ marginTop: 10, background: G.white, borderRadius: 8, padding: "6px 12px", display: "inline-block" }}>
            <span style={{ color: G.textMuted, fontSize: 11 }}>Equivale a solo </span>
            <span style={{ color: G.terraDark, fontSize: 13, fontWeight: 800 }}>$0.05 al día</span>
            <span style={{ color: G.textMuted, fontSize: 11 }}> — menos que un café</span>
          </div>
        </div>

        {/* Incluye */}
        <div style={{ marginBottom: 16 }}>
          {[
            { icon: "🙏", text: "Acompañamiento espiritual personalizado para tu perfil" },
            { icon: "📖", text: "Plan devocional de 21 días diseñado para ti" },
            { icon: "💛", text: "Versículos por emoción — siempre la Palabra exacta" },
            { icon: "🎧", text: "Biblia completa en audio" },
            { icon: "🌸", text: "Comunidad exclusiva de mujeres SELAH" },
          ].map((f,i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${G.border}` : "none" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
              <span style={{ color: G.textMid, fontSize: 13.5, lineHeight: 1.4 }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* CTA — conversión máxima */}
        <button onClick={() => onComprar("unico")}
          style={{ width: "100%", padding: "17px", background: `linear-gradient(135deg,${G.terra},${G.terraDark})`, border: "none", borderRadius: 14, color: G.white, fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: `0 8px 28px rgba(207,132,114,0.5)`, lineHeight: 1.3 }}>
          Sí, quiero comenzar mi camino con Dios →
        </button>
        <p style={{ color: G.textMuted, fontSize: 11, textAlign: "center", marginTop: 8 }}>
          🔒 Pago seguro · Sin suscripción · Sin cobros futuros
        </p>
      </div>

      {/* Contador */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
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
        <button onClick={() => onComprar("unico")} style={{ padding: "8px 18px", background: `linear-gradient(135deg,${G.terra},${G.terraDark})`, color: G.white, border: "none", borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Comenzar mi camino →
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

        {/* ── 2. ANTES / DESPUÉS — visual impactante ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ display: "inline-block", background: G.terra, borderRadius: 50, padding: "4px 16px", marginBottom: 10 }}>
              <span style={{ color: G.white, fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Tu transformación</span>
            </div>
            <h3 style={{ color: G.text, fontSize: "clamp(20px,5vw,26px)", fontFamily: "'Georgia',serif", fontWeight: 800, lineHeight: 1.2 }}>
              De donde estás hoy<br/>
              <span style={{ color: G.terra }}>a donde estarás en 21 días.</span>
            </h3>
          </div>

          {/* Cards individuales — más impacto visual */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {trans.map((t, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, alignItems: "center" }}>
                {/* Antes */}
                <div style={{ background: "rgba(160,128,112,0.07)", border: `1px solid rgba(160,128,112,0.15)`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>😔</span>
                  <span style={{ color: G.textMid, fontSize: 12.5, lineHeight: 1.45 }}>{t.antes}</span>
                </div>
                {/* Flecha */}
                <div style={{ color: G.terra, fontSize: 18, fontWeight: 800, textAlign: "center" }}>→</div>
                {/* Después */}
                <div style={{ background: `linear-gradient(135deg,${G.terraPale},${G.lavender})`, border: `1.5px solid ${G.borderS}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, boxShadow: G.shadow }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>✨</span>
                  <span style={{ color: G.text, fontSize: 12.5, lineHeight: 1.45, fontWeight: 600 }}>{t.despues}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Resultado final */}
          <div style={{ background: `linear-gradient(135deg,${G.terra},${G.terraDark})`, borderRadius: 16, padding: "16px 20px", marginTop: 16, textAlign: "center" }}>
            <p style={{ color: G.white, fontSize: 14.5, fontWeight: 700, lineHeight: 1.6, fontFamily: "'Georgia',serif", fontStyle: "italic" }}>
              "En 21 días no cambias todo.<br/>Pero cambias lo que importa."
            </p>
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

        {/* ── ROADMAP 4 SEMANAS ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ display: "inline-block", background: G.terra, borderRadius: 50, padding: "4px 16px", marginBottom: 10 }}>
              <span style={{ color: G.white, fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Tu transformación semana a semana</span>
            </div>
            <h3 style={{ color: G.text, fontSize: "clamp(18px,4.5vw,22px)", fontFamily: "'Georgia',serif", fontWeight: 800, lineHeight: 1.3 }}>
              Lo que pasa en tu interior<br/>
              <span style={{ color: G.terra }}>en 4 semanas con SELAH</span>
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { semana: "Semana 1", titulo: "Entiendes por qué tu fe se ha sentido sola", desc: "Por primera vez tienes palabras para lo que has cargado. La Palabra de Dios empieza a hablarte directamente a ti.", icon: "🌑", color: G.textMuted },
              { semana: "Semana 2", titulo: "La Biblia deja de sentirse lejana", desc: "Cada devocional llega exactamente donde duele. Empiezas a esperar ese momento del día.", icon: "🌱", color: G.terra },
              { semana: "Semana 3", titulo: "Un hábito espiritual real sin culpa", desc: "5 minutos cada mañana se vuelven el momento que más cuidas. Tu fe deja de depender del ánimo del día.", icon: "🌸", color: G.terra },
              { semana: "Semana 4", titulo: "Eres una mujer que camina en su fe con claridad", desc: "No necesitas tenerlo todo resuelto. Tienes dirección, tienes paz, y tienes a Dios hablándote cada día.", icon: "✨", color: G.gold },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: G.white, borderRadius: 16, padding: "16px 18px", border: `1px solid ${G.border}`, boxShadow: G.shadow }}>
                {/* Línea vertical conectora */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: i === 3 ? `linear-gradient(135deg,${G.terra},${G.terraDark})` : G.terraPale, border: `2px solid ${G.borderS}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{s.icon}</div>
                  {i < 3 && <div style={{ width: 2, height: 20, background: G.border, margin: "4px 0" }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: G.textMuted, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 3 }}>{s.semana}</div>
                  <div style={{ color: G.text, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{s.titulo}</div>
                  <div style={{ color: G.textMuted, fontSize: 12.5, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Garantía — grande y visual */}
        <div style={{ background: `linear-gradient(160deg,${G.lavender},${G.terraPale})`, borderRadius: 20, padding: "24px 20px", marginBottom: 28, textAlign: "center", border: `1.5px solid ${G.borderS}`, boxShadow: G.shadow }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🛡️</div>
          <div style={{ color: G.text, fontSize: 18, fontWeight: 800, marginBottom: 8, fontFamily: "'Georgia',serif" }}>Garantía total de 7 días</div>
          <div style={{ background: G.white, borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
            <p style={{ color: G.textMid, fontSize: 14, lineHeight: 1.65 }}>
              Si en los primeros 7 días no sientes que SELAH es para ti,<br/>
              <strong style={{ color: G.text }}>te devolvemos cada centavo.</strong><br/>
              Sin formularios. Sin preguntas. Sin vueltas.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {["✦ Sin riesgo", "✦ Sin preguntas", "✦ Devolución inmediata"].map((t,i) => (
              <span key={i} style={{ color: G.terraDark, fontSize: 12, fontWeight: 700 }}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── 5. TESTIMONIOS ── */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ color: G.text, fontSize: 17, fontFamily: "'Georgia',serif", fontWeight: 800, marginBottom: 16, textAlign: "center" }}>
            Ellas ya dieron el paso
          </h3>
          {[
            { texto: "Semana 1 todavía dudaba. Semana 3 ya no me despierto con ansiedad. Simplemente abro SELAH y algo en mí se asienta antes de que el día empiece. No sé explicarlo con palabras pero mi corazón lo siente.", nombre: "Valentina M.", lugar: "Bogotá, Colombia", emoji: "🌸", inicial: "V", tiempo: "hace 3 semanas", likes: 47 },
            { texto: "Llevaba 4 años alejada de Dios. Probé con iglesia, con podcasts, con nada. SELAH fue lo primero que habló de MI historia sin pedirme que primero lo tuviera todo bien. Eso lo cambió todo.", nombre: "Carolina R.", lugar: "Ciudad de México", emoji: "💜", inicial: "C", tiempo: "hace 5 días", likes: 83 },
            { texto: "Tengo TDAH y leer la Biblia siempre fue un tormento. El audio de SELAH lo cambió todo. Lo escucho haciendo el desayuno. 21 días después soy otra por dentro. Mi familia lo nota.", nombre: "Daniela P.", lugar: "Lima, Perú", emoji: "🕊️", inicial: "D", tiempo: "hace 1 semana", likes: 61 },
          ].map((t, i) => (
            <div key={i} style={{ background: G.white, border: `1px solid ${G.border}`, borderRadius: 16, padding: "16px", marginBottom: 12, boxShadow: G.shadow }}>
              {/* Header estilo Facebook */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${G.terra},${G.terraDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: G.white, flexShrink: 0 }}>
                  {t.inicial}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: G.text }}>{t.nombre}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 11, color: G.textMuted }}>{t.tiempo}</span>
                    <span style={{ color: G.textMuted, fontSize: 10 }}>·</span>
                    <span style={{ fontSize: 11, color: G.textMuted }}>🌐 {t.lugar}</span>
                  </div>
                </div>
                <div style={{ color: "#1877F2", fontSize: 20, fontWeight: 800 }}>f</div>
              </div>

              {/* Texto del post */}
              <p style={{ color: G.text, fontSize: 14, lineHeight: 1.75, marginBottom: 12 }}>{t.texto}</p>

              {/* Imagen simulada de reseña */}
              <div style={{ background: `linear-gradient(135deg,${G.terraPale},${G.lavender})`, borderRadius: 10, padding: "10px 14px", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>✦</span>
                <div>
                  <div style={{ color: G.terraDark, fontSize: 12, fontWeight: 700 }}>SELAH — Acompañamiento Espiritual</div>
                  <div style={{ color: G.textMuted, fontSize: 11 }}>selah-app-mu.vercel.app</div>
                </div>
              </div>

              {/* Reacciones estilo Facebook */}
              <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex" }}>
                    <span style={{ fontSize: 16 }}>❤️</span>
                    <span style={{ fontSize: 16, marginLeft: -4 }}>🙏</span>
                  </div>
                  <span style={{ color: G.textMuted, fontSize: 12 }}>{t.likes} personas</span>
                </div>
                <div style={{ color: G.gold, fontSize: 12, letterSpacing: 1 }}>★★★★★</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── 6. PRECIO SEGUNDA VEZ ── */}
        <BloquePrecios />

        {/* ── 7. ROADMAP 4 SEMANAS ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ display: "inline-block", background: G.terra, borderRadius: 50, padding: "4px 16px", marginBottom: 10 }}>
              <span style={{ color: G.white, fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Tu transformación semana a semana</span>
            </div>
            <h3 style={{ color: G.text, fontSize: "clamp(18px,4.5vw,22px)", fontFamily: "'Georgia',serif", fontWeight: 800, lineHeight: 1.3 }}>
              Lo que pasa en tus<br/>
              <span style={{ color: G.terra }}>primeras 4 semanas con SELAH</span>
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { num: "01", semana: "Semana 1", titulo: "Tu fe deja de sentirse sola", desc: "Empiezas a tener un espacio que habla de tu historia real. Los primeros 7 días construyen el hábito más suave que hayas tenido.", color: G.terraPale, border: G.borderS, numColor: G.textMuted },
              { num: "02", semana: "Semana 2", titulo: "La Palabra empieza a hablarte diferente", desc: "Los versículos ya no son textos genéricos — son respuestas directas a lo que estás viviendo. Empiezas a sentir que Dios te conoce.", color: G.lavender, border: G.lavMid, numColor: G.lavMid },
              { num: "03", semana: "Semana 3", titulo: "El hábito ya no requiere esfuerzo", desc: "Ya no tienes que recordar abrir SELAH — lo extrañas cuando no lo haces. La constancia se volvió natural.", color: G.terraPale, border: G.borderS, numColor: G.terra },
              { num: "04", semana: "Semana 4", titulo: "Eres una mujer que camina en su fe", desc: "No perfecta. No que lo tiene todo resuelto. Sino una mujer que sabe a quién acudir — y que siente la diferencia.", color: `linear-gradient(135deg,${G.terraPale},${G.lavender})`, border: G.terra, numColor: G.terraDark },
            ].map((s, i) => (
              <div key={i} style={{ background: s.color, border: `1.5px solid ${s.border}`, borderRadius: 16, padding: "18px 18px", display: "flex", gap: 16, alignItems: "flex-start", boxShadow: i === 3 ? G.shadowLg : G.shadow }}>
                <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", background: G.white, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: G.shadow }}>
                  <span style={{ color: s.numColor, fontSize: 14, fontWeight: 800, fontFamily: "'Georgia',serif" }}>{s.num}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: G.terra, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 700, marginBottom: 3 }}>{s.semana}</div>
                  <div style={{ color: G.text, fontSize: 14.5, fontWeight: 800, marginBottom: 5, lineHeight: 1.3 }}>{s.titulo}</div>
                  <div style={{ color: G.textMid, fontSize: 13, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
                {i === 3 && <span style={{ fontSize: 20, flexShrink: 0 }}>✦</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ── 8. FAQ ── */}
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
            <span style={{ color: G.textMuted, fontSize: 16, textDecoration: "line-through" }}>$19</span>
            <span style={{ color: G.terraDark, fontSize: 44, fontWeight: 800, fontFamily: "'Georgia',serif", lineHeight: 1 }}>$13.30</span>
          </div>
          <div style={{ color: G.textMuted, fontSize: 12 }}>pago único · acceso de por vida · 30% off</div>

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
          Sí, quiero mi acceso por $13.30 →
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
    // Track cada pregunta respondida
    track("QuizPregunta", { pregunta: qIndex + 1, total: QUESTIONS.length });
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      const arq = calcularArquetipo(n);
      setArquetipo(arq);
      track("QuizCompletado", { arquetipo: arq });
      setPantalla("analisis");
    }
  };

  const handleValidation = (valor) => {
    const n = [...respuestas]; n[qIndex] = valor; setRespuestas(n);
    setValidationPending({ valor, screenData: VALIDATION_SCREENS[qIndex + 1] });
    setPantalla("validacion");
  };

  const handleValidationContinue = () => {
    track("ValidacionVista", { pregunta: qIndex + 1 });
    setValidationPending(null); setPantalla("quiz"); setQIndex(qIndex + 1);
  };

  const handleEmail = async (data) => {
    setLeadData(data);

    // ── Meta Pixel: Lead event ──────────────────────────────
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", {
        content_name: data.arquetipo,
        content_category: "selah_quiz"
      });
    }

    // ── Systeme.io: Crear contacto y agregar al funnel ──────
    try {
      const SYSTEME_API_KEY = "a7sk3xrzplfy0neobvxvnlpvrh5bhmeusna2nb3rs55le3jzk70cd6gfg3h9z229";

      // 1. Crear o actualizar contacto
      const contactRes = await fetch("https://api.systeme.io/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": SYSTEME_API_KEY,
        },
        body: JSON.stringify({
          email: data.email,
          firstName: data.nombre,
          fields: [
            { slug: "arquetipo", value: data.arquetipo }
          ]
        }),
      });
      const contactData = await contactRes.json();
      console.log("Systeme contact:", contactData);

      // 2. Agregar al funnel (step de captura)
      if (contactData?.id) {
        await fetch(`https://api.systeme.io/api/contacts/${contactData.id}/funnel-step-subscriptions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": SYSTEME_API_KEY,
          },
          body: JSON.stringify({
            funnelStepId: 24371363
          }),
        });
      }
    } catch (err) {
      console.error("Systeme.io error:", err);
      // Continúa el flujo aunque falle — no bloquear la UX
    }

    track("EmailCapturado", { arquetipo: data.arquetipo });
    setPantalla("venta");
  };

  const handleCompra = (plan) => {
    const precios = { unico: 19, descuento: 13.30 };
    const valor = precios[plan] || 19;

    // Meta Pixel
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        value: valor, currency: "USD",
        content_name: "SELAH Acceso Completo"
      });
    }

    const urls = {
      unico:      "https://pay.hotmart.com/A106288475F",
      descuento:  "https://hotm.io/wgXbiFv",
      mensualOff: "https://hotm.io/wgXbiFv",
    };
    const url = urls[plan] || urls.unico;
    window.open(url, "_blank");
  };

  // Pantalla de venta — full page
  if (pantalla === "venta" && arquetipo && leadData) {
    fbq("track", "ViewContent", { content_name: "selah_landing", content_category: arquetipo });
    return (
      <div ref={topRef}>
        <ResultadoVenta arquetipo={arquetipo} nombre={leadData.nombre} onComprar={handleCompra} />
      </div>
    );
  }

  return (
    <div ref={topRef} style={{ minHeight: "100vh", background: G.bgGrad, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "28px 14px 60px", fontFamily: "-apple-system,'Segoe UI',Helvetica,sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 500, background: G.bgCard, borderRadius: 20, padding: "28px 18px", boxShadow: G.shadowLg, border: `1px solid ${G.border}` }}>
        {pantalla === "intro"     && <Intro onStart={() => { track("QuizInicio"); setPantalla("quiz"); }} />}
        {pantalla === "validacion" && validationPending && <ValidationScreen data={validationPending.screenData} onContinue={handleValidationContinue} />}
        {pantalla === "quiz"      && <Pregunta q={QUESTIONS[qIndex]} index={qIndex} total={QUESTIONS.length} onSelect={handleSelect} onValidation={VALIDATION_SCREENS[qIndex + 1] ? handleValidation : null} />}
        {pantalla === "analisis"  && arquetipo && <Analisis arquetipo={arquetipo} onDone={() => { track("AnalisisVisto", { arquetipo }); setPantalla("curva"); }} />}
        {pantalla === "curva"     && arquetipo && <CurvaEmocional arquetipo={arquetipo} onContinue={() => { track("CurvaEmocionalVista", { arquetipo }); setPantalla("email"); }} />}
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
