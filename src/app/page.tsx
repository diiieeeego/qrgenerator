"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

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
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "qr-code.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 text-neutral-800">
      <h1 className="text-3xl font-bold mb-6">QR Code Generator (SVG)</h1>

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
          <div className="bg-white p-4 rounded shadow">
            <QRCodeSVG
              value={url}
              size={256}
              level="H"
              includeMargin={true}
              ref={svgRef}
            />
          </div>

          <button
            onClick={downloadSVG}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Download as SVG
          </button>
        </>
      )}

      <p className="mt-6 text-sm text-gray-500">
        Your QR code updates as you type and downloads as a clean SVG.
      </p>
    </div>
  );
}
