let KEY=localStorage.getItem("v3_key")||"KUYADLAN";
let ENTRIES=JSON.parse(localStorage.getItem("v3_entries")||"[]");
let PASS=localStorage.getItem("v3_pass")||"1234";
let ANNOUNCE=localStorage.getItem("v3_ann")||"No announcement yet.";
let PROGRAMS=JSON.parse(localStorage.getItem("v3_progs")||'["BSCS","BSIT","BSIS","EMC"]');
let IS_OPEN=localStorage.getItem("v3_isOpen")!=="false";
let DEADLINE=localStorage.getItem("v3_deadline")||"";
let THEME=localStorage.getItem("v3_theme")||"dark";
let sortField="time",sortAsc=false;

const THEMES=["dark","light","gradient1","gradient2","gradient3"];
const THEME_LABELS={
  dark:"🌙 Dark Mode",
  light:"☀️ Light Mode",
  gradient1:"🎨 Purple Gradient",
  gradient2:"🌸 Pink Gradient",
  gradient3:"💧 Blue Gradient"
};

function applyTheme(name){
  document.body.className=name;
  let admin=document.getElementById("adminView");
  admin.className=name;
  localStorage.setItem("v3_theme",name);
  THEME=name;
  let btn=document.getElementById("themeBtn");
  if(btn){
    let idx=THEMES.indexOf(name);
    let next=THEMES[(idx+1)%THEMES.length];
    btn.textContent=THEME_LABELS[next]+" →";
  }
}

function toggleTheme(){
  let idx=THEMES.indexOf(THEME);
  let next=THEMES[(idx+1)%THEMES.length];
  applyTheme(next);
}

