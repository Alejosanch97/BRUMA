import { useState, useEffect, useCallback, useRef } from "react";
import "../Styles/home.css";

/* ═══════════════ LINKS ═══════════════ */
const IG_URL = "https://www.instagram.com/bruma.byvanne/";
const WA_URL = "https://api.whatsapp.com/send/?phone=573144100099&text&type=phone_number&app_absent=0";
const TT_URL = "https://www.tiktok.com/@bruma.byvanne";

// 👉 Si quieres usar el logo real como imagen (PNG sin fondo, ej. en Cloudinary), pega aquí el link.
//    Si queda vacío, el logo se dibuja con tipografía.
const LOGO_URL = "";

/* ═══════════════ LOOKS (temas completos) ═══════════════ */
// Cada color cambia TODA la página: fondo, closet, etiquetas, acentos, bloque final…
const THEMES = [
	{
		id: "butter", name: "Beurre", sw: "#f2dc6e",
		paper: "#fbf4d2", paper2: "#f3e7b0", closet: "#f1df8e", closetHi: "#fbf0c0", closetLo: "#e3cb66", label: "#fffbea",
		ink: "#1d1608", soft: "#6e5f2c", line: "rgba(29, 22, 8, 0.16)",
		acc: "#1d1608", accInk: "#f2dc6e", hi: "#f2dc6e", dark: "#1d1608", darkInk: "#fbf4d2", mist: "#fffbe6",
		tagA: "#fffdf3", tagAInk: "#1d1608", tagB: "#1d1608", tagBInk: "#fbf4d2", tagC: "#d4a72c", tagCInk: "#1d1608",
	},
	{
		id: "choco", name: "Cacao", sw: "#4b2a1d",
		paper: "#f1e4d6", paper2: "#e6d2bd", closet: "#d8bc9f", closetHi: "#ecdac6", closetLo: "#c49f7c", label: "#fbf4ec",
		ink: "#2b160d", soft: "#7a5a46", line: "rgba(43, 22, 13, 0.16)",
		acc: "#4b2a1d", accInk: "#f1e4d6", hi: "#e3b98f", dark: "#2b160d", darkInk: "#f1e4d6", mist: "#fff6ec",
		tagA: "#fbf4ec", tagAInk: "#2b160d", tagB: "#4b2a1d", tagBInk: "#f1e4d6", tagC: "#b9835a", tagCInk: "#fffaf4",
	},
	{
		id: "noir", name: "Noir", sw: "#151211",
		paper: "#121010", paper2: "#1c1917", closet: "#1f1b18", closetHi: "#2e2723", closetLo: "#141110", label: "#1e1a17",
		ink: "#f4efe6", soft: "#a49a8f", line: "rgba(244, 239, 230, 0.16)",
		acc: "#e9cf86", accInk: "#121010", hi: "#e9cf86", dark: "#000000", darkInk: "#f4efe6", mist: "rgba(255, 255, 255, 0.16)",
		tagA: "#f4efe6", tagAInk: "#121010", tagB: "#e9cf86", tagBInk: "#121010", tagC: "#3a322d", tagCInk: "#f4efe6",
	},
	{
		id: "cream", name: "Ivoire", sw: "#e3d5bd",
		paper: "#f4efe6", paper2: "#e9e1d3", closet: "#e8dfcf", closetHi: "#f3ece0", closetLo: "#ddd2bf", label: "#fffefb",
		ink: "#151211", soft: "#6f655b", line: "rgba(21, 18, 17, 0.14)",
		acc: "#f2dc6e", accInk: "#151211", hi: "#f2dc6e", dark: "#151211", darkInk: "#f4efe6", mist: "#ffffff",
		tagA: "#fffdf8", tagAInk: "#151211", tagB: "#151211", tagBInk: "#f4efe6", tagC: "#4b2a1d", tagCInk: "#f4efe6",
	},
];
const DEFAULT_THEME = "cream";
const STORE_KEY = "bruma-look";

const themeVars = (t) => ({
	"--br-paper": t.paper,
	"--br-paper-2": t.paper2,
	"--br-closet": t.closet,
	"--br-closet-hi": t.closetHi,
	"--br-closet-lo": t.closetLo,
	"--br-label": t.label,
	"--br-ink": t.ink,
	"--br-ink-soft": t.soft,
	"--br-line": t.line,
	"--br-mist": t.mist,
	"--br-dark": t.dark,
	"--br-dark-ink": t.darkInk,
	"--br-hi": t.hi,
	"--acc": t.acc,
	"--acc-ink": t.accInk,
	"--tag-a": t.tagA,
	"--tag-a-ink": t.tagAInk,
	"--tag-b": t.tagB,
	"--tag-b-ink": t.tagBInk,
	"--tag-c": t.tagC,
	"--tag-c-ink": t.tagCInk,
});

