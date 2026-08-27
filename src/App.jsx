import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Flower2, Languages, MailOpen, Menu, Mic2, Music2, Pause, Play, Sparkles, Volume2, VolumeX, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

const ASSET_BASE = import.meta.env.BASE_URL;
const assetPath = (path) => ASSET_BASE + path.replace(/^\//, "");

const COPY = {
  zh: {
    nav: ["首页", "二十岁", "祝福"],
    eyebrow: "聂丹茹 · 生日快乐",
    hero: "BLOOM INTO\nTWENTY",
    scroll: "向下滚动，拆开时间的礼物",
    chapter: "愿你在二十岁的花期里",
    lines: [
      ["01", "继续好奇", "把世界看得辽阔，也把日子过得具体。"],
      ["10", "保持自由", "不被答案定义，永远拥有重新出发的勇气。"],
      ["20", "尽情盛放", "被爱包围，也成为照亮自己的那束光。"],
    ],
    about: "致丹茹，二十岁",
    message: "愿你的二十岁，既有花开的热烈，也有树木生长的从容。愿每一次选择都更靠近真实的自己，每一段旅程都有风、有光，也有恰好同行的人。",
    signature: "生日快乐，聂丹茹。欢迎来到闪闪发光的 20 岁。",
    reveal: "拆开生日祝福",
    close: "收好祝福",
    cardTitle: "To Danru, at twenty",
    cardText: "愿你自由、勇敢、清醒、浪漫。愿所有花期都不必被催促，所有热爱都能得到回响。",
    secretKicker: "第二扇门已经打开",
    secretTitle: "欢迎来到聂丹茹的二十岁",
    secretBody: "一座只为今晚点亮的秘密花园，藏着新一岁的花、光与惊喜。",
    soundOn: "打开声音，听见二十岁",
    soundOff: "暂停秘密花园音乐",
    soundError: "声音未能启动，请再点一次",
    celebration: "聂丹茹，二十岁生日快乐！",
    giftTitle: "你的二十岁礼物间",
    giftIntro: "信件、朋友的声音与生日歌，都为你单独珍藏。",
    giftTabs: { letter: "生日信件", voices: "好友祝福", song: "生日祝歌" },
    closeRoom: "关闭礼物间",
    letterSign: "爱你的朋友们 · 2026.08.25",
    voiceTitle: "来自朋友的声音",
    voiceHint: "三段祝福，一段一段慢慢听。播放新的祝福时，上一段会自动暂停。",
    voiceLabels: ["好友祝福 · 01", "好友祝福 · 02", "好友祝福 · 03"],
    songTitle: "为你唱的生日祝福歌",
    songHint: "准备好以后，再亲手按下播放。",
    play: "播放",
    pause: "暂停",
    audioRetry: "加载未完成，请再点一次播放",
  },
  en: {
    nav: ["Home", "Twenty", "Wishes"],
    eyebrow: "NIE DANRU · THE TWENTIETH CHAPTER",
    hero: "BLOOM INTO\nTWENTY",
    scroll: "Scroll to unwrap the gift of time",
    chapter: "May your twentieth year be a season to",
    lines: [
      ["01", "STAY CURIOUS", "See the world widely, and live each small day fully."],
      ["10", "LIVE FREELY", "Let no answer define you. Keep the courage to begin again."],
      ["20", "BLOOM BRIGHTLY", "Be surrounded by love, and become your own light."],
    ],
    about: "For Danru, at twenty",
    message: "May your twentieth year carry the joy of flowers in bloom and the calm confidence of trees taking root. May every choice bring you closer to your truest self.",
    signature: "Happy birthday, Nie Danru. Welcome to your radiant twenties.",
    reveal: "Open your birthday wish",
    close: "Keep this wish",
    cardTitle: "二十岁的丹茹",
    cardText: "May you be free, brave, clear-eyed and romantic. May every love you nurture answer with light.",
    secretKicker: "THE SECOND DOOR IS OPEN",
    secretTitle: "Welcome to Danru's twentieth year",
    secretBody: "A secret garden lit only for tonight, holding flowers, light and one more surprise.",
    soundOn: "Turn on the sound of twenty",
    soundOff: "Pause the secret garden music",
    soundError: "Sound could not start. Tap once more.",
    celebration: "Happy twentieth birthday, Nie Danru!",
    giftTitle: "Your twentieth-year gift room",
    giftIntro: "A letter, your friends' voices and a birthday song—each kept in its own place.",
    giftTabs: { letter: "Birthday letter", voices: "Friend wishes", song: "Birthday song" },
    closeRoom: "Close gift room",
    letterSign: "With love, your friends · 2026.08.25",
    voiceTitle: "Voices from your friends",
    voiceHint: "Three wishes, one at a time. Starting a new one pauses the previous recording.",
    voiceLabels: ["Friend wish · 01", "Friend wish · 02", "Friend wish · 03"],
    songTitle: "A birthday blessing song for you",
    songHint: "Press play whenever you are ready.",
    play: "Play",
    pause: "Pause",
    audioRetry: "Still loading. Tap play once more.",
  },
};

const SECRET_LIGHTS = [
  ["flower", 10, 24, 38], ["sparkle", 21, 72, 22], ["flower", 76, 18, 30],
  ["sparkle", 85, 61, 19], ["flower", 67, 79, 22], ["sparkle", 33, 13, 17],
  ["flower", 16, 83, 24], ["sparkle", 91, 35, 15], ["flower", 42, 87, 18],
];

const CELEBRATION_PIECES = Array.from({ length: 18 }, (_, index) => ({
  left: 5 + (index * 29) % 90,
  delay: (index % 6) * 0.09,
  duration: 1.4 + (index % 5) * 0.16,
  rotate: (index % 2 ? 1 : -1) * (80 + index * 13),
  icon: index % 3 === 0 ? "flower" : "sparkle",
}));

const LETTER_PETALS = [
  { src: assetPath("petals/petal-ivory.webp"), left: "4%", top: "7%", size: 74, delay: .15, duration: 8.8, rotate: -24 },
  { src: assetPath("petals/petal-gold.webp"), left: "87%", top: "12%", size: 58, delay: .8, duration: 10.5, rotate: 34 },
  { src: assetPath("petals/petal-blush.webp"), left: "8%", top: "76%", size: 54, delay: 1.4, duration: 12.2, rotate: 18 },
  { src: assetPath("petals/petal-ivory.webp"), left: "91%", top: "70%", size: 62, delay: 2.1, duration: 11.4, rotate: -42 },
  { src: assetPath("petals/petal-gold.webp"), left: "77%", top: "88%", size: 45, delay: 2.8, duration: 13.2, rotate: 58 },
  { src: assetPath("petals/petal-blush.webp"), left: "18%", top: "18%", size: 38, delay: 3.3, duration: 14.1, rotate: -12 },
];
const audioRegistry = new Set();

function ScrollVideo() {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const posterRef = useRef(null);
  const [source] = useState(() => assetPath(window.matchMedia("(max-width: 768px)").matches ? "hero-scrub-540p.mp4" : "hero-scrub-720p.mp4"));
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const frameInterval = 1000 / 30;
    let duration = 0;
    let latestTarget = 0;
    let lastSeekAt = 0;
    let rafId = 0;
    let seekTimer = 0;
    let unlocked = false;

    const markReady = () => {
      duration = Number.isFinite(video.duration) ? video.duration : duration;
      setProgress(100);
      setReady(true);
    };

    const updateProgress = () => {
      if (!video.buffered.length || !video.duration) return;
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setProgress(Math.min(99, Math.round(bufferedEnd / video.duration * 100)));
    };

    const runSeek = (now) => {
      rafId = 0;
      const remaining = frameInterval - (now - lastSeekAt);
      if (remaining > 1) {
        seekTimer = setTimeout(() => {
          seekTimer = 0;
          rafId = requestAnimationFrame(runSeek);
        }, remaining);
        return;
      }

      if (!duration || Math.abs(video.currentTime - latestTarget) < 1 / 48) return;
      lastSeekAt = now;
      try {
        video.currentTime = Math.min(Math.max(latestTarget, 0), Math.max(duration - 1 / 48, 0));
      } catch {
        // Mobile Safari can briefly reject seeks while it is attaching the decoder.
      }
    };

    const scheduleSeek = () => {
      if (!duration || rafId || seekTimer) return;
      rafId = requestAnimationFrame(runSeek);
    };

    const onSeeked = () => scheduleSeek();
    const onMetadata = () => {
      duration = video.duration;
      latestTarget = (scrollY / Math.max(document.documentElement.scrollHeight - innerHeight, 1)) * duration;
      scheduleSeek();
      ScrollTrigger.refresh();
    };

    const unlockVideo = () => {
      if (unlocked) return;
      unlocked = true;
      if (video.readyState === 0) video.load();
      const playRequest = video.play();
      if (!playRequest) {
        video.pause();
        scheduleSeek();
        return;
      }
      playRequest.then(() => {
        video.pause();
        scheduleSeek();
      }).catch(() => {
        unlocked = false;
      });
    };

    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute("webkit-playsinline", "true");

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("loadeddata", markReady, { once: true });
    video.addEventListener("canplay", markReady, { once: true });
    video.addEventListener("progress", updateProgress);
    video.addEventListener("canplaythrough", markReady, { once: true });
    video.addEventListener("seeked", onSeeked);
    video.load();

    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate(self) {
        latestTarget = self.progress * duration;
        const posterBlend = gsap.utils.clamp(0, 1, self.progress / 0.12);
        gsap.set(posterRef.current, { opacity: 1 - posterBlend });
        scheduleSeek();
      },
    });

    const onMouseMove = (event) => {
      const x = event.clientX / innerWidth * 2 - 1;
      const y = event.clientY / innerHeight * 2 - 1;
      gsap.to(wrapperRef.current, { x: x * -30, y: y * -30, duration: 1.5, ease: "power2.out" });
    };

    addEventListener("mousemove", onMouseMove);
    addEventListener("pointerdown", unlockVideo, { once: true, capture: true });
    addEventListener("touchstart", unlockVideo, { once: true, passive: true, capture: true });
    const timeout = setTimeout(markReady, 4200);

    return () => {
      trigger.kill();
      clearTimeout(timeout);
      clearTimeout(seekTimer);
      if (rafId) cancelAnimationFrame(rafId);
      removeEventListener("mousemove", onMouseMove);
      removeEventListener("pointerdown", unlockVideo, { capture: true });
      removeEventListener("touchstart", unlockVideo, { capture: true });
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("progress", updateProgress);
      video.removeEventListener("seeked", onSeeked);
    };
  }, []);

  return <>
    <div className="video-stage" ref={wrapperRef} aria-hidden="true">
      <video ref={videoRef} className="scroll-video" src={source} poster={assetPath("birthday-hero.png")} muted playsInline preload="auto" />
      <img ref={posterRef} className="video-poster" src={assetPath("birthday-hero.png")} alt="" />
      <div className="video-shade" />
    </div>
    <div className={`loading-screen ${ready ? "is-ready" : ""}`} role="status" aria-live="polite">
      <Flower2 size={28} strokeWidth={1.5} />
      <p>为丹茹准备花海 · {progress}%</p>
    </div>
  </>;
}

