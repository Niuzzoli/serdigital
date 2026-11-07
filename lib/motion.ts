// Valores de movimiento compartidos por todos los componentes de Motion.
// La misma curva está en app/globals.css como --ease-out: si cambiás una, cambiá la otra.
export const EASE = [0.22, 1, 0.36, 1] as const;

// Duraciones en segundos (300–700 ms)
export const DUR = { fast: 0.3, base: 0.5, slow: 0.7 } as const;

// Desplazamiento corto para las apariciones (px)
export const SHIFT = 16;
