(function(){
'use strict';
const $=id=>document.getElementById(id),num=(x,n=3)=>Number(x).toFixed(n);let lastModel,lastParams,selected=0,lastSVG='';
function render(){const m=lastModel,p=lastParams;if(!m)return;const u=m.units[selected],mid=(u.x0+u.x1)/2,envD=u.radialD0+(u.radialD1-u.radialD0)*mid/u.l,pcd=p.eta*envD,core=p.spine*envD;
let out=[];const put=s=>out.push(s),txt=(x,y,s,size=13,anchor='middle',col='#18262e')=>put(`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${col}">${s}</text>`),line=(x1,y1,x2,y2,col='#8a9ba4',dash='')=>put(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="1" ${dash?'stroke-dasharray="'+dash+'"':''}/>`);
function dimH(x1,x2,y,label,ext1,ext2){line(x1,ext1,x1,y+5);line(x2,ext2,x2,y+5);put(`<path d="M${x1},${y} H${x2}" fill="none" stroke="#147e92" marker-start="url(#dimArrow)" marker-end="url(#dimArrow)"/>`);txt((x1+x2)/2,y-7,label,12,'middle','#116a7c')}
function dimV(x,y1,y2,label,from){line(from,y1,x+5,y1);line(from,y2,x+5,y2);put(`<path d="M${x},${y1} V${y2}" fill="none" stroke="#147e92" marker-start="url(#dimArrow)" marker-end="url(#dimArrow)"/>`);put(`<text x="${x-8}" y="${(y1+y2)/2}" transform="rotate(-90 ${x-8} ${(y1+y2)/2})" font-size="12" text-anchor="middle" fill="#116a7c">${label}</text>`)}
put('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 810" role="img" aria-label="单节轴向剖面、孔位俯视和整臂展开尺寸图"><defs><marker id="dimArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse"><path d="M6 3 L0 0 L0 6 Z" fill="#147e92"/></marker></defs><rect width="1000" height="810" fill="#f8fafb"/>');
txt(28,30,`第 ${selected+1} 节 / ${p.N} 节 · 根部编号 1`,18,'start');txt(28,53,'实体轮廓为实线；理论渐缩包络为虚线；尺寸与导出的 CAD 使用同一组数据。',12,'start','#52636e');
const S=Math.min(370/u.l,235/u.D0),x=110,y=222,X=z=>x+z*S,Y=r=>y-r*S,profile=[[0,0],[u.x0,u.h0],[u.x1,u.h1],[u.l,0],[u.x1,-u.h1],[u.x0,-u.h0]];
put(`<path d="${profile.map(([z,r],i)=>(i?'L':'M')+X(z)+','+Y(r)).join(' ')} Z" fill="#dce6e9" stroke="#243b47" stroke-width="2"/>`);
// Draw the same tapered core included in the exported solid.
const c0=p.spine*u.radialD0/2,c1=p.spine*u.radialD1/2;put(`<path d="M${X(0)},${Y(c0)} L${X(u.l)},${Y(c1)} L${X(u.l)},${Y(-c1)} L${X(0)},${Y(-c0)} Z" fill="#a9d6c5" stroke="#37816b"/>`);
line(X(-u.l*.06),y,X(u.l*1.08),y,'#7f959e','8 4');line(X(0),Y(u.radialD0/2),X(u.l),Y(u.radialD1/2),'#b27736','6 4');line(X(0),Y(-u.radialD0/2),X(u.l),Y(-u.radialD1/2),'#b27736','6 4');
const top=y-u.h0*S,bottom=y+u.h0*S;dimH(X(0),X(u.l),405,`P 节距 = ${num(u.l)}`,y,y);dimH(X(u.x0),X(u.x1),77,`C 圆柱段长 = ${num(u.x1-u.x0)}`,top,top);dimH(X(0),X(u.x0),371,`A = ${num(u.x0)}`,y,bottom);dimH(X(u.x1),X(u.l),343,`B = ${num(u.l-u.x1)}`,bottom,y);dimV(66,top,bottom,`D 实体最大外径 = ${num(u.D0)}`,X(u.x0));
const xm=X(mid);line(xm,82,xm,355,'#52636e','4 4');txt(xm+8,97,'S—S',12,'start');txt(110,444,'侧视轴向剖面：P = A + C + B；斜面由 A、B 和 D 唯一确定。',12,'start');
// Section S-S is through the middle of the cylindrical portion.
const cx=762,cy=226,R=122,rs=R/(u.D0/2);txt(cx,79,'S—S 截面 / 看向末端',15);put(`<circle cx="${cx}" cy="${cy}" r="${R}" fill="#dce6e9" stroke="#243b47" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${pcd/2*rs}" fill="none" stroke="#8a9ba4" stroke-dasharray="6 4"/><circle cx="${cx}" cy="${cy}" r="${core/2*rs}" fill="#a9d6c5" stroke="#37816b"/>`);line(cx-R-12,cy,cx+R+12,cy,'#8a9ba4','8 4');line(cx,cy-R-12,cx,cy+R+12,'#8a9ba4','8 4');
for(let k=0;k<p.cables;k++){let a=2*Math.PI*k/p.cables,hx=cx+pcd/2*rs*Math.cos(a),hy=cy-pcd/2*rs*Math.sin(a);put(`<circle cx="${hx}" cy="${hy}" r="${p.hole/2*rs}" fill="#f8fafb" stroke="#116a7c" stroke-width="1.5"/>`);txt(hx+12,hy-10,String(k+1),12,'start')}
// Attach each dimension to its feature instead of relying on the text legend.
const holeAngle=2*Math.PI/p.cables,holeX=cx+pcd/2*rs*Math.cos(holeAngle),holeY=cy-pcd/2*rs*Math.sin(holeAngle),holeR=p.hole/2*rs;
put(`<path data-dimension="tendon-hole" d="M${holeX-holeR*.7},${holeY-holeR*.7} L615,113 H564" fill="none" stroke="#147e92" marker-start="url(#dimArrow)"/>`);
txt(564,101,`${p.cables} × Ø${num(p.hole,2)} 绳孔`,12,'start','#116a7c');
const pcdAngle=200*Math.PI/180,pcdX=cx+pcd/2*rs*Math.cos(pcdAngle),pcdY=cy-pcd/2*rs*Math.sin(pcdAngle);
put(`<path data-dimension="pitch-circle" d="M${pcdX},${pcdY} L616,282 H535" fill="none" stroke="#147e92" marker-start="url(#dimArrow)"/>`);
txt(625,302,`孔中心圆 Ø${num(pcd)}`,12,'end','#116a7c');
const coreR=core/2*rs;
put(`<path data-dimension="solid-core" d="M${cx+coreR*.7},${cy-coreR*.7} L914,269 H968" fill="none" stroke="#37816b" marker-start="url(#dimArrow)"/>`);
txt(968,288,'实心柔性轴',12,'end','#286c58');txt(968,307,`Ød = ${num(core)}`,12,'end','#286c58');
txt(cx,375,`${p.cables} × Ø${num(p.hole,2)} 贯穿孔 · 均布 ${num(360/p.cables,0)}°`,13);txt(cx,398,`孔中心圆 PCD = ${num(pcd)}`,13);txt(cx,421,`中心柔性轴 Ød = ${num(core)}`,13);txt(cx,444,'PCD、轴径取 S—S 截面；沿轴线均随包络渐缩。',11);
line(28,468,972,468,'#c7d2d8');txt(28,497,'整臂展开 / 根部 → 末端',16,'start');
const scale=850/m.total,ox=85,oy=610;
for(let v of m.units){let pts=[[0,0],[v.x0,v.h0],[v.x1,v.h1],[v.l,0],[v.x1,-v.h1],[v.x0,-v.h0]];put(`<path d="${pts.map(([z,r],i)=>(i?'L':'M')+(ox+(v.z+z)*scale)+','+(oy-r*scale)).join(' ')} Z" fill="${v.index===selected+1?'#a9d6c5':'#dce6e9'}" stroke="#243b47" stroke-width=".8"/>`)}
line(ox,oy,ox+m.total*scale,oy,'#37816b');line(ox,oy-m.base/2*scale,ox+m.total*scale,oy-p.tip/2*scale,'#b27736','6 4');line(ox,oy+m.base/2*scale,ox+m.total*scale,oy+p.tip/2*scale,'#b27736','6 4');dimH(ox,ox+m.total*scale,718,`展开中心弦长 = ${num(m.total)} mm`,oy,oy);dimV(50,oy-m.base/2*scale,oy+m.base/2*scale,`根包络 Ø${num(m.base)}`,ox);
const tx=ox+m.total*scale,ty=oy-p.tip/2*scale;line(tx,ty,965,570,'#b27736');txt(966,555,`Dₜ = ${num(p.tip)}`,12,'end','#86501c');txt(966,575,'尖端虚线包络',11,'end','#86501c');
txt(28,759,`根单元实体最大外径：${num(m.units[0].D0)} mm；末单元实体最大外径：${num(m.units.at(-1).D0)} mm。`,13,'start');txt(28,784,`根→尖缩放 q = ${num(1/m.growth,6)}；第 i 节主体 = 第 1 节主体 × q^(i−1)。绳孔直径固定，不随主体缩放。`,13,'start');put('</svg>');lastSVG=out.join('');$('drawing').innerHTML=lastSVG;
$('dimensionValues').innerHTML=`<div class="dim-grid"><span>P 节距：${num(u.l)}</span><span>D 最大外径：${num(u.D0)}</span><span>A 根侧斜面轴长：${num(u.x0)}</span><span>C 圆柱段轴长：${num(u.x1-u.x0)}</span><span>B 尖侧斜面轴长：${num(u.l-u.x1)}</span><span>孔中心圆：Ø${num(pcd)}</span><span>绳孔直径：Ø${num(p.hole,2)}</span><span>实心柔性轴：Ø${num(core)}</span></div>`;
$('scaleRelation').textContent=`建一次主体母版即可：A、B、C、D、P 按 q = ${num(1/m.growth,6)} 连续缩放；先排主体，再生成贯穿绳孔及柔性轴。绳孔 Ø${num(p.hole,2)} 固定。`;
}
$('unitPick').onchange=()=>{selected=+$('unitPick').value;render()};$('exportDrawing').onclick=()=>{let a=document.createElement('a'),url=URL.createObjectURL(new Blob([lastSVG],{type:'image/svg+xml'}));a.href=url;a.download=`spirob-unit-${selected+1}-dimensions.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
window.DimensionSheet={update(m,p){lastModel=m;lastParams=p;selected=Math.min(selected,p.N-1);$('unitPick').innerHTML=m.units.map((u,i)=>`<option value="${i}" ${i===selected?'selected':''}>第 ${i+1} 节${i===0?' · 根部':i===p.N-1?' · 末端':''}</option>`).join('');render()}};
})();
