"use client";
import React from "react";
import { Monitor, Gamepad2 } from "lucide-react";
import { ACCENT, LINKS, PRODUCT_CONFIG } from "../shared/constants";
import { Card, CardTitle, WarningBox, DownloadBtn } from "../shared/components";
import {
  SectionGeneralDependencies, SectionRequirementsBase,
  SectionDownloadBase, SectionInstallationBase, SectionCommonIssues,
} from "../shared/sections-shared";

function getApkIssues(tx) {
  return [
    { t: tx.apkIssues.i1.t, d: tx.apkIssues.i1.d, img: "/error-hora-apk.png",    warning: tx.apkIssues.i1.warning, extra: tx.apkIssues.i1.sol, extraImg: "/solucion-error-hora-apk.png" },
    { t: tx.apkIssues.i2.t, d: tx.apkIssues.i2.d, img: "/version-problem-apk.png", extra: tx.apkIssues.i2.sol, link: { label: tx.dl.emuTitle, href: "?section=download" } },
    { t: tx.apkIssues.i3.t, d: tx.apkIssues.i3.d, img: "/error-india-apk.png",    extra: tx.apkIssues.i3.sol },
    { t: tx.apkIssues.i4.t, d: tx.apkIssues.i4.d, img: "/error-port-apk.png",     extra: tx.apkIssues.i4.sol, extraImg: "/solucion-puerto-apk.png" },
  ];
}

const cfg = PRODUCT_CONFIG["bypass-apk"];

export default function BypassApk({ section, productName, tx }) {
  if (section === "general-dependencies") return <SectionGeneralDependencies tx={tx} />;

  if (section === "requirements")
    return (
      <SectionRequirementsBase tx={tx} productName={productName}>
        <Card className="mt-5">
          <CardTitle icon={Gamepad2} title={tx.req.gameTitle} color={ACCENT} />
          <WarningBox title={tx.req.gameWarning} desc={tx.req.gameDesc} color="#b45309" />
          <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
            <img src="/settings-apk.png" alt="APK settings guide" className="w-full h-auto object-contain" />
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
            <DownloadBtn href={LINKS.ffNormalApk} label="Free Fire Normal" color="#06b6d4" />
            <DownloadBtn href={LINKS.ffMaxApk}    label="Free Fire MAX"    color="#06b6d4" />
          </div>
        </Card>
        <Card className="mb-4">
          <CardTitle icon={Monitor} title={tx.dl.emuTitle} color="#8b5cf6" />
          <div className="flex flex-wrap gap-2">
            <DownloadBtn href={LINKS.bs522zip} label="Bluestacks 5.22" color="#8b5cf6" />
            <DownloadBtn href={LINKS.bs514zip} label="Bluestacks 5.14" color="#8b5cf6" />
            <DownloadBtn href={LINKS.msi512}   label="MSI 5.12"        color="#8b5cf6" />
          </div>
        </Card>
      </SectionDownloadBase>
    );

  if (section === "installation")
    return (
      <SectionInstallationBase tx={tx}>
        <Card className="mb-5">
          <CardTitle icon={Monitor} title={tx.install.videoTitle} color={ACCENT} />
          <div className="rounded-xl overflow-hidden aspect-video w-full">
            <iframe src={cfg.videoUrl} title={`Tutorial HyperV ${productName}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
        </Card>
      </SectionInstallationBase>
    );

  return <SectionCommonIssues tx={tx} issues={getApkIssues(tx)} />;
}