function PillNav({ language, setLanguage, copy }) {
  const [open, setOpen] = useState(false);
  const logoRef = useRef(null);
  const navRef = useRef(null);
  useEffect(() => {
    gsap.fromTo(logoRef.current, { scale: 0, rotate: -60 }, { scale: 1, rotate: 0, duration: .6, ease: "back.out(1.7)" });
    gsap.fromTo(navRef.current, { width: 0, opacity: 0 }, { width: "auto", opacity: 1, duration: .65, ease: "power3.out" });
  }, []);
  const goTo = (index) => {
    const positions = [0, document.body.scrollHeight * .54, document.body.scrollHeight];
    gsap.to(window, { duration: 2.2, scrollTo: positions[index], ease: "power3.inOut" });
    setOpen(false);
  };
  return <header className="pill-nav" aria-label="Birthday navigation">
    <button ref={logoRef} className="logo-button" aria-label="Back to top" onClick={() => goTo(0)}
      onMouseEnter={(event) => gsap.to(event.currentTarget.querySelector("svg"), { rotate: 360, duration: .45 })}
      onMouseLeave={(event) => gsap.set(event.currentTarget.querySelector("svg"), { rotate: 0 })}>
      <Flower2 size={24} />
    </button>
    <nav ref={navRef} className="desktop-nav">
      {copy.nav.map((item, index) => <button className="nav-pill" key={item} onClick={() => goTo(index)}><span>{item}</span></button>)}
      <button className="language-pill" onClick={() => setLanguage(language === "zh" ? "en" : "zh")} aria-label="Switch language">
        <Languages size={15} /> <span>{language === "zh" ? "EN" : "中文"}</span>
      </button>
    </nav>
    <div className="mobile-nav">
      <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Open menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
      {open && <div className="mobile-popover">
        {copy.nav.map((item, index) => <button key={item} onClick={() => goTo(index)}>{item}</button>)}
        <button onClick={() => setLanguage(language === "zh" ? "en" : "zh")}>{language === "zh" ? "English" : "中文"}</button>
      </div>}
    </div>
  </header>;
}