const loadTheme = () => {
	try {
		const id = localStorage.getItem(STORE_KEY);
		return THEMES.find((t) => t.id === id) || THEMES.find((t) => t.id === DEFAULT_THEME);
	} catch {
		return THEMES.find((t) => t.id === DEFAULT_THEME);
	}
};

/* ═══════════════ DATA ═══════════════ */
const CLOSET = [
	{ id: "ig", n: "01", label: "Instagram", tag: "La colección", handle: "@bruma.byvanne", url: IG_URL, icon: "instagram", tone: "a", len: 14 },
	{ id: "wa", n: "02", label: "WhatsApp", tag: "Pide el tuyo", handle: "Compra aquí ✦", url: WA_URL, icon: "whatsapp", tone: "b", len: 34, featured: true },
	{ id: "tt", n: "03", label: "TikTok", tag: "Outfits en acción", handle: "@bruma.byvanne", url: TT_URL, icon: "tiktok", tone: "c", len: 20 },
];

const ROTATING = ["Básicos que elevan tus looks", "Envíos a toda Colombia", "Entrega inmediata", "Pregunta por el tuyo"];

const PERKS = [
	{ icon: "spark", text: "Básicos y prendas para elevar tus looks" },
	{ icon: "truck", text: "Envíos a toda Colombia" },
	{ icon: "box", text: "Entrega inmediata" },
	{ icon: "pin", text: "Tienda online · Bogotá" },
];

const TAPE = "NEW IN ✦ MODA FEMENINA ✦ BÁSICOS QUE ELEVAN ✦ ENVÍOS A TODA COLOMBIA ✦ ";
const WORD = "bruma".split("");

/* ═══════════════ ICONS (genéricos, sin logos de marca) ═══════════════ */
const Icon = ({ name, size = 20 }) => {
	const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
	switch (name) {
		case "instagram": return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" /></svg>;
		case "whatsapp": return <svg {...p}><path d="M20.5 11.6a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.3-4.4a8.5 8.5 0 1 1 15.7-4.5z" /><path d="M9 8.6c.2-.5.9-.6 1.2-.1l.7 1.3c.2.3.1.7-.2.9l-.5.4c.5 1.1 1.4 2 2.5 2.5l.4-.5c.2-.3.6-.4.9-.2l1.3.7c.5.3.4 1-.1 1.2-2.9 1.3-7.5-3.3-6.2-6.2z" fill="currentColor" stroke="none" /></svg>;
		case "tiktok": return <svg {...p}><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></svg>;
		case "bag": return <svg {...p}><path d="M5 8h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9z" /><path d="M9 10V6a3 3 0 0 1 6 0v4" /></svg>;
		case "arrow": return <svg {...p}><path d="M7 17L17 7M8 7h9v9" /></svg>;
		case "share": return <svg {...p}><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" /></svg>;
		case "spark": return <svg {...p}><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" /><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" /></svg>;
		case "truck": return <svg {...p}><path d="M2 6h11v10H2zM13 9h4l4 4v3h-8" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>;
		case "box": return <svg {...p}><path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z" /><path d="M3 7.5l9 4.5 9-4.5M12 12v9" /></svg>;
		case "pin": return <svg {...p}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>;
		default: return null;
	}
};

/* Símbolos de cuidado de prenda (decorativos) */
const CareSymbols = () => (
	<div className="br-care-symbols" aria-hidden="true">
		<svg viewBox="0 0 32 24"><path d="M3 6l3 14h20l3-14" /><path d="M3 6c4 3 7-3 10 0s7 3 10 0 4-1 6 0" /><text x="16" y="17">30</text></svg>
		<svg viewBox="0 0 32 24"><path d="M16 3L29 21H3z" /><path d="M8 4l16 18M24 4L8 22" /></svg>
		<svg viewBox="0 0 32 24"><path d="M4 19h24c0-6-4-10-11-10H9" /><path d="M9 9V6" /><circle cx="16" cy="15" r="1.2" fill="currentColor" /></svg>
		<svg viewBox="0 0 32 24"><rect x="4" y="2" width="24" height="20" rx="2" /><circle cx="16" cy="12" r="7" /></svg>
		<svg viewBox="0 0 32 24"><circle cx="16" cy="12" r="9" /><text x="16" y="16">P</text></svg>
	</div>
);

