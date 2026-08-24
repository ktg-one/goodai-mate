import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Mic, 
  Square, 
  Volume2, 
  Loader2,
  Activity,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Audio Helpers ---
const SAMPLE_RATE = 16000;

function pcmToBase64(float32Array: Float32Array): string {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToPcm(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const view = new DataView(bytes.buffer);
  const pcm = new Float32Array(bytes.length / 2);
  for (let i = 0; i < pcm.length; i++) {
    pcm[i] = view.getInt16(i * 2, true) / 0x7fff;
  }
  return pcm;
}

// --- Components ---

const Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 126" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="38" r="24" stroke="currentColor" strokeWidth="20" fill="none" />
    <path d="M 64 16 L 76 4 L 90 18 L 78 30 Z" fill="currentColor" />
    <path d="M 16 78 A 34 34 0 0 0 84 78" stroke="var(--color-orange, #F25C2B)" strokeWidth="20" fill="none" strokeLinecap="butt" />
  </svg>
);

const Visualizer = ({ 
  analyzer, 
  active,
  sensitivity = 1,
  mode = "dynamic"
}: { 
  analyzer: AnalyserNode | null;
  active: boolean;
  sensitivity?: number;
  mode?: "calm" | "dynamic";
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dataArray = new Uint8Array(analyzer?.frequencyBinCount || 1024);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      if (active && analyzer) {
        analyzer.getByteFrequencyData(dataArray);
      } else {
        // Natural paper-like settling
        for(let i=0; i<dataArray.length; i++) dataArray[i] *= 0.92;
      }

      // Draw Ribbon helper that simulates 3D paper twist with shading
      const drawPaperRibbon = (
        colorMain: string, 
        colorDark: string,
        yBase: number,
        freq: number,
        speed: number,
        thickness: number,
        amplitude: number,
        phase: number
      ) => {
        const points: {x: number, y: number, twist: number, opacity: number}[] = [];
        const step = 4;
        
        // Mode modifiers
        const isCalm = mode === "calm";
        const speedMult = isCalm ? 0.35 : 1.0;
        const freqMult = isCalm ? 0.6 : 1.0;
        const time = Date.now() * speed * speedMult;
        
        // Calculate the average intensity for dynamic scaling
        let sum = 0;
        for(let i=0; i<dataArray.length; i++) sum += dataArray[i];
        const intensity = (sum / dataArray.length) / 128; // 0 to 2 range roughly
        const scaleFactor = active ? (0.5 + intensity * 1.5) * sensitivity : (isCalm ? 0.1 : 0.2);
        const turbulence = Math.min(2.0, active ? (intensity * sensitivity * (isCalm ? 0.3 : 1.2)) : 0);

        for (let i = 0; i <= width; i += step) {
          const dataIdx = Math.floor((i / width) * dataArray.length * 0.4);
          const val = dataArray[dataIdx] / 255;
          const localFlurry = Math.min(1.5, val * scaleFactor);
          
          const curFreq = freq * freqMult;
          
          // Complex layered trigonometric functions for a "fluttering paper" effect
          const baseWave = Math.sin(i * curFreq + time + phase);
          const flutter1 = Math.sin(i * curFreq * 2.2 - time * 1.6 + phase) * (0.2 + turbulence * 0.3);
          const flutter2 = Math.cos(i * curFreq * 5.1 + time * 3.2) * (0.1 + localFlurry * (isCalm ? 0.05 : 0.4));
          const wave = baseWave + flutter1 + flutter2;
          
          // Rapid twisting to simulate paper folding chaotically in the wind
          const baseTwist = Math.cos(i * curFreq * 0.5 + time * 0.7 + phase);
          const twistFlutter = Math.sin(i * curFreq * 3.2 - time * 2.8) * (isCalm ? 0.05 : (0.2 + turbulence * 0.4 + localFlurry * 0.2));
          const twist = Math.max(-1, Math.min(1, baseTwist + twistFlutter));
          
          // Audio physically pushes the paper like dynamic gusts of wind
          const windGust = val * (isCalm ? 25 : 80) * scaleFactor * Math.sin(i * 0.05 - time * 4);
          const currentAmp = amplitude * (isCalm ? 0.5 : 1.0);
          const y = yBase + (wave * currentAmp * Math.min(2.5, (isCalm ? 0.8 : 0.5) + scaleFactor)) + windGust;
          
          points.push({
            x: i,
            y: y,
            twist: twist,
            opacity: 0.1 + val * 0.9
          });
        }

        // Draw multiple passes for the ribbon thickness/3D effect
        for (let pass = 0; pass < 2; pass++) {
          const isShadowPass = pass === 0;
          ctx.beginPath();
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          
          for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i+1];
            
            // Twist factor determines width and face
            const w1 = Math.abs(p1.twist) * thickness;
            const isFront = p1.twist > 0;
            
            // Shading
            if (isShadowPass) {
              if (isFront) {
                ctx.strokeStyle = "rgba(0,0,0,0.05)";
                ctx.lineWidth = w1 + 10;
              } else {
                continue;
              }
            } else {
              ctx.strokeStyle = isFront ? colorMain : colorDark;
              ctx.lineWidth = Math.max(2, w1);
            }

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        
        // Grainy highlight pass
        ctx.globalCompositeOperation = "overlay";
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = thickness * 0.2;
        ctx.beginPath();
        for (let i = 0; i < points.length - 1; i++) {
          const p = points[i];
          if (p.twist > 0.5) { // Only on front peaks
            ctx.lineTo(p.x, p.y);
          } else {
            ctx.moveTo(p.x, p.y);
          }
        }
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
      };

      // Draw ribbons in layered sets
      const isSpeaking = active && !analyzer; // If I were passing explicit state
      
      // Ink Background Ribbons
      drawPaperRibbon("#333333", "#0B0B0B", centerY, 0.008, 0.0015, 24, 40, 0);
      drawPaperRibbon("#444444", "#111111", centerY + 10, 0.012, 0.002, 18, 30, Math.PI);
      
      // Brand Orange Main Ribbons
      drawPaperRibbon("#F25C2B", "#D7591A", centerY, 0.015, 0.004, 32, 60, 2);
      drawPaperRibbon("#FF8A65", "#F25C2B", centerY - 5, 0.02, 0.005, 14, 50, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyzer, active]);

  return <canvas ref={canvasRef} width={1200} height={500} className="w-full h-full max-h-[500px] object-contain" />;
};

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [transcript, setTranscript] = useState("");
  const [aiTranscript, setAiTranscript] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [sensitivity, setSensitivity] = useState(1);
  const [visualMode, setVisualMode] = useState<"calm" | "dynamic">("dynamic");
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef(0);

  const initAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: SAMPLE_RATE });
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 1024;
      analyzerRef.current.connect(audioContextRef.current.destination);
    }
    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  };

  const startSession = async () => {
    await initAudio();
    
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const ws = new WebSocket(`${protocol}//${host}/ws/live`);
    wsRef.current = ws;

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      
      // Handle Model Text/Transcript
      const text = msg.serverContent?.modelTurn?.parts?.[0]?.text;
      if (text) {
         setAiTranscript(prev => prev + text);
         setIsSynthesizing(false);
         if (status === "thinking") setStatus("idle");
      }

      // Handle Model Audio
      const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
      if (audioData && audioContextRef.current && analyzerRef.current) {
        setStatus("speaking");
        const pcm = base64ToPcm(audioData);
        const buffer = audioContextRef.current.createBuffer(1, pcm.length, 24000); 
        buffer.getChannelData(0).set(pcm);
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(analyzerRef.current);
        
        const now = audioContextRef.current.currentTime;
        if (nextStartTimeRef.current < now) {
          nextStartTimeRef.current = now;
        }
        source.start(nextStartTimeRef.current);
        nextStartTimeRef.current += buffer.duration;
        
        source.onended = () => {
          if (nextStartTimeRef.current <= audioContextRef.current!.currentTime) {
             setStatus("idle");
          }
        };
      }
    };
  };

  const toggleRecording = async () => {
    await initAudio();

    if (isRecording) {
      setIsRecording(false);
      setStatus("idle");
      if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      return;
    }

    try {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        await startSession();
        // Give WS a tiny bit of time to open if it was closed
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setStatus("listening");
      setAiTranscript("");

      const source = audioContextRef.current!.createMediaStreamSource(stream);
      const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
      
      source.connect(processor);
      processor.connect(audioContextRef.current!.destination);
      source.connect(analyzerRef.current!);

      sourceRef.current = source;
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const base64 = pcmToBase64(input);
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ audio: base64 }));
        }
      };

    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const handleRepeatSpeak = async () => {
    if (!aiTranscript || status === "speaking") return;
    await initAudio();
    setIsSynthesizing(true);
    setStatus("thinking");
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      await startSession();
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ 
        text: `Please read this back to me exactly as written: "${aiTranscript}"` 
      }));
    } else {
      setIsSynthesizing(false);
      setStatus("idle");
    }
  };

  const handleInspireMe = async () => {
    await initAudio();
    setStatus("thinking");
    setAiTranscript("");
    setIsSynthesizing(true);

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      await startSession();
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ 
        text: "Give me a very short, profound, and inspiring quote. Speak it directly." 
      }));
    } else {
      setStatus("idle");
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper p-6 md:p-12 relative font-sans">
      <div className="bg-grain" />

      {/* Header */}
      <header className="flex items-center justify-between relative z-20 mb-8 md:mb-16 pb-6 border-b-4 border-ink">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-10 text-ink" />
          <span className="font-serif font-bold text-3xl tracking-tighter text-ink mt-1">
            Good<span className="text-orange">'</span>ai
          </span>
        </div>
        
        <nav className="hidden md:flex items-center border-2 border-ink stamp-box !shadow-[4px_4px_0_#0B0B0B] bg-paper">
          <a href="#" className="font-sans text-xs font-bold uppercase tracking-widest text-paper bg-ink px-6 py-3">Workflows</a>
          <a href="#" className="font-sans text-xs font-bold uppercase tracking-widest text-ink hover:bg-border px-6 py-3 transition-colors border-r-2 border-l-2 border-ink">Systems</a>
          <a href="#" className="font-sans text-xs font-bold uppercase tracking-widest text-ink hover:bg-hi-yellow px-6 py-3 transition-colors">Pricing</a>
        </nav>
      </header>

      {/* Main Hero & Visualizer */}
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1 relative z-10 w-full max-w-7xl mx-auto">
        {/* Left Column: Copy & Actions */}
        <div className="flex flex-col gap-8 w-full max-w-xl mx-auto lg:mx-0 order-2 lg:order-1">
          <div>
            <span className="font-mono text-xs font-bold tracking-widest uppercase text-ink/80 bg-hi-yellow px-2 py-1">
              Bidirectional Audio
            </span>
            <h1 className="font-serif text-5xl md:text-[5.5rem] font-bold text-ink leading-[0.95] mt-6 mb-6 tracking-tight">
              Tell us your problem.
            </h1>
            <p className="font-sans text-xl md:text-2xl text-ink/80 leading-snug">
              We'll handle the boring stuff. Speak straight into our system and watch it work in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2">
             <button 
                onClick={toggleRecording}
                className={cn(
                  "btn-primary",
                  isRecording && "ring-4 ring-orange flex"
                )}
             >
                {isRecording ? <Square className="h-5 w-5 mr-3" /> : <Mic className="h-5 w-5 mr-3" />}
                <span>{isRecording ? "Stop Listening" : "Start Talking"}</span>
             </button>

             <button 
                onClick={handleInspireMe}
                disabled={status !== "idle" && status !== "speaking"}
                className="btn-secondary"
             >
                <Zap className="h-4 w-4 mr-2" />
                Inspire Me
             </button>
             
             {isSynthesizing && (
               <div className="flex items-center gap-2 ml-4">
                 <Loader2 className="h-4 w-4 animate-spin text-orange" />
                 <span className="font-mono text-xs font-bold uppercase tracking-widest text-ink">Working…</span>
               </div>
             )}
          </div>

          {/* AI Response Block */}
          <div className="min-h-[120px] mt-4 flex items-center">
            <AnimatePresence mode="wait">
              {aiTranscript ? (
                <motion.div 
                  key="ai-text"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="stamp-box p-6 bg-paper-raised w-full relative"
                >
                  <p className="font-serif text-2xl text-ink leading-snug">
                    "{aiTranscript}"
                  </p>
                  <button 
                    onClick={handleRepeatSpeak}
                    disabled={status === "speaking" || isSynthesizing}
                    className="absolute -bottom-4 -right-2 bg-hi-yellow border-2 border-ink shadow-[2px_2px_0_#0B0B0B] text-ink font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-2 hover:bg-orange hover:text-paper transition-colors disabled:opacity-50"
                  >
                    <Volume2 className="h-3 w-3" /> Replay
                  </button>
                </motion.div>
              ) : (
                 <motion.div 
                  key="status"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 px-4 py-3 border-2 border-border bg-paper w-max"
                 >
                   <Activity className={cn("h-4 w-4", status === "listening" ? "text-orange animate-bounce" : "text-border")} />
                   <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink/70">
                     {status === "idle" ? "System Ready" : 
                      status === "listening" ? "Listening to environment..." :
                      status === "thinking" ? "Processing audio map..." : "Synthesizing voice..."}
                   </span>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Visualizer Block */}
        <div className="relative w-full h-[400px] lg:h-[550px] stamp-box overflow-hidden flex items-center justify-center bg-paper order-1 lg:order-2">
           <div className="absolute top-0 left-0 right-0 h-8 border-b-2 border-ink bg-paper-raised flex items-center px-4 justify-between z-20">
             <div className="flex gap-2">
               <div className="w-3 h-3 border-2 border-ink bg-paper" />
               <div className="w-3 h-3 border-2 border-ink bg-paper" />
             </div>
             <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink">
               Acoustic_Feed.exe
             </span>
           </div>
           
           <div className="absolute inset-0 pt-8" style={{ background: 'repeating-linear-gradient(0deg, rgba(11,11,11,0.025) 0 1px, transparent 1px 4px)' }}>
             <Visualizer analyzer={analyzerRef.current} active={isRecording || status === "speaking"} sensitivity={sensitivity} mode={visualMode} />
           </div>
           
           <div className="absolute bottom-6 left-6 flex items-center border-2 border-ink bg-paper shadow-[2px_2px_0_#0B0B0B] rounded-[2px] overflow-hidden z-20">
             <div className="px-3 py-1.5 bg-border text-ink font-mono text-[10px] uppercase font-bold border-r-2 border-ink select-none hidden sm:block">
               Mode
             </div>
             <button 
                onClick={() => setVisualMode("calm")}
                className={cn("px-4 py-1.5 font-mono text-[10px] uppercase font-bold border-r-2 border-ink transition-colors", visualMode === "calm" ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-paper-raised")}
              >
                Calm
              </button>
              <button 
                onClick={() => setVisualMode("dynamic")}
                className={cn("px-4 py-1.5 font-mono text-[10px] uppercase font-bold transition-colors", visualMode === "dynamic" ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-paper-raised")}
              >
                Dynamic
              </button>
           </div>

           <div className="absolute bottom-6 right-6 flex items-center border-2 border-ink bg-paper shadow-[2px_2px_0_#0B0B0B] rounded-[2px] overflow-hidden z-20">
             <div className="px-3 py-1.5 bg-border text-ink font-mono text-[10px] uppercase font-bold border-r-2 border-ink select-none hidden sm:block">
               Sens
             </div>
             <button 
                onClick={() => setSensitivity(0.5)}
                className={cn("px-4 py-1.5 font-mono text-[10px] uppercase font-bold border-r-2 border-ink transition-colors", sensitivity === 0.5 ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-paper-raised")}
              >
                Steady
              </button>
              <button 
                onClick={() => setSensitivity(1)}
                className={cn("px-4 py-1.5 font-mono text-[10px] uppercase font-bold border-r-2 border-ink transition-colors", sensitivity === 1 ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-paper-raised")}
              >
                Normal
              </button>
              <button 
                onClick={() => setSensitivity(2.5)}
                className={cn("px-4 py-1.5 font-mono text-[10px] uppercase font-bold transition-colors", sensitivity === 2.5 ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-paper-raised")}
              >
                High
              </button>
           </div>
        </div>
      </main>

      <footer className="mt-16 pt-8 border-t-2 border-border font-mono text-[10px] font-bold uppercase tracking-widest text-ink/60 flex flex-col md:flex-row justify-between gap-4 z-10 relative">
        <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full border-2 border-ink bg-hi-yellow" /> Gemini Voice API // WA Ocean</span>
        <span>Built in Perth, runs everywhere</span>
      </footer>
    </div>
  );
}

