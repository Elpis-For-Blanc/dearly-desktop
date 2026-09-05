const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const desk=$("#desktop"), wins=$("#windows"), icons=$("#icons"), decos=$("#decorations"), editor=$("#editor");
let z=10, wi=0, ii=0, di=0;
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1600)}
function select(el){$$(".selected").forEach(x=>x.classList.remove("selected"));el.classList.add("selected");el.style.zIndex=++z;buildEditor(el)}
function makeDraggable(el,handle=el){handle.addEventListener("pointerdown",ev=>{if(ev.target.closest(".close"))return;ev.preventDefault();select(el);const r=el.getBoundingClientRect(),d=desk.getBoundingClientRect(),ox=ev.clientX-r.left,oy=ev.clientY-r.top;
 const move=e=>{let x=Math.max(0,Math.min(e.clientX-d.left-ox,d.width-r.width)),y=Math.max(0,Math.min(e.clientY-d.top-oy,d.height-r.height-42));el.style.left=(x/d.width*100)+"%";el.style.top=(y/d.height*100)+"%"};
 const up=()=>{window.removeEventListener("pointermove",move);window.removeEventListener("pointerup",up)};window.addEventListener("pointermove",move);window.addEventListener("pointerup",up)})}
const defs={
note:["memo.txt","오늘 해야 할 일\n\n• 잊지 않기\n• 일찍 돌아가기"],
message:["MESSENGER","상대 | 아직 안 자?\n나 | 응. 왜?\n상대 | 그냥."],
music:["NOW PLAYING","Song Title | Artist"],
photo:["PHOTO VIEWER",""],
browser:["BROWSER","dearly://home | 최근 검색 기록"],
folder:["SECRET","photo.jpg\nmemo.txt\ndo_not_delete.txt"],
calendar:["CALENDAR","2026.09"],
todo:["TO DO","선물 고르기\n메일 확인하기\n일찍 돌아가기"],
profile:["PROFILE","NAME | status message"],
terminal:["TERMINAL","C:\\DEARLY> whoami\nprivate_user\n\nC:\\DEARLY> echo secret\naccess granted."],
sticky:["STICKY NOTE","잊지 말 것.\n오늘은 꼭 말하기."],
mail:["MAIL","RE: 오늘 저녁 | 확인했습니다.\nPRIVATE | 아직 읽지 않음\nNOTICE | 일정 변경 안내"]
};
function addWindow(type){const w=document.createElement("div");w.className="window "+type;w.dataset.kind="window";w.dataset.type=type;w.dataset.title=defs[type][0];w.dataset.text=defs[type][1];w.style.left=(17+(++wi*4)%38)+"%";w.style.top=(10+(wi*5)%34)+"%";w.style.zIndex=++z;
 w.innerHTML='<div class="bar"><i class="dot"></i><span class="title"></span><button class="close">×</button></div><div class="content"></div>';wins.appendChild(w);render(w);makeDraggable(w,w.querySelector(".bar"));w.addEventListener("pointerdown",()=>select(w));w.querySelector(".close").onclick=e=>{e.stopPropagation();w.remove();resetEditor()};select(w)}
