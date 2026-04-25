"use client";
import React from "react";
import {
  Package, ShieldOff, Settings, Check, Cpu,
  Shield, Monitor, Gamepad2, Download,
  AlertTriangle, Wrench, MessageCircle, ExternalLink
} from "lucide-react";
import { ACCENT, LINKS } from "./constants";
import { CopyUrl, Card, CardTitle, WarningBox, InfoBox, StepBadge, DownloadBtn, Accordion } from "./components";

/** Dependencias generales — idéntica para todos los productos */
export function SectionGeneralDependencies({ tx }) {
  return (
    <>
      <CopyUrl section="general-dependencies" />
      <div className="flex items-center gap-3 mb-2">
        <Package size={24} style={{ color: ACCENT }} />
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.deps.title}</h1>
      </div>
      <p className="text-white/40 text-sm mb-6">{tx.deps.subtitle}</p>
      <WarningBox title={tx.deps.warning} desc={tx.deps.warningDesc} color="#b45309" />
      <div className="mt-6 flex flex-col gap-5">
        <Card>
          <CardTitle icon={ShieldOff} title={tx.deps.defender.title} color="#ef4444" />
          <p className="text-white/50 text-sm mb-4">{tx.deps.defender.desc}</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-4 text-white/70 text-sm font-semibold">
              <Settings size={15} /> {tx.deps.defender.manual}
            </div>
            <div className="flex flex-col gap-4">
              {tx.deps.defender.steps.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <StepBadge n={i + 1} color="#6366f1" />
                  <div>
                    <p className="text-white font-semibold text-sm">{s.t}</p>
                    <p className="text-white/40 text-sm mt-0.5">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm font-bold" style={{ color: ACCENT }}>{tx.deps.defender.then}</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4 text-white font-bold text-sm">
              <Check size={15} className="text-green-400" /> {tx.deps.defender.dcontrol}
            </div>
            <div className="flex gap-3 mb-4">
              <StepBadge n={1} color="#6366f1" />
              <div>
                <p className="text-white font-semibold text-sm mb-2">{tx.deps.defender.downloadDcontrol}</p>
                <DownloadBtn href={LINKS.dcontrol} label={tx.deps.defender.downloadDcontrol} />
              </div>
            </div>
            <div className="flex gap-3">
              <StepBadge n={2} color="#6366f1" />
              <div>
                <p className="text-white font-semibold text-sm">{tx.deps.defender.runAndDisable}</p>
                <p className="text-white/40 text-sm mt-0.5">{tx.deps.defender.runDesc}</p>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <CardTitle icon={Cpu} title={tx.deps.vcpp.title} color="#6366f1" />
          <p className="text-white/50 text-sm mb-4">{tx.deps.vcpp.desc}</p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <StepBadge n={1} color="#6366f1" />
              <div>
                <p className="text-white font-semibold text-sm mb-2">{tx.deps.vcpp.download}</p>
                <DownloadBtn href={LINKS.vcpp} label="Download Here" />
              </div>
            </div>
            <div className="flex gap-3">
              <StepBadge n={2} color="#6366f1" />
              <div>
                <p className="text-white font-semibold text-sm">{tx.deps.vcpp.install}</p>
                <p className="text-white/40 text-sm mt-0.5">{tx.deps.vcpp.installDesc}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

/** Base de requisitos — pasa children para las imágenes específicas de cada producto */
export function SectionRequirementsBase({ tx, productName, children }) {
  return (
    <>
      <CopyUrl section="requirements" />
      <div className="flex items-center gap-3 mb-2">
        <Shield size={24} style={{ color: ACCENT }} />
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.req.title}</h1>
      </div>
      <p className="text-white/40 text-sm mb-6">{tx.req.subtitle}</p>
      <Card>
        <CardTitle icon={Monitor} title={tx.req.sysTitle} color={ACCENT} />
        <WarningBox title={tx.req.sysWarning} desc={`${productName} — Windows 8/10/11, HVCI ON & OFF.`} color="#b45309" />
        <div className="mt-4 flex flex-col gap-2">
          {tx.req.items.map(r => (
            <div key={r} className="flex items-center gap-2 text-white/70 text-sm">
              <Check size={14} style={{ color: ACCENT }} className="shrink-0" /> {r}
            </div>
          ))}
        </div>
      </Card>
      {children}
    </>
  );
}

/** Base de descargas — loader + children (FF/emuladores específicos) + remote tools */
export function SectionDownloadBase({ tx, productName, loaderUrl, children }) {
  return (
    <>
      <CopyUrl section="download" />
      <div className="flex items-center gap-3 mb-2">
        <Download size={24} style={{ color: ACCENT }} />
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.dl.title}</h1>
      </div>
      <p className="text-white/40 text-sm mb-6">{tx.dl.subtitle}</p>
      <Card className="mb-4">
        <CardTitle icon={Download} title={`${tx.dl.loaderTitle} ${productName}`} color={ACCENT} />
        <p className="text-white/50 text-sm mb-4">{tx.dl.loaderDesc}</p>
        <DownloadBtn href={loaderUrl} label={tx.dl.loaderBtn} color={ACCENT} />
      </Card>
      {children}
      <Card className="mb-4">
        <CardTitle icon={Wrench} title={tx.dl.remoteTitle} color="#f59e0b" />
        <p className="text-white/50 text-sm mb-3">{tx.dl.remoteDesc}</p>
        <div className="flex flex-wrap gap-2">
          <DownloadBtn href={LINKS.ultraviewer} label="UltraViewer" color="#f59e0b" />
          <DownloadBtn href={LINKS.anydesk}     label="AnyDesk"     color="#f59e0b" />
        </div>
      </Card>
      <InfoBox text={tx.dl.reminder} />
    </>
  );
}

