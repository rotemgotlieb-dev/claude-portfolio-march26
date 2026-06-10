/* ============================================
   ROTEM GOTLIEB — PORTFOLIO
   game.js v3: Visual clarity & polish
   ============================================ */

(function () {
  'use strict';

  function init() {
    var canvas = document.getElementById('bikeGame');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    /* ---- Color palettes ---- */
    var LIGHT = {
      sky: '#FAFAF8',
      mtnFar: '#CBD3D6', mtnNear: '#B8C2C6',
      treeA: '#8BA088', treeB: '#7A9080', treeFg: '#4A6848',
      gnd: '#C4B5A0', gndStripe: '#B4A694', trail: '#D0CAB8',
      biker: '#1A1A1A', grey: '#666666',
      rock: '#6B6B68', rockShadow: '#4A4A46', rockHighlight: '#8A8A86',
      log: '#6B4A0A', logShadow: '#4A3000', logHi: '#8B6A2A',
      stump: '#4A3018', stumpDark: '#2A1808', stumpRing: '#6A5030',
      mud: '#8A7A5A', mudDark: '#6A5A3A', splash: '#A09070',
      mailboxBody: '#3A6A9A', mailboxPost: '#8A8A86', mailboxFlag: '#CC4444',
      sunFace: '#E8D888', sunRay: '#E0D080', sunGlow: '#F0E8C0',
      cloud: '#E4E0D8', cloudShadow: '#D4D0C8',
    };
    var DARK = {
      sky: '#141413',
      mtnFar: '#252830', mtnNear: '#1E2025',
      treeA: '#1E2E22', treeB: '#162018', treeFg: '#0E1A10',
      gnd: '#2A2520', gndStripe: '#201C18', trail: '#352F28',
      biker: '#F0F0EC', grey: '#888888',
      rock: '#5A5A5A', rockShadow: '#444444', rockHighlight: '#6A6A6A',
      log: '#5A4A20', logShadow: '#4A3C18', logHi: '#705520',
      stump: '#4A3A20', stumpDark: '#2A1A08', stumpRing: '#6A5A38',
      mud: '#5A4A2A', mudDark: '#3A2A0A', splash: '#7A6A3A',
      mailboxBody: '#2A4A6A', mailboxPost: '#6A6A6A', mailboxFlag: '#AA3333',
      moonFace: '#D8D4C8', moonGlow: '#3A3830',
      star: '#666660',
    };

    /* ---- Color interpolation ---- */
    function hexToRgb(h) {
      return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    }
    function lerpColor(a, b, t) {
      var ar = hexToRgb(a), br = hexToRgb(b);
      return '#' + ((1<<24) |
        (Math.round(ar[0]+(br[0]-ar[0])*t)<<16) |
        (Math.round(ar[1]+(br[1]-ar[1])*t)<<8)  |
         Math.round(ar[2]+(br[2]-ar[2])*t)).toString(16).slice(1);
    }
    var cachedPalNightness = -1;
    var cachedPal = LIGHT;
    function getPal() {
      if (Math.abs(nightness - cachedPalNightness) < 0.008) return cachedPal;
      cachedPalNightness = nightness;
      if (nightness <= 0) { cachedPal = LIGHT; return LIGHT; }
      if (nightness >= 1) { cachedPal = DARK;  return DARK; }
      var p = {};
      var keys = Object.keys(LIGHT);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        p[k] = DARK[k] ? lerpColor(LIGHT[k], DARK[k], nightness) : LIGHT[k];
      }
      cachedPal = p;
      return p;
    }

    /* ---- Sizing ---- */
    var W, H, GY, S;
    var mtnFarPts, mtnNearPts, mtnTile;
    var trees, fgTrees, stars, clouds;

    function resize() {
      var isMobile = window.innerWidth < 768;
      S = isMobile ? 2 : 3;
      var cssH = isMobile ? 160 : 200;
      var cw = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      if (cw < 1) cw = window.innerWidth;
      W = Math.max(80, Math.floor(cw / S));
      H = Math.floor(cssH / S);
      canvas.width = W;
      canvas.height = H;
      GY = H - 14;
      buildWorld();
      resetBiker();
    }

    function buildWorld() {
      mtnTile = W * 3;
      mtnFarPts  = buildMtnPts(mtnTile, GY - 18, 8,  16, 18);
      mtnNearPts = buildMtnPts(mtnTile, GY - 11, 4,   9, 13);

      // Background trees
      trees = [];
      var span = W * 3;
      for (var i = 0; i < 28; i++) {
        trees.push({ x: Math.random()*span, h: 7+Math.random()*9, w: 4+Math.random()*4, col: Math.random()>0.5?0:1 });
      }
      trees.sort(function(a,b){ return a.x-b.x; });

      // Foreground trees — massive, close-to-camera feel
      fgTrees = [];
      var fgSpan = W * 5;
      for (var fi = 0; fi < 6; fi++) {
        fgTrees.push({ x: Math.random()*fgSpan, h: 40+Math.random()*20, w: 14+Math.random()*8 });
      }
      fgTrees.sort(function(a,b){ return a.x-b.x; });

      // Stars (fixed screen positions, top 45%)
      stars = [];
      for (var si = 0; si < 25; si++) {
        stars.push({ x: Math.random()*W, y: Math.random()*H*0.45, phase: Math.random()*Math.PI*2, size: Math.random()>0.7?2:1 });
      }

      // Clouds (4, drifting leftward)
      clouds = [
        { x: W*0.10, y: H*0.08, w: 1.6, spd: 0.18 },
        { x: W*0.38, y: H*0.14, w: 2.0, spd: 0.22 },
        { x: W*0.58, y: H*0.06, w: 1.2, spd: 0.15 },
        { x: W*0.82, y: H*0.11, w: 1.4, spd: 0.20 },
      ];

      cachedPalNightness = -1; // force palette recompute
    }

    function buildMtnPts(tileW, baseY, minPH, maxPH, minSeg) {
      var pts = [];
      var x = 0;
      while (x < tileW + minSeg * 2) {
        var segW = minSeg + Math.random() * minSeg * 1.4;
        pts.push({ x: x, y: baseY - minPH - Math.random()*(maxPH-minPH) });
        x += segW;
      }
      return pts;
    }

    /* ---- Sky / Day-Night state ---- */
    var nightness    = document.documentElement.getAttribute('data-theme') === 'dark' ? 1 : 0;
    var nightTarget  = nightness;
    var NIGHT_SPEED  = 1 / 90;  // ~1.5s transition at 60fps
    var sunRayAngle  = 0;
    var cloudDrift   = 0;       // increases each tick, drives cloud x

    /* ---- Physics constants ---- */
    var WR        = 4;
    var JUMP_VY   = -5.5;
    var GRAV      = 0.38;
    var BASE_SPD  = 3.0;
    var MAX_SPD   = 8.0;

    /* ---- Game state ---- */
    var IDLE = 'idle', PLAYING = 'playing', DEAD = 'dead';
    var state      = IDLE;
    var score      = 0;
    var highScore  = parseInt(localStorage.getItem('bikeHS')) || 0;
    var deathTimer = 0;
    var scrollX    = 0;
    var speed      = BASE_SPD;
    var mudSlowTimer = 0;

    /* ---- Milestone flash ---- */
    var milestoneFlash = 0;
    var milestoneText  = '';

    /* ---- Biker ---- */
    var biker = { x:0, y:0, vy:0, onGround:true, wasOnGround:true, tick:0 };
    var wheelAngle = 0;

    function resetBiker() {
      biker.x = Math.floor(W * 0.22);
      biker.y = GY - WR;
      biker.vy = 0;
      biker.onGround = true;
      biker.wasOnGround = true;
      biker.tick = 0;
    }

    /* ---- Obstacles ---- */
    var obstacles    = [];
    var lastObsType  = '';
    var nextObsIn    = 120;
    var obsMinGap    = 120;
    var obsGapVar    = 60;

    // Weighted pool: log 20%, boulder 20%, rockCluster 20%, stump 20%, mailbox 13%, mud 7%
    var OBS_POOL = ['log','log','boulder','boulder','rockCluster','rockCluster','stump','stump','mailbox','mailbox','mud'];

    function pickType() {
      var t, tries = 0;
      do { t = OBS_POOL[Math.floor(Math.random()*OBS_POOL.length)]; tries++; }
      while (t === lastObsType && tries < 6);
      lastObsType = t;
      return t;
    }

    function makeObs(type, startX) {
      var o = { type: type, x: startX };
      switch (type) {
        case 'log':         o.w = 22+Math.floor(Math.random()*8);  o.h = 8+Math.floor(Math.random()*3); break;
        case 'boulder':     o.w = 14+Math.floor(Math.random()*6);  o.h = 12+Math.floor(Math.random()*4); break;
        case 'rockCluster': o.w = 16+Math.floor(Math.random()*6);  o.h = 8+Math.floor(Math.random()*4); break;
        case 'stump':       o.w = 8 +Math.floor(Math.random()*3);  o.h = 10+Math.floor(Math.random()*4); break;
        case 'mailbox':     o.w = 12+Math.floor(Math.random()*4);  o.h = 18+Math.floor(Math.random()*3); o.flagUp = Math.random() > 0.5; break;
        case 'mud':         o.w = 18+Math.floor(Math.random()*7);  o.h = 3+Math.floor(Math.random()*2); break;
      }
      o.y = GY - o.h;
      return o;
    }

    function spawnObs() {
      var first = makeObs(pickType(), W + 8);
      obstacles.push(first);
      // Double obstacle after 50m (25% chance)
      if (score > 50 && Math.random() < 0.25) {
        var gap = 6 + Math.floor(Math.random() * 10);
        obstacles.push(makeObs(pickType(), first.x + first.w + gap));
      }
      nextObsIn = Math.max(obsMinGap, obsMinGap + Math.random() * obsGapVar);
    }

    /* ---- Distance markers ---- */
    var markers    = [];
    var nextMarker = 100;

    /* ---- Particles ---- */
    var particles = [];

    function spawnDust(x, y) {
      for (var i = 0; i < 5; i++) {
        var life = 15 + Math.random() * 10;
        particles.push({ x: x+(Math.random()-0.5)*6, y: y, vx: (Math.random()-0.5)*1.5,
          vy: -Math.random()*2-0.5, life: life, maxLife: life, size: 1+Math.random()*0.5, mud: false });
      }
    }

    function spawnMudSplash(x, y) {
      for (var i = 0; i < 9; i++) {
        var life = 12 + Math.random() * 12;
        particles.push({ x: x+(Math.random()-0.5)*10, y: y, vx: (Math.random()-0.5)*2.5,
          vy: -Math.random()*3-0.5, life: life, maxLife: life, size: 1+Math.random(), mud: true });
      }
    }

    /* ---- Screen shake ---- */
    var shakeX = 0, shakeY = 0, shakeDur = 0;
    function triggerShake() { shakeDur = 12; }

    /* ---- Collision ---- */
    function hitTest() {
      var T=2, bx1=biker.x-WR*0.5+T, bx2=biker.x+WR*2.3-T;
      var by1=biker.y-WR*2.2+T, by2=biker.y+WR-T;
      for (var i=0; i<obstacles.length; i++) {
        var o=obstacles[i];
        if (o.type==='mud') continue;
        if (bx2>o.x+T && bx1<o.x+o.w-T && by2>o.y+T && by1<o.y+o.h-T) return true;
      }
      return false;
    }

    function checkMud() {
      var T=3, bx1=biker.x-WR*0.5+T, bx2=biker.x+WR*2.3-T, by2=biker.y+WR;
      for (var i=obstacles.length-1; i>=0; i--) {
        var o=obstacles[i];
        if (o.type!=='mud') continue;
        if (bx2>o.x+T && bx1<o.x+o.w-T && by2>o.y) {
          mudSlowTimer = 30;
          spawnMudSplash(biker.x, biker.y+WR);
          obstacles.splice(i,1);
        }
      }
    }

    /* ---- Audio ---- */
    var audioCtx = null;
    var masterGain = null;
    var tempoMultiplier = 1.0;
    var nextTempoMilestone = 500;
    var melodyTimer = null;
    var bassTimer = null;
    var tickTimer = null;
    var melodyIndex = 0;
    var bassIndex = 0;
    var gameMuted = localStorage.getItem('gameMuted') === 'true';

    // Original melody — chill rolling ride feel (D minor pentatonic)
    var melodyNotes = [
      // Phrase 1 — rolling downhill
      [294, 180], [0, 60], [349, 140], [392, 140], [0, 80],
      [440, 220], [0, 100], [392, 140], [349, 180], [0, 80],
      [294, 260], [0, 120],
      // Phrase 2 — breeze pickup
      [392, 140], [440, 140], [523, 180], [0, 80],
      [440, 160], [0, 60], [392, 200], [0, 80],
      [349, 140], [294, 140], [262, 260], [0, 160],
      // Phrase 3 — cruise
      [294, 140], [0, 60], [262, 140], [294, 300], [0, 120],
      [349, 180], [392, 180], [349, 260], [0, 200]
    ];

    // Bass line — open fifths, steady pedal
    var bassNotes = [
      [147, 350], [147, 350], [175, 350], [196, 350],
      [165, 350], [147, 350], [131, 350], [147, 350],
      [175, 350], [196, 350], [165, 350], [147, 350]
    ];

    function initAudio() {
      if (audioCtx) return;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.connect(audioCtx.destination);
      masterGain.gain.value = gameMuted ? 0 : 0.4;
    }

    function playNote(freq, dur, type, vol) {
      if (!audioCtx || freq <= 0) return;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(masterGain);
      osc.type = type;
      osc.frequency.value = freq;
      var now = audioCtx.currentTime;
      var durSec = dur / 1000;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.setValueAtTime(vol, now + durSec * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durSec);
      osc.start(now); osc.stop(now + durSec);
    }

    function playNextMelody() {
      if (state !== PLAYING) return;
      var note = melodyNotes[melodyIndex];
      var dur = note[1] / tempoMultiplier;
      if (note[0] > 0) playNote(note[0], dur, 'square', 0.06);
      melodyIndex = (melodyIndex + 1) % melodyNotes.length;
      melodyTimer = setTimeout(playNextMelody, dur);
    }

    function playNextBass() {
      if (state !== PLAYING) return;
      var note = bassNotes[bassIndex];
      var dur = note[1] / tempoMultiplier;
      playNote(note[0], dur * 0.9, 'triangle', 0.04);
      bassIndex = (bassIndex + 1) % bassNotes.length;
      bassTimer = setTimeout(playNextBass, dur);
    }

    function playTick() {
      if (state !== PLAYING) return;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(masterGain);
      osc.type = 'square';
      osc.frequency.value = 800;
      var now = audioCtx.currentTime;
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      osc.start(now); osc.stop(now + 0.03);
      tickTimer = setTimeout(playTick, 300 / tempoMultiplier);
    }

    function startMusic() {
      melodyIndex = 0; bassIndex = 0;
      playNextMelody();
      playNextBass();
      playTick();
    }

    function stopMusic() {
      if (melodyTimer) { clearTimeout(melodyTimer); melodyTimer = null; }
      if (bassTimer) { clearTimeout(bassTimer); bassTimer = null; }
      if (tickTimer) { clearTimeout(tickTimer); tickTimer = null; }
    }

    function playJumpSound() {
      if (!audioCtx) return;
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(masterGain);
      osc.type = 'sine';
      var now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now); osc.stop(now + 0.18);
    }

    function playCrashSound() {
      if (!audioCtx) return;
      var now = audioCtx.currentTime;
      var thud = audioCtx.createOscillator();
      var thudGain = audioCtx.createGain();
      thud.connect(thudGain); thudGain.connect(masterGain);
      thud.type = 'sine';
      thud.frequency.setValueAtTime(80, now);
      thud.frequency.exponentialRampToValueAtTime(30, now + 0.3);
      thudGain.gain.setValueAtTime(0.15, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      thud.start(now); thud.stop(now + 0.35);
      var bufferSize = Math.floor(audioCtx.sampleRate * 0.2);
      var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      var noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      var noiseGain = audioCtx.createGain();
      noise.connect(noiseGain); noiseGain.connect(masterGain);
      noiseGain.gain.setValueAtTime(0.1, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      noise.start(now);
    }

    /* ---- Mute button ---- */
    var muteBtn = document.createElement('button');
    muteBtn.className = 'game-mute' + (gameMuted ? ' muted' : '');
    muteBtn.id = 'gameMute';
    muteBtn.setAttribute('aria-label', 'Toggle game sound');
    muteBtn.textContent = '\u266A';
    var promptEl = document.getElementById('gamePrompt');
    if (promptEl && promptEl.parentNode) {
      promptEl.parentNode.insertBefore(muteBtn, promptEl.nextSibling);
    }
    muteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      gameMuted = !gameMuted;
      localStorage.setItem('gameMuted', gameMuted);
      muteBtn.classList.toggle('muted', gameMuted);
      if (masterGain) masterGain.gain.value = gameMuted ? 0 : 0.4;
    });

    /* ---- Input ---- */
    function interact() {
      if (state===IDLE) {
        initAudio();
        state=PLAYING; score=0; speed=BASE_SPD; scrollX=0;
        obstacles=[]; nextObsIn=120; lastObsType=''; mudSlowTimer=0;
        particles=[]; markers=[]; nextMarker=100;
        obsMinGap=120; obsGapVar=60;
        milestoneFlash=0; milestoneText='';
        tempoMultiplier=1.0; nextTempoMilestone=500;
        resetBiker();
        startMusic();
        if (!running) startLoop();
      }
      if (state===PLAYING && biker.onGround) { biker.vy=JUMP_VY; biker.onGround=false; playJumpSound(); }
      if (state===DEAD && deathTimer>35) { state=IDLE; resetBiker(); }
    }

    canvas.addEventListener('click', interact);
    canvas.addEventListener('touchstart', function(e){ e.preventDefault(); interact(); }, {passive:false});
    document.addEventListener('keydown', function(e){
      if (e.code!=='Space') return;
      var r=canvas.getBoundingClientRect();
      if (r.top<window.innerHeight && r.bottom>0){ e.preventDefault(); interact(); }
    });

    /* ========== DRAW FUNCTIONS ========== */

    function drawMtnLayer(pts, parallax, color) {
      var ox = -(scrollX * parallax % mtnTile);
      if (ox>0) ox-=mtnTile;
      ctx.fillStyle = color;
      for (var rep=0; rep<3; rep++) {
        var bx = ox + rep*mtnTile;
        if (bx>W || bx+mtnTile<0) continue;
        ctx.beginPath(); ctx.moveTo(bx,H);
        for (var i=0; i<pts.length; i++) ctx.lineTo(bx+pts[i].x, pts[i].y);
        ctx.lineTo(bx+mtnTile,H); ctx.closePath(); ctx.fill();
      }
    }

    function drawTreeLayer(p) {
      var span=W*3, ox=-(scrollX*0.40%span);
      if (ox>0) ox-=span;
      trees.forEach(function(t){
        var tx=ox+t.x; if(tx<-t.w*2) tx+=span; if(tx<-t.w*2||tx>W+t.w*2) return;
        ctx.fillStyle = t.col===0 ? p.treeA : p.treeB;
        ctx.beginPath(); ctx.moveTo(tx+t.w*0.5,GY-t.h); ctx.lineTo(tx+t.w,GY-t.h*0.42); ctx.lineTo(tx,GY-t.h*0.42); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(tx+t.w*0.5,GY-t.h*0.62); ctx.lineTo(tx+t.w*1.18,GY-t.h*0.16); ctx.lineTo(tx-t.w*0.18,GY-t.h*0.16); ctx.closePath(); ctx.fill();
        ctx.fillRect(Math.round(tx+t.w*0.36), Math.round(GY-t.h*0.16), Math.max(1,Math.round(t.w*0.28)), Math.round(t.h*0.16));
      });
    }

    function drawFgTrees(p) {
      var span=W*5, ox=-(scrollX*1.3%span);
      if (ox>0) ox-=span;
      ctx.globalAlpha = 0.35;
      fgTrees.forEach(function(t){
        var tx=ox+t.x;
        if (tx < -t.w*2) tx += span;
        if (tx < -t.w*2 || tx > W+t.w*2) return;
        ctx.fillStyle = p.treeFg;
        // Only show lower portion — top goes off-canvas for "right next to you" feel
        var visibleH = Math.min(t.h, H * 0.7);
        // Wide triangular canopy
        ctx.beginPath();
        ctx.moveTo(tx + t.w*0.5, GY - visibleH);
        ctx.lineTo(tx + t.w*1.4, GY - visibleH*0.3);
        ctx.lineTo(tx - t.w*0.4, GY - visibleH*0.3);
        ctx.closePath();
        ctx.fill();
        // Thick trunk
        var trunkW = Math.max(2, Math.round(t.w * 0.4));
        ctx.fillRect(
          Math.round(tx + t.w*0.3),
          Math.round(GY - visibleH*0.3),
          trunkW,
          Math.round(visibleH*0.3)
        );
      });
      ctx.globalAlpha = 1;
    }

    function drawSky(p) {
      // Stars
      if (nightness > 0.02) {
        stars.forEach(function(s){
          var tw = 0.35 + Math.sin(scrollX*0.015 + s.phase) * 0.25;
          ctx.globalAlpha = tw * Math.min(1, (nightness-0.02)/0.3);
          ctx.fillStyle = DARK.star;
          ctx.fillRect(s.x, s.y, s.size, s.size);
        });
        ctx.globalAlpha = 1;
      }

      var sunX    = W * 0.82;
      var sunRestY = H * 0.20;
      var horizon  = GY + 22;
      var dayness  = 1 - nightness;

      // Sun (fades out as nightness increases, descends toward horizon)
      if (dayness > 0.02) {
        var sunY = sunRestY + (horizon - sunRestY) * Math.min(1, nightness * 2);
        var sunAlpha = Math.min(1, dayness * 3);
        // Glow
        ctx.globalAlpha = 0.08 * sunAlpha;
        ctx.fillStyle = LIGHT.sunGlow;
        ctx.beginPath(); ctx.arc(sunX, sunY, 10, 0, Math.PI*2); ctx.fill();
        // Body
        ctx.globalAlpha = sunAlpha;
        ctx.fillStyle = LIGHT.sunFace;
        ctx.beginPath(); ctx.arc(sunX, sunY, 5, 0, Math.PI*2); ctx.fill();
        // Rays
        ctx.strokeStyle = LIGHT.sunRay;
        ctx.lineWidth = 1.2;
        for (var ri=0; ri<8; ri++) {
          var ra = sunRayAngle + ri * Math.PI / 4;
          ctx.beginPath();
          ctx.moveTo(sunX + Math.cos(ra)*7, sunY + Math.sin(ra)*7);
          ctx.lineTo(sunX + Math.cos(ra)*11, sunY + Math.sin(ra)*11);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // Moon (rises as nightness increases)
      if (nightness > 0.02) {
        var moonAlpha = Math.min(1, Math.max(0, (nightness-0.02)/0.4));
        var moonY = horizon + (sunRestY - horizon) * Math.min(1, Math.max(0, (nightness-0.5)*2));
        ctx.globalAlpha = moonAlpha;
        // Full circle
        ctx.fillStyle = DARK.moonFace;
        ctx.beginPath(); ctx.arc(sunX, moonY, 6, 0, Math.PI*2); ctx.fill();
        // Crescent cutout
        ctx.fillStyle = p.sky;
        ctx.beginPath(); ctx.arc(sunX+3, moonY-1, 5.5, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Clouds (drift left slowly, fade out at night)
      var cloudAlpha = Math.max(0, 1 - nightness * 4);
      if (cloudAlpha > 0.02) {
        clouds.forEach(function(c){
          var CLOUD_W = W + 40;
          var cx = ((c.x - cloudDrift * c.spd) % CLOUD_W + CLOUD_W) % CLOUD_W - 5;
          ctx.globalAlpha = cloudAlpha * 0.88;
          ctx.fillStyle = p.cloud || LIGHT.cloud;
          ctx.beginPath(); ctx.arc(cx, c.y, c.w*4, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx+c.w*4, c.y+c.w*1.5, c.w*3, 0, Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(cx-c.w*3, c.y+c.w*1.5, c.w*2.5, 0, Math.PI*2); ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
    }

    function drawWheel(cx, cy, angle, p) {
      ctx.strokeStyle = p.biker; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, WR, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle = p.biker;
      ctx.beginPath(); ctx.arc(cx, cy, 1.2, 0, Math.PI*2); ctx.fill();
      var c0=Math.cos(angle), s0=Math.sin(angle);
      ctx.beginPath(); ctx.moveTo(cx+c0*WR*0.8,cy+s0*WR*0.8); ctx.lineTo(cx-c0*WR*0.8,cy-s0*WR*0.8); ctx.stroke();
      var c1=Math.cos(angle+Math.PI/2), s1=Math.sin(angle+Math.PI/2);
      ctx.beginPath(); ctx.moveTo(cx+c1*WR*0.8,cy+s1*WR*0.8); ctx.lineTo(cx-c1*WR*0.8,cy-s1*WR*0.8); ctx.stroke();
    }

    function drawBiker(p) {
      var x=biker.x, y=biker.y;

      // Tilt on jump: lean back on rise, forward on descent
      var tiltAngle = 0;
      if (!biker.onGround) {
        tiltAngle = Math.max(-0.1, Math.min(0.1, biker.vy * 0.015));
      }

      if (tiltAngle !== 0) {
        ctx.save();
        var pivotX = x + WR * 0.7;
        var pivotY = y;
        ctx.translate(pivotX, pivotY);
        ctx.rotate(tiltAngle);
        ctx.translate(-pivotX, -pivotY);
      }

      var rwcx=x-WR*0.55, fwcx=x+WR*1.95;
      drawWheel(rwcx, y, wheelAngle, p);
      drawWheel(fwcx, y, wheelAngle, p);
      var seat={x:rwcx+1,y:y-WR-5}, bb={x:x+WR*0.5,y:y-2}, headT={x:fwcx-1,y:y-WR-3};
      ctx.strokeStyle=p.biker; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(seat.x,seat.y); ctx.lineTo(bb.x,bb.y); ctx.lineTo(headT.x,headT.y); ctx.lineTo(seat.x,seat.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rwcx+1,y-1); ctx.lineTo(seat.x,seat.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rwcx,y); ctx.lineTo(bb.x,bb.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(headT.x,headT.y); ctx.lineTo(fwcx,y); ctx.stroke();
      ctx.fillStyle=p.biker; ctx.fillRect(seat.x-4,seat.y-1,8,2);
      var hip={x:seat.x,y:seat.y}, shldr={x:seat.x+5,y:seat.y-6};
      ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(hip.x,hip.y); ctx.lineTo(shldr.x,shldr.y); ctx.stroke();
      ctx.fillStyle=p.biker; ctx.beginPath(); ctx.arc(shldr.x+1,shldr.y-3,2.5,0,Math.PI*2); ctx.fill();
      var bar={x:headT.x,y:headT.y+1};
      ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(shldr.x,shldr.y); ctx.lineTo(bar.x,bar.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bar.x-1,bar.y-2); ctx.lineTo(bar.x+1,bar.y+2); ctx.stroke();
      var t=(state===PLAYING)?biker.tick*0.12:Math.PI*0.25;
      var knX=bb.x+Math.cos(t)*4, knY=bb.y+Math.sin(t)*3;
      var ftX=bb.x+Math.cos(t+1.6)*4, ftY=bb.y+Math.sin(t+1.6)*3;
      ctx.strokeStyle=p.grey; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(hip.x+1,hip.y+2); ctx.lineTo(knX,knY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(knX,knY); ctx.lineTo(ftX,ftY); ctx.stroke();
      ctx.strokeStyle=p.biker;

      if (tiltAngle !== 0) {
        ctx.restore();
      }
    }

    function drawObs(o, p) {
      var outlineStyle = nightness > 0.5 ? 'rgba(200,200,200,0.3)' : 'rgba(0,0,0,0.25)';
      switch(o.type) {
        case 'log':
          ctx.fillStyle=p.log; ctx.fillRect(o.x,o.y+1,o.w,o.h-2);
          ctx.fillStyle=p.logShadow; ctx.fillRect(o.x,o.y+o.h-2,o.w,2);
          ctx.fillStyle=p.logHi; ctx.fillRect(o.x+1,o.y+1,o.w-2,1);
          ctx.fillStyle=p.logShadow; ctx.fillRect(o.x,o.y,2,o.h); ctx.fillRect(o.x+o.w-2,o.y,2,o.h);
          ctx.strokeStyle=outlineStyle; ctx.lineWidth=1;
          ctx.strokeRect(o.x+0.5, o.y+0.5, o.w-1, o.h-1);
          break;

        case 'boulder':
          ctx.fillStyle=p.rock;
          ctx.beginPath();
          ctx.moveTo(o.x+2,o.y+o.h);
          ctx.lineTo(o.x+o.w-2,o.y+o.h);
          ctx.quadraticCurveTo(o.x+o.w,o.y+o.h*0.5,o.x+o.w*0.65,o.y+1);
          ctx.quadraticCurveTo(o.x+o.w*0.3,o.y,o.x+o.w*0.08,o.y+o.h*0.4);
          ctx.quadraticCurveTo(o.x,o.y+o.h*0.5,o.x+2,o.y+o.h);
          ctx.fill();
          ctx.fillStyle=p.rockShadow; ctx.fillRect(o.x+2,o.y+o.h-3,o.w-4,3);
          // Highlight on top edge
          ctx.fillStyle=p.rockHighlight || p.rock;
          ctx.globalAlpha=0.6;
          ctx.fillRect(o.x+Math.round(o.w*0.2),o.y+2,Math.round(o.w*0.35),1);
          ctx.globalAlpha=1;
          // Outline
          ctx.strokeStyle=outlineStyle; ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(o.x+2,o.y+o.h);
          ctx.lineTo(o.x+o.w-2,o.y+o.h);
          ctx.quadraticCurveTo(o.x+o.w,o.y+o.h*0.5,o.x+o.w*0.65,o.y+1);
          ctx.quadraticCurveTo(o.x+o.w*0.3,o.y,o.x+o.w*0.08,o.y+o.h*0.4);
          ctx.quadraticCurveTo(o.x,o.y+o.h*0.5,o.x+2,o.y+o.h);
          ctx.stroke();
          break;

        case 'rockCluster':
          var rr=[
            {x:o.x,                       y:o.y+Math.round(o.h*0.35), w:Math.round(o.w*0.32), h:Math.round(o.h*0.65)},
            {x:o.x+Math.round(o.w*0.28),  y:o.y,                       w:Math.round(o.w*0.38), h:o.h},
            {x:o.x+Math.round(o.w*0.66),  y:o.y+Math.round(o.h*0.25), w:Math.round(o.w*0.32), h:Math.round(o.h*0.75)},
          ];
          rr.forEach(function(r){
            ctx.fillStyle=p.rock;
            ctx.beginPath();
            ctx.moveTo(r.x+1,r.y+r.h); ctx.lineTo(r.x+r.w-1,r.y+r.h);
            ctx.lineTo(r.x+r.w,r.y+r.h-2); ctx.lineTo(r.x+Math.round(r.w*0.7),r.y);
            ctx.lineTo(r.x+Math.round(r.w*0.2),r.y+1); ctx.lineTo(r.x,r.y+r.h-2);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle=p.rockShadow; ctx.fillRect(r.x+1,r.y+r.h-2,r.w-2,2);
            ctx.strokeStyle=outlineStyle; ctx.lineWidth=1;
            ctx.beginPath();
            ctx.moveTo(r.x+1,r.y+r.h); ctx.lineTo(r.x+r.w-1,r.y+r.h);
            ctx.lineTo(r.x+r.w,r.y+r.h-2); ctx.lineTo(r.x+Math.round(r.w*0.7),r.y);
            ctx.lineTo(r.x+Math.round(r.w*0.2),r.y+1); ctx.lineTo(r.x,r.y+r.h-2);
            ctx.closePath(); ctx.stroke();
          });
          break;

        case 'stump':
          ctx.fillStyle=p.stump; ctx.fillRect(o.x,o.y,o.w,o.h);
          ctx.fillStyle=p.stumpDark;
          ctx.fillRect(o.x+1, o.y+Math.round(o.h*0.33), o.w-2, 1);
          ctx.fillRect(o.x+1, o.y+Math.round(o.h*0.66), o.w-2, 1);
          ctx.fillRect(o.x,o.y,1,o.h); ctx.fillRect(o.x+o.w-1,o.y,1,o.h);
          ctx.fillStyle=p.stumpRing; ctx.fillRect(o.x+1,o.y,o.w-2,2);
          ctx.fillStyle=p.stumpDark; ctx.fillRect(o.x+2,o.y,o.w-4,1);
          ctx.strokeStyle=outlineStyle; ctx.lineWidth=1;
          ctx.strokeRect(o.x+0.5, o.y+0.5, o.w-1, o.h-1);
          break;

        case 'mailbox':
          var postW = Math.max(2, Math.round(o.w * 0.22));
          var postH = Math.round(o.h * 0.28);
          var postX = Math.round(o.x + (o.w - postW) / 2);
          var bodyY = o.y;
          var bodyH = o.h - postH;
          // Post
          ctx.fillStyle = p.mailboxPost;
          ctx.fillRect(postX, bodyY + bodyH, postW, postH);
          // Body (barrel shape: rect with rounded top)
          ctx.fillStyle = p.mailboxBody;
          ctx.fillRect(o.x, bodyY + 3, o.w, bodyH - 3);
          // Dome (arc across top)
          ctx.beginPath();
          ctx.ellipse(o.x + o.w/2, bodyY + 3, o.w/2, 4, 0, Math.PI, 0);
          ctx.fill();
          // Mail slot
          ctx.fillStyle = nightness > 0.5 ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.25)';
          ctx.fillRect(o.x + 2, bodyY + Math.round(bodyH * 0.6), o.w - 4, 1);
          // Flag (right side of body)
          ctx.fillStyle = p.mailboxFlag;
          var flagBaseY = bodyY + Math.round(bodyH * 0.35);
          if (o.flagUp) {
            ctx.fillRect(o.x + o.w - 1, flagBaseY - 4, 1, 4); // pole up
            ctx.fillRect(o.x + o.w,     flagBaseY - 5, 2, 2); // little flag tab
          } else {
            ctx.fillRect(o.x + o.w - 1, flagBaseY - 1, 1, 3); // pole down
          }
          // Outline
          ctx.strokeStyle = outlineStyle; ctx.lineWidth = 1;
          ctx.strokeRect(o.x + 0.5, bodyY + 0.5, o.w - 1, bodyH - 1);
          break;

        case 'mud':
          ctx.fillStyle=p.mud; ctx.fillRect(o.x,o.y+1,o.w,o.h-1);
          ctx.fillStyle=p.mudDark; ctx.fillRect(o.x,o.y+o.h-1,o.w,1);
          ctx.globalAlpha=0.4; ctx.fillStyle=p.splash;
          ctx.fillRect(o.x+3,o.y+1,Math.round(o.w*0.3),1);
          ctx.fillRect(o.x+Math.round(o.w*0.6),o.y+1,Math.round(o.w*0.25),1);
          ctx.globalAlpha=1;
          break;
      }
    }

    function drawParticles(p) {
      particles.forEach(function(pt){
        ctx.globalAlpha = (pt.life/pt.maxLife) * 0.55;
        ctx.fillStyle = pt.mud ? p.splash : p.gnd;
        ctx.fillRect(Math.round(pt.x), Math.round(pt.y), Math.round(pt.size), Math.round(pt.size));
      });
      ctx.globalAlpha = 1;
    }

    function drawMarkers(p) {
      markers.forEach(function(m){
        var mx=Math.round(m.x); if(mx<-20||mx>W+5) return;
        ctx.fillStyle=p.stump; ctx.fillRect(mx,GY-12,2,12);
        ctx.fillStyle=p.logHi; ctx.fillRect(mx-5,GY-15,12,6);
        ctx.fillStyle=p.logShadow; ctx.fillRect(mx-5,GY-15,12,1);
        ctx.fillStyle=p.biker;
        ctx.font='bold '+Math.max(5,S+1)+'px monospace';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(m.label, mx+1, GY-12);
      });
    }

    function drawGameOverOverlay(p) {
      ctx.fillStyle = nightness > 0.5 ? 'rgba(20,20,19,0.86)' : 'rgba(250,250,248,0.86)';
      ctx.fillRect(0,0,W,H);
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle=p.biker;
      ctx.font='bold '+(S*6)+'px Satoshi, sans-serif';
      ctx.fillText('NICE RIDE!', W/2, H*0.34);
      ctx.font=(S*4)+'px Satoshi, sans-serif';
      ctx.fillText(score+'m', W/2, H*0.52);
      ctx.fillStyle=p.grey;
      ctx.font=(S*3)+'px Satoshi, sans-serif';
      ctx.fillText('best: '+highScore+'m', W/2, H*0.64);
      if (deathTimer > 35) {
        ctx.globalAlpha = 0.4 + Math.sin(deathTimer*0.08)*0.3;
        ctx.fillStyle=p.biker;
        ctx.font=(S*2.5)+'px Satoshi, sans-serif';
        ctx.fillText('click to ride again', W/2, H*0.80);
        ctx.globalAlpha=1;
      }
    }

    function drawFrame() {
      var p = getPal();
      ctx.save();
      ctx.translate(Math.round(shakeX), Math.round(shakeY));

      // Sky gradient (atmospheric perspective)
      var skyGrad = ctx.createLinearGradient(0, 0, 0, GY);
      skyGrad.addColorStop(0, p.sky);
      skyGrad.addColorStop(1, lerpColor(p.sky, p.gnd, 0.08));
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0,0,W,H);

      // Stars, sun, moon, clouds
      drawSky(p);

      // Motion blur ghost at high speed
      if (speed > 5 && state === PLAYING) {
        ctx.globalAlpha = 0.12;
        ctx.save(); ctx.translate(-2,0);
        drawMtnLayer(mtnFarPts, 0.12, p.mtnFar);
        ctx.restore();
        ctx.globalAlpha = 1;
      }

      // Mountains
      drawMtnLayer(mtnFarPts,  0.12, p.mtnFar);
      drawMtnLayer(mtnNearPts, 0.22, p.mtnNear);

      // Background trees
      drawTreeLayer(p);

      // Ground
      ctx.fillStyle=p.gnd; ctx.fillRect(0,GY,W,H-GY);
      ctx.fillStyle=p.gndStripe; ctx.fillRect(0,GY,W,2);

      // Thicker trail band — visible "road" the biker rides on
      ctx.fillStyle=p.trail;
      ctx.fillRect(0, GY-3, W, 3);

      // Trail dashes (on top of band)
      ctx.fillStyle=p.gndStripe;
      var dashLen=5, gapLen=4, trailY=GY-2, period=dashLen+gapLen;
      var startX=-(scrollX%period); if(startX>0) startX-=period;
      for (var dx=startX; dx<W; dx+=period) {
        if(dx+dashLen>0) ctx.fillRect(Math.round(dx),trailY,dashLen,1);
      }

      // Distance markers
      drawMarkers(p);

      // Obstacles
      for (var oi=0; oi<obstacles.length; oi++) drawObs(obstacles[oi], p);

      // Particles
      drawParticles(p);

      // Biker
      drawBiker(p);

      // Foreground trees (on top of biker)
      drawFgTrees(p);

      // Milestone flash
      if (milestoneFlash > 0 && state === PLAYING) {
        ctx.globalAlpha = Math.min(1, milestoneFlash / 20);
        ctx.fillStyle = p.biker;
        ctx.font = 'bold ' + (S * 5) + 'px Satoshi, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(milestoneText, W / 2, H * 0.3);
        ctx.globalAlpha = 1;
      }

      // Game over overlay
      if (state===DEAD) drawGameOverOverlay(p);

      ctx.restore();
    }

    function updateHUD() {
      var prompt = document.getElementById('gamePrompt');
      var sc     = document.getElementById('gameScore');
      if (state===IDLE) {
        if (prompt) prompt.textContent = highScore>0 ? 'press space or click to ride  ·  best: '+highScore+'m' : 'press space or click to ride';
        if (sc) sc.textContent='';
      } else if (state===PLAYING) {
        if (prompt) prompt.textContent='';
        if (sc) sc.textContent=score+'m'+(highScore?'  ·  best '+highScore+'m':'');
      } else {
        if (prompt) prompt.textContent='';
        if (sc) sc.textContent='';
      }
    }

    /* ---- Game loop ---- */
    var rafId=null, running=false, lastTs=0, isCanvasVisible=false;

    function tick(ts) {
      if (!running) return;
      var dt=Math.min(ts-lastTs,50); lastTs=ts;
      var n=dt/16.67;

      // Sky transition
      if (Math.abs(nightness-nightTarget) > 0.001) {
        var step = NIGHT_SPEED * n;
        nightness = nightTarget > nightness
          ? Math.min(nightTarget, nightness+step)
          : Math.max(nightTarget, nightness-step);
      }

      sunRayAngle += 0.003 * n;
      cloudDrift  += 0.35 * n;

      // Shake
      if (shakeDur > 0) {
        shakeDur -= n;
        shakeX = (Math.random()-0.5)*4;
        shakeY = (Math.random()-0.5)*3;
      } else { shakeX=0; shakeY=0; }

      if (state===PLAYING) {
        var curSpd = mudSlowTimer>0 ? speed*0.55 : speed;
        scrollX += curSpd * n;
        score = Math.floor(scrollX/8);
        speed = Math.min(BASE_SPD + score*0.003, MAX_SPD);
        biker.tick += n;
        wheelAngle += curSpd * n * 0.15;
        if (mudSlowTimer>0) mudSlowTimer -= n;
        if (milestoneFlash>0) milestoneFlash -= n;

        // Progressive difficulty
        obsMinGap = Math.max(55, 120 - score*0.35);
        obsGapVar = Math.min(90, 40 + score*0.3);

        // Physics
        biker.wasOnGround = biker.onGround;
        if (!biker.onGround) {
          biker.vy += GRAV*n; biker.y += biker.vy*n;
          if (biker.y >= GY-WR) { biker.y=GY-WR; biker.vy=0; biker.onGround=true; }
        }
        if (!biker.wasOnGround && biker.onGround) spawnDust(biker.x, biker.y+WR);

        // Riding dust kick-up behind rear wheel
        if (biker.onGround && biker.tick % 18 < n) {
          particles.push({
            x: biker.x - WR*0.8,
            y: GY - 1,
            vx: -0.3 - Math.random()*0.5,
            vy: -0.3 - Math.random()*0.4,
            life: 8 + Math.random()*5,
            maxLife: 12,
            size: 1,
            mud: false
          });
        }

        // Move obstacles
        for (var oi=0; oi<obstacles.length; oi++) obstacles[oi].x -= curSpd*n;
        obstacles = obstacles.filter(function(o){ return o.x > -(o.w+5); });

        checkMud();

        // Spawn
        nextObsIn -= n;
        if (nextObsIn <= 0) spawnObs();

        // Markers
        if (score >= nextMarker) {
          markers.push({x:W+10, label:nextMarker+'m', life:300});
          milestoneFlash = 40;
          milestoneText  = nextMarker + 'm!';
          nextMarker += 100;
        }
        for (var mi=0; mi<markers.length; mi++) { markers[mi].x -= curSpd*n; markers[mi].life -= n; }
        markers = markers.filter(function(m){ return m.x>-30 && m.life>0; });

        // Speed up music every 500m (caps at 1.8x)
        if (score >= nextTempoMilestone) {
          tempoMultiplier = Math.min(1.8, tempoMultiplier + 0.15);
          nextTempoMilestone += 500;
        }

        // Collision
        if (hitTest()) {
          state=DEAD; deathTimer=0;
          biker.vy=-2;  // stumble, not launch
          biker.onGround=false;
          triggerShake();
          stopMusic();
          playCrashSound();
          if (score>highScore) { highScore=score; localStorage.setItem('bikeHS',highScore); }
        }

      } else if (state===DEAD) {
        deathTimer += n;
        scrollX += 0.4*n;
        biker.vy += GRAV*n; biker.y += biker.vy*n;
        if (biker.y > H+20) biker.y = H+20;
        wheelAngle += 0.04*n;
      } else {
        scrollX += 0.6*n;
        wheelAngle += 0.04*n;
      }

      // Particles
      particles = particles.filter(function(pt){
        pt.x+=pt.vx; pt.y+=pt.vy; pt.vy+=0.08; pt.life-=n; return pt.life>0;
      });

      drawFrame();
      updateHUD();

      // Auto-stop when off-screen and transition complete
      if (!isCanvasVisible && Math.abs(nightness-nightTarget) < 0.002) { stopLoop(); return; }
      rafId = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(function(ts){ lastTs=ts; rafId=requestAnimationFrame(tick); });
    }

    function stopLoop() {
      running=false;
      if (rafId) { cancelAnimationFrame(rafId); rafId=null; }
    }

    window.addEventListener('resize', function(){
      resize(); drawFrame(); updateHUD();
    }, {passive:true});

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries){
        isCanvasVisible = entries[0].isIntersecting;
        if (isCanvasVisible) { startLoop(); }
        else if (Math.abs(nightness-nightTarget) < 0.002) { stopLoop(); }
      }, {threshold:0.1});
      io.observe(canvas);
    } else {
      isCanvasVisible=true; startLoop();
    }

    if ('MutationObserver' in window) {
      var mo = new MutationObserver(function(){
        var dark = document.documentElement.getAttribute('data-theme') === 'dark';
        nightTarget = dark ? 1 : 0;
        if (!running) startLoop(); // start temporarily for sky transition
      });
      mo.observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});
    }

    resize();
    drawFrame();
    updateHUD();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
