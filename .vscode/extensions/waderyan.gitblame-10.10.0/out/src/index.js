"use strict";var O=Object.defineProperty;var At=Object.getOwnPropertyDescriptor;var kt=Object.getOwnPropertyNames;var Bt=Object.prototype.hasOwnProperty;var St=(e,t)=>{for(var i in t)O(e,i,{get:t[i],enumerable:!0})},Dt=(e,t,i,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of kt(t))!Bt.call(e,o)&&o!==i&&O(e,o,{get:()=>t[o],enumerable:!(r=At(t,o))||r.enumerable});return e};var Mt=e=>Dt(O({},"__esModule",{value:!0}),e);var ae={};St(ae,{activate:()=>se});module.exports=Mt(ae);var It=require("vscode");var Rt=require("node:path"),a=require("vscode");var u=e=>e?.document.uri.scheme==="file";var V=require("vscode"),l=()=>V.window.activeTextEditor,N="N:-1",$=({document:e,selection:t})=>e.uri.scheme!=="file"?N:`${e.fileName}:${t.active.line}`;var W=require("vscode"),C=(e,t=[])=>Promise.resolve(W.window.showInformationMessage(e,...t)),y=(e,...t)=>Promise.resolve(W.window.showErrorMessage(e,...t));var _=require("vscode"),s=e=>_.workspace.getConfiguration("gitblame").get(e);var Q=require("vscode"),Ot=1e3,K=60*Ot,q=60*K,Y=24*q,X=365.25*Y,Nt=X/12,$t=[["year",X],["month",Nt],["day",Y],["hour",q],["minute",K]],G=(e,t)=>{let i=e.valueOf()-t.valueOf(),r=new Intl.RelativeTimeFormat(Q.env.language);for(let[o,n]of $t)if(i>n)return r.format(-1*Math.round(i/n),o);return"right now"};var F=({author:e,committer:t,hash:i,summary:r})=>{let o=new Date,n=({date:M})=>M.toISOString().slice(0,10),m=G(o,e.date),b=G(o,t.date),h=(M,Lt)=>(Ut="")=>M.substr(0,Number.parseInt(Ut||Lt,10));return{"author.mail":e.mail,"author.name":e.name,"author.timestamp":e.timestamp,"author.tz":e.tz,"author.date":n(e),"committer.mail":t.mail,"committer.name":t.name,"committer.timestamp":t.timestamp,"committer.tz":t.tz,"committer.date":n(t),"commit.hash":h(i,"64"),"commit.hash_short":h(i,"7"),"commit.summary":h(r,"65536"),"time.ago":m,"time.c_ago":b}};var Wt=(e,t,i)=>r=>{let o=e.indexOf(r,t);return o===-1||o>i?i:o},Gt=(e,t)=>(i,r)=>r===i||t===i?"":e.substring(i+1,r);function zt(e,t,i){let r=t.indexOf("}",i),o=Wt(t,i,r),n=Gt(t,r),m=o(","),b=o("|"),h=t.substring(i,Math.min(m,b));return[e[h]??h,n(b,r),n(m,b)]}function*jt(e,t){let i=0,r=0,o=0;for(let n=0;n<e.length;n++)if(o===0&&e[n]==="$")o=2;else if(o===2&&e[n]==="{")o=1,r=n-1,yield[e.slice(i,r)],i=r;else if(o===2)o=0;else if(o===1){o=0;let m=e.indexOf("}",n);if(m===-1)break;yield zt(t,e,n),i=m+1}yield[e.slice(i)]}var Z=(e,t="")=>t==="u"?e.toUpperCase():t==="l"?e.toLowerCase():t?`${e}|${t}`:e,Ht=e=>e.replace(/\u202e/g,""),v=(e,t)=>{let i="";for(let[r,o,n]of jt(e,t))typeof r=="string"?i+=Z(r,o):i+=Z(r(n),o);return Ht(i)},J=e=>v(s("statusBarMessageFormat"),F(e)),tt=e=>v(s("inlineMessageFormat"),F(e));var p=require("vscode");function w(e,t=!1){if(t&&e==="HEAD")return!0;let i=e.length;return(i===40||i===64)&&/^[a-z0-9]+$/.test(e)}function d(e){let t=e.hash.length;return(t===40||t===64)&&/^0+$/.test(e.hash)}var E=class{statusBar;decorationType;configChange;ongoingViewUpdateRejects=new Set;constructor(){this.decorationType=p.window.createTextEditorDecorationType({}),this.statusBar=this.createStatusBarItem(),this.configChange=p.workspace.onDidChangeConfiguration(t=>{t.affectsConfiguration("gitblame")&&this.createStatusBarItem()})}set(t,i,r=!0){t?d(t)?(this.text(s("statusBarMessageNoCommit"),!1),i&&this.createLineDecoration(s("inlineMessageNoCommit"),i,r)):(this.text(J(t),!0),i&&this.createLineDecoration(tt(t),i,r)):this.clear()}clear(){this.text("",!1),this.removeLineDecoration()}activity(){this.text("$(extensions-refresh)",!1),this.statusBar.tooltip="git blame - Waiting for git blame response"}dispose(){this.statusBar?.dispose(),this.decorationType.dispose(),this.configChange.dispose()}command(){let t=s("statusBarMessageClickAction");return t==="Open tool URL"?"gitblame.online":t==="Open git show"?"gitblame.gitShow":"gitblame.quickInfo"}text(t,i){this.statusBar.text=`$(git-commit) ${t.trimEnd()}`,this.statusBar.tooltip=`git blame${i?"":" - No info about the current line"}`,this.statusBar.command=i?this.command():void 0}createStatusBarItem(){this.statusBar&&this.statusBar.dispose();let t=p.window.createStatusBarItem(p.StatusBarAlignment.Right,s("statusBarPositionPriority"));return t.show(),t}async createLineDecoration(t,i,r){if(!s("inlineMessageEnabled"))return;let o=s("inlineMessageMargin"),n=new p.Position(i.selection.active.line,Number.MAX_SAFE_INTEGER);this.removeLineDecoration(),r&&await this.delayUpdate(s("delayBlame"))&&i.setDecorations?.(this.decorationType,[{renderOptions:{after:{contentText:t,margin:`0 0 0 ${o}rem`,color:new p.ThemeColor("gitblame.inlineMessage")}},range:new p.Range(n,n)}])}removeLineDecoration(){l()?.setDecorations?.(this.decorationType,[])}preUpdate(t){if(this.clear(),!u(t))return!1;for(let i of this.ongoingViewUpdateRejects)i();return this.ongoingViewUpdateRejects.clear(),this.activity(),!0}async delayUpdate(t){if(t>0)try{return await new Promise((i,r)=>{this.ongoingViewUpdateRejects.add(r),setTimeout(()=>i(!0),t)})}catch{return!1}return!0}};var U=require("node:fs"),vt=require("vscode");var et=require("vscode"),c=class e{static instance;out;static getInstance(){return e.instance??=new e,e.instance}constructor(){this.out=et.window.createOutputChannel("Git Blame",{log:!0})}static error(t){t instanceof Error&&e.getInstance().out.error(t)}static info(t){e.getInstance().out.info(t)}dispose(){e.instance=void 0,this.out.dispose()}};var ht=require("node:fs/promises"),yt=require("node:path");var ot=require("node:child_process"),nt=require("node:fs/promises"),x=require("node:path"),st=require("vscode");var it=require("node:child_process");var rt=async(e,t,i={})=>(c.info(`${e} ${t.join(" ")}`),new Promise(r=>(0,it.execFile)(e,t,{...i,encoding:"utf8"},(o,n,m)=>{o||m?(c.error(o||m),r("")):r(n.trim())})));var g=(e,t=" ")=>{let i=e.indexOf(t[0]);return i===-1?[e,""]:[e.substr(0,i),e.substr(i+1).trim()]};var z=()=>{let e=st.extensions.getExtension("vscode.git");return e?.exports.enabled?e.exports.getAPI(1).git.path:"git"},f=(e,...t)=>rt(z(),t,{cwd:(0,x.dirname)(e)}),at=async e=>{let t=l();return u(t)?f(t.document.fileName,"ls-remote","--get-url",e):""},mt=async e=>{let t=l();if(!u(t))return"";let{fileName:i}=t.document,r=await f(i,"symbolic-ref","-q","--short","HEAD"),o=await f(i,"config",`branch.${r}.remote`);return f(i,"config",`remote.${o||e}.url`)},T=async e=>f(e,"rev-parse","--absolute-git-dir"),ct=(e,t)=>{let i=["blame","-C","--incremental","--",e];return s("ignoreWhitespace")&&i.splice(1,0,"-w"),t&&i.splice(1,0,"-S",t),c.info(`${z()} ${i.join(" ")}`),(0,ot.spawn)(z(),i,{cwd:(0,x.dirname)(e)})},lt=async e=>{let t=s("revsFile");if(t.length===0)return;let i=await T(e),r=(0,x.dirname)(i);return(await Promise.allSettled(t.map(o=>(0,x.join)(r,o)).map(o=>(0,nt.access)(o).then(()=>o)))).filter(o=>o.status==="fulfilled").map(o=>o.value)[0]},pt=async()=>{let e=l();if(!u(e))return"";let{fileName:t}=e.document;return f(t,"ls-files","--full-name","--",t)},ut=async e=>{let t=l();if(!u(t))return"";let i=await f(t.document.fileName,"rev-parse","--abbrev-ref",`${e}/HEAD`);return g(i,"/")[1]};var Vt=e=>({author:{mail:"",name:"",timestamp:"",date:new Date,tz:""},committer:{mail:"",name:"",timestamp:"",date:new Date,tz:""},hash:e,summary:""}),_t=e=>({commit:e,filename:""});function Qt(){return new Promise(setImmediate)}var Kt=25;async function*qt(e){let t=0;for(;t<e.length;){let i=e.indexOf(`
`,t);yield g(e.toString("utf8",t,i)),i%Kt===0&&await Qt(),t=i+1}}var Yt=(e,t,i)=>{t==="time"?(e.timestamp=i,e.date=new Date(Number.parseInt(i,10)*1e3)):t==="tz"||t==="mail"?e[t]=i:t===""&&(e.name=i)},Xt=(e,t,i)=>{let[r,o]=g(e,"-");(r==="author"||r==="committer")&&Yt(i[r],o,t)},Zt=(e,t)=>w(e)&&/^\d+ \d+ \d+$/.test(t),Jt=(e,t,i)=>{e==="summary"?i.summary=t:w(e)?i.hash=e:Xt(e,t,i)};function*te(e){let[t,i,r]=e.split(" ").map(Number);for(let o=0;o<r;o++)yield{source:t+o,result:i+o}}function*dt(e,t,i){if(!(e===void 0||t===void 0)){i.set(e.commit.hash,e.commit);for(let r of t)yield{...e,line:r}}}async function*ee(e,t){let i,r;for await(let[o,n]of qt(e))Zt(o,n)&&(i=_t(t.get(o)??Vt(o)),r=te(n)),i&&(o==="filename"?(i.filename=n,yield*dt(i,r,t)):Jt(o,n,i.commit));yield*dt(i,r,t)}async function*gt(e){let t=new Map;for await(let i of e??[])yield*ee(i,t)}async function ft(e){for await(let t of e??[])if(typeof t=="string")throw new Error(t)}var R=class{constructor(t){this.fileName=t}store;process;killed=!1;getBlame(){return this.store??=this.blame(),this.store}dispose(){this.process?.kill(),this.killed=!0}async*run(t){this.process=ct(t,await lt(t)),yield*gt(this.process?.stdout),await ft(this.process?.stderr)}async blame(){let t=new Map,i=await(0,ht.realpath)(this.fileName);try{for await(let r of this.run(i))t.set(r.line.result,r)}catch(r){c.error(r),this.dispose()}if(!this.killed)return(0,yt.relative)(this.fileName,i)?c.info(`Blamed "${i}" (resolved via symlink from "${this.fileName}")`):c.info(`Blamed "${i}"`),t}};var I=class{list=[];storage=new Map;processing=new Set;_maxParallel;constructor(t=2){this.maxParallel=t}add(t){return new Promise(i=>{this.storage.set(t,i),this.processing.size<this.maxParallel?this.startFunction(t):this.list.push(t)})}updateParalell(t){let i=this.maxParallel;this.maxParallel=t;let r=Math.max(0,this.maxParallel-i);for(let o=0;o<r;o++)this.runNext()}set maxParallel(t){this._maxParallel=t}get maxParallel(){return Math.max(1,Number(this._maxParallel))}startFunction(t){this.processing.add(t);let i=this.storage.get(t);this.storage.delete(t),i&&t().then(i).finally(()=>{this.processing.delete(t),this.runNext()})}runNext(){if(this.processing.size<this.maxParallel){let t=this.list.shift();t&&this.startFunction(t)}}};var L=class{files=new Map;fsWatchers=new Map;blameQueue=new I(s("parallelBlames"));configChange;constructor(){this.configChange=vt.workspace.onDidChangeConfiguration(t=>{t.affectsConfiguration("gitblame")&&this.blameQueue.updateParalell(s("parallelBlames"))})}async file(t){return this.get(t)}async getLine(t,i){let r=i+1;return(await this.get(t))?.get(r)}async removeFromRepository(t){for(let[i,r]of this.files)(await r)?.gitRoot===t&&this.remove(i)}async remove(t){(await(await this.files.get(t))?.file)?.dispose(),this.fsWatchers.get(t)?.close(),this.files.delete(t);let i=this.fsWatchers.get(t);i&&(this.fsWatchers.delete(t),i.close())}dispose(){for(let t of this.files.keys())this.remove(t);this.configChange.dispose()}async get(t){if(this.files.has(t))return(await this.files.get(t))?.store;let i=this.create(t).then(({file:r,gitRoot:o})=>r?(this.fsWatchers.set(t,(0,U.watch)(t,()=>{this.remove(t)})),{file:r,store:this.blameQueue.add(()=>r.getBlame()),gitRoot:o}):{file:r,store:Promise.resolve(void 0),gitRoot:o});return this.files.set(t,i),(await i)?.store}async create(t){try{await U.promises.access(t);let i=T(t);if(await i)return{gitRoot:await i,file:new R(t)}}catch{}return c.info(`Will not blame '${t}'. Outside the current workspace.`),{gitRoot:"",file:void 0}}};var xt=require("node:fs"),k=require("node:path");var A=class{heads=new Map;filesWithFoundHeads=new Set;callback=()=>{};onChange(t){this.callback=t}async addFile(t){if(this.filesWithFoundHeads.has(t))return;this.filesWithFoundHeads.add(t);let i=await T(t),r=this.normalizeWindowsDriveLetter(i);if(this.heads.has(r)===!0||i==="")return;let n=(0,k.resolve)(r,"..");this.heads.set(r,(0,xt.watch)((0,k.join)(r,"HEAD"),{persistent:!1},()=>this.callback({gitRoot:r,repositoryRoot:n})))}dispose(){for(let[,t]of this.heads)t.close();this.heads.clear(),this.filesWithFoundHeads.clear(),this.callback=()=>{}}normalizeWindowsDriveLetter(t){return t.length===0?"":t[0].toLowerCase()+t.substr(1)}};var Ft=require("node:url"),Et=require("vscode");var bt=require("node:url"),wt=e=>{let t;try{t=new bt.URL(e)}catch{return!1}return t.href!==e||t.protocol!=="http:"&&t.protocol!=="https:"?!1:!!(t.hostname&&t.pathname)};var Tt=require("node:url");var j=e=>e.replace(/\.git$/i,""),B=e=>j(e).replace(/^([a-z-]+:\/\/)?([\w%:\\]+?@)?/i,"").replace(/:([a-z_.~+%-][a-z0-9_.~+%-]+)\/?/i,"/$1/");var Pt=e=>{let t=/^(https?):/.exec(e)?.[1],i;try{i=new Tt.URL(`${t??"https"}://${B(e)}`)}catch{return}return i.port=t?i.port:"",i};var Ct=e=>/([a-zA-Z0-9_~%+.-]*?)(\.git)?$/.exec(e)?.[1]??"";var H=(e,t,i="/")=>e.split(i).filter(o=>!!o)[Number(t)]||"invalid-index",ie=({hostname:e})=>t=>t===""?e:H(e,t,"."),re=e=>{if(/^[a-z]+?@/.test(e)){let[,t]=g(e,":");return(i="")=>i===""?`/${t}`:H(t,i)}try{let{pathname:t}=new Ft.URL(e);return(i="")=>i===""?t:H(t,i)}catch{return()=>"no-remote-url"}},oe=e=>(s("pluralWebPathSubstrings")??[]).some(t=>e.includes(t)),ne=async e=>{let t=s("remoteName"),i=await at(t);if(i===t)return;let r=B(await mt(t)),o=Pt(r),n=await pt(),m=await ut(t);return{hash:e.commit.hash,"tool.protocol":o?.protocol??"https:","tool.commitpath":`/commit${oe(r)?"s":""}/`,"project.name":Ct(i),"project.remote":r,"project.defaultbranch":m,"gitorigin.hostname":o?ie(o):"no-origin-url","gitorigin.path":re(j(i)),"gitorigin.port":o?.port?`:${o.port}`:"","file.path":n,"file.path.result":n,"file.path.source":e.filename,"file.line":e.line.result.toString(),"file.line.result":e.line.result.toString(),"file.line.source":e.line.source.toString()}},S=async e=>{if(!e||d(e.commit))return;let t=await ne(e);if(t===void 0)return;let i=v(s("commitUrl"),t);if(wt(i))return Et.Uri.parse(i,!0);y(`Malformed gitblame.commitUrl: '${i}' from '${s("commitUrl")}'`)};var D=class{disposable;blame;view;headWatcher;constructor(){this.blame=new L,this.view=new E,this.headWatcher=new A,this.disposable=this.setupListeners(),this.updateView()}async blameLink(){let t=await S(await this.commit(!0));t?a.commands.executeCommand("vscode.open",t):y("Empty gitblame.commitUrl")}async showMessage(){let t=await this.commit();if(!t||d(t.commit)){this.view.clear();return}let i=v(s("infoMessageFormat"),F(t.commit)),r=await S(t),o=[];r&&o.push({title:"Online",action(){a.commands.executeCommand("vscode.open",r)}}),o.push({title:"Terminal",action:()=>this.runGitShow()}),this.view.set(t.commit,l()),(await C(i,o))?.action()}async copyHash(){let t=await this.commit(!0);t&&!d(t.commit)&&(await a.env.clipboard.writeText(t.commit.hash),C("Copied hash"))}async copyToolUrl(){let t=await this.commit(!0),i=await S(t);i?(await a.env.clipboard.writeText(i.toString()),C("Copied tool URL")):y("gitblame.commitUrl config empty")}async runGitShow(){let t=l();if(!u(t))return;let r=(await this.commit(!0))?.commit.hash??"HEAD";if(!w(r,!0))return;let o=s("ignoreWhitespace")?"-w ":"",n=a.window.createTerminal({name:`Git Blame: git show ${r}`,iconPath:new a.ThemeIcon("git-commit"),isTransient:!0,cwd:(0,Rt.dirname)(t.document.fileName)});n.sendText(`git show ${o}${r}; exit 0`,!0),n.show()}dispose(){this.view.dispose(),this.disposable.dispose(),this.blame.dispose(),this.headWatcher.dispose()}setupListeners(){let t=i=>{let{scheme:r}=i.document.uri;(r==="file"||r==="untitled")&&this.updateView(i)};return this.headWatcher.onChange(({repositoryRoot:i})=>this.blame.removeFromRepository(i)),a.Disposable.from(a.window.onDidChangeActiveTextEditor(i=>{u(i)?(this.view.activity(),this.blame.file(i.document.fileName),t(i)):this.view.clear()}),a.window.onDidChangeTextEditorSelection(({textEditor:i})=>{t(i)}),a.workspace.onDidSaveTextDocument(()=>{this.updateView()}),a.workspace.onDidCloseTextDocument(i=>{this.blame.remove(i.fileName)}),a.workspace.onDidChangeTextDocument(({document:i})=>{let r=l();r?.document===i&&this.updateView(r,!1)}))}async updateView(t=l(),i=!0){if(!this.view.preUpdate(t))return;this.headWatcher.addFile(t.document.fileName);let r=$(t),o=await this.blame.getLine(t.document.fileName,t.selection.active.line),n=l();if(!u(n))return;let m=$(n);(r===m||m===N)&&this.view.set(o?.commit,t,i)}async commit(t=!1){let i=()=>y("Unable to blame current line"),r=l();if(!u(r)){i();return}t||this.view.activity(),this.headWatcher.addFile(r.document.fileName);let o=await this.blame.getLine(r.document.fileName,r.selection.active.line);return o||i(),o}};var P=(e,t)=>It.commands.registerCommand(`gitblame.${e}`,t),se=e=>{let t=new D;e.subscriptions.push(t,c.getInstance(),P("quickInfo",()=>{t.showMessage()}),P("online",()=>{t.blameLink()}),P("addCommitHashToClipboard",()=>{t.copyHash()}),P("addToolUrlToClipboard",()=>{t.copyToolUrl()}),P("gitShow",()=>{t.runGitShow()}))};