function ScrollFloat({ text, eyebrow }) {
  const rootRef = useRef(null);
  const metaRef = useRef(null);
  const lines = useMemo(() => text.split("\n"), [text]);
  useEffect(() => {
    const chars = rootRef.current?.querySelectorAll(".char");
    const headlineTween = gsap.fromTo(chars,
      { opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1, transformOrigin: "50% 0%" },
      { opacity: 0, yPercent: 250, scaleY: 1.2, scaleX: .9, stagger: .012, ease: "power2.inOut", scrollTrigger: { trigger: document.body, start: "top top", end: "+=1200", scrub: 1.5 } },
    );
    const metaTween = gsap.to(metaRef.current, { autoAlpha: 0, y: -24, scrollTrigger: { trigger: document.body, start: "8% top", end: "19% top", scrub: 1 } });
    return () => { headlineTween.kill(); metaTween.kill(); };
  }, [text]);
  return <div className="hero-copy" ref={rootRef}>
    <div className="hero-meta" ref={metaRef}>
      <div className="eyebrow-lockup"><Flower2 size={19} strokeWidth={1.5} /><p className="eyebrow">{eyebrow}</p><span className="eyebrow-rule" /><Sparkles size={16} strokeWidth={1.5} /></div>
      <p className="twenty-mark">20</p>
    </div>
    <div className="hero-motes" aria-hidden="true"><Sparkles className="hero-mote mote-a" /><Flower2 className="hero-mote mote-b" /><Sparkles className="hero-mote mote-c" /></div>
    <h1 aria-label={text.replace("\n", " ")}>
      {lines.map((line) => <span className="headline-line" key={line}>{line.split(" ").map((word, wordIndex) => <span className="headline-word" key={`${word}-${wordIndex}`}>{[...word].map((char, charIndex) => <span className="char" key={`${char}-${charIndex}`}>{char}</span>)}{wordIndex < line.split(" ").length - 1 ? <span>&nbsp;</span> : null}</span>)}</span>)}
    </h1>
  </div>;
}

