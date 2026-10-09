import React, { useState } from 'react';
import { Mail, ArrowUpRight, Code2, Send, CheckCircle2, Copy, Check } from 'lucide-react';

export default function PortfolioContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Cyber Strategy / Risk Advisory',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText('immanuel.0747@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-10">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block">
            {'// Let\'s Connect'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-100 font-sans tracking-tight">
            Have an interesting problem?
          </h2>
          <p className="text-lg text-slate-300 font-mono">
            {"Let's build something worth talking about."}
          </p>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-sans leading-relaxed pt-2">
            Whether you want to discuss enterprise cybersecurity strategy, incident response architectures, business analytics modeling, or prospective technical roles — my inbox is always open.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Email link */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left transition-all hover:border-cyan-500/40 shadow-lg space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <Mail size={18} className="text-cyan-400" />
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy email to clipboard"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-500 block">Direct Email</span>
              <a
                href="mailto:immanuel.0747@gmail.com"
                className="text-sm font-semibold text-slate-200 hover:text-cyan-300 transition-colors break-all"
              >
                immanuel.0747@gmail.com
              </a>
            </div>
          </div>

          {/* GitHub Profile */}
          <a
            href="https://github.com/jatinsingh82"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left transition-all hover:border-cyan-500/40 shadow-lg group block space-y-3"
          >
            <div className="flex items-center justify-between text-slate-400">
              <Code2 size={18} className="text-cyan-400" />
              <ArrowUpRight size={14} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-500 block">Code Repositories</span>
              <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors font-mono">
                github.com/jatinsingh82
              </span>
            </div>
          </a>
        </div>

        {/* Quick Message Form */}
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl text-left">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/5">
            <div>
              <h3 className="text-base font-bold text-slate-100 font-mono">Send a Direct Inquiry</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Recruiter outreach, advisory consult, or engineering discussions.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold">
              ● Active Inbox
            </span>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-100 font-mono">Inquiry Prepared & Logged</h4>
                <p className="text-xs text-slate-400 font-sans max-w-md mx-auto">
                  Thank you, <span className="text-cyan-300 font-semibold">{formData.name}</span>. You can also send this note directly via your default email client:
                </p>
              </div>
              <div className="pt-2">
                <a
                  href={`mailto:immanuel.0747@gmail.com?subject=${encodeURIComponent(
                    `[Portfolio Inquiry] ${formData.subject} - from ${formData.name}`
                  )}&body=${encodeURIComponent(
                    `From: ${formData.name} (${formData.email})\n\n${formData.message}`
                  )}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors shadow-lg shadow-cyan-500/20"
                >
                  <Send size={14} />
                  <span>Open Draft in Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 block">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Alex Reed"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-sans transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400 block">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@organization.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-sans transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block">Discussion Topic</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/60 font-sans transition-colors"
                >
                  <option value="Cyber Strategy / Risk Advisory">Cyber Strategy / Risk Advisory</option>
                  <option value="Incident Simulation & IR Architectures">Incident Simulation & IR Architectures</option>
                  <option value="Business Analytics & Quantitative Modeling">Business Analytics & Quantitative Modeling</option>
                  <option value="Full-Stack Engineering & Web Systems">Full-Stack Engineering & Web Systems</option>
                  <option value="Recruitment & Technical Opportunities">Recruitment & Technical Opportunities</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400 block">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details about the problem, project, or role..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 font-sans resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors shadow-lg shadow-cyan-500/20"
              >
                <Send size={14} />
                <span>Submit Inquiry Note</span>
              </button>
            </form>
          )}

          <div className="pt-4 mt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
            <span>Location: India</span>
            <span>Focus: Cyber Strategy & Engineering</span>
            <span className="text-emerald-400">● Open to Dialogue</span>
          </div>
        </div>
      </div>
    </section>
  );
}
