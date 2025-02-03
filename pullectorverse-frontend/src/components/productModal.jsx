import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { gsap } from "gsap";

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    } else if (!isOpen && isAnimating) {
      gsap.to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.2,
        ease: "power3.in",
        onComplete: () => setIsAnimating(false),
      });
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-xs z-50"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-xl border-1 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 text-2xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
