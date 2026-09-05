/** Generadores de datos falsos con la MISMA forma que devuelven DONKI, NeoWs y JPL CAD.
 *  La semilla es el día actual: los datos son estables dentro de una jornada
 *  (una demo repetible) pero cambian al día siguiente (se siente vivo). */

function mulberry32(semilla) {
  return function () {
    semilla |= 0;
    semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const semillaDelDia = () => {
  const hoy = new Date().toISOString().slice(0, 10);
  return [...hoy].reduce((a, c) => a + c.charCodeAt(0), 0);
};

const rnd = mulberry32(semillaDelDia());
const entre = (min, max) => min + rnd() * (max - min);
const entero = (min, max) => Math.floor(entre(min, max + 1));
const elegir = (xs) => xs[entero(0, xs.length - 1)];
const isoZ = (d) => d.toISOString().slice(0, 16) + "Z";

/** Clases reales ponderadas: las C son comunes, las X raras. */
function claseSolar() {
  const p = rnd();
  const letra = p < 0.6 ? "C" : p < 0.92 ? "M" : "X";
  return `${letra}${entre(1, 9.9).toFixed(1)}`;
}

export function llamaradas(cuantas = 6) {
  const ahora = Date.now();
  return Array.from({ length: cuantas }, (_, i) => {
    const inicio = new Date(ahora - (i * entre(6, 40) + entre(1, 5)) * 3600_000);
    const pico = new Date(inicio.getTime() + entre(5, 45) * 60_000);
    const region = entero(13800, 14300);
    return {
      flrID: `${isoZ(inicio).replace("Z", "")}-FLR-${String(i + 1).padStart(3, "0")}`,
      instruments: [{ displayName: "GOES-P: EXIS 1.0-8.0" }],
      beginTime: isoZ(inicio),
      peakTime: isoZ(pico),
      endTime: null,
      classType: claseSolar(),
      sourceLocation: `${elegir(["N", "S"])}${entero(5, 30)}${elegir(["E", "W"])}${entero(10, 95)}`,
      activeRegionNum: region,
      note: "Dato simulado por la fake API de KillaLab. No es un evento real.",
      link: `https://webtools.ccmc.gsfc.nasa.gov/DONKI/view/FLR/${entero(10000, 99999)}/-1`,
    };
  });
}

export function feedNeoWs(fecha) {
  const objetos = Array.from({ length: entero(4, 11) }, (_, i) => {
    const dmin = entre(8, 420);
    return {
      id: String(entero(2000000, 3999999)),
      name: `(${new Date().getFullYear()} ${elegir("ABCDEFGHJKLMNPQRSTUVWXY")}${elegir("ABCDEFGHJKLMNPQRSTUVWXY")}${entero(1, 9)})`,
      absolute_magnitude_h: Number(entre(18, 27).toFixed(1)),
      estimated_diameter: {
        meters: { estimated_diameter_min: Number(dmin.toFixed(1)), estimated_diameter_max: Number((dmin * 2.24).toFixed(1)) },
      },
      is_potentially_hazardous_asteroid: rnd() < 0.15,
      close_approach_data: [
        {
          close_approach_date: fecha,
          close_approach_date_full: `${fecha} ${String(entero(0, 23)).padStart(2, "0")}:${String(entero(0, 59)).padStart(2, "0")}`,
          relative_velocity: { kilometers_per_second: entre(3, 28).toFixed(4) },
          miss_distance: { kilometers: entre(180_000, 7_400_000).toFixed(0) },
          orbiting_body: "Earth",
        },
      ],
    };
  });
  return { element_count: objetos.length, near_earth_objects: { [fecha]: objetos } };
}

export function cad(limite = 5) {
  const UA_KM = 149_597_870.7;
  const ahora = Date.now();
  const meses = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const data = Array.from({ length: limite }, (_, i) => {
    const d = new Date(ahora + (i + 1) * entre(0.5, 4) * 86400_000);
    const cd = `${d.getUTCFullYear()}-${meses[d.getUTCMonth()]}-${String(d.getUTCDate()).padStart(2, "0")} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
    return [
      `${d.getUTCFullYear()} ${elegir("ABCDEFGHJKLMNPQRSTUVWXY")}${elegir("ABCDEFGHJKLMNPQRSTUVWXY")}${entero(1, 9)}`,
      String(entero(1, 40)),
      cd,
      (entre(150_000, 7_000_000) / UA_KM).toFixed(9),
      entre(2.5, 26).toFixed(4),
      entre(17, 27).toFixed(2),
    ];
  });
  return {
    signature: { source: "KillaLab fake API", version: "1.0" },
    count: String(data.length),
    fields: ["des", "orbit_id", "cd", "dist", "v_rel", "h"],
    data,
  };
}