/** Base de instalación — children = card(s) con video(s) */
export function SectionInstallationBase({ tx, children }) {
  return (
    <>
      <CopyUrl section="installation" />
      <div className="flex items-center gap-3 mb-2">
        <Settings size={24} style={{ color: ACCENT }} />
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.install.title}</h1>
      </div>
      <p className="text-white/40 text-sm mb-6">{tx.install.subtitle}</p>
      {children}
      <Card>
        <CardTitle icon={Settings} title={tx.install.stepsTitle} color={ACCENT} />
        <div className="flex flex-col gap-4">
          {tx.install.steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <StepBadge n={i + 1} color={ACCENT} />
              <div>
                <p className="text-white font-semibold text-sm">{s.t}</p>
                <p className="text-white/40 text-sm mt-0.5">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <div className="rounded-xl px-4 py-4 border border-red-500/30 bg-red-500/10 flex gap-3">
            <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-bold text-sm">{tx.install.fails}</p>
              <p className="text-red-300/70 text-sm">{tx.install.failsDesc}</p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

/** Issues comunes — recibe el array de issues ya armado */
export function SectionCommonIssues({ tx, issues }) {
  return (
    <>
      <CopyUrl section="common-issues" />
      <div className="flex items-center gap-3 mb-2">
        <AlertTriangle size={24} style={{ color: "#f59e0b" }} />
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.issues.title}</h1>
      </div>
      <p className="text-white/40 text-sm mb-6">{tx.issues.subtitle}</p>
      <Card className="mb-4">
        <CardTitle icon={AlertTriangle} title={tx.issues.ticketTitle} color="#f59e0b" />
        <p className="text-white/50 text-sm">{tx.issues.ticketDesc}</p>
      </Card>
      <Card className="mb-4">
        <CardTitle icon={Wrench} title={tx.issues.issuesTitle} color={ACCENT} />
        <div className="flex flex-col gap-2">
          {issues.map((item, i) => (
            <Accordion key={i} title={item.t} img={item.img} warning={item.warning}
              video={item.video} extra={item.extra} link={item.link} extraImg={item.extraImg}>
              {item.d}
            </Accordion>
          ))}
        </div>
      </Card>
      <Card>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#5865F2]/20 flex items-center justify-center shrink-0">
            <MessageCircle size={18} className="text-[#5865F2]" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">{tx.issues.helpTitle}</p>
            <a href="https://discord.com/invite/hypervgg" target="_blank" rel="noopener noreferrer"
              className="text-[#5865F2] text-xs hover:underline">Join Discord</a>
          </div>
        </div>
        <p className="text-white/40 text-sm mb-4">{tx.issues.helpDesc}</p>
        <a href="https://discord.com/invite/hypervgg" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-[#5865F2] hover:bg-[#4752c4] transition-colors">
          <MessageCircle size={15} /> {tx.issues.joinDiscord} <ExternalLink size={13} />
        </a>
      </Card>
    </>
  );
}