function render(w){const c=w.querySelector(".content"),t=w.dataset.type,s=w.dataset.text||"";w.querySelector(".title").textContent=w.dataset.title||"";
 if(t==="note"||t==="sticky"||t==="terminal") c.textContent=s;
 else if(t==="message"){const my=(document.querySelector("#messageMyName")?.value||"나").trim(),other=(document.querySelector("#messageOtherName")?.value||"상대").trim();c.innerHTML='<div class="messages">'+s.split("\n").filter(Boolean).map((l,i)=>{const a=l.split("|"),speaker=(a[0]||"").trim(),me=speaker===my;return `<div class="bubble ${me?"me":""}"><b>${esc(speaker||other)}</b><br>${esc(a.slice(1).join("|").trim())}</div>`}).join("")+"</div>";}
 else if(t==="music"){const a=s.split("|");c.innerHTML=`<div class="musicgrid"><div class="cover ${w.dataset.img?"has-photo":""}" ${w.dataset.img?`style="background-image:url('${w.dataset.img}')"`:""}>${w.dataset.img?"":"♫"}</div><div><b>${esc(a[0]||"Song Title")}</b><br><small>${esc(a[1]||"Artist")}</small><div class="progress"><i></i></div></div></div>`}
 else if(t==="photo") c.innerHTML=`<div class="photoarea" ${w.dataset.img?`style="background-image:url('${w.dataset.img}')"`:""}>${w.dataset.img?"":"PHOTO"}</div>`;
 else if(t==="browser"){const a=s.split("|");c.innerHTML=`<div class="browserbar">‹　›　↻　${esc(a[0]||"dearly://home")}</div><div style="padding:12px"><b>${esc(a[1]||"PAGE")}</b><p>가상의 브라우저 화면입니다.</p></div>`}
 else if(t==="folder") c.innerHTML=`<div class="foldergrid">${s.split("\n").filter(Boolean).map(x=>`<div class="mini">${esc(x)}</div>`).join("")}</div>`;
 else if(t==="calendar"){let nums=Array.from({length:30},(_,i)=>i+1);c.innerHTML=`<b>${esc(s)}</b><div class="calendar-grid">${["S","M","T","W","T","F","S"].map(x=>`<b>${x}</b>`).join("")}${nums.map(x=>`<span>${x}</span>`).join("")}</div>`}
 else if(t==="todo") c.innerHTML=s.split("\n").filter(Boolean).map(x=>`<div class="todo-line">□ <span>${esc(x)}</span></div>`).join("");
 else if(t==="profile"){const a=s.split("|");c.innerHTML=`<div class="profilebox"><div class="avatar ${w.dataset.img?"has-photo":""}" ${w.dataset.img?`style="background-image:url('${w.dataset.img}')"`:""}></div><b>${esc(a[0]||"NAME")}</b><p>${esc(a[1]||"status message")}</p></div>`}
 else if(t==="mail") c.innerHTML=s.split("\n").filter(Boolean).map(x=>{let a=x.split("|");return `<div class="mailrow"><b>${esc(a[0])}</b><br><small>${esc(a[1]||"")}</small></div>`}).join("");
}
function addIcon(name,type="folder"){const el=document.createElement("div");el.className="icon "+(type==="file"?"file":"");el.dataset.kind="icon";el.dataset.name=name;el.dataset.iconType=type;el.style.left=((ii%4)*86+14)+"px";el.style.top=(Math.floor(ii/4)*76+15)+"px";ii++;el.innerHTML=`<div class="iconpic"></div><span>${esc(name)}</span>`;icons.appendChild(el);makeDraggable(el);el.onclick=()=>select(el)}
function addDeco(type){const el=document.createElement("div");el.className="deco "+type;el.dataset.kind="deco";el.dataset.deco=type;el.style.left=(58+(di*5)%25)+"%";el.style.top=(10+(di*7)%55)+"%";di++;el.textContent=type==="heart"?"♡":type==="star"?"☆":type==="sparkle"?"✦":"";decos.appendChild(el);makeDraggable(el);el.onclick=()=>select(el)}
function resetEditor(){editor.innerHTML='<h3>SELECTED ITEM</h3><p class="sub">창·아이콘·장식을 클릭하면 세부 편집이 나타나.</p>'}
function buildEditor(el){
 if(el.dataset.kind==="icon"){editor.innerHTML=`<h3>DESKTOP ITEM</h3><label>이름<input id="eName" value="${esc(el.dataset.name)}"></label><button id="deleteSelected">삭제</button>`;$("#eName").oninput=e=>{el.dataset.name=e.target.value;el.querySelector("span").textContent=e.target.value};$("#deleteSelected").onclick=()=>{el.remove();resetEditor()};return}
 if(el.dataset.kind==="deco"){editor.innerHTML=`<h3>DECORATION</h3><label>크기<input id="eSize" type="range" min="12" max="90" value="${parseInt(getComputedStyle(el).fontSize)||34}"></label><button id="deleteSelected">삭제</button>`;$("#eSize").oninput=e=>el.style.fontSize=e.target.value+"px";$("#deleteSelected").onclick=()=>{el.remove();resetEditor()};return}
 const t=el.dataset.type;editor.innerHTML=`<h3>${t.toUpperCase()}</h3><label>창 제목<input id="eTitle" value="${esc(el.dataset.title)}"></label><label style="display:block">내용<textarea id="eText" rows="7">${esc(el.dataset.text)}</textarea></label>${["photo","music","profile"].includes(t)?`<label style="display:block">${t==="music"?"앨범 사진":t==="profile"?"프로필 사진":"사진"}<input id="ePhoto" type="file" accept="image/*"></label><div id="mediaFileName" class="sub">${el.dataset.fileName?esc(el.dataset.fileName):"선택된 파일이 없습니다."}</div>${el.dataset.img?'<button id="removeMediaPhoto" type="button">사진 제거</button>':""}`:""}<div class="two"><label>너비<input id="eWidth" type="range" min="220" max="620" value="${Math.round(el.getBoundingClientRect().width)}"></label><label>삭제<button id="deleteSelected">창 삭제</button></label></div>${t==="message"?`<div class="two messenger-editor-names"><label>상대 이름<input id="eOtherName" value="${esc((document.querySelector('#messageOtherName')?.value||'상대'))}" placeholder="상대 이름"></label><label>내 이름<input id="eMyName" value="${esc((document.querySelector('#messageMyName')?.value||'나'))}" placeholder="내 이름"></label></div><p class="sub">각 줄을 “이름 | 내용”으로 입력해 주세요. ‘내 이름’은 오른쪽, ‘상대 이름’은 왼쪽에 표시됩니다.</p>`:""}`;
 $("#eTitle").oninput=e=>{el.dataset.title=e.target.value;render(el)};$("#eText").oninput=e=>{el.dataset.text=e.target.value;render(el)};$("#eWidth").oninput=e=>el.style.width=e.target.value+"px";$("#deleteSelected").onclick=()=>{el.remove();resetEditor()};
 if(t==="message"){
   const eo=$("#eOtherName"), em=$("#eMyName");
   if(eo) eo.oninput=e=>{const g=$("#messageOtherName");if(g)g.value=e.target.value;$$('.window.message').forEach(render)};
   if(em) em.oninput=e=>{const g=$("#messageMyName");if(g)g.value=e.target.value;$$('.window.message').forEach(render)};
 }
 if(["photo","music","profile"].includes(t)){
   $("#ePhoto").onchange=e=>{
     const f=e.target.files[0]; if(!f)return;
     el.dataset.fileName=f.name;
     const name=$("#mediaFileName"); if(name) name.textContent=f.name;
     const r=new FileReader(); r.onload=()=>{el.dataset.img=r.result;render(el)}; r.readAsDataURL(f);
   };
   const remove=$("#removeMediaPhoto");
   if(remove) remove.onclick=()=>{delete el.dataset.img;delete el.dataset.fileName;render(el);buildEditor(el)};
 }
}
$$("[data-add]").forEach(b=>b.onclick=()=>addWindow(b.dataset.add));$$("[data-deco]").forEach(b=>b.onclick=()=>addDeco(b.dataset.deco));
$("#addFolder").onclick=()=>{addIcon($("#iconName").value.trim()||"new folder","folder");$("#iconName").value=""};$("#addFile").onclick=()=>{addIcon($("#fileName").value.trim()||"memo.txt","file");$("#fileName").value=""};
$("#theme").onchange=e=>{
  const theme=e.target.value;
  desk.className="desktop theme-"+theme;
  // A theme selection should show the theme itself instead of an old custom wallpaper/color.
  desk.style.background="";
  desk.style.backgroundColor="";
  desk.style.backgroundImage="";
  desk.classList.remove("has-wallpaper");
  desk.style.removeProperty("--custom-wallpaper");
  $("#wallpaperName").textContent="선택된 파일이 없습니다.";
  const specialFonts={
    win98:'Tahoma, "MS Sans Serif", sans-serif',
    terminalgreen:'Consolas, "Courier New", monospace',
    newspaper:'Georgia, "Times New Roman", serif'
  };
  if(specialFonts[theme]){
    desk.style.setProperty("--desk-font",specialFonts[theme]);
    desk.style.setProperty("--title-font",specialFonts[theme]);
  }
};
$("#bgColor").oninput=e=>{desk.classList.remove("has-wallpaper");desk.style.removeProperty("--custom-wallpaper");desk.style.backgroundImage="none";desk.style.backgroundColor=e.target.value};
$("#accent").oninput=e=>desk.style.setProperty("--a",e.target.value);
$("#fontFamily").onchange=async e=>{
  const font=e.target.value;
  desk.style.setProperty("--desk-font",font);
  try{await document.fonts.load("16px "+font); await document.fonts.ready;}catch(_){}
  desk.querySelectorAll(".content, .content *, .icon, .icon *, .taskbar, .taskbar *").forEach(el=>{
    if(!el.closest(".terminal")) el.style.fontFamily=font;
  });
  desk.offsetHeight;
};
$("#fontSize").oninput=e=>desk.style.setProperty("--desk-font-size",e.target.value+"px");
$("#titleFont").onchange=async e=>{
  desk.style.setProperty("--title-font",e.target.value);
  try{await document.fonts.load("16px "+e.target.value); await document.fonts.ready;}catch(_){}
  desk.offsetHeight;
};
$("#bgFit").onchange=e=>{desk.style.setProperty("background-size",e.target.value,"important");};$("#dim").oninput=e=>desk.querySelector(".dim").style.opacity=e.target.value/100;$("#opacity").oninput=e=>desk.style.setProperty("--win-alpha",e.target.value/100);$("#radius").oninput=e=>desk.style.setProperty("--radius",e.target.value+"px");$("#clock").oninput=e=>$("#trayClock").textContent=e.target.value;
$("#wallpaper").onchange=e=>{const f=e.target.files[0];if(!f)return;$("#wallpaperName").textContent=f.name;const r=new FileReader();r.onload=()=>{const u=`url("${r.result}")`;desk.style.setProperty("--custom-wallpaper",u);desk.classList.add("has-wallpaper");desk.style.setProperty("background-image",u,"important");desk.style.setProperty("background-repeat","no-repeat","important");desk.style.setProperty("background-position","center","important");desk.style.setProperty("background-size",$("#bgFit").value||"cover","important");};r.readAsDataURL(f)};
$("#resetBtn").onclick=()=>{if(confirm("현재 꾸민 화면을 초기화하시겠습니까?"))location.reload()};
$("#oocBtn").onclick=async()=>{const p=`[OOC: 지금까지의 대화와 설정을 바탕으로 {{char}}의 개인 PC 화면에 있을 법한 내용을 작성해주세요. 기존 설정과 {{char}}·{{user}}의 관계성을 우선하고, 확인되지 않은 중요한 설정은 임의로 확정하지 마세요.

1. 바탕화면 폴더 이름 6개
2. 바탕화면 파일 이름 6개
3. 메모장 내용
4. 최근 재생 음악 3곡
5. {{user}}와의 메신저 대화 6줄
6. 최근 검색어 5개
7. TO DO 5개
8. 최근 메일 제목 4개
9. 숨겨둔 폴더와 내부 파일 4개
10. 휴지통 파일 3개
11. PC 화면에서 가장 캐릭터다운 작은 흔적 3개

성격, 직업, 습관, 말투와 현재 관계가 자연스럽게 드러나도록 작성해주세요.]`;try{await navigator.clipboard.writeText(p);toast("OOC가 복사되었습니다.")}catch{const a=document.createElement("textarea");a.value=p;document.body.appendChild(a);a.select();document.execCommand("copy");a.remove();toast("OOC가 복사되었습니다.")}};
$("#saveBtn").onclick=async()=>{if(!window.html2canvas){toast("저장 기능을 불러오지 못했습니다.");return}$$(".selected").forEach(x=>x.classList.remove("selected"));try{await document.fonts.ready;const c=await html2canvas(desk,{scale:3,useCORS:true,backgroundColor:null,logging:false});const a=document.createElement("a");a.download="DEARLY_DESKTOP_MY_PC.png";a.href=c.toDataURL("image/png");a.click();toast("고화질 PNG 저장이 완료되었습니다.")}catch(err){console.error(err);toast("PNG 저장 중 문제가 발생했습니다.")}};
addIcon("photos");addIcon("secret");addIcon("private.txt","file");addWindow("note");addWindow("music");

