"use client";
import React from "react";
import { Monitor, Gamepad2, Archive } from "lucide-react";
import { ACCENT, LINKS, PRODUCT_CONFIG, getBypassUidIssues } from "../shared/constants";
import { Card, CardTitle, WarningBox, DownloadBtn } from "../shared/components";
import {
  SectionGeneralDependencies, SectionRequirementsBase,
  SectionDownloadBase, SectionInstallationBase, SectionCommonIssues,
} from "../shared/sections-shared";

const MEMU_IMGS = ["/memu-config-1.png","/memu-config-2.png","/memu-config-3.png","/memu-config-4.png"];
const cfg = PRODUCT_CONFIG["bypass-uid-memuplay"];

export default function BypassUidMemuPlay({ section, productName, tx }) {
  if (section === "general-dependencies") return <SectionGeneralDependencies tx={tx} />;

  if (section === "requirements")
    return (
      <SectionRequirementsBase tx={tx} productName={productName}>
        <Card className="mt-5">
          <CardTitle icon={Gamepad2} title={tx.req.gameTitle} color={ACCENT} />
          <WarningBox title={tx.req.gameWarning} desc={tx.req.gameDesc} color="#b45309" />
          <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
            <img src="/adb.png" alt="ADB configuration guide" className="w-full h-auto object-contain" />
          </div>
        </Card>
        <Card className="mt-5">
          <CardTitle icon={Monitor} title="Configuración del Emulador" color={ACCENT} />
          <WarningBox title="Configuración ADB Requerida"
            desc="El emulador DEBE estar configurado correctamente con ADB habilitado para que el Bypass funcione."
            color="#b45309" />
          <div className="mt-4 flex flex-col gap-3">
            {MEMU_IMGS.map((src, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-white/10">
                <img src={src} alt={`Config ${i + 1}`} className="w-full h-auto object-contain" />
              </div>
            ))}
          </div>
        </Card>
      </SectionRequirementsBase>
    );

  if (section === "download")
    return (
      <SectionDownloadBase tx={tx} productName={productName} loaderUrl={cfg.loaderUrl}>
        <Card className="mb-4">
          <CardTitle icon={Gamepad2} title={tx.dl.ffTitle} color="#06b6d4" />
          <p className="text-white/50 text-sm mb-3">{tx.dl.ffDesc}</p>
          <div className="flex flex-wrap gap-2">
            <DownloadBtn href={LINKS.ffNormal} label="Free Fire Normal" color="#06b6d4" />
            <DownloadBtn href={LINKS.ffMax}    label="Free Fire Max"    color="#06b6d4" />
            <DownloadBtn href={LINKS.ffTela}   label="Free Fire Tela"   color="#06b6d4" />
          </div>
        </Card>
        <Card className="mb-4">
          <CardTitle icon={Monitor} title={tx.dl.emuTitle} color="#8b5cf6" />
          <div className="flex flex-wrap gap-2">
            <DownloadBtn href={LINKS.memuplay} label="MemuPlay 9.3.2.2" color="#8b5cf6" />
          </div>
        </Card>
        <Card className="mb-4">
          <CardTitle icon={Archive} title={tx.dl.zArchiverTitle} color="#85363dff" />
          <p className="text-white/50 text-sm mb-3">{tx.dl.zArchiverDesc}</p>
          <DownloadBtn href={LINKS.zarchiver} label="ZArchiver" color="#85363dff" />
        </Card>
      </SectionDownloadBase>
    );

  if (section === "installation")
    return (
      <SectionInstallationBase tx={tx}>
        <Card className="mb-5">
          <CardTitle icon={Monitor} title={tx.install.videoTitleMemu} color={ACCENT} />
          {/* Video principal — tutorial completo MEmu Play */}
          <div className="rounded-xl overflow-hidden aspect-video w-full mb-2">
            <iframe src={cfg.videoUrlMemuFreeFire} title={`Tutorial HyperV ${productName}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
          {/* Video secundario — tutorial bypass MEmu */}
          <div className="rounded-xl overflow-hidden aspect-video w-full">
            <iframe src={cfg.videoUrlMemuBypass} title={`Tutorial Bypass ${productName}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
        </Card>
      </SectionInstallationBase>
    );

  return <SectionCommonIssues tx={tx} issues={getBypassUidIssues()} />;
}
