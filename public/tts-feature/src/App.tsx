import { useState, useRef, useEffect, useCallback } from "react";
import { 
  Mic, 
  Square, 
  Settings, 
  List, 
  Play, 
  Menu, 
  Volume2, 
  Search, 
  ArrowLeft,
  Loader2
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

const Visualizer = ({ 
  analyzer, 
  active 
}: { 
  analyzer: AnalyserNode | null;
  active: boolean;
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
        const time = Date.now() * speed;
        
        // Calculate the average intensity for dynamic scaling
        let sum = 0;
        for(let i=0; i<dataArray.length; i++) sum += dataArray[i];
        const intensity = (sum / dataArray.length) / 128; // 0 to 2 range roughly
        const scaleFactor = active ? (0.5 + intensity * 1.5) : 0.2;

        for (let i = 0; i <= width; i += step) {
          const dataIdx = Math.floor((i / width) * dataArray.length * 0.4);
          const val = dataArray[dataIdx] / 255;
          
          const wave = Math.sin(i * freq + time + phase);
          const twist = Math.cos(i * freq * 0.5 + time * 0.7 + phase);
          
          // Use the val to add "vibration"
          const y = yBase + (wave * 50 * scaleFactor) + (val * 120 * scaleFactor);
          
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
      
      // Black Background Ribbons
      drawPaperRibbon("#333333", "#111111", centerY, 0.008, 0.0015, 24, 40, 0);
      drawPaperRibbon("#444444", "#1a1a1a", centerY + 10, 0.012, 0.002, 18, 30, Math.PI);
      
      // Orange Main Ribbons
      drawPaperRibbon("#f97316", "#c2410c", centerY, 0.015, 0.004, 32, 60, 2);
      drawPaperRibbon("#fb923c", "#ea580c", centerY - 5, 0.02, 0.005, 14, 50, 4);

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
    <div className="flex min-h-screen flex-col bg-paper p-6 md:p-12 relative">
      <div className="bg-grain" />
      
      {/* Subtle lighting overlay */}
      <div className="pointer-events-none fixed inset-0 z-40 bg-radial-[at_50%_0%] from-white/20 to-transparent" />

      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/50 shadow-sm backdrop-blur-sm">
            <Menu className="h-6 w-6 text-slate-600" />
          </button>
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Good'ai</h1>
            <p className="text-sm font-medium text-slate-400">Voice assistant</p>
          </div>
        </div>
        
        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex rounded-full bg-white/60 p-1 shadow-sm backdrop-blur-sm">
            <button className="rounded-full bg-white px-8 py-2 text-sm font-semibold shadow-sm">Normal</button>
            <button className="rounded-full px-8 py-2 text-sm font-medium text-slate-400">Vunniled</button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleInspireMe}
            disabled={status !== "idle" && status !== "speaking"}
            className="wood-button flex items-center gap-2 !bg-orange-600 disabled:opacity-50"
          >
            <Volume2 className="h-4 w-4 fill-white" />
            <span className="font-semibold uppercase tracking-wider text-xs">Inspire Me</span>
          </button>
          
          <button className="wood-button flex items-center gap-2">
            <Play className="h-4 w-4 fill-white" />
            <span className="font-semibold uppercase tracking-wider text-xs">Playboard</span>
          </button>
        </div>
      </header>

      {/* Main Visualizer Area */}
      <main className="relative flex flex-1 flex-col items-center justify-center py-12">
        <div className="absolute inset-x-0 top-0 flex flex-col items-center justify-center gap-6 text-center">
            <AnimatePresence mode="wait">
              {aiTranscript ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center gap-4 max-w-2xl px-4"
                >
                  <p className="font-serif text-2xl italic text-slate-700 md:text-4xl text-balance leading-tight">
                    "{aiTranscript}"
                  </p>
                  
                  <button 
                    onClick={handleRepeatSpeak}
                    disabled={status === "speaking" || isSynthesizing}
                    className={cn(
                      "wood-button flex items-center gap-3 !px-8 !py-3 disabled:opacity-50 transition-all",
                      status === "speaking" && "ring-4 ring-orange-400/20"
                    )}
                  >
                    {isSynthesizing ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Volume2 className={cn("h-5 w-5", status === "speaking" && "animate-bounce")} />
                    )}
                    <span className="font-bold uppercase tracking-widest text-xs">
                      {status === "speaking" ? "Speaking..." : "Speak Text"}
                    </span>
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="status"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-slate-400 uppercase tracking-widest text-xs font-bold"
                >
                  {status === "idle" && "Ready to help"}
                  {status === "listening" && "Listening..."}
                  {status === "thinking" && "Processing..."}
                </motion.div>
              )}
            </AnimatePresence>
        </div>

        <div className="relative z-10 w-full max-w-5xl">
           <Visualizer analyzer={analyzerRef.current} active={isRecording || status === "speaking"} />
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-6 md:gap-12">
          <div className="flex items-center gap-4">
             <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
               <ArrowLeft className="h-5 w-5 text-slate-400" />
             </button>
             <button 
                onClick={toggleRecording}
                className={cn(
                  "wood-button !p-5 !rounded-full transition-all hover:scale-110",
                  isRecording && "animate-pulse ring-8 ring-orange-400/10"
                )}
             >
                {isRecording ? <Square className="h-8 w-8 fill-white" /> : <Mic className="h-8 w-8 fill-white" />}
             </button>
          </div>

          <div className="flex flex-1 items-center gap-4 rounded-[2rem] bg-white/50 p-2 shadow-inner backdrop-blur-md ring-1 ring-white/20">
            <div className="wood-button !px-8 !py-3 flex items-center justify-center gap-2">
               <div className="h-4 w-1 bg-white/20 rounded-full" />
               <div className="h-7 w-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
               <div className="h-4 w-1 bg-white/20 rounded-full" />
            </div>
            <div className="flex flex-1 items-center gap-4 px-4">
               <Volume2 className="h-5 w-5 text-slate-400" />
               <div className="relative h-1.5 flex-1 rounded-full bg-slate-200/50">
                  <div className="absolute top-0 left-0 h-full w-2/3 rounded-full bg-wood-light" />
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
              <Settings className="h-5 w-5 text-slate-400" />
            </button>
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
              <List className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Bottom Bar Info */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
           <span className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />Gemini 3.1 Live API</span>
           <span className="hidden md:inline">Voice: Zephyr — Paper Visualizer Active</span>
           <span>Vercel Platform Ready</span>
        </div>
      </footer>
    </div>
  );
}