function StoryRail({ copy }) {
  const railRef = useRef(null);
  useEffect(() => {
    const cards = gsap.utils.toArray(".wish-note", railRef.current);
    const tweens = cards.map((card, index) => gsap.fromTo(card, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, scrollTrigger: { trigger: document.body, start: `${25 + index * 18}% top`, end: `${37 + index * 18}% top`, scrub: 1 } }));
    const exitTween = gsap.to(railRef.current, { autoAlpha: 0, y: -60, scrollTrigger: { trigger: document.body, start: "67% top", end: "73% top", scrub: 1 } });
    return () => { tweens.forEach((item) => item.kill()); exitTween.kill(); };
  }, [copy]);
  return <section className="story-rail" ref={railRef} aria-label="Birthday wishes">
    <p className="story-kicker">{copy.chapter}</p>
    {copy.lines.map(([number, title, body], index) => <article className={`wish-note note-${index + 1}`} key={number}><span>{number}</span><h2>{title}</h2><p>{body}</p></article>)}
  </section>;
}

function createAmbientEngine() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  const context = new AudioContextClass();
  const master = context.createGain();
  const filter = context.createBiquadFilter();
  master.gain.value = .0001;
  filter.type = "lowpass";
  filter.frequency.value = 2200;
  filter.Q.value = .35;
  master.connect(filter);
  filter.connect(context.destination);

  const pad = context.createGain();
  pad.gain.value = .07;
  pad.connect(master);
  [[261.63, "sine", -4], [392, "triangle", 5], [523.25, "sine", -8]].forEach(([frequency, type, detune]) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.detune.value = detune;
    gain.gain.value = type === "triangle" ? .32 : .44;
    oscillator.connect(gain).connect(pad);
    oscillator.start();
  });

  const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 523.25, 392, 440];
  let noteIndex = 0;
  let timer = 0;
  let suspendTimer = 0;
  const playChime = () => {
    if (context.state !== "running") return;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const panner = context.createStereoPanner ? context.createStereoPanner() : null;
    oscillator.type = noteIndex % 3 === 0 ? "triangle" : "sine";
    oscillator.frequency.value = notes[noteIndex++ % notes.length];
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.075, now + .08);
    gain.gain.exponentialRampToValueAtTime(.0001, now + 4.6);
    if (panner) {
      panner.pan.value = noteIndex % 2 ? -.28 : .28;
      oscillator.connect(gain).connect(panner).connect(master);
    } else oscillator.connect(gain).connect(master);
    oscillator.start(now);
    oscillator.stop(now + 4.8);
  };
  return {
    async start() {
      clearTimeout(suspendTimer);
      const unlockSource = context.createBufferSource();
      unlockSource.buffer = context.createBuffer(1, 1, context.sampleRate);
      unlockSource.connect(context.destination);
      unlockSource.start();
      await context.resume();
      if (context.state !== "running") throw new Error("AudioContext did not enter the running state");
      const now = context.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, .0001), now);
      master.gain.exponentialRampToValueAtTime(.62, now + 1.8);
      playChime();
      clearInterval(timer);
      timer = setInterval(playChime, 3800);
    },
    stop() {
      clearInterval(timer);
      timer = 0;
      if (context.state !== "closed") {
        const now = context.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(Math.max(master.gain.value, .0001), now);
        master.gain.exponentialRampToValueAtTime(.0001, now + 1.4);
        clearTimeout(suspendTimer);
        suspendTimer = setTimeout(() => context.suspend(), 1500);
      }
    },
    dispose() {
      clearInterval(timer);
      clearTimeout(suspendTimer);
      if (context.state !== "closed") context.close();
    },
  };
}