/* ═══════════════ LOGO ═══════════════ */
const Logo = ({ className = "" }) =>
	LOGO_URL ? (
		<img className={`br-logo-img ${className}`} src={LOGO_URL} alt="Bruma by Vanne" />
	) : (
		<span className={`br-logo ${className}`} aria-label="Bruma by Vanne">
			<span className="br-logo-main">bruma</span>
			<span className="br-logo-sub"><i>by</i>VANNE</span>
		</span>
	);

/* ═══════════════ HOME ═══════════════ */
export const Home = () => {
	const [intro, setIntro] = useState("closed"); // closed → open → done
	const [word, setWord] = useState(0);
	const [swing, setSwing] = useState(null);
	const [theme, setTheme] = useState(loadTheme);
	const [wipe, setWipe] = useState(null);
	const [dock, setDock] = useState(false);
	const [toast, setToast] = useState("");
	const wipeTimers = useRef([]);

	const mounted = intro !== "closed";

	// Puertas del closet: se abren solas (o al tocarlas)
	useEffect(() => {
		const t1 = setTimeout(() => setIntro((s) => (s === "closed" ? "open" : s)), 900);
		const t2 = setTimeout(() => setIntro("done"), 2200);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, []);
	const skipIntro = () => setIntro((s) => (s === "closed" ? "open" : s));

	// Frase que va rotando bajo el logo
	useEffect(() => {
		const id = setInterval(() => setWord((w) => (w + 1) % ROTATING.length), 2600);
		return () => clearInterval(id);
	}, []);

	// Guarda el look elegido + pinta la barra del navegador del celular
	useEffect(() => {
		try {
			localStorage.setItem(STORE_KEY, theme.id);
		} catch {
			/* sin almacenamiento */
		}
		let meta = document.querySelector('meta[name="theme-color"]');
		if (!meta) {
			meta = document.createElement("meta");
			meta.name = "theme-color";
			document.head.appendChild(meta);
		}
		meta.content = theme.paper;
		document.body.style.background = theme.paper;
	}, [theme]);

	useEffect(() => () => wipeTimers.current.forEach(clearTimeout), []);

	// Botón flotante al pasar el hero
	useEffect(() => {
		const onScroll = () => {
			const nearEnd = window.innerHeight + window.scrollY > document.body.scrollHeight - 260;
			setDock(window.scrollY > 420 && !nearEnd);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Revelado al hacer scroll
	useEffect(() => {
		if (!mounted) return;
		const els = document.querySelectorAll("[data-reveal]:not([data-visible])");
		const io = new IntersectionObserver(
			(entries) =>
				entries.forEach((e) => {
					if (e.isIntersecting) {
						e.target.dataset.visible = "true";
						io.unobserve(e.target);
					}
				}),
			{ threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
		);
		els.forEach((el) => io.observe(el));
		return () => io.disconnect();
	}, [mounted]);

	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => setToast(""), 2200);
		return () => clearTimeout(t);
	}, [toast]);

	// La etiqueta se balancea al tocarla (el link abre normal)
	const touchTag = useCallback((id) => {
		setSwing(null);
		requestAnimationFrame(() => setSwing(id));
		navigator.vibrate?.(12);
	}, []);

	// Cambio de look: un círculo del nuevo color cubre la pantalla desde el dedo
	const pickTheme = (t, e) => {
		if (t.id === theme.id || wipe) return;
		const r = e.currentTarget.getBoundingClientRect();
		wipeTimers.current.forEach(clearTimeout);
		setWipe({ t, x: r.left + r.width / 2, y: r.top + r.height / 2, key: Date.now() });
		navigator.vibrate?.([10, 40, 10]);
		wipeTimers.current = [
			setTimeout(() => setTheme(t), 560),
			setTimeout(() => setWipe(null), 1400),
		];
	};

	const share = async () => {
		const data = { title: "Bruma by Vanne ✨", text: "Moda femenina · envíos a toda Colombia ✨", url: window.location.href };
		try {
			if (navigator.share) return await navigator.share(data);
			await navigator.clipboard.writeText(data.url);
			setToast("¡Link copiado! ✦");
		} catch {
			/* el usuario canceló */
		}
	};

	return (
		<div className={`br-wrap theme-${theme.id} ${mounted ? "is-in" : ""}`} style={themeVars(theme)}>
			{/* ─── PUERTAS DEL CLOSET ─── */}
			{intro !== "done" && (
				<div className={`br-doors ${intro === "open" ? "open" : ""}`} onClick={skipIntro} aria-hidden="true">
					<div className="br-door l"><i className="br-knob" /></div>
					<div className="br-door r"><i className="br-knob" /></div>
					<div className="br-doors-logo">
						<Logo />
						<small>Now open ✦</small>
					</div>
				</div>
			)}

			<main className="br-page">
				<div className="br-grain" aria-hidden="true" />

				{/* Niebla (bruma) */}
				<div className="br-mist" aria-hidden="true">
					<span className="m1" />
					<span className="m2" />
					<span className="m3" />
				</div>

				{/* ─── TOP ─── */}
				<header className="br-top br-rise" style={{ "--d": ".2s" }}>
					<span className="br-pill"><i /> Tienda online</span>
					<button className="br-share" onClick={share} aria-label="Compartir"><Icon name="share" size={17} /></button>
				</header>

				{/* ─── HERO ─── */}
				<section className="br-hero">
					<svg className="br-sticker br-rise" style={{ "--d": ".9s" }} viewBox="0 0 120 120" aria-hidden="true">
						<defs><path id="brRing" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
						<circle cx="60" cy="60" r="58" className="br-sticker-bg" />
						<text><textPath href="#brRing" textLength="286">NEW IN ✦ MODA FEMENINA ✦ BOGOTÁ ✦</textPath></text>
						<text x="60" y="68" className="br-sticker-star">✦</text>
					</svg>

					<p className="br-kicker br-rise" style={{ "--d": ".3s" }}>
						<span>Moda femenina</span>
						<i>colección actual</i>
					</p>

					{LOGO_URL ? (
						<Logo className="br-hero-img br-rise" />
					) : (
						<h1 className="br-hero-logo" aria-label="Bruma by Vanne">
							<span className="br-word" aria-hidden="true">
								{WORD.map((c, i) => <span key={i} style={{ "--i": i }}>{c}</span>)}
							</span>
							<span className="br-vanne" aria-hidden="true"><i>by</i><b>VANNE</b></span>
						</h1>
					)}

					<div className="br-rotator br-rise" style={{ "--d": "1.2s" }}>
						<span key={word}>{ROTATING[word]}</span>
					</div>
				</section>

				{/* ─── CLOSET VIRTUAL ─── */}
				<section className="br-closet-sec">
					<div className="br-closet br-rise" style={{ "--d": "1s" }}>
						<div className="br-closet-head">
							<small>N° 01 — Closet virtual</small>
							<h2>Elige tu <i>prenda</i></h2>
						</div>

						<div className="br-rack">
							<span className="br-rail" aria-hidden="true"><i /><i /></span>
							<nav className="br-hangs">
								{CLOSET.map((c, i) => (
									<a
										key={c.id}
										href={c.url}
										target="_blank"
										rel="noopener noreferrer"
										className={`br-hang tone-${c.tone} ${c.featured ? "is-feat" : ""} ${swing === c.id ? "swing" : ""}`}
										style={{ "--i": i, "--len": `${c.len}px` }}
										onClick={() => touchTag(c.id)}
										onAnimationEnd={(e) => e.animationName === "brTapSwing" && setSwing(null)}
										aria-label={`${c.label}: ${c.tag}`}
									>
										<svg className="br-hanger" viewBox="0 0 120 64" aria-hidden="true">
											<path d="M60 26v-6c0-3 6-4 6-10a6 6 0 0 0-12 0" />
											<path d="M60 26L9 54c-3 2-2 5 2 5h98c4 0 5-3 2-5z" />
										</svg>
										<span className="br-string" />
										<span className="br-tag">
											<span className="br-tag-hole" />
											{c.featured && <span className="br-tag-badge">Favorito</span>}
											<span className="br-tag-n">N° {c.n}</span>
											<span className="br-tag-icon"><Icon name={c.icon} size={c.featured ? 24 : 21} /></span>
											<strong>{c.label}</strong>
											<em>{c.tag}</em>
											<span className="br-barcode" />
											<small>{c.handle}</small>
										</span>
									</a>
								))}
							</nav>
						</div>

						<div className="br-drawer">
							<i className="br-drawer-knob" />
							<span>toca una prenda ✦</span>
							<i className="br-drawer-knob" />
						</div>
					</div>
				</section>

				{/* ─── CINTA ─── */}
				<div className="br-tape" aria-hidden="true">
					<div className="br-tape-in">
						<span>{TAPE.repeat(3)}</span>
						<span>{TAPE.repeat(3)}</span>
					</div>
				</div>

				{/* ─── ETIQUETA DE CUIDADO ─── */}
				<section className="br-sec">
					<div className="br-sh" data-reveal>
						<span>02</span>
						<h2>La <i>etiqueta</i></h2>
						<em>Lo que nos define</em>
					</div>
					<div className="br-care" data-reveal>
						<span className="br-care-stitch" />
						<p className="br-care-brand">bruma <i>by VANNE</i></p>
						<p className="br-care-comp">100% estilo · 0% complicaciones</p>
						<ul>
							{PERKS.map((p, i) => (
								<li key={p.text} style={{ "--d": `${0.15 + i * 0.08}s` }}>
									<Icon name={p.icon} size={18} />
									<span>{p.text}</span>
								</li>
							))}
						</ul>
						<CareSymbols />
						<p className="br-care-foot">Lavar con amor · Usar con actitud</p>
					</div>
				</section>

				{/* ─── LOOKS ─── */}
				<section className="br-sec">
					<div className="br-sh" data-reveal>
						<span>03</span>
						<h2>Tu <i>look</i></h2>
						<em>Toca y cambia todo</em>
					</div>
					<div className="br-swatches" data-reveal role="radiogroup" aria-label="Look de la página">
						{THEMES.map((t) => (
							<button
								key={t.id}
								role="radio"
								aria-checked={theme.id === t.id}
								className={`br-swatch ${theme.id === t.id ? "on" : ""}`}
								style={{ "--sw": t.sw }}
								onClick={(e) => pickTheme(t, e)}
							>
								<span className="br-swatch-fabric" />
								<small>{t.name}</small>
							</button>
						))}
					</div>
					<p className="br-swatch-now" data-reveal>
						Estás viendo el look <b key={theme.id}>{theme.name}</b>
					</p>
				</section>

				{/* ─── CTA FINAL ─── */}
				<section className="br-final">
					<div className="br-final-mist" aria-hidden="true"><span /><span /></div>
					<p className="br-final-kicker" data-reveal>Lo nuevo ya llegó al closet ✦</p>
					<h2 data-reveal>¿Lista para <i>estrenar</i>?</h2>
					<a className="br-cta" href={WA_URL} target="_blank" rel="noopener noreferrer" data-reveal>
						<span className="br-cta-icon"><Icon name="bag" size={22} /></span>
						<span className="br-cta-text"><small>Catálogo · WhatsApp</small><strong>Mira lo nuevo y compra</strong></span>
						<span className="br-cta-arrow"><Icon name="arrow" size={18} /></span>
					</a>
					<div className="br-final-links" data-reveal>
						<a href={IG_URL} target="_blank" rel="noopener noreferrer"><Icon name="instagram" size={16} /> Instagram</a>
						<a href={TT_URL} target="_blank" rel="noopener noreferrer"><Icon name="tiktok" size={16} /> TikTok</a>
					</div>
					<footer className="br-foot">
						<Logo className="small" />
						<small>Bogotá · Colombia · {new Date().getFullYear()}</small>
					</footer>
				</section>
			</main>

			{/* ─── DOCK FLOTANTE ─── */}
			<a className={`br-dock ${dock ? "on" : ""}`} href={WA_URL} target="_blank" rel="noopener noreferrer" aria-hidden={!dock} tabIndex={dock ? 0 : -1}>
				<span className="br-dock-dot" />
				<span>Compra lo nuevo ✦</span>
				<i><Icon name="bag" size={18} /></i>
			</a>

			{/* ─── TRANSICIÓN DE LOOK ─── */}
			{wipe && (
				<div
					key={wipe.key}
					className="br-wipe"
					style={{ "--x": `${wipe.x}px`, "--y": `${wipe.y}px`, background: wipe.t.paper, color: wipe.t.ink }}
					aria-hidden="true"
				>
					<small>Nuevo look</small>
					<span>{wipe.t.name}</span>
					<i style={{ background: wipe.t.sw }} />
				</div>
			)}

			{toast && <div className="br-toast">{toast}</div>}
		</div>
	);
};

export default Home;