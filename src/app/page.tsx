"use client";

import { useState, useRef } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";

export default function QRGeneratorPage() {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUrl(input);
    setIsValid(validateUrl(input));
  };

  const validateUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const downloadSVG = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const urlBlob = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = urlBlob;
    link.download = "qr-code.svg";
    link.click();

    URL.revokeObjectURL(urlBlob);
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "qr-code.png";
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 text-neutral-800">
      <h1 className="text-3xl font-bold mb-6">QR Code Generator</h1>

      <input
        type="url"
        value={url}
        onChange={handleInputChange}
        placeholder="Enter a valid URL (https://...)"
        className={`w-full max-w-md px-4 py-2 border rounded-md mb-4 ${
          isValid ? "border-gray-300" : "border-red-500"
        }`}
      />

      {!isValid && (
        <p className="text-red-500 text-sm mb-4">
          Please enter a valid URL starting with http:// or https://
        </p>
      )}

      {isValid && url && (
        <>
          <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <QRCodeSVG
              value={url}
              size={256}
              level="H"
              includeMargin
              ref={svgRef}
              className="mb-4"
            />
            <QRCodeCanvas
              value={url}
              size={256}
              level="H"
              includeMargin
              style={{ display: "none" }}
              ref={canvasRef}
            />

            <div className="flex gap-4">
              <button
                onClick={downloadSVG}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Download SVG
              </button>
              <button
                onClick={downloadPNG}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Download PNG
              </button>
            </div>
          </div>
        </>
      )}

      <p className="mt-6 text-sm text-gray-500">
        QR code updates in real time. You can download it as SVG or PNG.
      </p>
    </div>
  );
}