function AmbientMusicControl({ copy }) {
  const engineRef = useRef(null);
  const pauseRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const pauseAmbient = () => {
      engineRef.current?.stop();
      setPlaying(false);
    };
    pauseRef.current = pauseAmbient;
    audioRegistry.add(pauseAmbient);
    addEventListener("birthday:ambient-stop", pauseAmbient);
    return () => {
      audioRegistry.delete(pauseAmbient);
      removeEventListener("birthday:ambient-stop", pauseAmbient);
      engineRef.current?.dispose();
    };
  }, []);
  const toggle = async () => {
    if (playing) {
      pauseRef.current?.();
      return;
    }
    setError(false);
    audioRegistry.forEach((pause) => { if (pause !== pauseRef.current) pause(); });
    engineRef.current ||= createAmbientEngine();
    if (!engineRef.current) {
      setError(true);
      return;
    }
    try {
      await engineRef.current.start();
      setPlaying(true);
    } catch {
      setPlaying(false);
      setError(true);
    }
  };
  return <button className={`garden-sound ${playing ? "is-playing" : ""}`} onClick={toggle} aria-pressed={playing}>
    {playing ? <VolumeX size={17} /> : <Volume2 size={17} />}
    <span>{error ? copy.soundError : playing ? copy.soundOff : copy.soundOn}</span>

  </button>;
}
function SecretGarden({ copy }) {
  const gardenRef = useRef(null);
  const contentRef = useRef(null);
  useEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: document.body, start: "68% top", end: "92% top", scrub: 1.15, onUpdate(self) { if (self.progress > .86) dispatchEvent(new Event("birthday:ambient-stop")); } } });
      timeline.fromTo(gardenRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: .16 })
        .fromTo(contentRef.current, { autoAlpha: 0, scale: .86, y: 70 }, { autoAlpha: 1, scale: 1, y: 0, duration: .28, ease: "power3.out" }, .06)
        .fromTo(".secret-light", { autoAlpha: 0, scale: 0, rotate: -35 }, { autoAlpha: 1, scale: 1, rotate: 0, stagger: .025, duration: .22, ease: "back.out(1.8)" }, .12)
        .to(contentRef.current, { autoAlpha: 0, scale: 1.05, y: -45, duration: .16 }, .82)
        .to(gardenRef.current, { autoAlpha: 0, duration: .12 }, .88);
    }, gardenRef);
    return () => context.revert();
  }, [copy]);
  return <section className="secret-garden" ref={gardenRef} aria-label={copy.secretTitle}>
    <div className="secret-veil" />
    {SECRET_LIGHTS.map(([icon, left, top, size], index) => <span className="secret-light" style={{ left: `${left}%`, top: `${top}%` }} key={`${left}-${top}`}>
      {icon === "flower" ? <Flower2 size={size} strokeWidth={1.15} /> : <Sparkles size={size} strokeWidth={1.15} />}
    </span>)}
    <div className="secret-content" ref={contentRef}>
      <p>{copy.secretKicker}</p><span className="secret-age">20</span><h2>{copy.secretTitle}</h2><div className="secret-divider"><Flower2 size={20} strokeWidth={1.25} /></div><p className="secret-body">{copy.secretBody}</p><AmbientMusicControl copy={copy} />
    </div>
  </section>;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

