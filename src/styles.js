export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.sv-root{
  --sky:#90D5FF; --blue:#2A6BD0; --blued:#1E54AC; --ink:#141A35; --ink2:#1E2647;
  --gold:#FFCB5C; --mint:#34D2A6; --violet:#A78BFA;
  --bg:#EEF4FF; --paper:#FFFFFF; --muted:#7C859E;
  --line:rgba(20,26,53,.10); --line2:rgba(20,26,53,.16); --danger:#E5484D;
  font-family:'Plus Jakarta Sans',system-ui,sans-serif; color:var(--ink);
  background:var(--bg); min-height:100vh; padding:0;
}
.sv-root *{box-sizing:border-box}
.sv-root button{font-family:inherit; cursor:pointer}

.wordmark{display:inline-flex; align-items:center; gap:1px; font-family:'Quicksand',sans-serif; font-weight:500; letter-spacing:-.01em; line-height:1}
.wordmark svg{margin:0 1px}

/* starfield overlay for dark surfaces */
.starfield{position:relative}
.starfield>*{position:relative; z-index:1}
.starfield::before{content:""; position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.8;
  background-image:
   radial-gradient(1.4px 1.4px at 14% 26%, rgba(255,255,255,.9), transparent),
   radial-gradient(1px 1px at 68% 16%, rgba(255,255,255,.7), transparent),
   radial-gradient(1.4px 1.4px at 86% 54%, rgba(255,255,255,.85), transparent),
   radial-gradient(1px 1px at 38% 72%, rgba(255,255,255,.6), transparent),
   radial-gradient(1px 1px at 54% 40%, rgba(255,255,255,.5), transparent),
   radial-gradient(1.4px 1.4px at 28% 88%, rgba(255,255,255,.7), transparent),
   radial-gradient(1px 1px at 78% 82%, rgba(255,255,255,.55), transparent);
}

