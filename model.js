(function(global){
'use strict';
const norm=v=>Math.hypot(...v),sub=(a,b)=>a.map((x,i)=>x-b[i]),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
function calculate(p){
if(!(p.L>0&&p.tip>0&&p.taper>0&&p.taper<45&&Number.isInteger(p.N)&&p.N>=2))throw Error('尺寸或单元数量无效');
let lo=1e-7,hi=3,target=Math.tan(p.taper*Math.PI/360);for(let i=0;i<90;i++){let b=(lo+hi)/2;if(b*Math.tanh(Math.PI*b)/Math.sqrt(1+b*b)<target)lo=b;else hi=b}const b=(lo+hi)/2,tanh=Math.tanh(Math.PI*b),rt=p.tip/(2*tanh),theta=Math.log1p(p.L*b/(rt*Math.sqrt(1+b*b)))/b,step=theta/p.N,growth=Math.exp(b*step),inner=2/(1+Math.exp(2*Math.PI*b));
const point=(r,t)=>[r*Math.cos(t),r*Math.sin(t)];const units=[];let total=0;for(let j=0;j<p.N;j++){let t0=(p.N-j)*step,t1=t0-step,r0=rt*Math.exp(b*t0),r1=rt*Math.exp(b*t1),c0=point(r0,t0),c1=point(r1,t1),v=sub(c1,c0),l=norm(v),e=v.map(x=>x/l),perp=[-e[1],e[0]],i0=point(r0*inner,t0),i1=point(r1*inner,t1),d0=sub(i0,c0),d1=sub(i1,c0),x0=dot(d0,e),x1=dot(d1,e),h0=Math.abs(dot(d0,perp)),h1=Math.abs(dot(d1,perp));units.push({index:j+1,z:total,l,x0,x1,h0,h1,D0:2*h0,D1:2*h1,radialD0:2*r0*tanh,radialD1:2*r1*tanh});total+=l;}
return {b,theta,step,growth,rt,base:p.tip+2*p.L*target,total,units,params:p};
}
function geometry(m,curl,az){let angle=0,p=[0,0,0],frames=[{p:p.slice(),angle:0}],points=[];for(let i=0;i<m.units.length;i++){let u=m.units[i];if(i)angle+=curl*m.step;points.push({p:p.slice(),angle,u});p=[p[0]+u.l*Math.sin(angle)*Math.cos(az),p[1]+u.l*Math.sin(angle)*Math.sin(az),p[2]+u.l*Math.cos(angle)];frames.push({p:p.slice(),angle})}return {points,frames,tip:p};}
global.SpiModel={calculate,geometry};if(typeof module!=='undefined')module.exports=global.SpiModel;
})(typeof window!=='undefined'?window:globalThis);