function AudioPlayer({ src, title, caption, copy }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    const audio = audioRef.current;
    const pauseSelf = () => audio.pause();
    audioRegistry.add(pauseSelf);
    const onTime = () => setCurrent(audio.currentTime);
    const onDuration = () => setDuration(audio.duration || 0);
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onCanPlay = () => setError("");
    const onError = () => setError(copy.audioRetry);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("durationchange", onDuration);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("error", onError);
    return () => {
      audio.pause(); audioRegistry.delete(pauseSelf);
      audio.removeEventListener("timeupdate", onTime); audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("durationchange", onDuration); audio.removeEventListener("pause", onPause); audio.removeEventListener("play", onPlay);
      audio.removeEventListener("canplay", onCanPlay); audio.removeEventListener("error", onError);
    };
  }, []);
  const toggle = async () => {
    const audio = audioRef.current;
    if (audio.paused) {
      setError("");
      audioRegistry.forEach((pause) => pause());
      audio.muted = false;
      audio.volume = 1;
      if (audio.readyState === 0 || audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) audio.load();
      try { await audio.play(); } catch { setPlaying(false); setError(copy.audioRetry); }
    } else audio.pause();
  };
  const seek = (event) => {
    const next = Number(event.target.value);
    audioRef.current.currentTime = next;
    setCurrent(next);
  };
  return <article className={`audio-card ${playing ? "is-playing" : ""}`}>
    <audio ref={audioRef} src={src} preload="auto" />
    <button className="audio-play" onClick={toggle} aria-label={`${playing ? copy.pause : copy.play} ${title}`}>
      {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
    </button>
    <div className="audio-copy"><strong>{title}</strong>{(error || caption) && <span className={error ? "audio-error" : ""} role={error ? "status" : undefined}>{error || caption}</span>}
      <div className="audio-timeline"><input type="range" min="0" max={duration || 0} step="0.01" value={Math.min(current, duration || 0)} onChange={seek} aria-label={title} /><time>{formatTime(current)} / {formatTime(duration)}</time></div>
    </div>
  </article>;
}

