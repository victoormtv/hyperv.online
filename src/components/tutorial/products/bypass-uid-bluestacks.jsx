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
const cfg = PRODUCT_CONFIG["bypass-uid-bluestacks"];

export default function BypassUidBluestacks({ section, productName, tx }) {
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
            <DownloadBtn href={LINKS.bs514} label="Bluestacks 5.14" color="#8b5cf6" />
            <DownloadBtn href={LINKS.bs522} label="Bluestacks 5.22" color="#8b5cf6" />
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
          <CardTitle icon={Monitor} title={tx.install.videoTitleBS} color={ACCENT} />
          <div className="rounded-xl overflow-hidden aspect-video w-full">
            <iframe src={cfg.videoUrlBS} title={`Tutorial HyperV ${productName}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
        </Card>
      </SectionInstallationBase>
    );

  return <SectionCommonIssues tx={tx} issues={getBypassUidIssues()} />;
}
