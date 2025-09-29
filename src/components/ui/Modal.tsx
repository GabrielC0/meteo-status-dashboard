'use client';

import { ReactNode, useEffect } from 'react';
import styles from '@/styles/components/ui/Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const preventBackgroundScroll = (e: WheelEvent) => {
        const target = e.target;
        const modal = document.querySelector('[data-modal-content]');

        if (modal && target instanceof Node && !modal.contains(target)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      document.addEventListener('wheel', preventBackgroundScroll, {
        passive: false,
      });

      return () => {
        document.body.style.overflow = 'unset';
        document.documentElement.style.overflow = 'unset';
        document.removeEventListener('wheel', preventBackgroundScroll);
      };
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} data-modal-content>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