function toggleEye(id,btn){
  let input=document.getElementById(id);
  if(input.type==="password"){input.type="text";btn.textContent="🙈";}
  else{input.type="password";btn.textContent="👁️";}
}
function initPrograms(){
  let sel=document.getElementById("program"),fSel=document.getElementById("fProgram");
  sel.innerHTML='<option value="">Program *</option>';fSel.innerHTML='<option value="">All Program</option>';
  PROGRAMS.forEach(p=>{sel.innerHTML+=`<option>${p}</option>`;fSel.innerHTML+=`<option>${p}</option>`;});
  renderProgList();
}
function renderProgList(){
  let div=document.getElementById("progList");div.innerHTML="";
  PROGRAMS.forEach((p,i)=>{
    div.innerHTML+=`<span style="background:var(--input);border:1px solid var(--border);padding:6px 10px;border-radius:999px;font-size:11px;color:var(--text)">${p} <b style="cursor:pointer;color:#f55" onclick="removeProg(${i})">x</b></span>`;
  });
}
function addProgram(){
  let v=document.getElementById("newProg").value.trim().toUpperCase();
  if(!v)return;if(PROGRAMS.includes(v)){alert("Already exists");return;}
  PROGRAMS.push(v);localStorage.setItem("v3_progs",JSON.stringify(PROGRAMS));
  document.getElementById("newProg").value="";initPrograms();
}
function removeProg(i){if(confirm("Remove "+PROGRAMS[i]+"?")){PROGRAMS.splice(i,1);localStorage.setItem("v3_progs",JSON.stringify(PROGRAMS));initPrograms();}}
function isSpellingMistake(i,c){i=i.toUpperCase();c=c.toUpperCase();if(Math.abs(i.length-c.length)>2)return false;let d=0,l=Math.min(i.length,c.length);for(let k=0;k<l;k++)if(i[k]!==c[k])d++;d+=Math.abs(i.length-c.length);return d>0&&d<=2;}
function checkDeadline(){
  if(DEADLINE){if(new Date()>new Date(DEADLINE))IS_OPEN=false;}
  let dot=document.getElementById("statusDot"),btn=document.getElementById("submitBtn");
  if(!IS_OPEN){dot.textContent="🔒 CLOSED";dot.className="status-dot closed";btn.disabled=true;btn.textContent="Submission Closed";}
  else{dot.textContent="🔓 OPEN";dot.className="status-dot open";btn.disabled=false;btn.textContent="Submit Entry";}
  document.getElementById("sOpen").textContent=IS_OPEN?"OPEN":"CLOSED";
  document.getElementById("sOpen").style.color=IS_OPEN?"#4ade80":"#f87171";
  document.getElementById("sDue").textContent=DEADLINE?new Date(DEADLINE).toLocaleString():"No deadline";
  if(DEADLINE)document.getElementById("deadlineInput").value=DEADLINE;
}
function updateCounter(){document.getElementById("counter").textContent="✅ Finished: "+ENTRIES.length+" students";}
function submitEntry(){
  checkDeadline();if(!IS_OPEN){alert("Closed");return;}
  let name=document.getElementById("fullName").value.trim();
  let year=document.getElementById("yearLevel").value;
  let prog=document.getElementById("program").value;
  let sec=document.getElementById("section").value;
  let subj=document.getElementById("subject").value.trim();
  let key=document.getElementById("keyword").value.trim();
  let res=document.getElementById("result");
  if(!name||!year||!prog||!sec||!subj||!key){res.className="bad";res.textContent="❌ Fill all fields!";res.style.display="block";return;}
  if(key.toUpperCase()!==KEY.toUpperCase()){
    if(isSpellingMistake(key,KEY)){res.className="warn";res.textContent="Wrong spelling!";}else{res.className="bad";res.textContent="Wrong keyword!";}
    res.style.display="block";return;
  }
  if(ENTRIES.some(e=>e.name.toLowerCase()===name.toLowerCase()&&e.subject.toLowerCase()===subj.toLowerCase())){
    res.className="warn";res.textContent=name+" already submitted for "+subj;res.style.display="block";return;
  }
  ENTRIES.push({name,year,program:prog,section:sec,subject:subj,time:new Date().toLocaleString(),timestamp:Date.now()});
  localStorage.setItem("v3_entries",JSON.stringify(ENTRIES));updateCounter();
  res.className="ok";res.innerHTML=`Correct! ${name} counted! 🎉`;res.style.display="block";
  ["fullName","subject","keyword"].forEach(id=>document.getElementById(id).value="");
  setTimeout(()=>res.style.display="none",2500);
}
function toggleAnn(){let b=document.getElementById("annBox");b.classList.toggle("show");b.innerHTML="<b style='color:#ff5e00'>📢</b><br><br>"+ANNOUNCE.replace(/\n/g,"<br>");}
function openAdminLogin(){document.getElementById("adminLogin").style.display="flex";}
function closeAdminLogin(){document.getElementById("adminLogin").style.display="none";}
function checkAdmin(){if(document.getElementById("adminPassIn").value===PASS){closeAdminLogin();openAdmin();}else alert("Wrong password");}
function openAdmin(){
  document.getElementById("adminView").style.display="block";
  applyTheme(THEME);
  document.getElementById("sTotal").textContent=ENTRIES.length;
  document.getElementById("sKeyword").textContent=KEY;
  document.getElementById("annInput").value=ANNOUNCE;
  checkDeadline();renderTable();
}
function closeAdmin(){document.getElementById("adminView").style.display="none";document.getElementById("adminPassIn").value="";}
function renderTable(){
  let fp=document.getElementById("fProgram").value,fy=document.getElementById("fYear").value,fs=document.getElementById("fSection").value,fsubj=document.getElementById("fSubject").value.toLowerCase(),fsearch=document.getElementById("fSearch").value.toLowerCase();
  let filtered=[...ENTRIES];
  if(fp)filtered=filtered.filter(e=>e.program===fp);
  if(fy)filtered=filtered.filter(e=>e.year===fy);
  if(fs)filtered=filtered.filter(e=>e.section===fs);
  if(fsubj)filtered=filtered.filter(e=>e.subject.toLowerCase().includes(fsubj));
  if(fsearch)filtered=filtered.filter(e=>e.name.toLowerCase().includes(fsearch));
  filtered.sort((a,b)=>{
    let av=a[sortField],bv=b[sortField];if(sortField==="time"){av=a.timestamp;bv=b.timestamp;}
    if(typeof av==="string")av=av.toLowerCase();if(typeof bv==="string")bv=bv.toLowerCase();
    if(av<bv)return sortAsc?-1:1;if(av>bv)return sortAsc?1:-1;return 0;
  });
  let tbody=document.getElementById("tableBody");tbody.innerHTML="";
  filtered.forEach((e)=>{
    let origIdx=ENTRIES.indexOf(e);
    tbody.innerHTML+=`<tr><td>${e.name}</td><td>${e.program}</td><td>${e.year}</td><td>${e.section}</td><td>${e.subject}</td><td>${e.time}</td><td><button class="b b-red" onclick="delEntry(${origIdx})">Del</button></td></tr>`;
  });
}
function sortBy(f){if(sortField===f)sortAsc=!sortAsc;else{sortField=f;sortAsc=true;}renderTable();}
function delEntry(i){if(confirm("Remove "+ENTRIES[i].name+"?")){ENTRIES.splice(i,1);localStorage.setItem("v3_entries",JSON.stringify(ENTRIES));updateCounter();renderTable();}}
function clearEntries(){if(confirm("Clear ALL?")){ENTRIES=[];localStorage.setItem("v3_entries","[]");updateCounter();renderTable();}}
function exportCSV(){if(!ENTRIES.length){alert("No data");return;}let csv="No,Name,Program,Year,Section,Subject,DateTime\n"+ENTRIES.map((e,i)=>`${i+1},"${e.name}","${e.program}","${e.year}","${e.section}","${e.subject}","${e.time}"`).join("\n");let blob=new Blob([csv],{type:"text/csv"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="entries.csv";a.click();}
function saveKey(){let nk=document.getElementById("newKey").value.trim();if(!nk){alert("Type keyword");return;}if(!confirm("Save '"+nk+"' and clear?"))return;KEY=nk;localStorage.setItem("v3_key",nk);ENTRIES=[];localStorage.setItem("v3_entries","[]");updateCounter();openAdmin();document.getElementById("newKey").value="";alert("Saved!");}
function changePass(){let oldP=document.getElementById("oldP").value,newP=document.getElementById("newP").value;if(oldP!==PASS){alert("Wrong current");return;}if(newP.length<4){alert("Min 4");return;}PASS=newP;localStorage.setItem("v3_pass",newP);document.getElementById("oldP").value="";document.getElementById("newP").value="";alert("Password changed!");}
function saveDeadline(){let d=document.getElementById("deadlineInput").value;if(!d){alert("Pick date");return;}DEADLINE=d;localStorage.setItem("v3_deadline",d);checkDeadline();alert("Saved: "+new Date(d).toLocaleString());}
function clearDeadline(){DEADLINE="";localStorage.removeItem("v3_deadline");document.getElementById("deadlineInput").value="";checkDeadline();alert("No deadline");}
function setOpen(o){IS_OPEN=o;localStorage.setItem("v3_isOpen",o);checkDeadline();alert(o?"OPENED":"CLOSED");}
function saveAnn(){let t=document.getElementById("annInput").value.trim();if(!t){alert("Type");return;}ANNOUNCE=t;localStorage.setItem("v3_ann",t);alert("Published!");}
function clearAnn(){ANNOUNCE="No announcement yet.";localStorage.setItem("v3_ann",ANNOUNCE);document.getElementById("annInput").value="";alert("Cleared");}

initPrograms();updateCounter();checkDeadline();renderTable();
applyTheme(THEME);
setInterval(checkDeadline,30000);