import { useRef, useState } from "react";
import { Logo } from "../components/BrandMarks";
import { fmt } from "../data/constants";
import { REWARDS } from "../data/constants";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

async function downloadPDF(element, fileName) {
  // High quality settings
  const canvas = await html2canvas(element, {
    scale: 3, // 3x scale for high resolution (300 DPI equivalent)
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    width: element.offsetWidth,
    height: element.offsetHeight,
  });

  const imgData = canvas.toDataURL("image/png", 1.0);

  // PDF setup (A4 size)
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Calculate dimensions to center the image
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const finalWidth = imgWidth * ratio;
  const finalHeight = imgHeight * ratio;
  const x = (pdfWidth - finalWidth) / 2;
  const y = (pdfHeight - finalHeight) / 2;

  pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
  pdf.save(fileName);
}

export function ClaimProof({ claim, onClose }) {
  const proofCardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const reward = REWARDS.find((r) => r.id === claim.tier);
  const isFulfilled = claim.status === "fulfilled";

  const handleDownload = async () => {
    if (!proofCardRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      await downloadPDF(proofCardRef.current, `bukti-klaim-${claim.tier}-${claim.id.slice(0, 8)}.pdf`);
    } catch (error) {
      console.error("PDF download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="screen proof starfield">
      <div ref={proofCardRef} className="proof-card">
        <div className="proof-mark"><Logo width={175} /></div>
        <div className="proof-title">Tunjukkan layar ini ke kasir</div>
        <div className="proof-reward">{reward?.label || claim.tier}</div>
        <div className="proof-rows">
          <div><span>Waktu</span><b>{fmt(claim.created_at)}</b></div>
          <div>
            <span>Status</span>
            <b className={`pstat ${isFulfilled ? "fulfilled" : "pending"}`}>
              {isFulfilled ? "Selesai" : "Menunggu kasir"}
            </b>
          </div>
        </div>
        {!isFulfilled && <div className="proof-pulse" />}
        <button
          className="btn btn-primary full"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? "Downloading..." : "Download PDF"}
        </button>
        <button className="btn btn-ghost full" onClick={onClose}>Tutup</button>
      </div>
    </div>
  );
}