function GiftRoom({ copy, onClose }) {
  const [tab, setTab] = useState("letter");
  const [celebrating, setCelebrating] = useState(true);
  const roomRef = useRef(null);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setCelebrating(false), 2350);
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    addEventListener("keydown", onKey);
    return () => { clearTimeout(timer); removeEventListener("keydown", onKey); document.body.style.overflow = previousOverflow; audioRegistry.forEach((pause) => pause()); };
  }, [onClose]);
  useEffect(() => {
    if (!celebrating) gsap.fromTo(roomRef.current, { autoAlpha: 0, scale: .94, y: 24 }, { autoAlpha: 1, scale: 1, y: 0, duration: .65, ease: "power3.out" });
  }, [celebrating]);
  const tabs = [
    ["letter", copy.giftTabs.letter, MailOpen], ["voices", copy.giftTabs.voices, Mic2], ["song", copy.giftTabs.song, Music2],
  ];
  return <div className="gift-modal" role="dialog" aria-modal="true" aria-labelledby="gift-title">
    {celebrating ? <div className="celebration" aria-live="polite">
      <div className="celebration-halo"><Flower2 size={76} strokeWidth={1} /><span>20</span></div>
      <h2>{copy.celebration}</h2><p>BLOOM · BRAVE · BE LOVED</p>
      <div className="celebration-pieces" aria-hidden="true">{CELEBRATION_PIECES.map((piece, index) => <span style={{ left: `${piece.left}%`, animationDelay: `${piece.delay}s`, animationDuration: `${piece.duration}s`, "--spin": `${piece.rotate}deg` }} key={index}>
        {piece.icon === "flower" ? <Flower2 size={18 + index % 3 * 4} /> : <Sparkles size={16 + index % 4 * 3} />}
      </span>)}</div>
    </div> : <div className="gift-room" ref={roomRef}>
      <button className="gift-close" onClick={onClose} aria-label={copy.closeRoom}><X size={21} /></button>
      <header className="gift-header"><span className="gift-seal"><Flower2 size={22} /></span><div><p>20 · FOR NIE DANRU</p><h2 id="gift-title">{copy.giftTitle}</h2><span>{copy.giftIntro}</span></div></header>
      <nav className="gift-tabs" aria-label={copy.giftTitle}>{tabs.map(([id, label, Icon]) => <button className={tab === id ? "active" : ""} onClick={() => setTab(id)} aria-selected={tab === id} role="tab" key={id}><Icon size={17} />{label}</button>)}</nav>
      <div className="gift-stage">
        {tab === "letter" && <section className="letter-panel" role="tabpanel"><div className="letter-petals" aria-hidden="true">{LETTER_PETALS.map((petal, index) => <img src={petal.src} alt="" key={`${petal.src}-${index}`} style={{ left: petal.left, top: petal.top, width: `${petal.size}px`, animationDelay: `${petal.delay}s`, animationDuration: `${petal.duration}s`, "--petal-rotate": `${petal.rotate}deg` }} />)}</div><p>LETTER · 08.25</p><span className="letter-age">20</span><h3>{copy.cardTitle}</h3><div className="letter-rule"><Flower2 size={18} /></div><p className="letter-body">{copy.cardText}</p><p className="letter-long">{copy.message}</p><footer>{copy.letterSign}</footer></section>}
        {tab === "voices" && <section className="audio-panel" role="tabpanel"><div className="audio-heading"><Mic2 size={26} /><div><h3>{copy.voiceTitle}</h3><p>{copy.voiceHint}</p></div></div>{copy.voiceLabels.map((label, index) => <AudioPlayer key={label} src={assetPath(`audio/friend-wish-0${index + 1}.mp3`)} title={label} caption={["31.4s", "14.0s", "14.6s"][index]} copy={copy} />)}</section>}
        {tab === "song" && <section className="audio-panel song-panel" role="tabpanel"><div className="record-mark"><Music2 size={40} /><span>20</span></div><div className="audio-heading"><div><h3>{copy.songTitle}</h3><p>{copy.songHint}</p></div></div><AudioPlayer src={assetPath("audio/birthday-song.mp3")} title={copy.songTitle} caption="21.8s" copy={copy} /></section>}
      </div>
    </div>}
  </div>;
}
function GlassPanel({ copy }) {
  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const tween = gsap.fromTo(wrapperRef.current, { y: "100%" }, { y: "0%", ease: "none", scrollTrigger: { trigger: wrapperRef.current, start: "top bottom", end: "bottom bottom", scrub: 1.5 } });
    return () => tween.kill();
  }, []);
  const onMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 2 - 1;
    const y = (event.clientY - rect.top) / rect.height * 2 - 1;
    gsap.to(panelRef.current, { x: x * 16, y: y * 12, rotationY: x * 2.5, rotationX: -y * 2.5, duration: 1, ease: "power3.out" });
  };
  return <>
    <div className="panel-anchor" ref={wrapperRef}>
    <section className="glass-wrap" onMouseMove={onMove} onMouseLeave={() => gsap.to(panelRef.current, { x: 0, y: 0, rotationX: 0, rotationY: 0 })}>
      <div className="glass-panel" ref={panelRef}>
        <div className="panel-number">20</div>
        <div className="panel-content">
          <p className="serif-kicker">{copy.about}</p>
          <h2>{copy.message}</h2>
          <p className="signature">{copy.signature}</p>
          <button className="reveal-button" onClick={() => setRevealed(true)}><Sparkles size={18} /> {copy.reveal}</button>
        </div>
        <div className="marquee" aria-hidden="true"><div className="marquee-track">
          {["BRAVE", "CURIOUS", "FREE", "LOVED", "RADIANT", "BRAVE", "CURIOUS", "FREE", "LOVED", "RADIANT"].map((item, index) => <span key={`${item}-${index}`}>{item} · 聂丹茹 · 20</span>)}
        </div></div>
      </div>
    </section>
    </div>
    {revealed && <GiftRoom copy={copy} onClose={() => setRevealed(false)} />}
  </>;
}

