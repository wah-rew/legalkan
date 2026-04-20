"use client";
import { ReactNode } from "react";
import { captureEvent } from "@/components/PostHogProvider";

interface ContractFormProps {
  title: string;
  subtitle?: string;
  steps: string[];
  currentStep: number;
  loading?: boolean;
  error?: string;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  children: ReactNode;
  contractTypeLabel?: string;
}

export default function ContractForm({
  title,
  subtitle,
  steps,
  currentStep,
  loading,
  error,
  onNext,
  onBack,
  onSubmit,
  children,
  contractTypeLabel,
}: ContractFormProps) {
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "#F8F9FF" }}>
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          {contractTypeLabel && (
            <span
              className="badge inline-flex mb-3"
              style={{ background: "rgba(255,77,109,0.1)", color: "#FF4D6D" }}
            >
              {contractTypeLabel}
            </span>
          )}
          <h1 className="font-jakarta text-3xl font-extrabold" style={{ color: "#0D1B3E" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm" style={{ color: "#6B7FA8" }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1 sm:gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all"
                style={{
                  background:
                    i < currentStep
                      ? "#06D6A0"
                      : i === currentStep
                      ? "#FF4D6D"
                      : "rgba(13,27,62,0.1)",
                  color: i <= currentStep ? "white" : "#9BA3C4",
                }}
              >
                {i < currentStep ? "✓" : i + 1}
              </div>
              <span
                className="hidden text-xs font-semibold sm:block"
                style={{ color: i === currentStep ? "#0D1B3E" : "#9BA3C4" }}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <div
                  className="h-px w-4 sm:w-8"
                  style={{
                    background: i < currentStep ? "#06D6A0" : "rgba(13,27,62,0.12)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card">
          {/* Step hint banner */}
          <div
            className="rounded-2xl p-3 mb-5"
            style={{
              background:
                currentStep === 0
                  ? "rgba(255,77,109,0.06)"
                  : currentStep === steps.length - 1
                  ? "rgba(6,214,160,0.08)"
                  : "rgba(255,209,102,0.10)",
              borderLeft: `3px solid ${
                currentStep === 0
                  ? "#FF4D6D"
                  : currentStep === steps.length - 1
                  ? "#06D6A0"
                  : "#FFD166"
              }`,
            }}
          >
            <p
              className="text-xs font-semibold"
              style={{
                color:
                  currentStep === 0
                    ? "#FF4D6D"
                    : currentStep === steps.length - 1
                    ? "#028A66"
                    : "#9A6F00",
              }}
            >
              {currentStep === steps.length - 1 ? "✅" : `📋`} Langkah {currentStep + 1} dari {steps.length} — {steps[currentStep]}
            </p>
          </div>

          {/* Form content */}
          {children}

          {/* Error */}
          {error && (
            <div
              className="mt-4 rounded-2xl px-4 py-3 text-sm font-semibold"
              style={{ background: "rgba(255,77,109,0.1)", color: "#E63558" }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {currentStep > 0 && (
              <button
                className="btn-ghost flex-1"
                onClick={onBack}
                disabled={loading}
              >
                ← Kembali
              </button>
            )}
            {!isLast ? (
              <button className="btn-primary flex-1" onClick={() => {
                captureEvent('form_step_completed', { step: steps[currentStep], contractType: contractTypeLabel });
                onNext();
              }}>
                Lanjut →
              </button>
            ) : (
              <button
                className="btn-amber flex-1 py-4 text-base font-extrabold"
                onClick={onSubmit}
                disabled={loading}
              >
                {loading ? "⏳ Membuat kontrak..." : "✨ Generate Kontrak"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#9BA3C4" }}>
          🔒 Data kamu dienkripsi & aman · Tidak perlu buat akun
        </p>
      </div>
    </div>
  );
}

// ─── Shared form helpers ──────────────────────────────────────────────────────

export function FormInput({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="form-label">
        {label}
        {required && <span style={{ color: "#FF4D6D" }}> *</span>}
        {hint && (
          <span className="ml-1 text-xs font-normal" style={{ color: "#9BA3C4" }}>
            ({hint})
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export function RpInput({
  label,
  value,
  onChange,
  required,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  required?: boolean;
  hint?: string;
}) {
  const formatted = value ? new Intl.NumberFormat("id-ID").format(value) : "";
  return (
    <FormInput label={label} required={required} hint={hint}>
      <div className="relative">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
          style={{ color: "#6B7FA8" }}
        >
          Rp
        </span>
        <input
          className="form-input pl-10"
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={formatted}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            onChange(raw ? parseInt(raw) : 0);
          }}
        />
      </div>
    </FormInput>
  );
}

export function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex justify-between items-start gap-4 py-3 border-b text-sm"
      style={{ borderColor: "rgba(13,27,62,0.06)" }}
    >
      <span className="font-semibold shrink-0" style={{ color: "#6B7FA8", minWidth: "140px" }}>
        {label}
      </span>
      <span className="text-right font-medium" style={{ color: "#0D1B3E" }}>
        {value || "-"}
      </span>
    </div>
  );
}

export function PriceBox({ price = 29000 }: { price?: number }) {
  const priceFormatted = new Intl.NumberFormat('id-ID').format(price);
  return (
    <div
      className="rounded-2xl p-4 mt-2"
      style={{ background: "rgba(255,77,109,0.06)" }}
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold" style={{ color: "#0D1B3E" }}>
          Biaya Pembuatan Kontrak
        </span>
        <span className="font-jakarta font-extrabold text-lg" style={{ color: "#FF4D6D" }}>
          Rp {priceFormatted}
        </span>
      </div>
      <p className="text-xs mt-1" style={{ color: "#9BA3C4" }}>
        Bayar 1x via Virtual Account Bank. Kontrak langsung jadi.
      </p>
    </div>
  );
}
