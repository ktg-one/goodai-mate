"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Activity,
    BellRing,
    BriefcaseBusiness,
    CalendarDays,
    Check,
    Layers,
    Mail,
    Send,
    Workflow,
} from "lucide-react";

const workflowInputs = [
    { label: "Email", icon: Mail },
    { label: "Calendar", icon: CalendarDays },
    { label: "Jobs", icon: BriefcaseBusiness },
];

const workflowOutputs = [
    { label: "Reply sent", icon: Send },
    { label: "Job booked", icon: Check },
    { label: "Team updated", icon: BellRing },
];

export function ProductDemo() {
    return (
        <section id="demo" className="py-24 px-6 bg-brand-paper text-brand-ink overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-bold tracking-wide mb-4"
                    >
                        See the workflow.
                    </motion.h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        One place to see what is moving, what is stuck, and what the system handled for you.
                    </p>
                </div>

                <Tabs defaultValue="dashboard" className="w-full max-w-5xl mx-auto">
                    <div className="flex justify-center mb-8">
                        <TabsList className="bg-brand-paper p-1 rounded-full border border-brand-ink">
                            <TabsTrigger
                                value="dashboard"
                                className="rounded-full px-6 py-2 text-sm font-medium text-brand-ink data-[state=active]:bg-brand-ink data-[state=active]:text-brand-paper transition-colors"
                            >
                                Today
                            </TabsTrigger>
                            <TabsTrigger
                                value="analytics"
                                className="rounded-full px-6 py-2 text-sm font-medium text-brand-ink data-[state=active]:bg-brand-ink data-[state=active]:text-brand-paper transition-colors"
                            >
                                Jobs
                            </TabsTrigger>
                            <TabsTrigger
                                value="settings"
                                className="rounded-full px-6 py-2 text-sm font-medium text-brand-ink data-[state=active]:bg-brand-ink data-[state=active]:text-brand-paper transition-colors"
                            >
                                Rules
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="relative aspect-video md:aspect-video lg:aspect-2/1 border border-brand-ink bg-brand-paper p-2 md:p-4 shadow-[8px_8px_0_var(--brand-coral)]">
                        {/* macOS-style Window Controls */}
                        <div className="absolute top-4 left-4 flex gap-2 z-20">
                            <div className="w-3 h-3 rounded-full bg-brand-coral border border-brand-ink" />
                            <div className="w-3 h-3 rounded-full bg-brand-paper border border-brand-ink" />
                            <div className="w-3 h-3 rounded-full bg-brand-eucalyptus border border-brand-ink" />
                        </div>

                        <div className="w-full h-full bg-brand-paper border border-brand-ink overflow-hidden relative">
                            <TabsContent value="dashboard" className="h-full mt-0 p-6 md:p-10">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full"
                                >
                                    <div className="bg-brand-ink text-brand-paper border border-brand-ink p-6 flex flex-col justify-between">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-brand-coral text-brand-ink border border-brand-paper">
                                                <Activity className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium">Work moving</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-2 w-full bg-brand-paper/20 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-brand-coral rounded-full" />
                                            </div>
                                            <div className="flex justify-between text-xs text-brand-paper/70">
                                                <span>On track</span>
                                                <span>12 jobs handled</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-brand-eucalyptus text-brand-ink border border-brand-ink p-4 flex min-h-60 flex-col">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-brand-paper text-brand-ink border border-brand-ink">
                                                <Workflow className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium">One trigger. Job handled.</div>
                                                <div className="text-xs text-brand-ink/65">No copying between tools</div>
                                            </div>
                                        </div>
                                        <WorkflowMap />
                                    </div>
                                </motion.div>
                            </TabsContent>

                            <TabsContent value="analytics" className="h-full mt-0 p-6 md:p-10">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex items-center justify-center h-full"
                                >
                                    <div className="text-center">
                                        <div className="mb-4 inline-flex p-4 rounded-full bg-brand-eucalyptus text-brand-ink border border-brand-ink">
                                            <Layers className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Time back</h3>
                                        <p className="text-sm text-muted-foreground">See which jobs were handled and where the week got easier.</p>
                                    </div>
                                </motion.div>
                            </TabsContent>

                            <TabsContent value="settings" className="h-full mt-0 p-6 md:p-10">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="max-w-md mx-auto space-y-4 bg-brand-ink p-4"
                                >
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between border border-brand-ink bg-brand-paper p-4"
                                        >
                                            <span className="text-sm font-medium">Workflow rule {i}</span>
                                            <div className="relative h-6 w-10 rounded-full border border-brand-ink bg-brand-paper">
                                                <div className="absolute right-1 top-1 h-4 w-4 rounded-full border border-brand-ink bg-brand-eucalyptus" />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </section>
    );
}