/* dev bar */
.dev-bar{display:flex; align-items:center; gap:14px; padding:10px 16px; background:#0C1126; position:sticky; top:0; z-index:30; flex-wrap:wrap}
.dev-label{font-size:10px; letter-spacing:.18em; color:#6577a8; font-weight:700}
.seg{display:flex; background:#1A2240; border-radius:10px; padding:3px}
.seg button{border:0; background:transparent; color:#9fb0d6; font-weight:600; font-size:13px; padding:7px 13px; border-radius:8px; display:flex; align-items:center; gap:6px}
.seg button.on{background:var(--sky); color:#0C1126}
.dot-badge{background:#0C1126; color:var(--sky); font-size:10px; font-weight:700; border-radius:9px; padding:1px 6px}
.reset{margin-left:auto; border:1px solid #2C3760; background:transparent; color:#7e8cb5; font-size:12px; padding:6px 11px; border-radius:8px}

.stage{display:flex; justify-content:center; padding:22px 14px; min-height:100vh}
.phone{width:390px; max-width:100%; background:var(--ink); border-radius:42px; padding:12px; box-shadow:0 24px 60px rgba(0,0,0,.5); position:relative}
.notch{position:absolute; top:18px; left:50%; transform:translateX(-50%); width:120px; height:24px; background:var(--ink); border-radius:0 0 16px 16px; z-index:5}
.phone-screen{background:var(--bg); border-radius:32px; overflow:hidden; height:760px; overflow-y:auto; position:relative}
.phone-screen::-webkit-scrollbar{width:0}
.tablet{width:920px; max-width:100%; background:var(--ink); border-radius:22px; padding:12px; box-shadow:0 24px 60px rgba(0,0,0,.5)}

.screen{min-height:100%; max-width:390px; margin:0 auto; width:100%}
.pad{padding:20px}
.pad-x{padding:0 18px 24px}
.center-col{display:flex; flex-direction:column; align-items:center; text-align:center}

.login-bg{background:linear-gradient(180deg,#FFFFFF 0%, #F8FBFF 40%, #F0F6FF 100%); min-height:100vh; padding:20px}
.login-mark{margin:14px 0 10px}
.sv-logo{display:block; max-width:100%; height:auto}
.login-logo{margin:26px auto 22px}
.tagline{font-size:11px; letter-spacing:.16em; color:var(--muted); font-weight:600; text-transform:uppercase; margin:6px 0 20px}

.field{width:100%; text-align:left; margin-bottom:14px}
.field label{display:block; font-size:13px; font-weight:600; margin-bottom:6px; color:var(--ink)}
.field .opt{color:var(--muted); font-weight:500}
.lbl-light{color:#cdd7f0 !important}
.input{width:100%; border:1.5px solid var(--line2); background:var(--paper); border-radius:12px; padding:13px 14px; font-size:15px; color:var(--ink); outline:none; transition:border-color .15s}
.input:focus{border-color:var(--blue)}
.search{margin-bottom:14px}
.row2{display:grid; grid-template-columns:1fr 1fr; gap:12px}

.btn{border:0; border-radius:12px; font-weight:600; font-size:15px; padding:13px 16px; transition:transform .08s, filter .15s}
.btn:active{transform:scale(.98)}
.btn.full{width:100%}
.btn.sm{font-size:13px; padding:9px 14px; border-radius:10px}
.btn-primary{background:var(--blue); color:#fff}
.btn-primary:hover{filter:brightness(1.06)}
.btn-primary:disabled{background:var(--line2); color:#fff; cursor:not-allowed; filter:none}
.btn-ghost{background:transparent; color:var(--ink); border:1.5px solid var(--line2)}
.btn-ghost:hover{background:rgba(20,26,53,.04)}
.btn-danger{background:var(--danger); color:#fff}
.btn-danger-ghost{background:transparent; color:var(--danger); border:1.5px solid rgba(229,72,77,.4)}
.link{background:none; border:0; color:var(--blue); font-weight:600; font-size:13px; margin-top:10px}

.divider{display:flex; align-items:center; gap:10px; color:var(--muted); font-size:12px; width:100%; margin:16px 0}
.divider:before,.divider:after{content:""; flex:1; height:1px; background:var(--line2)}
.hint-demo{margin-top:18px; font-size:12px; color:var(--muted); background:rgba(20,26,53,.05); padding:8px 12px; border-radius:10px}
.hint-demo b{color:var(--ink)}
.hint-demo.light{background:rgba(255,255,255,.08); color:#aeb9da}
.hint-demo.light b{color:#fff}
.muted{color:var(--muted); font-size:14px; line-height:1.5}
.muted.small{font-size:12px; margin-top:14px}

.topbar{display:flex; align-items:center; gap:12px; padding:18px 20px 8px; font-weight:700; font-size:18px; font-family:'Quicksand',sans-serif}
.topbar.sticky{position:sticky; top:0; background:var(--bg); z-index:6; padding-bottom:12px}
.tb-back{border:0; background:rgba(20,26,53,.06); width:34px; height:34px; border-radius:10px; font-size:18px; color:var(--ink)}

.card-picker{display:flex; gap:10px}
.swatch{width:54px; height:54px; border-radius:12px; border:3px solid transparent; position:relative}
.swatch.sel{border-color:var(--ink)}
.swatch-check{position:absolute; inset:0; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:20px; text-shadow:0 1px 3px rgba(0,0,0,.35)}

/* dashboard header — light blue gradient */
.dash-head{display:flex; align-items:center; justify-content:space-between; padding:20px 18px 16px; background:linear-gradient(135deg,#4A90E2,#63B3ED); color:#fff; border-radius:0 0 22px 22px; overflow:hidden; margin-bottom:16px}
.dh-left{display:flex; align-items:center}
.hello{font-weight:700; font-size:17px; font-family:'Quicksand',sans-serif; color:#fff; text-shadow:0 1px 2px rgba(0,0,0,.1)}
.lvl-badge{display:inline-block; background:var(--gold); color:#5a3d00; font-size:11px; font-weight:700; padding:2px 9px; border-radius:8px; margin-top:3px}
.icon-btn{border:0; background:rgba(255,255,255,.14); color:#fff; width:36px; height:36px; border-radius:10px; font-size:16px}
.dh-right{display:flex; align-items:center}
.text-btn{background:rgba(255,255,255,.14); color:#fff; border:0; padding:6px 12px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; transition:background .2s}
.text-btn:hover{background:rgba(255,255,255,.24)}

.stamp-card{border-radius:22px; padding:18px; color:#fff; box-shadow:0 14px 30px rgba(20,26,53,.28); overflow:hidden; margin-top:-4px}
.sc-top{display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px}
.sc-name{font-weight:700; font-size:18px; font-family:'Quicksand',sans-serif; text-shadow:0 1px 2px rgba(0,0,0,.18)}
.sc-meta{font-size:12px; opacity:.95; font-weight:600}
.sc-mascot{background:rgba(255,255,255,.22); border-radius:12px; padding:3px}
.dots{display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:14px}
.dot{aspect-ratio:1; border-radius:50%; border:2px dashed rgba(255,255,255,.6); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; color:rgba(255,255,255,.75)}
.dot.filled{background:#fff; border-style:solid; border-color:#fff; color:var(--gold); font-size:18px; box-shadow:0 3px 8px rgba(0,0,0,.2)}
.sc-foot{font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; opacity:.85; font-weight:600}
.flip{position:relative; width:100%; cursor:pointer; perspective:1500px}
.flip-inner{position:relative; transition:transform .6s cubic-bezier(.4,.15,.2,1); transform-style:preserve-3d}
.flip-inner.flipped{transform:rotateY(180deg)}
.flip-face{backface-visibility:hidden; -webkit-backface-visibility:hidden; border-radius:16px; overflow:hidden; box-shadow:0 14px 30px rgba(20,26,53,.26)}
.flip-front{position:relative}
.flip-back{position:absolute; inset:0; transform:rotateY(180deg)}
.card-img,
.card-svg{display:block; width:100%; height:auto}
.flip-caption{text-align:center; font-size:11.5px; color:var(--muted); margin:9px 0 2px}
.theme-picker{display:flex; flex-direction:column; gap:10px}
.theme-opt{position:relative; border:2.5px solid transparent; border-radius:12px; overflow:hidden; padding:0; background:none; width:100%; display:block; line-height:0}
.theme-opt img{width:100%; display:block}
.theme-opt.sel{border-color:var(--blue); box-shadow:0 4px 14px rgba(42,107,208,.28)}
.theme-name{position:absolute; bottom:7px; left:8px; background:rgba(20,26,53,.72); color:#fff; font-size:11px; font-weight:700; padding:2px 9px; border-radius:7px; font-family:'Quicksand',sans-serif; line-height:1.4}

.progress-note{background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:12px 14px; font-size:13.5px; margin:14px 0; line-height:1.4}
.section-label{font-family:'Quicksand',sans-serif; font-weight:700; font-size:15px; margin:20px 2px 12px; color:var(--ink)}
.hist-btn{margin:2px 0 18px}
.room-scroll{display:flex; gap:12px; overflow-x:auto; padding:2px 2px 10px; margin:0 -2px; -webkit-overflow-scrolling:touch}
.room-scroll::-webkit-scrollbar{height:0}
.room-card{flex:none; width:138px; position:relative; border-radius:16px; overflow:hidden; box-shadow:0 6px 16px rgba(20,26,53,.18)}
.room-card img{width:138px; height:184px; object-fit:cover; display:block}
.room-name{position:absolute; left:0; right:0; bottom:0; padding:20px 10px 9px; color:#fff; font-weight:700; font-size:12.5px; font-family:'Quicksand',sans-serif; background:linear-gradient(transparent, rgba(20,26,53,.85))}
.room-soon{background:linear-gradient(160deg,#1B2350,#141A35); display:flex; align-items:center; justify-content:center}
.soon-inner{position:relative; z-index:1; text-align:center; padding:10px}
.soon-badge{display:inline-block; background:var(--gold); color:#5a3d00; font-size:9.5px; font-weight:700; padding:3px 9px; border-radius:8px; letter-spacing:.05em; text-transform:uppercase; margin-bottom:10px}
.soon-name{color:#fff; font-weight:700; font-size:14px; font-family:'Quicksand',sans-serif; line-height:1.25}
.tier-row{display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:16px}
.tier{background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:12px 6px; text-align:center; opacity:.62}
.tier.unlocked{opacity:1; border-color:var(--sky); box-shadow:0 4px 12px rgba(144,213,255,.3)}
.tier-ic{display:flex; align-items:center; justify-content:center; height:26px}
.tier-cost{font-weight:700; font-size:15px; margin-top:2px; font-family:'Quicksand',sans-serif}
.tier-state{font-size:10px; color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:.05em}
.tier.unlocked .tier-state{color:var(--blue)}
.dash-actions{display:flex; flex-direction:column; gap:10px; margin-bottom:18px}

.referral{background:linear-gradient(135deg,#1B2350,#141A35); color:#fff; border-radius:18px; padding:16px; overflow:hidden}
.ref-head{font-weight:700; font-size:15px; font-family:'Quicksand',sans-serif; margin-bottom:6px}
.referral p{font-size:12.5px; line-height:1.5; opacity:.88; margin:0 0 12px}
.ref-code{display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,.12); border-radius:10px; padding:8px 8px 8px 14px}
.ref-code span{font-weight:700; letter-spacing:.04em}
.copy{border:0; background:var(--sky); color:#0C1126; font-weight:700; font-size:12px; padding:6px 14px; border-radius:8px}

.bal-chip{background:linear-gradient(135deg,#1B2350,#141A35); color:#fff; border-radius:12px; padding:10px 14px; font-size:14px; font-weight:600; text-align:center; margin-bottom:14px}
.bal-chip b{color:var(--gold); font-size:16px}
.reward{display:flex; align-items:center; gap:12px; background:var(--paper); border:1px solid var(--line); border-radius:16px; padding:14px; margin-bottom:12px}
.reward.locked{opacity:.66}
.reward-main{flex:1; min-width:0}
.reward-top{display:flex; align-items:center; gap:10px; margin-bottom:8px}
.reward-ic{width:46px; height:46px; flex:none; border-radius:12px; background:rgba(144,213,255,.18); display:flex; align-items:center; justify-content:center}
.reward-head{flex:1; min-width:0}
.reward-title{font-weight:700; font-size:15px; font-family:'Quicksand',sans-serif}
.reward-cost{font-size:12px; font-weight:700; color:var(--blue); margin-top:1px}
.cost-star{color:var(--gold)}
.reward-desc{font-size:12.5px; color:var(--muted); line-height:1.5; margin:0}
.claim-btn{flex:none; align-self:center; min-width:78px; border:0; background:var(--gold); color:#5a3d00; border-radius:11px; font-size:13.5px; font-weight:700; font-family:'Quicksand',sans-serif; padding:12px 14px; transition:transform .08s, filter .15s}
.claim-btn:hover{filter:brightness(1.04)}
.claim-btn:active{transform:scale(.97)}
.claim-btn:disabled{background:#E1E7F2; color:#9aa4bb; cursor:not-allowed; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px}

.hist{display:flex; align-items:center; gap:12px; padding:12px 4px; border-bottom:1px solid var(--line)}
.hist-ic{font-size:20px; width:34px; height:34px; background:rgba(20,26,53,.05); border-radius:10px; display:flex; align-items:center; justify-content:center}
.hist-body{flex:1}
.hist-label{font-weight:600; font-size:14px; display:flex; align-items:center; gap:8px; flex-wrap:wrap}
.hist-time{font-size:11.5px; color:var(--muted); margin-top:1px}
.hist-delta{font-weight:700; font-size:15px}
.hist-delta.plus{color:var(--mint)}
.hist-delta.minus{color:var(--danger)}
.mini-badge{font-size:10px; font-weight:700; padding:2px 8px; border-radius:7px; text-transform:uppercase; letter-spacing:.04em}
.mini-badge.pending{background:#FFF1D6; color:#946100}
.mini-badge.fulfilled{background:#D6F6EC; color:#0C7A57}
.empty{text-align:center; color:var(--muted); padding:30px 10px; font-size:14px}

.proof{background:linear-gradient(160deg,#1B2350,#0E1430); display:flex; align-items:center; justify-content:center; min-height:760px; padding:24px}
.proof-card{background:#fff; border-radius:24px; padding:26px; width:100%; max-width:320px; text-align:center; position:relative}
.proof-mark{display:flex; justify-content:center; margin-bottom:6px}
.proof-title{font-weight:600; font-size:14px; color:var(--muted); margin:6px 0 12px}
.proof-reward{font-family:'Quicksand',sans-serif; font-weight:700; font-size:22px; color:var(--ink); margin-bottom:18px}
.proof-rows{text-align:left; border-top:1px dashed var(--line2); padding-top:14px}
.proof-rows>div{display:flex; justify-content:space-between; padding:6px 0; font-size:13.5px}
.proof-rows span{color:var(--muted)}
.pstat.pending{color:#946100}
.pstat.fulfilled{color:#0C7A57}
.proof-pulse{height:4px; border-radius:4px; background:var(--gold); margin:16px 0; animation:pulse 1.4s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}

.toast{position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:var(--ink); color:#fff; padding:12px 20px; border-radius:12px; font-size:14px; font-weight:600; z-index:60; box-shadow:0 8px 24px rgba(0,0,0,.35); animation:slideUp .25s ease}
.toast.err{background:var(--danger)}
.toast.ok{background:var(--mint)}
@keyframes slideUp{from{transform:translate(-50%,12px); opacity:0}to{transform:translate(-50%,0); opacity:1}}

/* ADMIN */
.admin{display:flex; background:var(--bg); border-radius:14px; overflow:hidden; min-height:620px}
.admin-side{width:210px; background:linear-gradient(180deg,#1B2350,#10162E); padding:18px 14px; display:flex; flex-direction:column; gap:6px; overflow:hidden}
.admin-logo{display:flex; align-items:center; gap:7px; margin-bottom:2px}
.admin-tag{font-size:9px; letter-spacing:.2em; color:#8593bd; font-weight:600; margin:0 0 16px 2px; text-transform:uppercase}
.admin-tag.light{color:#aeb9da; margin:4px 0 8px}
.anav{border:0; background:transparent; color:#b7c2e4; text-align:left; padding:11px 12px; border-radius:10px; font-weight:600; font-size:14px; display:flex; align-items:center; gap:8px}
.anav:hover{background:rgba(255,255,255,.06)}
.anav.on{background:var(--sky); color:#0C1126}
.anav-badge{margin-left:auto; background:var(--gold); color:#5a3d00; font-size:11px; font-weight:700; border-radius:8px; padding:1px 7px}
.admin-spacer{flex:1}
.muted-nav{color:#7e8cb5}
.admin-main{flex:1; padding:24px; overflow-y:auto; max-height:620px}

.admin-login{background:linear-gradient(160deg,#1B2350,#0E1430); border-radius:14px; min-height:620px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px}

.apanel{max-width:560px}
.apanel-h{font-family:'Quicksand',sans-serif; font-size:22px; font-weight:700; margin:0 0 16px; display:flex; align-items:center; gap:10px}
.live{font-size:11px; color:var(--mint); font-weight:700; letter-spacing:.05em}
.res-list{display:flex; flex-direction:column; gap:8px}
.res-row{display:flex; align-items:center; gap:12px; background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:12px 14px; text-align:left}
.res-row:hover{border-color:var(--blue)}
.rr-info{flex:1}
.rr-name{font-weight:700; font-size:15px}
.rr-phone{font-size:12.5px; color:var(--muted)}
.rr-bal{font-weight:700; color:var(--blue); font-size:13px}
.back-link{border:0; background:none; color:var(--blue); font-weight:600; font-size:13px; margin-bottom:14px}
.member-head{display:flex; align-items:center; gap:14px; background:var(--paper); border:1px solid var(--line); border-radius:16px; padding:16px; margin-bottom:16px}
.mh-name{font-family:'Quicksand',sans-serif; font-weight:700; font-size:19px}
.mh-meta{font-size:13px; color:var(--muted)}
.mh-bal{margin-left:auto; text-align:center; font-size:11px; color:var(--muted); font-weight:600}
.mh-bal span{display:block; font-size:26px; font-weight:700; color:var(--blue); font-family:'Quicksand',sans-serif}
.add-box{background:var(--paper); border:1px solid var(--line); border-radius:16px; padding:16px; margin-bottom:12px}
.check{display:flex; align-items:flex-start; gap:10px; font-size:13.5px; margin-bottom:14px; cursor:pointer; line-height:1.4}
.check input{margin-top:2px; width:18px; height:18px; accent-color:var(--blue)}
.remove-box{background:var(--paper); border:1px solid rgba(229,72,77,.3); border-radius:16px; padding:16px; margin-bottom:12px}
.remove-box label{display:block; font-size:13px; font-weight:600; margin-bottom:6px}
.remove-box .row2{margin-top:12px}
.mini-hist{margin-top:18px}
.mh-title{font-weight:700; font-size:13px; color:var(--muted); text-transform:uppercase; letter-spacing:.05em; margin-bottom:8px}
.mh-row{display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--line); font-size:13px}
.mh-time{color:var(--muted); font-size:12px}
.notif-list{display:flex; flex-direction:column; gap:10px}
.notif{display:flex; align-items:center; gap:12px; background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:14px}
.notif.pending{border-color:var(--gold); background:#FFFCF4}
.notif-ic{font-size:22px}
.notif-body{flex:1}
.notif-title{font-weight:700; font-size:14.5px}
.notif-phone{font-weight:500; color:var(--muted); font-size:12.5px; margin-left:6px}
.notif-reward{font-size:13px; margin:1px 0}
.notif-time{font-size:11.5px; color:var(--muted)}
.done-tag{font-size:12px; font-weight:700; color:var(--mint)}
.stat-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:22px}
.stat{background:var(--paper); border:1px solid var(--line); border-radius:14px; padding:16px}
.stat.warn{border-color:var(--gold); background:#FFFCF4}
.stat-n{font-family:'Quicksand',sans-serif; font-weight:700; font-size:30px; color:var(--ink)}
.stat-l{font-size:12px; color:var(--muted); font-weight:600; margin-top:2px}
.stat-block{background:var(--paper); border:1px solid var(--line); border-radius:16px; padding:18px; margin-bottom:16px}
.sb-title{font-weight:700; font-size:14px; margin-bottom:14px}
.bar-row{display:flex; align-items:center; gap:12px; margin-bottom:10px}
.bar-label{width:178px; font-size:13px; font-weight:600; display:flex; align-items:center; gap:7px}
.bar-track{flex:1; height:12px; background:rgba(20,26,53,.07); border-radius:6px; overflow:hidden}
.bar-fill{height:100%; background:linear-gradient(90deg,var(--sky),var(--blue)); border-radius:6px; transition:width .4s}
.bar-n{width:24px; text-align:right; font-weight:700; font-size:13px}
.lvl-chips{display:flex; gap:10px; flex-wrap:wrap}
.lvl-chip{background:rgba(20,26,53,.05); border-radius:10px; padding:8px 14px; font-size:13px}
.lvl-chip b{color:var(--blue); font-size:16px; font-family:'Quicksand',sans-serif}

@media(max-width:560px){
  .admin-side{width:60px; padding:14px 8px}
  .admin-logo .wordmark,.admin-tag,.anav span{display:none}
  .anav{justify-content:center}
  .stat-grid{grid-template-columns:repeat(2,1fr)}
  .bar-label{width:110px; font-size:12px}
}
`;
