import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export default function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
 const ref = useRef<HTMLDialogElement>(null);
 useEffect(() => { const dialog = ref.current; const previous = document.activeElement; dialog?.showModal(); const before = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { dialog?.close(); document.body.style.overflow = before; if (previous instanceof HTMLElement) previous.focus(); }; }, []);
 return <dialog ref={ref} className={`modal ${wide ? 'wide' : ''}`} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === ref.current) { const box = ref.current.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose(); } }}><div className="modal-header"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close modal"><X size={19} /></button></div><div className="modal-body">{children}</div></dialog>;
}