function WorkflowMap() {
    const reduceMotion = useReducedMotion();
    const [phase, setPhase] = useState(0);
    const [runId, setRunId] = useState(0);
    const timersRef = useRef<number[]>([]);
    const inputPaths = [
        "M 28 18 C 39 18 39 50 50 50",
        "M 28 50 H 50",
        "M 28 82 C 39 82 39 50 50 50",
    ];
    const outputPaths = [
        "M 50 50 C 61 50 61 18 72 18",
        "M 50 50 H 72",
        "M 50 50 C 61 50 61 82 72 82",
    ];

    const clearTimers = () => {
        timersRef.current.forEach((timer) => window.clearTimeout(timer));
        timersRef.current = [];
    };

    useEffect(() => () => {
        timersRef.current.forEach((timer) => window.clearTimeout(timer));
        timersRef.current = [];
    }, []);

    const runWorkflow = () => {
        clearTimers();
        setRunId((current) => current + 1);

        if (reduceMotion) {
            setPhase(4);
            return;
        }

        setPhase(1);
        timersRef.current = [
            window.setTimeout(() => setPhase(2), 750),
            window.setTimeout(() => setPhase(3), 1400),
            window.setTimeout(() => setPhase(4), 2500),
        ];
    };

    const isRunning = phase > 0 && phase < 4;
    const status = [
        "Ready when you are.",
        "Email received.",
        "Checking the calendar.",
        "Booking the job and sending updates.",
        "Done. Everyone is updated.",
    ][phase];

    return (
        <div className="flex flex-1 flex-col border-t border-brand-ink/20 pt-3">
            <div
                role="img"
                aria-label="Example workflow: an email arrives, the workflow checks the calendar, creates the job, sends a reply, and updates the team."
                className="relative min-h-[145px] flex-1 overflow-hidden"
            >
                <svg
                    aria-hidden="true"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute inset-0 h-full w-full"
                >
                    {[...inputPaths, ...outputPaths].map((path) => (
                        <path
                            key={path}
                            d={path}
                            fill="none"
                            stroke="var(--brand-ink)"
                            strokeOpacity="0.2"
                            strokeWidth="1.2"
                            strokeDasharray="3 3"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}

                    {phase >= 1 && (
                        <motion.path
                            key={`input-${runId}`}
                            d={inputPaths[0]}
                            fill="none"
                            stroke="var(--brand-coral)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: reduceMotion ? 0 : 0.7, ease: "easeInOut" }}
                        />
                    )}

                    {phase >= 3 && outputPaths.map((path, index) => (
                        <motion.path
                            key={`output-${runId}-${path}`}
                            d={path}
                            fill="none"
                            stroke="var(--brand-eucalyptus)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : index * 0.1, ease: "easeOut" }}
                        />
                    ))}
                </svg>

                <div className="relative z-10 grid min-h-[145px] grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1fr)] items-center gap-3">
                    <div className="space-y-2">
                        {workflowInputs.map(({ label, icon: Icon }, index) => (
                            <div
                                key={label}
                                className={cn(
                                    "flex items-center gap-2 border border-brand-ink px-2 py-2 text-[10px] font-medium transition-colors sm:text-xs",
                                    index === 0 && phase >= 1 ? "bg-brand-coral" : "bg-brand-paper"
                                )}
                            >
                                <Icon className="h-3.5 w-3.5 shrink-0" />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>

                    <motion.div
                        animate={!reduceMotion && phase >= 2 && phase < 4 ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                        transition={{ duration: 0.65, repeat: !reduceMotion && phase >= 2 && phase < 4 ? Infinity : 0, ease: "easeInOut" }}
                        className={cn(
                            "flex aspect-square items-center justify-center rounded-full border-2 border-brand-ink text-brand-ink transition-colors",
                            phase >= 2 ? "bg-brand-eucalyptus" : "bg-brand-paper"
                        )}
                    >
                        <Workflow className="h-5 w-5" aria-hidden="true" />
                    </motion.div>

                    <div className="space-y-2">
                        {workflowOutputs.map(({ label, icon: Icon }) => (
                            <div
                                key={label}
                                className={cn(
                                    "flex items-center gap-2 border border-brand-ink px-2 py-2 text-[10px] font-medium transition-colors sm:text-xs",
                                    phase >= 3 ? "bg-brand-ink text-brand-paper" : "bg-brand-paper text-brand-ink"
                                )}
                            >
                                <Icon className={cn("h-3.5 w-3.5 shrink-0", phase >= 3 && "text-brand-eucalyptus")} />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-3 border-t border-brand-ink/20 pt-3">
                <p id="workflow-status" role="status" aria-live="polite" className="text-[10px] text-brand-ink/70 sm:text-xs">
                    {status}
                </p>
                <Button
                    type="button"
                    size="sm"
                    onClick={runWorkflow}
                    disabled={isRunning}
                    aria-describedby="workflow-status"
                    className="shrink-0 rounded-full bg-brand-ink px-4 text-brand-paper hover:bg-brand-coral hover:text-brand-ink focus-visible:outline-brand-coral disabled:cursor-wait disabled:opacity-60"
                >
                    {isRunning ? "Running…" : phase === 4 ? "Run again" : "Run it"}
                </Button>
            </div>
        </div>
    );
}
