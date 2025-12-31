import { createSignal, onCleanup, onMount, For } from "solid-js";

interface Confetti {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    width: number;
    height: number;
    rotation: number;
    rotationSpeed: number;
    color: string;
    life: number;
    maxLife: number;
    type: "shape" | "emoji";
    emoji?: string;
    element?: HTMLDivElement;
}

export default function ParticleButton() {
    const [confetti, setConfetti] = createSignal<Confetti[]>([]);
    let containerRef: HTMLDivElement | undefined;
    let animationFrameId: number | undefined;
    let confettiIdCounter = 0;
    let lastClickTime = 0;
    const THROTTLE_MS = 400; // Minimum time between clicks
    const MAX_CONFETTI = 700; // Reduced for better performance

    // Fun, colorful confetti colors
    const confettiColors = [
        "#FF6B9D",
        "#4ECDC4",
        "#45B7D1",
        "#FFA07A",
        "#98D8C8",
        "#F7DC6F",
        "#BB8FCE",
        "#85C1E2",
        "#F8B739",
        "#FF6B9D",
        "#C44569",
        "#6C5CE7",
        "#FFD93D",
        "#6BCB77",
        "#4D96FF",
        "#FF6B9D",
        "#FF9F43",
        "#10AC84",
        "#5F27CD",
        "#00D2D3",
        "#FF6348",
        "#FFA502",
        "#2ED573",
        "#1E90FF",
    ];

    // Funny emojis to mix with confetti
    const funnyEmojis = [
        "😂",
        "🤣",
        "😆",
        "😄",
        "😃",
        "😊",
        "😎",
        "🤪",
        "🥳",
        "🎉",
        "🎊",
        "✨",
        "🌟",
        "💫",
        "🔥",
        "💥",
        "⚡",
        "🌈",
        "🎈",
        "🎁",
        "🍕",
        "🍔",
        "🍟",
        "🌮",
        "🍰",
        "🍭",
        "🍬",
        "🍪",
        "🎂",
        "🍩",
        "🚀",
        "🎮",
        "🎯",
        "🏆",
        "🎪",
        "🎨",
        "🎭",
        "🎬",
        "🎤",
        "🎧",
        "🦄",
        "🐱",
        "🐶",
        "🐼",
        "🐨",
        "🦁",
        "🐯",
        "🐸",
        "🐷",
        "🐰",
        "👻",
        "🤖",
        "👾",
        "🦾",
        "🦿",
        "💀",
        "☠️",
        "👽",
        "🤡",
        "🎃",
    ];

    const createConfetti = (x: number, y: number, count: number = 50) => {
        const currentConfetti = confetti();
        const currentCount = currentConfetti.length;

        // Limit total confetti count for performance
        if (currentCount >= MAX_CONFETTI) {
            // Remove oldest confetti if we're at max
            const toRemove = currentCount - MAX_CONFETTI + count;
            setConfetti((prev) => prev.slice(toRemove));
        }

        const newConfetti: Confetti[] = [];
        const actualCount = Math.min(count, MAX_CONFETTI - currentCount);

        for (let i = 0; i < actualCount; i++) {
            const angle =
                (Math.PI * 2 * i) / actualCount + (Math.random() - 0.5) * 0.5;
            const speed = 2 + Math.random() * 8;
            const isEmoji = Math.random() > 0.5; // 50% emojis, 50% shapes

            if (isEmoji) {
                // Create emoji particle
                const emojiSize = 20 + Math.random() * 15;
                newConfetti.push({
                    id: confettiIdCounter++,
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    width: emojiSize,
                    height: emojiSize,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.3,
                    color: "",
                    life: 0,
                    maxLife: 100 + Math.random() * 50,
                    type: "emoji",
                    emoji: funnyEmojis[
                        Math.floor(Math.random() * funnyEmojis.length)
                    ],
                });
            } else {
                // Create shape particle
                const isRect = Math.random() > 0.3; // 70% rectangles, 30% squares
                newConfetti.push({
                    id: confettiIdCounter++,
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    width: isRect
                        ? 8 + Math.random() * 12
                        : 6 + Math.random() * 8,
                    height: isRect
                        ? 4 + Math.random() * 6
                        : 6 + Math.random() * 8,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.3,
                    color: confettiColors[
                        Math.floor(Math.random() * confettiColors.length)
                    ],
                    life: 0,
                    maxLife: 100 + Math.random() * 80,
                    type: "shape",
                });
            }
        }
        setConfetti((prev) => [...prev, ...newConfetti]);
    };

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Throttle clicks
        const now = Date.now();
        if (now - lastClickTime < THROTTLE_MS) {
            return;
        }
        lastClickTime = now;

        const button = e.currentTarget as HTMLElement;
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Create confetti explosion from button center
        createConfetti(x, y, 120);
    };

    const animate = () => {
        const confettiList = confetti();
        if (confettiList.length === 0) {
            animationFrameId = requestAnimationFrame(animate);
            return;
        }

        // Direct DOM manipulation for better performance - no signal updates
        const updated: Confetti[] = [];
        const length = confettiList.length;
        const GRAVITY = 0.2;
        const AIR_RESISTANCE = 0.98;

        for (let i = 0; i < length; i++) {
            const conf = confettiList[i];
            const element = conf.element;

            // Update position
            const newX = conf.x + conf.vx;
            const newY = conf.y + conf.vy;

            // Update rotation
            const newRotation = conf.rotation + conf.rotationSpeed;

            // Apply gravity and air resistance
            const newVy = (conf.vy + GRAVITY) * AIR_RESISTANCE;
            const newVx = conf.vx * AIR_RESISTANCE;

            // Update life
            const newLife = conf.life + 1;

            // Only keep if still alive
            if (newLife < conf.maxLife) {
                // Update DOM directly for performance
                if (element) {
                    const opacity = 1 - newLife / conf.maxLife;
                    element.style.left = `${newX}px`;
                    element.style.top = `${newY}px`;
                    element.style.transform = `translate(-50%, -50%) rotate(${newRotation}rad)`;
                    element.style.opacity = opacity.toString();
                }

                // Update confetti data
                conf.x = newX;
                conf.y = newY;
                conf.vx = newVx;
                conf.vy = newVy;
                conf.rotation = newRotation;
                conf.life = newLife;
                updated.push(conf);
            } else if (element) {
                // Remove dead particles from DOM
                element.remove();
            }
        }

        // Only update signal when particles are removed
        if (updated.length !== length) {
            setConfetti(updated);
        }

        animationFrameId = requestAnimationFrame(animate);
    };

    onMount(() => {
        animate();

        onCleanup(() => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        });
    });

    return (
        <>
            <div
                ref={containerRef}
                class="fixed inset-0 pointer-events-none z-50"
            >
                <For each={confetti()}>
                    {(conf) => {
                        const opacity = 1 - conf.life / conf.maxLife;
                        return (
                            <div
                                ref={(el) => {
                                    conf.element = el;
                                }}
                                class="absolute pointer-events-none will-change-transform"
                                style={{
                                    left: `${conf.x}px`,
                                    top: `${conf.y}px`,
                                    width: `${conf.width}px`,
                                    height: `${conf.height}px`,
                                    transform: `translate(-50%, -50%) rotate(${conf.rotation}rad)`,
                                    opacity: opacity.toString(),
                                    ...(conf.type === "shape" && {
                                        "background-color": conf.color,
                                    }),
                                }}
                            >
                                {conf.type === "emoji" && conf.emoji && (
                                    <span
                                        class="block text-center leading-none"
                                        style={{
                                            "font-size": `${conf.width * 0.8}px`,
                                        }}
                                    >
                                        {conf.emoji}
                                    </span>
                                )}
                            </div>
                        );
                    }}
                </For>
            </div>
            <button
                onClick={handleClick}
                type="button"
                style={{
                    all: "unset",
                    cursor: "pointer",
                }}
            >
                click to see the effect? 🎉
            </button>
        </>
    );
}