export function App() {
  const [language, setLanguage] = useState("zh");
  const copy = COPY[language];
  useEffect(() => {
    const root = document.documentElement;
    let stableWidth = innerWidth;
    let refreshTimer = 0;
    const setStableViewport = () => {
      root.style.setProperty("--app-height", String(innerHeight) + "px");
      root.style.setProperty("--story-height", String(innerHeight * 5.8) + "px");
      root.style.setProperty("--panel-height", String(innerHeight * .88) + "px");
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
    };
    const onResize = () => {
      if (Math.abs(innerWidth - stableWidth) < 48) return;
      stableWidth = innerWidth;
      setStableViewport();
    };
    const onOrientation = () => setTimeout(setStableViewport, 240);
    setStableViewport();
    addEventListener("resize", onResize, { passive: true });
    addEventListener("orientationchange", onOrientation, { passive: true });
    return () => {
      clearTimeout(refreshTimer);
      removeEventListener("resize", onResize);
      removeEventListener("orientationchange", onOrientation);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    const progress = document.querySelector(".page-progress span");
    const trigger = ScrollTrigger.create({ start: 0, end: "max", onUpdate(self) { if (progress) progress.style.transform = `scaleX(${self.progress})`; } });
    return () => trigger.kill();
  }, [language]);
  return <main className="birthday-site">
    <ScrollVideo />
    <PillNav language={language} setLanguage={setLanguage} copy={copy} />
    <div className="page-progress"><span /></div>
    <div className="scroll-hint"><ArrowDown size={16} /><span>{copy.scroll}</span></div>
    <div className="experience">
      <ScrollFloat text={copy.hero} eyebrow={copy.eyebrow} />
      <StoryRail copy={copy} />
      <SecretGarden copy={copy} />
      <GlassPanel copy={copy} />
    </div>
  </main>;
}








