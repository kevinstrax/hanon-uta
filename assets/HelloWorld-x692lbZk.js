import{_ as s,a as m,d as b,b as I,F as w,r as G,o as L,e as U,f as o,w as g,g as x,t as T,h as y,u as F,i as j,j as W,k as S,l as K,m as $,n as Q,p as X,q as Y,s as k,v as Z,x as C,y as N,z as O,A as J,B as tt,C as st,D as et,S as q,E as at,G as ot,H as nt}from"./index-D9JEFkvJ.js";function _t(a){if(!a)return 0;const _=new Date(a.replace(/-/g,"/"));return isNaN(_.getTime())?(console.log("Invalid date, %s",a),0):Math.floor(_.getTime()/1e3)}function rt(a){const[_,t,i]=a.split(":").map(Number);return _*3600+t*60+i}async function it(a){return dt(a).then(lt)}async function dt(a){const _=Object.assign({"/src/assets/data/Clara/2025-04-09.json":()=>s(()=>import("./Clara-data-KWabhxK5.js"),[]),"/src/assets/data/Gabu/2024-12-27.json":()=>s(()=>import("./Gabu-data-Dm6ChUUY.js").then(t=>t._),[]),"/src/assets/data/Gabu/2025-01-06.json":()=>s(()=>import("./Gabu-data-Dm6ChUUY.js").then(t=>t.a),[]),"/src/assets/data/Gabu/2025-01-12.json":()=>s(()=>import("./Gabu-data-Dm6ChUUY.js").then(t=>t.b),[]),"/src/assets/data/Gabu/2025-01-25.json":()=>s(()=>import("./Gabu-data-Dm6ChUUY.js").then(t=>t.c),[]),"/src/assets/data/Gabu/2025-02-09.json":()=>s(()=>import("./Gabu-data-Dm6ChUUY.js").then(t=>t.d),[]),"/src/assets/data/Gabu/2025-02-14.json":()=>s(()=>import("./Gabu-data-Dm6ChUUY.js").then(t=>t.e),[]),"/src/assets/data/Gabu/2025-03-01.json":()=>s(()=>import("./Gabu-data-Dm6ChUUY.js").then(t=>t.f),[]),"/src/assets/data/Gabu/2025-03-07.json":()=>s(()=>import("./Gabu-data-Dm6ChUUY.js").then(t=>t.g),[]),"/src/assets/data/Gabu/2025-04-06.json":()=>s(()=>import("./Gabu-data-Dm6ChUUY.js").then(t=>t.h),[]),"/src/assets/data/Gabu/2025-04-12.json":()=>s(()=>import("./Gabu-data-Dm6ChUUY.js").then(t=>t.i),[]),"/src/assets/data/Hanon/2024-03-03.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t._),[]),"/src/assets/data/Hanon/2024-03-11.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a),[]),"/src/assets/data/Hanon/2024-03-14.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.b),[]),"/src/assets/data/Hanon/2024-03-16.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.c),[]),"/src/assets/data/Hanon/2024-03-21.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.d),[]),"/src/assets/data/Hanon/2024-03-29.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.e),[]),"/src/assets/data/Hanon/2024-04-10.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.f),[]),"/src/assets/data/Hanon/2024-04-14.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.g),[]),"/src/assets/data/Hanon/2024-04-18.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.h),[]),"/src/assets/data/Hanon/2024-04-20.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.i),[]),"/src/assets/data/Hanon/2024-04-22.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.j),[]),"/src/assets/data/Hanon/2024-04-26.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.k),[]),"/src/assets/data/Hanon/2024-04-30.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.l),[]),"/src/assets/data/Hanon/2024-05-02_1.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.m),[]),"/src/assets/data/Hanon/2024-05-02_2.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.n),[]),"/src/assets/data/Hanon/2024-05-04.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.o),[]),"/src/assets/data/Hanon/2024-05-06.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.p),[]),"/src/assets/data/Hanon/2024-05-11.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.q),[]),"/src/assets/data/Hanon/2024-05-16.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.r),[]),"/src/assets/data/Hanon/2024-05-18.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.s),[]),"/src/assets/data/Hanon/2024-05-20.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.t),[]),"/src/assets/data/Hanon/2024-05-24.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.u),[]),"/src/assets/data/Hanon/2024-05-28.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.v),[]),"/src/assets/data/Hanon/2024-05-31.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.w),[]),"/src/assets/data/Hanon/2024-06-04.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.x),[]),"/src/assets/data/Hanon/2024-06-10.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.y),[]),"/src/assets/data/Hanon/2024-06-14.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.z),[]),"/src/assets/data/Hanon/2024-06-15.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.A),[]),"/src/assets/data/Hanon/2024-06-18.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.B),[]),"/src/assets/data/Hanon/2024-06-23.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.C),[]),"/src/assets/data/Hanon/2024-06-28.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.D),[]),"/src/assets/data/Hanon/2024-06-29.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.E),[]),"/src/assets/data/Hanon/2024-07-19.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.F),[]),"/src/assets/data/Hanon/2024-07-21.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.G),[]),"/src/assets/data/Hanon/2024-07-24.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.H),[]),"/src/assets/data/Hanon/2024-07-26.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.I),[]),"/src/assets/data/Hanon/2024-07-30.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.J),[]),"/src/assets/data/Hanon/2024-08-03.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.K),[]),"/src/assets/data/Hanon/2024-08-04.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.L),[]),"/src/assets/data/Hanon/2024-08-08.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.M),[]),"/src/assets/data/Hanon/2024-08-15.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.N),[]),"/src/assets/data/Hanon/2024-08-17.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.O),[]),"/src/assets/data/Hanon/2024-08-18.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.P),[]),"/src/assets/data/Hanon/2024-08-19.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.Q),[]),"/src/assets/data/Hanon/2024-08-22.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.R),[]),"/src/assets/data/Hanon/2024-08-25.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.S),[]),"/src/assets/data/Hanon/2024-08-30.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.T),[]),"/src/assets/data/Hanon/2024-09-02.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.U),[]),"/src/assets/data/Hanon/2024-09-04.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.V),[]),"/src/assets/data/Hanon/2024-09-06.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.W),[]),"/src/assets/data/Hanon/2024-09-11.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.X),[]),"/src/assets/data/Hanon/2024-09-12.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.Y),[]),"/src/assets/data/Hanon/2024-09-16.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.Z),[]),"/src/assets/data/Hanon/2024-09-18.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.$),[]),"/src/assets/data/Hanon/2024-09-23.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a0),[]),"/src/assets/data/Hanon/2024-09-27.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a1),[]),"/src/assets/data/Hanon/2024-09-30.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a2),[]),"/src/assets/data/Hanon/2024-10-01.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a3),[]),"/src/assets/data/Hanon/2024-10-04.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a4),[]),"/src/assets/data/Hanon/2024-10-05.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a5),[]),"/src/assets/data/Hanon/2024-10-11.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a6),[]),"/src/assets/data/Hanon/2024-10-17.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a7),[]),"/src/assets/data/Hanon/2024-10-21.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a8),[]),"/src/assets/data/Hanon/2024-10-24.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a9),[]),"/src/assets/data/Hanon/2024-10-26.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aa),[]),"/src/assets/data/Hanon/2024-10-29.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ab),[]),"/src/assets/data/Hanon/2024-10-30.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ac),[]),"/src/assets/data/Hanon/2024-11-01.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ad),[]),"/src/assets/data/Hanon/2024-11-04.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ae),[]),"/src/assets/data/Hanon/2024-11-07.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.af),[]),"/src/assets/data/Hanon/2024-11-11.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ag),[]),"/src/assets/data/Hanon/2024-11-15.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ah),[]),"/src/assets/data/Hanon/2024-11-19.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ai),[]),"/src/assets/data/Hanon/2024-11-22.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aj),[]),"/src/assets/data/Hanon/2024-11-30.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ak),[]),"/src/assets/data/Hanon/2024-12-06.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.al),[]),"/src/assets/data/Hanon/2024-12-08.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.am),[]),"/src/assets/data/Hanon/2024-12-11.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.an),[]),"/src/assets/data/Hanon/2024-12-12.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ao),[]),"/src/assets/data/Hanon/2024-12-20.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ap),[]),"/src/assets/data/Hanon/2024-12-22.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aq),[]),"/src/assets/data/Hanon/2024-12-25.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ar),[]),"/src/assets/data/Hanon/2024-12-26.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.as),[]),"/src/assets/data/Hanon/2024-12-28.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.at),[]),"/src/assets/data/Hanon/2024-12-28_2.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.au),[]),"/src/assets/data/Hanon/2025-01-11.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.av),[]),"/src/assets/data/Hanon/2025-01-12.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aw),[]),"/src/assets/data/Hanon/2025-01-17.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ax),[]),"/src/assets/data/Hanon/2025-01-18.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.ay),[]),"/src/assets/data/Hanon/2025-01-18_2.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.az),[]),"/src/assets/data/Hanon/2025-01-23.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aA),[]),"/src/assets/data/Hanon/2025-01-25.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aB),[]),"/src/assets/data/Hanon/2025-01-27.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aC),[]),"/src/assets/data/Hanon/2025-01-29.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aD),[]),"/src/assets/data/Hanon/2025-01-31.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aE),[]),"/src/assets/data/Hanon/2025-02-01.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aF),[]),"/src/assets/data/Hanon/2025-02-07.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aG),[]),"/src/assets/data/Hanon/2025-02-14.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aH),[]),"/src/assets/data/Hanon/2025-02-15.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aI),[]),"/src/assets/data/Hanon/2025-02-17.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aJ),[]),"/src/assets/data/Hanon/2025-02-21.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aK),[]),"/src/assets/data/Hanon/2025-02-23.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aL),[]),"/src/assets/data/Hanon/2025-02-24-.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aM),[]),"/src/assets/data/Hanon/2025-02-24.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aN),[]),"/src/assets/data/Hanon/2025-02-25.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aO),[]),"/src/assets/data/Hanon/2025-02-27.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aP),[]),"/src/assets/data/Hanon/2025-02-28.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aQ),[]),"/src/assets/data/Hanon/2025-02-28_.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aR),[]),"/src/assets/data/Hanon/2025-03-01.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aS),[]),"/src/assets/data/Hanon/2025-03-02.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aT),[]),"/src/assets/data/Hanon/2025-03-09.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aU),[]),"/src/assets/data/Hanon/2025-03-12.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aV),[]),"/src/assets/data/Hanon/2025-03-13.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aW),[]),"/src/assets/data/Hanon/2025-03-18.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aX),[]),"/src/assets/data/Hanon/2025-04-09.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aY),[]),"/src/assets/data/Hanon/2025-04-11.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.aZ),[]),"/src/assets/data/Hanon/2025-04-16.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a_),[]),"/src/assets/data/Hanon/2025_03_10.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.a$),[]),"/src/assets/data/Hanon/2025_03_29.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.b0),[]),"/src/assets/data/Hanon/2025_03_30.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.b1),[]),"/src/assets/data/Hanon/2025_04_01.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.b2),[]),"/src/assets/data/Hanon/2025_04_02_1.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.b3),[]),"/src/assets/data/Hanon/2025_04_02_2.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.b4),[]),"/src/assets/data/Hanon/2025_04_04.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.b5),[]),"/src/assets/data/Hanon/2025_04_05.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.b6),[]),"/src/assets/data/Hanon/2025_04_13.json":()=>s(()=>import("./Hanon-data-C4puE9eV.js").then(t=>t.b7),[])});return await Promise.all(Object.entries(_).filter(([t])=>t.includes(`/${a}/`)).map(async([t,i])=>(await i()).default))}function ut(a,_){const t=Number(a.ref_video_publish_date_ts??0),i=Number(_.ref_video_publish_date_ts??0);if(t>i)return-1;if(t<i)return 1;const d=Number(a.video_offset_ts??0),e=Number(_.video_offset_ts??0);return d-e}function ct(a){a.sort(ut)}function lt(a){const _=[];return a.forEach(t=>{mt(t.song_timeline).forEach(i=>{let d=rt(i.time),e={ref_video_title:t.video_title,ref_video_artist:t.video_artist,ref_video_url:`https://www.youtube.com/watch?v=${t.video_id}&t=${d}s`,ref_video_embed_url:`https://www.youtube.com/embed/${t.video_id}`,ref_video_thumbnail_url:`https://img.youtube.com/vi/${t.video_id}/sddefault.jpg`,ref_video_thumbnail_lqip_url:`https://img.youtube.com/vi/${t.video_id}/mqdefault.jpg`,ref_video_publish_date_ts:_t(t.video_publish_date_str),song_origin_artist:i.artist,song_title:i.title,song_start_time:i.time,video_offset_ts:d};if(Et(e))_.push(e);else{if(e.song_title.includes("はのは")||e.song_title.includes("スパチャ読み")||e.song_title.includes("エンドカード")||e.song_title.includes("END")||e.song_title.includes("こんばんは"))return;console.log("filtered song: %s",e.song_title)}})}),ct(_),_}function Et(a){return!(!a.song_origin_artist||a.song_origin_artist.includes("Cパート")&&(a.song_title==="END"||a.song_title==="ED")||a.song_title==="雑談")}function mt(a){const _=a.split(`
`).filter(d=>d.trim()!==""),t=[],i=/^((?:\d+:\d{2}:\d{2})(?:\s*~\s*\d+:\d{2}:\d{2})?)(?:[;；]\s*(?:\d+:\d{2}:\d{2})(?:\s*~\s*\d+:\d{2}:\d{2})?)*\s+(.+)/;for(const d of _){const e=d.match(i);if(!e)continue;const u=e[1];let c=e[2];c=c.replace(/^\d+\.\s*/,"");let[D,l]=c.includes("/")?c.split("/").map(v=>v.trim()):[c.trim(),""];l&&(l=l.replace(/\s*~?\d+:\d{2}:\d{2}.*$/,"").trim()),t.push({time:u,title:D,artist:l})}return t}const vt=(a,_,t)=>{const i=m(()=>typeof a=="string"?a:a.value.replace(/（非公式）/,"")),d=m(()=>{var e;return typeof _=="string"?_:((e=_.value)==null?void 0:e.replace(/非公式ファンサービス/,"ファン制作応援ツール"))??""});return{title:a,meta:[{name:"description",content:_},{property:"og:type",content:"website"},{property:"og:url",content:m(()=>window.location.href)},{property:"og:title",content:i},{property:"og:description",content:d},{property:"og:image",content:m(()=>{var e;return(e=t.value[0])==null?void 0:e.ref_video_thumbnail_url})},{name:"twitter:card",content:"summary"},{name:"twitter:title",content:i},{name:"twitter:description",content:d},{name:"twitter:image",content:m(()=>{var e;return(e=t.value[0])==null?void 0:e.ref_video_thumbnail_url})}]}},pt={class:"row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-1 g-2"},ht={class:"card h-100 hover-bg-light"},Tt={class:"card-img-top ratio ratio-16x9"},Dt=["href"],It=["alt","title"],Lt={class:"card-body"},Pt=["title"],jt={class:"card-text hover-text-light"},At=["title"],Vt={class:"card-text hover-text-light"},Rt=["title"],Ot={class:"card-text hover-text-light"},ft={class:"text-muted"},Ht=["href","title"],gt=b({__name:"SongsList",props:{paginatedSongs:{}},setup(a){const _=a;return(t,i)=>{const d=U("lazy");return L(),I("div",pt,[(L(!0),I(w,null,G(_.paginatedSongs,(e,u)=>(L(),I("div",{key:u},[o("div",ht,[o("div",Tt,[o("a",{href:e.ref_video_url,class:"d-flex align-items-center justify-content-center",target:"_blank"},[g(o("img",{alt:e.song_title,title:e.song_title,class:"img-fluid w-100"},null,8,It),[[d,{src:e.ref_video_thumbnail_url,loading:e.ref_video_thumbnail_lqip_url}]])],8,Dt)]),o("div",Lt,[o("h6",{class:"card-title hover-text-light text-truncate",title:e.song_title},[i[0]||(i[0]=o("i",{class:"fas fa-music"},null,-1)),x(" "+T(e.song_title),1)],8,Pt),o("p",jt,[o("small",{class:"text-muted d-block text-truncate",title:e.song_origin_artist},T(e.song_origin_artist),9,At)]),o("p",Vt,[o("small",{class:"text-muted card-subtitle multi-line-ellipsis-2",title:e.ref_video_title},T(e.ref_video_title),9,Rt)]),o("p",Ot,[o("small",ft,[o("a",{class:"text-decoration-none text-secondary",href:e.ref_video_url,title:e.song_title,target:"_blank"},"⤷ "+T(e.song_start_time),9,Ht)])])])])]))),128))])}}}),bt=y(gt,[["__scopeId","data-v-8e655d14"]]),wt={class:"mb-4"},xt={class:"quick-searches"},yt=["href"],St=b({__name:"QuickSearches",setup(a){const _=[{text:"世界一可愛い私 香鳴ハノン",query:"世界一可愛い私"},{text:"アイドル 歌ってみた",query:"アイドル"},{text:"夜に駆ける",query:"夜に駆ける"}],t="/hanon-uta/";return(i,d)=>(L(),I("footer",wt,[o("p",xt,[d[0]||(d[0]=x("クイック検索: ")),(L(),I(w,null,G(_,(e,u)=>o("a",{key:e.query,href:`${F(t)}?search=${encodeURIComponent(e.query)}`,class:"text-nowrap"},T(e.text),9,yt)),64))])]))}}),$t=y(St,[["__scopeId","data-v-98d83f2a"]]),kt={class:"row my-4 mt-0 clearfix"},Ct={class:"input-group"},Nt={key:0,class:"text-center text-muted small mt-4 mb-2 d-flex justify-content-center align-items-center gap-2"},qt=["max"],Gt={class:"text-center mb-4"},Bt=b({__name:"HelloWorld",props:{vtuber:{}},setup(a){const _=a,t=j([]),i=W(),d=K(),e=et();S(async()=>{try{i.startSongsLoading(),t.value=await it(_.vtuber)}finally{i.completeLoading()}});const u=j(d.query.search||""),c=j(1),D=j(nt),l=j(1);$(()=>d.query.search,r=>{u.value=r||""}),$(u,r=>{e.push({name:d.name,query:{search:r||void 0}}),r&&r.trim()!==""&&(c.value=l.value=1)});const v=m(()=>{if(!u.value)return t.value;const r=u.value.trim().toLowerCase();return r===""?t.value:t.value.map(E=>{const h=E.song_title.toLowerCase(),H=E.song_origin_artist.toLowerCase();let P=0;return(h===r||H===r)&&(P+=100),h.startsWith(r)&&(P+=50),H.startsWith(r)&&(P+=30),h.includes(r)&&(P+=30),H.includes(r)&&(P+=20),{...E,_matchScore:P}}).filter(E=>E._matchScore>0).sort((E,h)=>E._matchScore!==h._matchScore?h._matchScore-E._matchScore:E.song_title.localeCompare(h.song_title,"ja")).map(({_matchScore:E,...h})=>h)}),B=m(()=>{const r=`${d.meta.title??q}`,n=`${r}${at}`;return u.value&&u.value.trim()!==""&&v.value.length>0?`${u.value.trim()}｜${r}が歌った回を一覧`:n}),z=m(()=>{const r=`${d.meta.title??q}`;return u.value&&u.value.trim()!==""&&v.value.length>0?`「${u.value.trim()}」を${r}さんが歌った配信回を完全網羅。YouTube該当時間へ直接ジャンプできる非公式ファンサービス。`:`${r}${ot}`});Q(vt(B,z,v));const M=m(()=>{const r=(c.value-1)*D.value,n=r+D.value;return v.value.slice(r,n)}),A=m(()=>Math.ceil(v.value.length/D.value)),V=r=>{if(c.value===r)return;const n=Math.max(1,Math.min(r,A.value));c.value=l.value=n,st(()=>{})},R=j(!1),f=()=>{R.value=window.innerWidth<=370};return S(()=>{f(),window.addEventListener("resize",f)}),X(()=>{window.removeEventListener("resize",f)}),(r,n)=>(L(),I(w,null,[n[9]||(n[9]=Y('<div class="dropdown my-4 d-inline-block" data-v-c6bd79c8><button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" data-v-c6bd79c8><i class="fa-solid fa-language fa-fw me-1" data-v-c6bd79c8></i> 説明書 </button><ul class="dropdown-menu dropdown-menu-end" data-v-c6bd79c8><li data-v-c6bd79c8><a class="dropdown-item" href="https://github.com/kevinstrax/hanon-uta/blob/main/README.md" target="_blank" rel="noopener noreferrer" data-v-c6bd79c8><i class="fa-solid fa-file-lines fa-fw me-2" data-v-c6bd79c8></i> 日本語 </a></li><li data-v-c6bd79c8><a class="dropdown-item" href="https://github.com/kevinstrax/hanon-uta/blob/main/README_zh-CN.md" target="_blank" rel="noopener noreferrer" data-v-c6bd79c8><i class="fa-solid fa-file-lines fa-fw me-2" data-v-c6bd79c8></i> 简体中文 </a></li></ul></div>',1)),o("div",kt,[o("div",Ct,[n[7]||(n[7]=o("span",{class:"input-group-text bg-light"},[o("i",{class:"fas fa-search"})],-1)),g(o("input",{"onUpdate:modelValue":n[0]||(n[0]=p=>u.value=p),type:"search",class:"form-control shadow-none",placeholder:"曲名またはアーティスト名で検索...",onInput:n[1]||(n[1]=p=>c.value=l.value=1)},null,544),[[C,u.value]])])]),k(bt,{"paginated-songs":M.value},null,8,["paginated-songs"]),A.value>1?(L(),I("div",Nt,[o("input",{class:O([{disabled:c.value===1},"btn btn-light rounded-end-0 responsive-width"]),"aria-label":"前のページ",style:{"min-width":"55px"},type:"button",value:"‹",onClick:n[2]||(n[2]=N(p=>V(c.value-1),["prevent"]))},null,2),g(o("input",{"onUpdate:modelValue":n[3]||(n[3]=p=>l.value=p),class:O(["form-control",{"form-control-sm":R.value}]),min:"1",max:A.value,style:tt({width:R.value?"60px":"70px"}),type:"number",onKeyup:n[4]||(n[4]=J(p=>V(l.value),["enter"]))},null,46,qt),[[C,l.value,void 0,{number:!0}]]),o("span",{class:O(["text-muted text-nowrap",{small:R.value}])},[x("/ "+T(A.value),1),n[8]||(n[8]=o("span",{class:"d-none d-xxs-inline"},"ページ",-1))],2),o("input",{type:"button",class:"btn btn-light",onClick:n[5]||(n[5]=p=>V(l.value)),value:"移動"}),o("input",{class:O([{disabled:c.value===A.value},"btn btn-light rounded-start-0 responsive-width"]),"aria-label":"次のページ",style:{"min-width":"55px"},type:"button",value:"›",onClick:n[6]||(n[6]=N(p=>V(c.value+1),["prevent"]))},null,2)])):Z("",!0),o("p",Gt,[o("small",null,T((c.value-1)*D.value+1)+"～"+T(Math.min(c.value*D.value,v.value.length))+" 件を表示 / 全 "+T(v.value.length)+" 件",1)]),k($t)],64))}}),Mt=y(Bt,[["__scopeId","data-v-c6bd79c8"]]);export{Mt as H};
