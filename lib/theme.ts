// Tema claro / oscuro.
// - Preferencia "system" (automático, por defecto): sigue al sistema del visitante y cambia si el sistema cambia.
// - "light" / "dark": elegidas con el botón de la barra; se guardan en localStorage y ganan sobre el sistema.
// En <html> quedan dos atributos:
//   data-theme="light|dark"            → el tema que se ve (los tokens de globals.css leen este)
//   data-theme-pref="system|light|dark" → lo que eligió el visitante (lo usa el botón)

export type Theme = "light" | "dark";
export type ThemePreference = "system" | Theme;

export const THEME_STORAGE_KEY = "serdigital-theme";

export function parsePreference(stored: string | null): ThemePreference {
  return stored === "light" || stored === "dark" ? stored : "system";
}

export function resolveTheme(stored: string | null, systemPrefersLight: boolean): Theme {
  const pref = parsePreference(stored);
  if (pref !== "system") return pref;
  return systemPrefersLight ? "light" : "dark";
}

/** Orden del botón: automático → claro → oscuro → automático */
export function nextPreference(current: ThemePreference): ThemePreference {
  return current === "system" ? "light" : current === "light" ? "dark" : "system";
}

// Script que corre en <head> antes de pintar la página: evita el parpadeo de tema.
// Repite la lógica de resolveTheme porque se ejecuta antes de que cargue React.
// Expone window.__setThemePref para que el botón aplique una preferencia con la misma lógica.
export const THEME_INIT_SCRIPT = `(function(){try{
var k="${THEME_STORAGE_KEY}",d=document.documentElement,m=window.matchMedia("(prefers-color-scheme: light)");
function stored(){try{var v=localStorage.getItem(k);return v==="light"||v==="dark"?v:null}catch(e){return null}}
function apply(){var s=stored();d.setAttribute("data-theme-pref",s||"system");d.setAttribute("data-theme",s||(m.matches?"light":"dark"))}
window.__setThemePref=function(p){try{if(p==="system")localStorage.removeItem(k);else localStorage.setItem(k,p)}catch(e){}
if(p==="light"||p==="dark"){d.setAttribute("data-theme-pref",p);d.setAttribute("data-theme",p)}else{d.setAttribute("data-theme-pref","system");d.setAttribute("data-theme",m.matches?"light":"dark")}};
apply();m.addEventListener("change",function(){if(d.getAttribute("data-theme-pref")==="system")apply()});
}catch(e){}})();`;
