/**
 * Relationship models.
 *
 * Every mission is built on a real equation. The learner controls one variable;
 * the model computes both sides of the relationship from that variable and
 * reports whether they agree within a physically meaningful tolerance.
 *
 * A model is never "slide to 58%". The balance point is solved from the
 * equation, and the tolerance is expressed in the quantity's own unit.
 */

const round = (value, places = 2) => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

/**
 * Each kind exposes:
 *   solve(p)        -> the control value at which both sides agree
 *   left(p, x)      -> left-hand quantity at control value x
 *   right(p, x)     -> right-hand quantity at control value x
 *   labels(p)       -> { left, right, unit } naming both sides
 *
 * `p` is the per-mission parameter object. Every number in it is a real,
 * dimensioned quantity chosen so the solved answer lands inside the
 * control range.
 */
export const MODEL_KINDS = {
  /** a·b = c·x — torque, hydraulics, work, moment balance. */
  inverseProduct: {
    solve: (p) => (p.leftA * p.leftB) / p.rightA,
    left: (p) => p.leftA * p.leftB,
    right: (p, x) => p.rightA * x,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** y = k·x — Ohm's law, F=ma, momentum, concentration, Hooke's law. */
  proportional: {
    solve: (p) => p.targetY / p.k,
    left: (p, x) => p.k * x,
    right: (p) => p.targetY,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** a + x = C — series resistance, angle sums, energy conservation, mass balance. */
  sumToConstant: {
    solve: (p) => p.total - p.known,
    left: (p, x) => p.known + x,
    right: (p) => p.total,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** 1/a + 1/x = 1/c — parallel resistance, thin lens equation. */
  reciprocalSum: {
    solve: (p) => 1 / (1 / p.combined - 1 / p.known),
    left: (p, x) => 1 / (1 / p.known + 1 / x),
    right: (p) => p.combined,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** a² + x² = c² — Pythagorean distance, resultant vectors. */
  pythagoras: {
    solve: (p) => Math.sqrt(Math.max(0, p.hypotenuse ** 2 - p.known ** 2)),
    left: (p, x) => Math.sqrt(p.known ** 2 + x ** 2),
    right: (p) => p.hypotenuse,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /**
   * pH = -log10[H⁺].
   *
   * The control is expressed in µmol/L so the slider carries readable numbers,
   * so the mol/L conversion (1 µmol/L = 1e-6 mol/L) is folded in here:
   *   pH = -log10(x · 1e-6) = 6 - log10(x)
   */
  logAcidity: {
    solve: (p) => 10 ** (6 - p.targetPH),
    left: (p, x) => 6 - Math.log10(Math.max(1e-9, x)),
    right: (p) => p.targetPH,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** v = f·λ — wave speed, resonance, standing waves. */
  waveSpeed: {
    solve: (p) => p.speed / p.wavelength,
    left: (p, x) => x * p.wavelength,
    right: (p) => p.speed,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** n₁sinθ₁ = n₂sinθ₂ — refraction. Control is θ₁ in degrees. */
  snell: {
    solve: (p) => (Math.asin(Math.min(1, (p.n2 * Math.sin((p.theta2 * Math.PI) / 180)) / p.n1)) * 180) / Math.PI,
    left: (p, x) => p.n1 * Math.sin((x * Math.PI) / 180),
    right: (p) => p.n2 * Math.sin((p.theta2 * Math.PI) / 180),
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** x̄ = Σx / n — the control is the one unknown sample. */
  mean: {
    solve: (p) => p.targetMean * (p.samples.length + 1) - p.samples.reduce((sum, value) => sum + value, 0),
    left: (p, x) => (p.samples.reduce((sum, value) => sum + value, 0) + x) / (p.samples.length + 1),
    right: (p) => p.targetMean,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** PV = nRT — the control is volume, pressure, or temperature. */
  idealGas: {
    solve: (p) => (p.moles * 8.314 * p.temperature) / p.pressure,
    left: (p, x) => p.pressure * x,
    right: (p) => p.moles * 8.314 * p.temperature,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /**
   * Logistic equilibrium: population is stable when N = K.
   *
   * `perUnit` is how much population one unit of the control delivers — boats
   * that each land 25 t, habitat patches that each support 3 species. It
   * defaults to 1, which is the original identity behaviour, so every mission
   * authored before it existed is unaffected.
   *
   * It exists because without it this kind cannot pose a question. `solve`
   * returned `capacity` verbatim, and `capacity` is printed on the panel as the
   * right-hand reading, so the learner could match the two numbers without
   * knowing what a carrying capacity is. With a factor they still have to know
   * the population settles at K — and then work out how many units reach it.
   */
  carryingCapacity: {
    solve: (p) => p.capacity / (p.perUnit ?? 1),
    left: (p, x) => x * (p.perUnit ?? 1),
    right: (p) => p.capacity,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /**
   * Flux balance: net transfer is zero when the two potentials match.
   *
   * Same `perUnit` escape hatch and the same reason. "Isotonic means equal" is
   * the concept worth teaching; reading 0.9 off the right-hand readout and
   * dragging until the left says 0.9 teaches pattern-matching instead. When the
   * control is a dose rather than the potential itself — grams of salt per
   * litre, each raising concentration by 0.3% — the learner has to know the
   * goal is equality *and* convert to it.
   */
  fluxBalance: {
    solve: (p) => p.outside / (p.perUnit ?? 1),
    left: (p, x) => x * (p.perUnit ?? 1),
    right: (p) => p.outside,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** Q = m·c·ΔT — the control is ΔT, mass, or supplied heat. */
  heatTransfer: {
    solve: (p) => p.heat / (p.mass * p.specificHeat),
    left: (p, x) => p.mass * p.specificHeat * x,
    right: (p) => p.heat,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** a : b = c : x — scale drawings, similar shapes, unit conversion. */
  ratioMatch: {
    solve: (p) => (p.b * p.c) / p.a,
    left: (p, x) => p.a * x,
    right: (p) => p.b * p.c,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** Inverse-square: F = k / r². Control is separation r. */
  inverseSquare: {
    solve: (p) => Math.sqrt(p.constant / p.targetForce),
    left: (p, x) => p.constant / Math.max(1e-6, x ** 2),
    right: (p) => p.targetForce,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** R = v₀²·sin(2θ)/g — projectile range. Control is launch speed. */
  projectileRange: {
    solve: (p) => Math.sqrt((p.range * 9.81) / Math.sin((2 * p.angle * Math.PI) / 180)),
    left: (p, x) => (x ** 2 * Math.sin((2 * p.angle * Math.PI) / 180)) / 9.81,
    right: (p) => p.range,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },

  /** Cardiac / ventilation output: rate × stroke = required output. */
  rateVolume: {
    solve: (p) => p.requiredOutput / p.strokeVolume,
    left: (p, x) => x * p.strokeVolume,
    right: (p) => p.requiredOutput,
    labels: (p) => ({ left: p.leftName, right: p.rightName, unit: p.productUnit }),
  },
};

/**
 * Wraps a raw model definition into something the UI and engine can use.
 *
 * `control` describes how the slider maps onto the real variable. The slider is
 * always 0-100 for touch consistency, but every number shown to the learner is
 * in the model's real units.
 */
export function createModel({ kind, params, control, tolerance }) {
  const definition = MODEL_KINDS[kind];
  if (!definition) throw new Error(`Unknown model kind: ${kind}`);

  const { min, max } = control;
  const span = max - min;

  /** slider percent -> real control value */
  const toValue = (percent) => min + (Math.min(100, Math.max(0, percent)) / 100) * span;
  /** real control value -> slider percent */
  const toPercent = (value) => ((value - min) / span) * 100;

  const solvedValue = definition.solve(params);
  const solvedPercent = toPercent(solvedValue);

  const evaluate = (percent) => {
    const value = toValue(percent);
    const left = definition.left(params, value);
    const right = definition.right(params, value);
    const error = left - right;
    return {
      value: round(value, control.precision ?? 1),
      left: round(left, 2),
      right: round(right, 2),
      error: round(error, 3),
      balanced: Math.abs(error) <= tolerance,
      /** -1 = left side short, +1 = left side over */
      direction: Math.sign(error),
    };
  };

  return {
    kind,
    params,
    control,
    tolerance,
    labels: definition.labels(params),
    solvedValue: round(solvedValue, control.precision ?? 1),
    solvedPercent,
    toValue,
    toPercent,
    evaluate,
    /** Solvable inside the slider range? Guards bad authoring at build time. */
    isReachable: solvedPercent >= 2 && solvedPercent <= 98,
  };
}
