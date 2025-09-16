"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { MultiSelectProps } from "@/types/multi-select.types";
import styles from "./MultiSelect.module.css";

const MultiSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  maxVisible = 6,
  horsContractList,
  onHorsContratChange,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [panelPos, setPanelPos] = useState<{
    top: number;
    left: number;
    minWidth: number;
  } | null>(null);
  const [showHorsContract, setShowHorsContract] = useState(false);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      const target = e.target;
      if (target instanceof Node && !rootRef.current.contains(target))
        setOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);

    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    const trigger = triggerRef.current;

    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();

    setPanelPos({
      top: rect.bottom + 6,
      left: rect.left,
      minWidth: rect.width,
    });

    const onResize = () => {
      const r = trigger.getBoundingClientRect();
      setPanelPos({ top: r.bottom + 6, left: r.left, minWidth: r.width });
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open]);

  const selectedOptions = useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const horsSet = new Set(
      (horsContractList ?? []).map((s) => s.toLowerCase())
    );
    const visible = options.filter((o) =>
      showHorsContract ? true : !horsSet.has(o.value.toLowerCase())
    );

    return term
      ? visible.filter((o) => o.label.toLowerCase().includes(term))
      : visible;
  }, [options, searchTerm, showHorsContract, horsContractList]);

  return (
    <div className={styles.root} ref={rootRef}>
      <div
        role="button"
        tabIndex={0}
        className={styles.trigger}
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
          if (e.key === "Escape") setOpen(false);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Ouvrir la sélection multiple"
      >
        <div className={styles.triggerContent}>
          {selectedOptions.length === 0 ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : (
            <span
              className={styles.overflowText}
              title={selectedOptions.map((o) => o.label).join(", ")}
            >
              {selectedOptions.map((o) => o.label).join(", ")}
            </span>
          )}
          <span className={styles.chevron}>⌄</span>
        </div>
      </div>
      {open && (
        <div
          className={styles.panel}
          role="listbox"
          style={{
            position: "fixed",
            top: panelPos?.top,
            left: panelPos?.left,
            minWidth: panelPos?.minWidth,
          }}
        >
          <div className={styles.searchRow}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.actionBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange([]);
                setSearchTerm("");
              }}
            >
              Effacer
            </button>
            {horsContractList && (
              <label className={styles.horsLabel}>
                <input
                  type="checkbox"
                  checked={showHorsContract}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setShowHorsContract(isChecked);
                    onHorsContratChange?.(isChecked);

                    if (!isChecked) {
                      const horsSet = new Set(
                        horsContractList.map((s) => s.toLowerCase())
                      );
                      const filteredValue = value.filter(
                        (v) => !horsSet.has(v.toLowerCase())
                      );
                      onChange(filteredValue);
                    }
                  }}
                />
                <span>Hors contrat</span>
              </label>
            )}
          </div>
          <div
            className={styles.list}
            style={{
              maxHeight:
                40 * Math.max(2, Math.min(maxVisible, filteredOptions.length)),
            }}
          >
            {filteredOptions.map((o) => {
              const isHors = (horsContractList ?? [])
                .map((s) => s.toLowerCase())
                .includes(o.value.toLowerCase());
              const checked = value.includes(o.value);
              return (
                <div
                  key={o.value}
                  className={styles.option}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(
                      checked
                        ? value.filter((v) => v !== o.value)
                        : [...value, o.value]
                    );
                  }}
                  aria-selected={checked}
                >
                  <input type="checkbox" readOnly checked={checked} />
                  <span className={styles.optionLabel}>{o.label}</span>
                  {isHors && (
                    <span className={styles.horsMeta}>(Hors contrat)</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
