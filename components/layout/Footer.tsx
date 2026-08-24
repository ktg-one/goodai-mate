import Link from "next/link";
import { SURVEY_URL } from "@/lib/links";

export function Footer() {
    return (
        <footer className="w-full bg-brand-ink text-brand-paper border-t border-brand-paper/20 py-20 px-6 md:px-12 lg:px-24">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
                <div className="col-span-2 lg:col-span-2">
                    <Link href="/" className="font-display text-xl font-bold tracking-tighter">
                        Good&apos;Ai
                    </Link>
                    <p className="mt-4 text-sm text-brand-paper/65 w-full max-w-xs">
                        We fix clunky workflows and build practical automation for businesses that have better things to do.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="font-semibold text-sm">Work</h4>
                    <Link href="#features" className="text-sm text-brand-paper/65 hover:text-brand-coral">How we help</Link>
                    <Link href="#story" className="text-sm text-brand-paper/65 hover:text-brand-coral">How it works</Link>
                    <Link href="#pricing" className="text-sm text-brand-paper/65 hover:text-brand-coral">Ways to work together</Link>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="font-semibold text-sm">Good&apos;Ai</h4>
                    <Link href="#story" className="text-sm text-brand-paper/65 hover:text-brand-coral">Our approach</Link>
                    <Link href="https://goodai.up.railway.app/" className="text-sm text-brand-paper/65 hover:text-brand-coral">Field notes</Link>
                    <Link href="#testimonials" className="text-sm text-brand-paper/65 hover:text-brand-coral">What we work on</Link>
                    <Link href={SURVEY_URL} className="text-sm text-brand-paper/65 hover:text-brand-coral">Contact</Link>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="font-semibold text-sm">Legal</h4>
                    <Link href="#" className="text-sm text-brand-paper/65 hover:text-brand-coral">Privacy</Link>
                    <Link href="#" className="text-sm text-brand-paper/65 hover:text-brand-coral">Terms</Link>
                </div>
            </div>

            <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-paper/60 border-t border-brand-paper/20 pt-8">
                <p>&copy; 2026 Good&apos;Ai. Built in Perth, runs everywhere.</p>
                <div className="flex gap-4">
                    {/* Socials placeholders */}
                    <span>Perth, WA</span>
                    <span>LinkedIn</span>
                </div>
            </div>
        </footer>
    );
}