// Bottom DEARLY icon image
(()=>{
  const input=document.querySelector("#brandIconUpload");
  const reset=document.querySelector("#brandIconReset");
  const icon=document.querySelector("#brandIcon");
  if(!input || !icon) return;

  input.addEventListener("change", e=>{
    const file=e.target.files && e.target.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=()=>{
      icon.style.backgroundImage=`url("${reader.result}")`;
      icon.classList.add("has-custom-image");
    };
    reader.readAsDataURL(file);
  });

  if(reset) reset.addEventListener("click", ()=>{
    icon.style.backgroundImage="";
    icon.classList.remove("has-custom-image");
    input.value="";
  });
})();


// ===== Window resizing + responsive content =====
(()=>{
  const desk=document.querySelector("#desktop");
  if(!desk) return;

  function refreshWindowLayout(win){
    if(!win) return;
    win.classList.toggle("compact-window", win.offsetWidth < 270);
  }

  function addResizeHandle(win){
    if(!win || win.querySelector(":scope > .resize-handle")) return;
    const h=document.createElement("div");
    h.className="resize-handle";
    h.title="드래그하여 창 크기를 조절할 수 있습니다.";
    win.appendChild(h);

    h.addEventListener("pointerdown", e=>{
      e.preventDefault();
      e.stopPropagation();
      h.setPointerCapture?.(e.pointerId);

      const startX=e.clientX, startY=e.clientY;
      const startW=win.offsetWidth, startH=win.offsetHeight;
      const deskRect=desk.getBoundingClientRect();
      const winRect=win.getBoundingClientRect();
      const maxW=Math.max(190, deskRect.right-winRect.left);
      const maxH=Math.max(105, deskRect.bottom-winRect.top);

      const move=ev=>{
        const w=Math.max(190,Math.min(maxW,startW+(ev.clientX-startX)));
        const hgt=Math.max(105,Math.min(maxH,startH+(ev.clientY-startY)));
        win.style.width=w+"px";
        win.style.height=hgt+"px";
        win.dataset.w=w;
        win.dataset.h=hgt;
        refreshWindowLayout(win);
      };
      const up=ev=>{
        window.removeEventListener("pointermove",move);
        window.removeEventListener("pointerup",up);
        try{h.releasePointerCapture?.(ev.pointerId)}catch(_){}
      };
      window.addEventListener("pointermove",move);
      window.addEventListener("pointerup",up);
    });

    refreshWindowLayout(win);
  }

  function scan(){
    desk.querySelectorAll(".window").forEach(addResizeHandle);
  }

  scan();

  // Windows added later also receive a resize handle automatically.
  const observer=new MutationObserver(scan);
  observer.observe(desk,{childList:true,subtree:true});

  window.addEventListener("resize",()=>{
    desk.querySelectorAll(".window").forEach(refreshWindowLayout);
  });
})();

// Text editor: preserve user-entered line breaks and wrap long lines.
document.addEventListener("focusin", e=>{
  if(e.target && e.target.tagName==="TEXTAREA"){
    e.target.setAttribute("wrap","soft");
    e.target.style.whiteSpace="pre-wrap";
    e.target.style.overflowWrap="anywhere";
  }
});

// Messenger participant names
(()=>{
 const my=document.querySelector("#messageMyName");
 const other=document.querySelector("#messageOtherName");
 if(!my||!other)return;
 const refresh=()=>document.querySelectorAll(".window.message").forEach(render);
 my.addEventListener("input",refresh);
 other.addEventListener("input",refresh);
})();
