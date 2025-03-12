var ce = globalThis;
function te(e) {
  return (ce.__Zone_symbol_prefix || "__zone_symbol__") + e;
}
function Et() {
  let e = ce.performance;
  function t(L) {
    e && e.mark && e.mark(L);
  }
  function c(L, s) {
    e && e.measure && e.measure(L, s);
  }
  t("Zone");
  class n {
    static {
      this.__symbol__ = te;
    }
    static assertZonePatched() {
      if (ce.Promise !== O.ZoneAwarePromise)
        throw new Error(
          "Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)"
        );
    }
    static get root() {
      let s = n.current;
      for (; s.parent; ) s = s.parent;
      return s;
    }
    static get current() {
      return b.zone;
    }
    static get currentTask() {
      return S;
    }
    static __load_patch(s, i, o = !1) {
      if (O.hasOwnProperty(s)) {
        let E = ce[te("forceDuplicateZoneCheck")] === !0;
        if (!o && E) throw Error("Already loaded patch: " + s);
      } else if (!ce["__Zone_disable_" + s]) {
        let E = "Zone:" + s;
        t(E), (O[s] = i(ce, n, P)), c(E, E);
      }
    }
    get parent() {
      return this._parent;
    }
    get name() {
      return this._name;
    }
    constructor(s, i) {
      (this._parent = s),
        (this._name = i ? i.name || "unnamed" : "<root>"),
        (this._properties = (i && i.properties) || {}),
        (this._zoneDelegate = new f(
          this,
          this._parent && this._parent._zoneDelegate,
          i
        ));
    }
    get(s) {
      let i = this.getZoneWith(s);
      if (i) return i._properties[s];
    }
    getZoneWith(s) {
      let i = this;
      for (; i; ) {
        if (i._properties.hasOwnProperty(s)) return i;
        i = i._parent;
      }
      return null;
    }
    fork(s) {
      if (!s) throw new Error("ZoneSpec required!");
      return this._zoneDelegate.fork(this, s);
    }
    wrap(s, i) {
      if (typeof s != "function")
        throw new Error("Expecting function got: " + s);
      let o = this._zoneDelegate.intercept(this, s, i),
        E = this;
      return function () {
        return E.runGuarded(o, this, arguments, i);
      };
    }
    run(s, i, o, E) {
      b = { parent: b, zone: this };
      try {
        return this._zoneDelegate.invoke(this, s, i, o, E);
      } finally {
        b = b.parent;
      }
    }
    runGuarded(s, i = null, o, E) {
      b = { parent: b, zone: this };
      try {
        try {
          return this._zoneDelegate.invoke(this, s, i, o, E);
        } catch (H) {
          if (this._zoneDelegate.handleError(this, H)) throw H;
        }
      } finally {
        b = b.parent;
      }
    }
    runTask(s, i, o) {
      if (s.zone != this)
        throw new Error(
          "A task can only be run in the zone of creation! (Creation: " +
            (s.zone || K).name +
            "; Execution: " +
            this.name +
            ")"
        );
      let E = s,
        { type: H, data: { isPeriodic: ee = !1, isRefreshable: A = !1 } = {} } =
          s;
      if (s.state === W && (H === G || H === m)) return;
      let he = s.state != j;
      he && E._transitionTo(j, d);
      let _e = S;
      (S = E), (b = { parent: b, zone: this });
      try {
        H == m && s.data && !ee && !A && (s.cancelFn = void 0);
        try {
          return this._zoneDelegate.invokeTask(this, E, i, o);
        } catch (Q) {
          if (this._zoneDelegate.handleError(this, Q)) throw Q;
        }
      } finally {
        let Q = s.state;
        if (Q !== W && Q !== q)
          if (H == G || ee || (A && Q === k)) he && E._transitionTo(d, j, k);
          else {
            let Te = E._zoneDelegates;
            this._updateTaskCount(E, -1),
              he && E._transitionTo(W, j, W),
              A && (E._zoneDelegates = Te);
          }
        (b = b.parent), (S = _e);
      }
    }
    scheduleTask(s) {
      if (s.zone && s.zone !== this) {
        let o = this;
        for (; o; ) {
          if (o === s.zone)
            throw Error(
              `can not reschedule task to ${this.name} which is descendants of the original zone ${s.zone.name}`
            );
          o = o.parent;
        }
      }
      s._transitionTo(k, W);
      let i = [];
      (s._zoneDelegates = i), (s._zone = this);
      try {
        s = this._zoneDelegate.scheduleTask(this, s);
      } catch (o) {
        throw (
          (s._transitionTo(q, k, W), this._zoneDelegate.handleError(this, o), o)
        );
      }
      return (
        s._zoneDelegates === i && this._updateTaskCount(s, 1),
        s.state == k && s._transitionTo(d, k),
        s
      );
    }
    scheduleMicroTask(s, i, o, E) {
      return this.scheduleTask(new T(B, s, i, o, E, void 0));
    }
    scheduleMacroTask(s, i, o, E, H) {
      return this.scheduleTask(new T(m, s, i, o, E, H));
    }
    scheduleEventTask(s, i, o, E, H) {
      return this.scheduleTask(new T(G, s, i, o, E, H));
    }
    cancelTask(s) {
      if (s.zone != this)
        throw new Error(
          "A task can only be cancelled in the zone of creation! (Creation: " +
            (s.zone || K).name +
            "; Execution: " +
            this.name +
            ")"
        );
      if (!(s.state !== d && s.state !== j)) {
        s._transitionTo($, d, j);
        try {
          this._zoneDelegate.cancelTask(this, s);
        } catch (i) {
          throw (
            (s._transitionTo(q, $), this._zoneDelegate.handleError(this, i), i)
          );
        }
        return (
          this._updateTaskCount(s, -1),
          s._transitionTo(W, $),
          (s.runCount = -1),
          s
        );
      }
    }
    _updateTaskCount(s, i) {
      let o = s._zoneDelegates;
      i == -1 && (s._zoneDelegates = null);
      for (let E = 0; E < o.length; E++) o[E]._updateTaskCount(s.type, i);
    }
  }
  let a = {
    name: "",
    onHasTask: (L, s, i, o) => L.hasTask(i, o),
    onScheduleTask: (L, s, i, o) => L.scheduleTask(i, o),
    onInvokeTask: (L, s, i, o, E, H) => L.invokeTask(i, o, E, H),
    onCancelTask: (L, s, i, o) => L.cancelTask(i, o),
  };
  class f {
    get zone() {
      return this._zone;
    }
    constructor(s, i, o) {
      (this._taskCounts = { microTask: 0, macroTask: 0, eventTask: 0 }),
        (this._zone = s),
        (this._parentDelegate = i),
        (this._forkZS = o && (o && o.onFork ? o : i._forkZS)),
        (this._forkDlgt = o && (o.onFork ? i : i._forkDlgt)),
        (this._forkCurrZone = o && (o.onFork ? this._zone : i._forkCurrZone)),
        (this._interceptZS = o && (o.onIntercept ? o : i._interceptZS)),
        (this._interceptDlgt = o && (o.onIntercept ? i : i._interceptDlgt)),
        (this._interceptCurrZone =
          o && (o.onIntercept ? this._zone : i._interceptCurrZone)),
        (this._invokeZS = o && (o.onInvoke ? o : i._invokeZS)),
        (this._invokeDlgt = o && (o.onInvoke ? i : i._invokeDlgt)),
        (this._invokeCurrZone =
          o && (o.onInvoke ? this._zone : i._invokeCurrZone)),
        (this._handleErrorZS = o && (o.onHandleError ? o : i._handleErrorZS)),
        (this._handleErrorDlgt =
          o && (o.onHandleError ? i : i._handleErrorDlgt)),
        (this._handleErrorCurrZone =
          o && (o.onHandleError ? this._zone : i._handleErrorCurrZone)),
        (this._scheduleTaskZS =
          o && (o.onScheduleTask ? o : i._scheduleTaskZS)),
        (this._scheduleTaskDlgt =
          o && (o.onScheduleTask ? i : i._scheduleTaskDlgt)),
        (this._scheduleTaskCurrZone =
          o && (o.onScheduleTask ? this._zone : i._scheduleTaskCurrZone)),
        (this._invokeTaskZS = o && (o.onInvokeTask ? o : i._invokeTaskZS)),
        (this._invokeTaskDlgt = o && (o.onInvokeTask ? i : i._invokeTaskDlgt)),
        (this._invokeTaskCurrZone =
          o && (o.onInvokeTask ? this._zone : i._invokeTaskCurrZone)),
        (this._cancelTaskZS = o && (o.onCancelTask ? o : i._cancelTaskZS)),
        (this._cancelTaskDlgt = o && (o.onCancelTask ? i : i._cancelTaskDlgt)),
        (this._cancelTaskCurrZone =
          o && (o.onCancelTask ? this._zone : i._cancelTaskCurrZone)),
        (this._hasTaskZS = null),
        (this._hasTaskDlgt = null),
        (this._hasTaskDlgtOwner = null),
        (this._hasTaskCurrZone = null);
      let E = o && o.onHasTask,
        H = i && i._hasTaskZS;
      (E || H) &&
        ((this._hasTaskZS = E ? o : a),
        (this._hasTaskDlgt = i),
        (this._hasTaskDlgtOwner = this),
        (this._hasTaskCurrZone = this._zone),
        o.onScheduleTask ||
          ((this._scheduleTaskZS = a),
          (this._scheduleTaskDlgt = i),
          (this._scheduleTaskCurrZone = this._zone)),
        o.onInvokeTask ||
          ((this._invokeTaskZS = a),
          (this._invokeTaskDlgt = i),
          (this._invokeTaskCurrZone = this._zone)),
        o.onCancelTask ||
          ((this._cancelTaskZS = a),
          (this._cancelTaskDlgt = i),
          (this._cancelTaskCurrZone = this._zone)));
    }
    fork(s, i) {
      return this._forkZS
        ? this._forkZS.onFork(this._forkDlgt, this.zone, s, i)
        : new n(s, i);
    }
    intercept(s, i, o) {
      return this._interceptZS
        ? this._interceptZS.onIntercept(
            this._interceptDlgt,
            this._interceptCurrZone,
            s,
            i,
            o
          )
        : i;
    }
    invoke(s, i, o, E, H) {
      return this._invokeZS
        ? this._invokeZS.onInvoke(
            this._invokeDlgt,
            this._invokeCurrZone,
            s,
            i,
            o,
            E,
            H
          )
        : i.apply(o, E);
    }
    handleError(s, i) {
      return this._handleErrorZS
        ? this._handleErrorZS.onHandleError(
            this._handleErrorDlgt,
            this._handleErrorCurrZone,
            s,
            i
          )
        : !0;
    }
    scheduleTask(s, i) {
      let o = i;
      if (this._scheduleTaskZS)
        this._hasTaskZS && o._zoneDelegates.push(this._hasTaskDlgtOwner),
          (o = this._scheduleTaskZS.onScheduleTask(
            this._scheduleTaskDlgt,
            this._scheduleTaskCurrZone,
            s,
            i
          )),
          o || (o = i);
      else if (i.scheduleFn) i.scheduleFn(i);
      else if (i.type == B) V(i);
      else throw new Error("Task is missing scheduleFn.");
      return o;
    }
    invokeTask(s, i, o, E) {
      return this._invokeTaskZS
        ? this._invokeTaskZS.onInvokeTask(
            this._invokeTaskDlgt,
            this._invokeTaskCurrZone,
            s,
            i,
            o,
            E
          )
        : i.callback.apply(o, E);
    }
    cancelTask(s, i) {
      let o;
      if (this._cancelTaskZS)
        o = this._cancelTaskZS.onCancelTask(
          this._cancelTaskDlgt,
          this._cancelTaskCurrZone,
          s,
          i
        );
      else {
        if (!i.cancelFn) throw Error("Task is not cancelable");
        o = i.cancelFn(i);
      }
      return o;
    }
    hasTask(s, i) {
      try {
        this._hasTaskZS &&
          this._hasTaskZS.onHasTask(
            this._hasTaskDlgt,
            this._hasTaskCurrZone,
            s,
            i
          );
      } catch (o) {
        this.handleError(s, o);
      }
    }
    _updateTaskCount(s, i) {
      let o = this._taskCounts,
        E = o[s],
        H = (o[s] = E + i);
      if (H < 0) throw new Error("More tasks executed then were scheduled.");
      if (E == 0 || H == 0) {
        let ee = {
          microTask: o.microTask > 0,
          macroTask: o.macroTask > 0,
          eventTask: o.eventTask > 0,
          change: s,
        };
        this.hasTask(this._zone, ee);
      }
    }
  }
  class T {
    constructor(s, i, o, E, H, ee) {
      if (
        ((this._zone = null),
        (this.runCount = 0),
        (this._zoneDelegates = null),
        (this._state = "notScheduled"),
        (this.type = s),
        (this.source = i),
        (this.data = E),
        (this.scheduleFn = H),
        (this.cancelFn = ee),
        !o)
      )
        throw new Error("callback is not defined");
      this.callback = o;
      let A = this;
      s === G && E && E.useG
        ? (this.invoke = T.invokeTask)
        : (this.invoke = function () {
            return T.invokeTask.call(ce, A, this, arguments);
          });
    }
    static invokeTask(s, i, o) {
      s || (s = this), J++;
      try {
        return s.runCount++, s.zone.runTask(s, i, o);
      } finally {
        J == 1 && Y(), J--;
      }
    }
    get zone() {
      return this._zone;
    }
    get state() {
      return this._state;
    }
    cancelScheduleRequest() {
      this._transitionTo(W, k);
    }
    _transitionTo(s, i, o) {
      if (this._state === i || this._state === o)
        (this._state = s), s == W && (this._zoneDelegates = null);
      else
        throw new Error(
          `${this.type} '${
            this.source
          }': can not transition to '${s}', expecting state '${i}'${
            o ? " or '" + o + "'" : ""
          }, was '${this._state}'.`
        );
    }
    toString() {
      return this.data && typeof this.data.handleId < "u"
        ? this.data.handleId.toString()
        : Object.prototype.toString.call(this);
    }
    toJSON() {
      return {
        type: this.type,
        state: this.state,
        source: this.source,
        zone: this.zone.name,
        runCount: this.runCount,
      };
    }
  }
  let g = te("setTimeout"),
    y = te("Promise"),
    N = te("then"),
    _ = [],
    w = !1,
    M;
  function x(L) {
    if ((M || (ce[y] && (M = ce[y].resolve(0))), M)) {
      let s = M[N];
      s || (s = M.then), s.call(M, L);
    } else ce[g](L, 0);
  }
  function V(L) {
    J === 0 && _.length === 0 && x(Y), L && _.push(L);
  }
  function Y() {
    if (!w) {
      for (w = !0; _.length; ) {
        let L = _;
        _ = [];
        for (let s = 0; s < L.length; s++) {
          let i = L[s];
          try {
            i.zone.runTask(i, null, null);
          } catch (o) {
            P.onUnhandledError(o);
          }
        }
      }
      P.microtaskDrainDone(), (w = !1);
    }
  }
  let K = { name: "NO ZONE" },
    W = "notScheduled",
    k = "scheduling",
    d = "scheduled",
    j = "running",
    $ = "canceling",
    q = "unknown",
    B = "microTask",
    m = "macroTask",
    G = "eventTask",
    O = {},
    P = {
      symbol: te,
      currentZoneFrame: () => b,
      onUnhandledError: F,
      microtaskDrainDone: F,
      scheduleMicroTask: V,
      showUncaughtError: () => !n[te("ignoreConsoleErrorUncaughtError")],
      patchEventTarget: () => [],
      patchOnProperties: F,
      patchMethod: () => F,
      bindArguments: () => [],
      patchThen: () => F,
      patchMacroTask: () => F,
      patchEventPrototype: () => F,
      isIEOrEdge: () => !1,
      getGlobalObjects: () => {},
      ObjectDefineProperty: () => F,
      ObjectGetOwnPropertyDescriptor: () => {},
      ObjectCreate: () => {},
      ArraySlice: () => [],
      patchClass: () => F,
      wrapWithCurrentZone: () => F,
      filterProperties: () => [],
      attachOriginToPatched: () => F,
      _redefineProperty: () => F,
      patchCallbacks: () => F,
      nativeScheduleMicroTask: x,
    },
    b = { parent: null, zone: new n(null, null) },
    S = null,
    J = 0;
  function F() {}
  return c("Zone", "Zone"), n;
}
function mt() {
  let e = globalThis,
    t = e[te("forceDuplicateZoneCheck")] === !0;
  if (e.Zone && (t || typeof e.Zone.__symbol__ != "function"))
    throw new Error("Zone already loaded.");
  return (e.Zone ??= Et()), e.Zone;
}
var be = Object.getOwnPropertyDescriptor,
  Ze = Object.defineProperty,
  xe = Object.getPrototypeOf,
  pt = Object.create,
  yt = Array.prototype.slice,
  $e = "addEventListener",
  He = "removeEventListener",
  Me = te($e),
  Le = te(He),
  ae = "true",
  le = "false",
  we = te("");
function Be(e, t) {
  return Zone.current.wrap(e, t);
}
function Ue(e, t, c, n, a) {
  return Zone.current.scheduleMacroTask(e, t, c, n, a);
}
var Z = te,
  Se = typeof window < "u",
  ye = Se ? window : void 0,
  X = (Se && ye) || globalThis,
  kt = "removeAttribute";
function ze(e, t) {
  for (let c = e.length - 1; c >= 0; c--)
    typeof e[c] == "function" && (e[c] = Be(e[c], t + "_" + c));
  return e;
}
function vt(e, t) {
  let c = e.constructor.name;
  for (let n = 0; n < t.length; n++) {
    let a = t[n],
      f = e[a];
    if (f) {
      let T = be(e, a);
      if (!rt(T)) continue;
      e[a] = ((g) => {
        let y = function () {
          return g.apply(this, ze(arguments, c + "." + a));
        };
        return fe(y, g), y;
      })(f);
    }
  }
}
function rt(e) {
  return e
    ? e.writable === !1
      ? !1
      : !(typeof e.get == "function" && typeof e.set > "u")
    : !0;
}
var ot = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope,
  Oe =
    !("nw" in X) &&
    typeof X.process < "u" &&
    X.process.toString() === "[object process]",
  Ve = !Oe && !ot && !!(Se && ye.HTMLElement),
  st =
    typeof X.process < "u" &&
    X.process.toString() === "[object process]" &&
    !ot &&
    !!(Se && ye.HTMLElement),
  Ne = {},
  bt = Z("enable_beforeunload"),
  Ke = function (e) {
    if (((e = e || X.event), !e)) return;
    let t = Ne[e.type];
    t || (t = Ne[e.type] = Z("ON_PROPERTY" + e.type));
    let c = this || e.target || X,
      n = c[t],
      a;
    if (Ve && c === ye && e.type === "error") {
      let f = e;
      (a =
        n && n.call(this, f.message, f.filename, f.lineno, f.colno, f.error)),
        a === !0 && e.preventDefault();
    } else
      (a = n && n.apply(this, arguments)),
        e.type === "beforeunload" && X[bt] && typeof a == "string"
          ? (e.returnValue = a)
          : a != null && !a && e.preventDefault();
    return a;
  };
function Je(e, t, c) {
  let n = be(e, t);
  if (
    (!n && c && be(c, t) && (n = { enumerable: !0, configurable: !0 }),
    !n || !n.configurable)
  )
    return;
  let a = Z("on" + t + "patched");
  if (e.hasOwnProperty(a) && e[a]) return;
  delete n.writable, delete n.value;
  let f = n.get,
    T = n.set,
    g = t.slice(2),
    y = Ne[g];
  y || (y = Ne[g] = Z("ON_PROPERTY" + g)),
    (n.set = function (N) {
      let _ = this;
      if ((!_ && e === X && (_ = X), !_)) return;
      typeof _[y] == "function" && _.removeEventListener(g, Ke),
        T && T.call(_, null),
        (_[y] = N),
        typeof N == "function" && _.addEventListener(g, Ke, !1);
    }),
    (n.get = function () {
      let N = this;
      if ((!N && e === X && (N = X), !N)) return null;
      let _ = N[y];
      if (_) return _;
      if (f) {
        let w = f.call(this);
        if (w)
          return (
            n.set.call(this, w),
            typeof N[kt] == "function" && N.removeAttribute(t),
            w
          );
      }
      return null;
    }),
    Ze(e, t, n),
    (e[a] = !0);
}
function it(e, t, c) {
  if (t) for (let n = 0; n < t.length; n++) Je(e, "on" + t[n], c);
  else {
    let n = [];
    for (let a in e) a.slice(0, 2) == "on" && n.push(a);
    for (let a = 0; a < n.length; a++) Je(e, n[a], c);
  }
}
var oe = Z("originalInstance");
function ve(e) {
  let t = X[e];
  if (!t) return;
  (X[Z(e)] = t),
    (X[e] = function () {
      let a = ze(arguments, e);
      switch (a.length) {
        case 0:
          this[oe] = new t();
          break;
        case 1:
          this[oe] = new t(a[0]);
          break;
        case 2:
          this[oe] = new t(a[0], a[1]);
          break;
        case 3:
          this[oe] = new t(a[0], a[1], a[2]);
          break;
        case 4:
          this[oe] = new t(a[0], a[1], a[2], a[3]);
          break;
        default:
          throw new Error("Arg list too long.");
      }
    }),
    fe(X[e], t);
  let c = new t(function () {}),
    n;
  for (n in c)
    (e === "XMLHttpRequest" && n === "responseBlob") ||
      (function (a) {
        typeof c[a] == "function"
          ? (X[e].prototype[a] = function () {
              return this[oe][a].apply(this[oe], arguments);
            })
          : Ze(X[e].prototype, a, {
              set: function (f) {
                typeof f == "function"
                  ? ((this[oe][a] = Be(f, e + "." + a)), fe(this[oe][a], f))
                  : (this[oe][a] = f);
              },
              get: function () {
                return this[oe][a];
              },
            });
      })(n);
  for (n in t) n !== "prototype" && t.hasOwnProperty(n) && (X[e][n] = t[n]);
}
function ue(e, t, c) {
  let n = e;
  for (; n && !n.hasOwnProperty(t); ) n = xe(n);
  !n && e[t] && (n = e);
  let a = Z(t),
    f = null;
  if (n && (!(f = n[a]) || !n.hasOwnProperty(a))) {
    f = n[a] = n[t];
    let T = n && be(n, t);
    if (rt(T)) {
      let g = c(f, a, t);
      (n[t] = function () {
        return g(this, arguments);
      }),
        fe(n[t], f);
    }
  }
  return f;
}
function wt(e, t, c) {
  let n = null;
  function a(f) {
    let T = f.data;
    return (
      (T.args[T.cbIdx] = function () {
        f.invoke.apply(this, arguments);
      }),
      n.apply(T.target, T.args),
      f
    );
  }
  n = ue(
    e,
    t,
    (f) =>
      function (T, g) {
        let y = c(T, g);
        return y.cbIdx >= 0 && typeof g[y.cbIdx] == "function"
          ? Ue(y.name, g[y.cbIdx], y, a)
          : f.apply(T, g);
      }
  );
}
function fe(e, t) {
  e[Z("OriginalDelegate")] = t;
}
var Qe = !1,
  Ae = !1;
function Pt() {
  try {
    let e = ye.navigator.userAgent;
    if (e.indexOf("MSIE ") !== -1 || e.indexOf("Trident/") !== -1) return !0;
  } catch {}
  return !1;
}
function Rt() {
  if (Qe) return Ae;
  Qe = !0;
  try {
    let e = ye.navigator.userAgent;
    (e.indexOf("MSIE ") !== -1 ||
      e.indexOf("Trident/") !== -1 ||
      e.indexOf("Edge/") !== -1) &&
      (Ae = !0);
  } catch {}
  return Ae;
}
function et(e) {
  return typeof e == "function";
}
function tt(e) {
  return typeof e == "number";
}
var pe = !1;
if (typeof window < "u")
  try {
    let e = Object.defineProperty({}, "passive", {
      get: function () {
        pe = !0;
      },
    });
    window.addEventListener("test", e, e),
      window.removeEventListener("test", e, e);
  } catch {
    pe = !1;
  }
var Nt = { useG: !0 },
  ne = {},
  ct = {},
  at = new RegExp("^" + we + "(\\w+)(true|false)$"),
  lt = Z("propagationStopped");
function ut(e, t) {
  let c = (t ? t(e) : e) + le,
    n = (t ? t(e) : e) + ae,
    a = we + c,
    f = we + n;
  (ne[e] = {}), (ne[e][le] = a), (ne[e][ae] = f);
}
function St(e, t, c, n) {
  let a = (n && n.add) || $e,
    f = (n && n.rm) || He,
    T = (n && n.listeners) || "eventListeners",
    g = (n && n.rmAll) || "removeAllListeners",
    y = Z(a),
    N = "." + a + ":",
    _ = "prependListener",
    w = "." + _ + ":",
    M = function (k, d, j) {
      if (k.isRemoved) return;
      let $ = k.callback;
      typeof $ == "object" &&
        $.handleEvent &&
        ((k.callback = (m) => $.handleEvent(m)), (k.originalDelegate = $));
      let q;
      try {
        k.invoke(k, d, [j]);
      } catch (m) {
        q = m;
      }
      let B = k.options;
      if (B && typeof B == "object" && B.once) {
        let m = k.originalDelegate ? k.originalDelegate : k.callback;
        d[f].call(d, j.type, m, B);
      }
      return q;
    };
  function x(k, d, j) {
    if (((d = d || e.event), !d)) return;
    let $ = k || d.target || e,
      q = $[ne[d.type][j ? ae : le]];
    if (q) {
      let B = [];
      if (q.length === 1) {
        let m = M(q[0], $, d);
        m && B.push(m);
      } else {
        let m = q.slice();
        for (let G = 0; G < m.length && !(d && d[lt] === !0); G++) {
          let O = M(m[G], $, d);
          O && B.push(O);
        }
      }
      if (B.length === 1) throw B[0];
      for (let m = 0; m < B.length; m++) {
        let G = B[m];
        t.nativeScheduleMicroTask(() => {
          throw G;
        });
      }
    }
  }
  let V = function (k) {
      return x(this, k, !1);
    },
    Y = function (k) {
      return x(this, k, !0);
    };
  function K(k, d) {
    if (!k) return !1;
    let j = !0;
    d && d.useG !== void 0 && (j = d.useG);
    let $ = d && d.vh,
      q = !0;
    d && d.chkDup !== void 0 && (q = d.chkDup);
    let B = !1;
    d && d.rt !== void 0 && (B = d.rt);
    let m = k;
    for (; m && !m.hasOwnProperty(a); ) m = xe(m);
    if ((!m && k[a] && (m = k), !m || m[y])) return !1;
    let G = d && d.eventNameToString,
      O = {},
      P = (m[y] = m[a]),
      b = (m[Z(f)] = m[f]),
      S = (m[Z(T)] = m[T]),
      J = (m[Z(g)] = m[g]),
      F;
    d && d.prepend && (F = m[Z(d.prepend)] = m[d.prepend]);
    function L(r, u) {
      return !pe && typeof r == "object" && r
        ? !!r.capture
        : !pe || !u
        ? r
        : typeof r == "boolean"
        ? { capture: r, passive: !0 }
        : r
        ? typeof r == "object" && r.passive !== !1
          ? { ...r, passive: !0 }
          : r
        : { passive: !0 };
    }
    let s = function (r) {
        if (!O.isExisting)
          return P.call(O.target, O.eventName, O.capture ? Y : V, O.options);
      },
      i = function (r) {
        if (!r.isRemoved) {
          let u = ne[r.eventName],
            v;
          u && (v = u[r.capture ? ae : le]);
          let R = v && r.target[v];
          if (R) {
            for (let p = 0; p < R.length; p++)
              if (R[p] === r) {
                R.splice(p, 1),
                  (r.isRemoved = !0),
                  r.removeAbortListener &&
                    (r.removeAbortListener(), (r.removeAbortListener = null)),
                  R.length === 0 && ((r.allRemoved = !0), (r.target[v] = null));
                break;
              }
          }
        }
        if (r.allRemoved)
          return b.call(r.target, r.eventName, r.capture ? Y : V, r.options);
      },
      o = function (r) {
        return P.call(O.target, O.eventName, r.invoke, O.options);
      },
      E = function (r) {
        return F.call(O.target, O.eventName, r.invoke, O.options);
      },
      H = function (r) {
        return b.call(r.target, r.eventName, r.invoke, r.options);
      },
      ee = j ? s : o,
      A = j ? i : H,
      he = function (r, u) {
        let v = typeof u;
        return (
          (v === "function" && r.callback === u) ||
          (v === "object" && r.originalDelegate === u)
        );
      },
      _e = d && d.diff ? d.diff : he,
      Q = Zone[Z("UNPATCHED_EVENTS")],
      Te = e[Z("PASSIVE_EVENTS")];
    function h(r) {
      if (typeof r == "object" && r !== null) {
        let u = { ...r };
        return r.signal && (u.signal = r.signal), u;
      }
      return r;
    }
    let l = function (r, u, v, R, p = !1, C = !1) {
      return function () {
        let I = this || e,
          D = arguments[0];
        d && d.transferEventName && (D = d.transferEventName(D));
        let U = arguments[1];
        if (!U) return r.apply(this, arguments);
        if (Oe && D === "uncaughtException") return r.apply(this, arguments);
        let z = !1;
        if (typeof U != "function") {
          if (!U.handleEvent) return r.apply(this, arguments);
          z = !0;
        }
        if ($ && !$(r, U, I, arguments)) return;
        let de = pe && !!Te && Te.indexOf(D) !== -1,
          se = h(L(arguments[2], de)),
          ge = se?.signal;
        if (ge?.aborted) return;
        if (Q) {
          for (let ie = 0; ie < Q.length; ie++)
            if (D === Q[ie])
              return de ? r.call(I, D, U, se) : r.apply(this, arguments);
        }
        let Ie = se ? (typeof se == "boolean" ? !0 : se.capture) : !1,
          Fe = se && typeof se == "object" ? se.once : !1,
          gt = Zone.current,
          De = ne[D];
        De || (ut(D, G), (De = ne[D]));
        let We = De[Ie ? ae : le],
          Ee = I[We],
          qe = !1;
        if (Ee) {
          if (((qe = !0), q)) {
            for (let ie = 0; ie < Ee.length; ie++) if (_e(Ee[ie], U)) return;
          }
        } else Ee = I[We] = [];
        let Pe,
          Xe = I.constructor.name,
          Ye = ct[Xe];
        Ye && (Pe = Ye[D]),
          Pe || (Pe = Xe + u + (G ? G(D) : D)),
          (O.options = se),
          Fe && (O.options.once = !1),
          (O.target = I),
          (O.capture = Ie),
          (O.eventName = D),
          (O.isExisting = qe);
        let ke = j ? Nt : void 0;
        ke && (ke.taskData = O), ge && (O.options.signal = void 0);
        let re = gt.scheduleEventTask(Pe, U, ke, v, R);
        if (ge) {
          O.options.signal = ge;
          let ie = () => re.zone.cancelTask(re);
          r.call(ge, "abort", ie, { once: !0 }),
            (re.removeAbortListener = () =>
              ge.removeEventListener("abort", ie));
        }
        if (
          ((O.target = null),
          ke && (ke.taskData = null),
          Fe && (O.options.once = !0),
          (!pe && typeof re.options == "boolean") || (re.options = se),
          (re.target = I),
          (re.capture = Ie),
          (re.eventName = D),
          z && (re.originalDelegate = U),
          C ? Ee.unshift(re) : Ee.push(re),
          p)
        )
          return I;
      };
    };
    return (
      (m[a] = l(P, N, ee, A, B)),
      F && (m[_] = l(F, w, E, A, B, !0)),
      (m[f] = function () {
        let r = this || e,
          u = arguments[0];
        d && d.transferEventName && (u = d.transferEventName(u));
        let v = arguments[2],
          R = v ? (typeof v == "boolean" ? !0 : v.capture) : !1,
          p = arguments[1];
        if (!p) return b.apply(this, arguments);
        if ($ && !$(b, p, r, arguments)) return;
        let C = ne[u],
          I;
        C && (I = C[R ? ae : le]);
        let D = I && r[I];
        if (D)
          for (let U = 0; U < D.length; U++) {
            let z = D[U];
            if (_e(z, p)) {
              if (
                (D.splice(U, 1),
                (z.isRemoved = !0),
                D.length === 0 &&
                  ((z.allRemoved = !0),
                  (r[I] = null),
                  !R && typeof u == "string"))
              ) {
                let de = we + "ON_PROPERTY" + u;
                r[de] = null;
              }
              return z.zone.cancelTask(z), B ? r : void 0;
            }
          }
        return b.apply(this, arguments);
      }),
      (m[T] = function () {
        let r = this || e,
          u = arguments[0];
        d && d.transferEventName && (u = d.transferEventName(u));
        let v = [],
          R = ft(r, G ? G(u) : u);
        for (let p = 0; p < R.length; p++) {
          let C = R[p],
            I = C.originalDelegate ? C.originalDelegate : C.callback;
          v.push(I);
        }
        return v;
      }),
      (m[g] = function () {
        let r = this || e,
          u = arguments[0];
        if (u) {
          d && d.transferEventName && (u = d.transferEventName(u));
          let v = ne[u];
          if (v) {
            let R = v[le],
              p = v[ae],
              C = r[R],
              I = r[p];
            if (C) {
              let D = C.slice();
              for (let U = 0; U < D.length; U++) {
                let z = D[U],
                  de = z.originalDelegate ? z.originalDelegate : z.callback;
                this[f].call(this, u, de, z.options);
              }
            }
            if (I) {
              let D = I.slice();
              for (let U = 0; U < D.length; U++) {
                let z = D[U],
                  de = z.originalDelegate ? z.originalDelegate : z.callback;
                this[f].call(this, u, de, z.options);
              }
            }
          }
        } else {
          let v = Object.keys(r);
          for (let R = 0; R < v.length; R++) {
            let p = v[R],
              C = at.exec(p),
              I = C && C[1];
            I && I !== "removeListener" && this[g].call(this, I);
          }
          this[g].call(this, "removeListener");
        }
        if (B) return this;
      }),
      fe(m[a], P),
      fe(m[f], b),
      J && fe(m[g], J),
      S && fe(m[T], S),
      !0
    );
  }
  let W = [];
  for (let k = 0; k < c.length; k++) W[k] = K(c[k], n);
  return W;
}
function ft(e, t) {
  if (!t) {
    let f = [];
    for (let T in e) {
      let g = at.exec(T),
        y = g && g[1];
      if (y && (!t || y === t)) {
        let N = e[T];
        if (N) for (let _ = 0; _ < N.length; _++) f.push(N[_]);
      }
    }
    return f;
  }
  let c = ne[t];
  c || (ut(t), (c = ne[t]));
  let n = e[c[le]],
    a = e[c[ae]];
  return n ? (a ? n.concat(a) : n.slice()) : a ? a.slice() : [];
}
function Ot(e, t) {
  let c = e.Event;
  c &&
    c.prototype &&
    t.patchMethod(
      c.prototype,
      "stopImmediatePropagation",
      (n) =>
        function (a, f) {
          (a[lt] = !0), n && n.apply(a, f);
        }
    );
}
function Ct(e, t) {
  t.patchMethod(
    e,
    "queueMicrotask",
    (c) =>
      function (n, a) {
        Zone.current.scheduleMicroTask("queueMicrotask", a[0]);
      }
  );
}
var Re = Z("zoneTask");
function me(e, t, c, n) {
  let a = null,
    f = null;
  (t += n), (c += n);
  let T = {};
  function g(N) {
    let _ = N.data;
    _.args[0] = function () {
      return N.invoke.apply(this, arguments);
    };
    let w = a.apply(e, _.args);
    return (
      tt(w)
        ? (_.handleId = w)
        : ((_.handle = w), (_.isRefreshable = et(w.refresh))),
      N
    );
  }
  function y(N) {
    let { handle: _, handleId: w } = N.data;
    return f.call(e, _ ?? w);
  }
  (a = ue(
    e,
    t,
    (N) =>
      function (_, w) {
        if (et(w[0])) {
          let M = {
              isRefreshable: !1,
              isPeriodic: n === "Interval",
              delay: n === "Timeout" || n === "Interval" ? w[1] || 0 : void 0,
              args: w,
            },
            x = w[0];
          w[0] = function () {
            try {
              return x.apply(this, arguments);
            } finally {
              let {
                handle: j,
                handleId: $,
                isPeriodic: q,
                isRefreshable: B,
              } = M;
              !q && !B && ($ ? delete T[$] : j && (j[Re] = null));
            }
          };
          let V = Ue(t, w[0], M, g, y);
          if (!V) return V;
          let {
            handleId: Y,
            handle: K,
            isRefreshable: W,
            isPeriodic: k,
          } = V.data;
          if (Y) T[Y] = V;
          else if (K && ((K[Re] = V), W && !k)) {
            let d = K.refresh;
            K.refresh = function () {
              let { zone: j, state: $ } = V;
              return (
                $ === "notScheduled"
                  ? ((V._state = "scheduled"), j._updateTaskCount(V, 1))
                  : $ === "running" && (V._state = "scheduling"),
                d.call(this)
              );
            };
          }
          return K ?? Y ?? V;
        } else return N.apply(e, w);
      }
  )),
    (f = ue(
      e,
      c,
      (N) =>
        function (_, w) {
          let M = w[0],
            x;
          tt(M)
            ? ((x = T[M]), delete T[M])
            : ((x = M?.[Re]), x ? (M[Re] = null) : (x = M)),
            x?.type ? x.cancelFn && x.zone.cancelTask(x) : N.apply(e, w);
        }
    ));
}
function It(e, t) {
  let { isBrowser: c, isMix: n } = t.getGlobalObjects();
  if ((!c && !n) || !e.customElements || !("customElements" in e)) return;
  let a = [
    "connectedCallback",
    "disconnectedCallback",
    "adoptedCallback",
    "attributeChangedCallback",
    "formAssociatedCallback",
    "formDisabledCallback",
    "formResetCallback",
    "formStateRestoreCallback",
  ];
  t.patchCallbacks(t, e.customElements, "customElements", "define", a);
}
function Dt(e, t) {
  if (Zone[t.symbol("patchEventTarget")]) return;
  let {
    eventNames: c,
    zoneSymbolEventNames: n,
    TRUE_STR: a,
    FALSE_STR: f,
    ZONE_SYMBOL_PREFIX: T,
  } = t.getGlobalObjects();
  for (let y = 0; y < c.length; y++) {
    let N = c[y],
      _ = N + f,
      w = N + a,
      M = T + _,
      x = T + w;
    (n[N] = {}), (n[N][f] = M), (n[N][a] = x);
  }
  let g = e.EventTarget;
  if (!(!g || !g.prototype))
    return t.patchEventTarget(e, t, [g && g.prototype]), !0;
}
function Mt(e, t) {
  t.patchEventPrototype(e, t);
}
function ht(e, t, c) {
  if (!c || c.length === 0) return t;
  let n = c.filter((f) => f.target === e);
  if (!n || n.length === 0) return t;
  let a = n[0].ignoreProperties;
  return t.filter((f) => a.indexOf(f) === -1);
}
function nt(e, t, c, n) {
  if (!e) return;
  let a = ht(e, t, c);
  it(e, a, n);
}
function je(e) {
  return Object.getOwnPropertyNames(e)
    .filter((t) => t.startsWith("on") && t.length > 2)
    .map((t) => t.substring(2));
}
function Lt(e, t) {
  if ((Oe && !st) || Zone[e.symbol("patchEvents")]) return;
  let c = t.__Zone_ignore_on_properties,
    n = [];
  if (Ve) {
    let a = window;
    n = n.concat([
      "Document",
      "SVGElement",
      "Element",
      "HTMLElement",
      "HTMLBodyElement",
      "HTMLMediaElement",
      "HTMLFrameSetElement",
      "HTMLFrameElement",
      "HTMLIFrameElement",
      "HTMLMarqueeElement",
      "Worker",
    ]);
    let f = Pt() ? [{ target: a, ignoreProperties: ["error"] }] : [];
    nt(a, je(a), c && c.concat(f), xe(a));
  }
  n = n.concat([
    "XMLHttpRequest",
    "XMLHttpRequestEventTarget",
    "IDBIndex",
    "IDBRequest",
    "IDBOpenDBRequest",
    "IDBDatabase",
    "IDBTransaction",
    "IDBCursor",
    "WebSocket",
  ]);
  for (let a = 0; a < n.length; a++) {
    let f = t[n[a]];
    f && f.prototype && nt(f.prototype, je(f.prototype), c);
  }
}
function At(e) {
  e.__load_patch("legacy", (t) => {
    let c = t[e.__symbol__("legacyPatch")];
    c && c();
  }),
    e.__load_patch("timers", (t) => {
      let c = "set",
        n = "clear";
      me(t, c, n, "Timeout"), me(t, c, n, "Interval"), me(t, c, n, "Immediate");
    }),
    e.__load_patch("requestAnimationFrame", (t) => {
      me(t, "request", "cancel", "AnimationFrame"),
        me(t, "mozRequest", "mozCancel", "AnimationFrame"),
        me(t, "webkitRequest", "webkitCancel", "AnimationFrame");
    }),
    e.__load_patch("blocking", (t, c) => {
      let n = ["alert", "prompt", "confirm"];
      for (let a = 0; a < n.length; a++) {
        let f = n[a];
        ue(
          t,
          f,
          (T, g, y) =>
            function (N, _) {
              return c.current.run(T, t, _, y);
            }
        );
      }
    }),
    e.__load_patch("EventTarget", (t, c, n) => {
      Mt(t, n), Dt(t, n);
      let a = t.XMLHttpRequestEventTarget;
      a && a.prototype && n.patchEventTarget(t, n, [a.prototype]);
    }),
    e.__load_patch("MutationObserver", (t, c, n) => {
      ve("MutationObserver"), ve("WebKitMutationObserver");
    }),
    e.__load_patch("IntersectionObserver", (t, c, n) => {
      ve("IntersectionObserver");
    }),
    e.__load_patch("FileReader", (t, c, n) => {
      ve("FileReader");
    }),
    e.__load_patch("on_property", (t, c, n) => {
      Lt(n, t);
    }),
    e.__load_patch("customElements", (t, c, n) => {
      It(t, n);
    }),
    e.__load_patch("XHR", (t, c) => {
      N(t);
      let n = Z("xhrTask"),
        a = Z("xhrSync"),
        f = Z("xhrListener"),
        T = Z("xhrScheduled"),
        g = Z("xhrURL"),
        y = Z("xhrErrorBeforeScheduled");
      function N(_) {
        let w = _.XMLHttpRequest;
        if (!w) return;
        let M = w.prototype;
        function x(P) {
          return P[n];
        }
        let V = M[Me],
          Y = M[Le];
        if (!V) {
          let P = _.XMLHttpRequestEventTarget;
          if (P) {
            let b = P.prototype;
            (V = b[Me]), (Y = b[Le]);
          }
        }
        let K = "readystatechange",
          W = "scheduled";
        function k(P) {
          let b = P.data,
            S = b.target;
          (S[T] = !1), (S[y] = !1);
          let J = S[f];
          V || ((V = S[Me]), (Y = S[Le])), J && Y.call(S, K, J);
          let F = (S[f] = () => {
            if (S.readyState === S.DONE)
              if (!b.aborted && S[T] && P.state === W) {
                let s = S[c.__symbol__("loadfalse")];
                if (S.status !== 0 && s && s.length > 0) {
                  let i = P.invoke;
                  (P.invoke = function () {
                    let o = S[c.__symbol__("loadfalse")];
                    for (let E = 0; E < o.length; E++)
                      o[E] === P && o.splice(E, 1);
                    !b.aborted && P.state === W && i.call(P);
                  }),
                    s.push(P);
                } else P.invoke();
              } else !b.aborted && S[T] === !1 && (S[y] = !0);
          });
          return (
            V.call(S, K, F),
            S[n] || (S[n] = P),
            G.apply(S, b.args),
            (S[T] = !0),
            P
          );
        }
        function d() {}
        function j(P) {
          let b = P.data;
          return (b.aborted = !0), O.apply(b.target, b.args);
        }
        let $ = ue(
            M,
            "open",
            () =>
              function (P, b) {
                return (P[a] = b[2] == !1), (P[g] = b[1]), $.apply(P, b);
              }
          ),
          q = "XMLHttpRequest.send",
          B = Z("fetchTaskAborting"),
          m = Z("fetchTaskScheduling"),
          G = ue(
            M,
            "send",
            () =>
              function (P, b) {
                if (c.current[m] === !0 || P[a]) return G.apply(P, b);
                {
                  let S = {
                      target: P,
                      url: P[g],
                      isPeriodic: !1,
                      args: b,
                      aborted: !1,
                    },
                    J = Ue(q, d, S, k, j);
                  P && P[y] === !0 && !S.aborted && J.state === W && J.invoke();
                }
              }
          ),
          O = ue(
            M,
            "abort",
            () =>
              function (P, b) {
                let S = x(P);
                if (S && typeof S.type == "string") {
                  if (S.cancelFn == null || (S.data && S.data.aborted)) return;
                  S.zone.cancelTask(S);
                } else if (c.current[B] === !0) return O.apply(P, b);
              }
          );
      }
    }),
    e.__load_patch("geolocation", (t) => {
      t.navigator &&
        t.navigator.geolocation &&
        vt(t.navigator.geolocation, ["getCurrentPosition", "watchPosition"]);
    }),
    e.__load_patch("PromiseRejectionEvent", (t, c) => {
      function n(a) {
        return function (f) {
          ft(t, a).forEach((g) => {
            let y = t.PromiseRejectionEvent;
            if (y) {
              let N = new y(a, { promise: f.promise, reason: f.rejection });
              g.invoke(N);
            }
          });
        };
      }
      t.PromiseRejectionEvent &&
        ((c[Z("unhandledPromiseRejectionHandler")] = n("unhandledrejection")),
        (c[Z("rejectionHandledHandler")] = n("rejectionhandled")));
    }),
    e.__load_patch("queueMicrotask", (t, c, n) => {
      Ct(t, n);
    });
}
function jt(e) {
  e.__load_patch("ZoneAwarePromise", (t, c, n) => {
    let a = Object.getOwnPropertyDescriptor,
      f = Object.defineProperty;
    function T(h) {
      if (h && h.toString === Object.prototype.toString) {
        let l = h.constructor && h.constructor.name;
        return (l || "") + ": " + JSON.stringify(h);
      }
      return h ? h.toString() : Object.prototype.toString.call(h);
    }
    let g = n.symbol,
      y = [],
      N = t[g("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== !1,
      _ = g("Promise"),
      w = g("then"),
      M = "__creationTrace__";
    (n.onUnhandledError = (h) => {
      if (n.showUncaughtError()) {
        let l = h && h.rejection;
        l
          ? console.error(
              "Unhandled Promise rejection:",
              l instanceof Error ? l.message : l,
              "; Zone:",
              h.zone.name,
              "; Task:",
              h.task && h.task.source,
              "; Value:",
              l,
              l instanceof Error ? l.stack : void 0
            )
          : console.error(h);
      }
    }),
      (n.microtaskDrainDone = () => {
        for (; y.length; ) {
          let h = y.shift();
          try {
            h.zone.runGuarded(() => {
              throw h.throwOriginal ? h.rejection : h;
            });
          } catch (l) {
            V(l);
          }
        }
      });
    let x = g("unhandledPromiseRejectionHandler");
    function V(h) {
      n.onUnhandledError(h);
      try {
        let l = c[x];
        typeof l == "function" && l.call(this, h);
      } catch {}
    }
    function Y(h) {
      return h && h.then;
    }
    function K(h) {
      return h;
    }
    function W(h) {
      return A.reject(h);
    }
    let k = g("state"),
      d = g("value"),
      j = g("finally"),
      $ = g("parentPromiseValue"),
      q = g("parentPromiseState"),
      B = "Promise.then",
      m = null,
      G = !0,
      O = !1,
      P = 0;
    function b(h, l) {
      return (r) => {
        try {
          L(h, l, r);
        } catch (u) {
          L(h, !1, u);
        }
      };
    }
    let S = function () {
        let h = !1;
        return function (r) {
          return function () {
            h || ((h = !0), r.apply(null, arguments));
          };
        };
      },
      J = "Promise resolved with itself",
      F = g("currentTaskTrace");
    function L(h, l, r) {
      let u = S();
      if (h === r) throw new TypeError(J);
      if (h[k] === m) {
        let v = null;
        try {
          (typeof r == "object" || typeof r == "function") && (v = r && r.then);
        } catch (R) {
          return (
            u(() => {
              L(h, !1, R);
            })(),
            h
          );
        }
        if (
          l !== O &&
          r instanceof A &&
          r.hasOwnProperty(k) &&
          r.hasOwnProperty(d) &&
          r[k] !== m
        )
          i(r), L(h, r[k], r[d]);
        else if (l !== O && typeof v == "function")
          try {
            v.call(r, u(b(h, l)), u(b(h, !1)));
          } catch (R) {
            u(() => {
              L(h, !1, R);
            })();
          }
        else {
          h[k] = l;
          let R = h[d];
          if (
            ((h[d] = r),
            h[j] === j && l === G && ((h[k] = h[q]), (h[d] = h[$])),
            l === O && r instanceof Error)
          ) {
            let p =
              c.currentTask && c.currentTask.data && c.currentTask.data[M];
            p &&
              f(r, F, {
                configurable: !0,
                enumerable: !1,
                writable: !0,
                value: p,
              });
          }
          for (let p = 0; p < R.length; ) o(h, R[p++], R[p++], R[p++], R[p++]);
          if (R.length == 0 && l == O) {
            h[k] = P;
            let p = r;
            try {
              throw new Error(
                "Uncaught (in promise): " +
                  T(r) +
                  (r && r.stack
                    ? `
` + r.stack
                    : "")
              );
            } catch (C) {
              p = C;
            }
            N && (p.throwOriginal = !0),
              (p.rejection = r),
              (p.promise = h),
              (p.zone = c.current),
              (p.task = c.currentTask),
              y.push(p),
              n.scheduleMicroTask();
          }
        }
      }
      return h;
    }
    let s = g("rejectionHandledHandler");
    function i(h) {
      if (h[k] === P) {
        try {
          let l = c[s];
          l &&
            typeof l == "function" &&
            l.call(this, { rejection: h[d], promise: h });
        } catch {}
        h[k] = O;
        for (let l = 0; l < y.length; l++) h === y[l].promise && y.splice(l, 1);
      }
    }
    function o(h, l, r, u, v) {
      i(h);
      let R = h[k],
        p = R
          ? typeof u == "function"
            ? u
            : K
          : typeof v == "function"
          ? v
          : W;
      l.scheduleMicroTask(
        B,
        () => {
          try {
            let C = h[d],
              I = !!r && j === r[j];
            I && ((r[$] = C), (r[q] = R));
            let D = l.run(p, void 0, I && p !== W && p !== K ? [] : [C]);
            L(r, !0, D);
          } catch (C) {
            L(r, !1, C);
          }
        },
        r
      );
    }
    let E = "function ZoneAwarePromise() { [native code] }",
      H = function () {},
      ee = t.AggregateError;
    class A {
      static toString() {
        return E;
      }
      static resolve(l) {
        return l instanceof A ? l : L(new this(null), G, l);
      }
      static reject(l) {
        return L(new this(null), O, l);
      }
      static withResolvers() {
        let l = {};
        return (
          (l.promise = new A((r, u) => {
            (l.resolve = r), (l.reject = u);
          })),
          l
        );
      }
      static any(l) {
        if (!l || typeof l[Symbol.iterator] != "function")
          return Promise.reject(new ee([], "All promises were rejected"));
        let r = [],
          u = 0;
        try {
          for (let p of l) u++, r.push(A.resolve(p));
        } catch {
          return Promise.reject(new ee([], "All promises were rejected"));
        }
        if (u === 0)
          return Promise.reject(new ee([], "All promises were rejected"));
        let v = !1,
          R = [];
        return new A((p, C) => {
          for (let I = 0; I < r.length; I++)
            r[I].then(
              (D) => {
                v || ((v = !0), p(D));
              },
              (D) => {
                R.push(D),
                  u--,
                  u === 0 &&
                    ((v = !0), C(new ee(R, "All promises were rejected")));
              }
            );
        });
      }
      static race(l) {
        let r,
          u,
          v = new this((C, I) => {
            (r = C), (u = I);
          });
        function R(C) {
          r(C);
        }
        function p(C) {
          u(C);
        }
        for (let C of l) Y(C) || (C = this.resolve(C)), C.then(R, p);
        return v;
      }
      static all(l) {
        return A.allWithCallback(l);
      }
      static allSettled(l) {
        return (this && this.prototype instanceof A ? this : A).allWithCallback(
          l,
          {
            thenCallback: (u) => ({ status: "fulfilled", value: u }),
            errorCallback: (u) => ({ status: "rejected", reason: u }),
          }
        );
      }
      static allWithCallback(l, r) {
        let u,
          v,
          R = new this((D, U) => {
            (u = D), (v = U);
          }),
          p = 2,
          C = 0,
          I = [];
        for (let D of l) {
          Y(D) || (D = this.resolve(D));
          let U = C;
          try {
            D.then(
              (z) => {
                (I[U] = r ? r.thenCallback(z) : z), p--, p === 0 && u(I);
              },
              (z) => {
                r ? ((I[U] = r.errorCallback(z)), p--, p === 0 && u(I)) : v(z);
              }
            );
          } catch (z) {
            v(z);
          }
          p++, C++;
        }
        return (p -= 2), p === 0 && u(I), R;
      }
      constructor(l) {
        let r = this;
        if (!(r instanceof A))
          throw new Error("Must be an instanceof Promise.");
        (r[k] = m), (r[d] = []);
        try {
          let u = S();
          l && l(u(b(r, G)), u(b(r, O)));
        } catch (u) {
          L(r, !1, u);
        }
      }
      get [Symbol.toStringTag]() {
        return "Promise";
      }
      get [Symbol.species]() {
        return A;
      }
      then(l, r) {
        let u = this.constructor?.[Symbol.species];
        (!u || typeof u != "function") && (u = this.constructor || A);
        let v = new u(H),
          R = c.current;
        return this[k] == m ? this[d].push(R, v, l, r) : o(this, R, v, l, r), v;
      }
      catch(l) {
        return this.then(null, l);
      }
      finally(l) {
        let r = this.constructor?.[Symbol.species];
        (!r || typeof r != "function") && (r = A);
        let u = new r(H);
        u[j] = j;
        let v = c.current;
        return this[k] == m ? this[d].push(v, u, l, l) : o(this, v, u, l, l), u;
      }
    }
    (A.resolve = A.resolve),
      (A.reject = A.reject),
      (A.race = A.race),
      (A.all = A.all);
    let he = (t[_] = t.Promise);
    t.Promise = A;
    let _e = g("thenPatched");
    function Q(h) {
      let l = h.prototype,
        r = a(l, "then");
      if (r && (r.writable === !1 || !r.configurable)) return;
      let u = l.then;
      (l[w] = u),
        (h.prototype.then = function (v, R) {
          return new A((C, I) => {
            u.call(this, C, I);
          }).then(v, R);
        }),
        (h[_e] = !0);
    }
    n.patchThen = Q;
    function Te(h) {
      return function (l, r) {
        let u = h.apply(l, r);
        if (u instanceof A) return u;
        let v = u.constructor;
        return v[_e] || Q(v), u;
      };
    }
    return (
      he && (Q(he), ue(t, "fetch", (h) => Te(h))),
      (Promise[c.__symbol__("uncaughtPromiseErrors")] = y),
      A
    );
  });
}
function Zt(e) {
  e.__load_patch("toString", (t) => {
    let c = Function.prototype.toString,
      n = Z("OriginalDelegate"),
      a = Z("Promise"),
      f = Z("Error"),
      T = function () {
        if (typeof this == "function") {
          let _ = this[n];
          if (_)
            return typeof _ == "function"
              ? c.call(_)
              : Object.prototype.toString.call(_);
          if (this === Promise) {
            let w = t[a];
            if (w) return c.call(w);
          }
          if (this === Error) {
            let w = t[f];
            if (w) return c.call(w);
          }
        }
        return c.call(this);
      };
    (T[n] = c), (Function.prototype.toString = T);
    let g = Object.prototype.toString,
      y = "[object Promise]";
    Object.prototype.toString = function () {
      return typeof Promise == "function" && this instanceof Promise
        ? y
        : g.call(this);
    };
  });
}
function xt(e, t, c, n, a) {
  let f = Zone.__symbol__(n);
  if (t[f]) return;
  let T = (t[f] = t[n]);
  (t[n] = function (g, y, N) {
    return (
      y &&
        y.prototype &&
        a.forEach(function (_) {
          let w = `${c}.${n}::` + _,
            M = y.prototype;
          try {
            if (M.hasOwnProperty(_)) {
              let x = e.ObjectGetOwnPropertyDescriptor(M, _);
              x && x.value
                ? ((x.value = e.wrapWithCurrentZone(x.value, w)),
                  e._redefineProperty(y.prototype, _, x))
                : M[_] && (M[_] = e.wrapWithCurrentZone(M[_], w));
            } else M[_] && (M[_] = e.wrapWithCurrentZone(M[_], w));
          } catch {}
        }),
      T.call(t, g, y, N)
    );
  }),
    e.attachOriginToPatched(t[n], T);
}
function $t(e) {
  e.__load_patch("util", (t, c, n) => {
    let a = je(t);
    (n.patchOnProperties = it),
      (n.patchMethod = ue),
      (n.bindArguments = ze),
      (n.patchMacroTask = wt);
    let f = c.__symbol__("BLACK_LISTED_EVENTS"),
      T = c.__symbol__("UNPATCHED_EVENTS");
    t[T] && (t[f] = t[T]),
      t[f] && (c[f] = c[T] = t[f]),
      (n.patchEventPrototype = Ot),
      (n.patchEventTarget = St),
      (n.isIEOrEdge = Rt),
      (n.ObjectDefineProperty = Ze),
      (n.ObjectGetOwnPropertyDescriptor = be),
      (n.ObjectCreate = pt),
      (n.ArraySlice = yt),
      (n.patchClass = ve),
      (n.wrapWithCurrentZone = Be),
      (n.filterProperties = ht),
      (n.attachOriginToPatched = fe),
      (n._redefineProperty = Object.defineProperty),
      (n.patchCallbacks = xt),
      (n.getGlobalObjects = () => ({
        globalSources: ct,
        zoneSymbolEventNames: ne,
        eventNames: a,
        isBrowser: Ve,
        isMix: st,
        isNode: Oe,
        TRUE_STR: ae,
        FALSE_STR: le,
        ZONE_SYMBOL_PREFIX: we,
        ADD_EVENT_LISTENER_STR: $e,
        REMOVE_EVENT_LISTENER_STR: He,
      }));
  });
}
function Ht(e) {
  jt(e), Zt(e), $t(e);
}
var dt = mt();
Ht(dt);
At(dt);
var Bt = ":";
var Ge = class {
    visitText(t, c) {
      return t.value;
    }
    visitContainer(t, c) {
      return `[${t.children.map((n) => n.visit(this)).join(", ")}]`;
    }
    visitIcu(t, c) {
      let n = Object.keys(t.cases).map(
        (a) => `${a} {${t.cases[a].visit(this)}}`
      );
      return `{${t.expression}, ${t.type}, ${n.join(", ")}}`;
    }
    visitTagPlaceholder(t, c) {
      return t.isVoid
        ? `<ph tag name="${t.startName}"/>`
        : `<ph tag name="${t.startName}">${t.children
            .map((n) => n.visit(this))
            .join(", ")}</ph name="${t.closeName}">`;
    }
    visitPlaceholder(t, c) {
      return t.value
        ? `<ph name="${t.name}">${t.value}</ph>`
        : `<ph name="${t.name}"/>`;
    }
    visitIcuPlaceholder(t, c) {
      return `<ph icu name="${t.name}">${t.value.visit(this)}</ph>`;
    }
    visitBlockPlaceholder(t, c) {
      return `<ph block name="${t.startName}">${t.children
        .map((n) => n.visit(this))
        .join(", ")}</ph name="${t.closeName}">`;
    }
  },
  Vt = new Ge();
var _t;
(function (e) {
  (e[(e.Little = 0)] = "Little"), (e[(e.Big = 1)] = "Big");
})(_t || (_t = {}));
function Ut(e, t) {
  for (let c = 1, n = 1; c < e.length; c++, n++)
    if (t[n] === "\\") n++;
    else if (e[c] === Bt) return c;
  throw new Error(`Unterminated $localize metadata block in "${t}".`);
}
var Ce = function (e, ...t) {
    if (Ce.translate) {
      let n = Ce.translate(e, t);
      (e = n[0]), (t = n[1]);
    }
    let c = Tt(e[0], e.raw[0]);
    for (let n = 1; n < e.length; n++) c += t[n - 1] + Tt(e[n], e.raw[n]);
    return c;
  },
  zt = ":";
function Tt(e, t) {
  return t.charAt(0) === zt ? e.substring(Ut(e, t) + 1) : e;
}
globalThis.$localize = Ce;
var ru = Object.defineProperty,
  ou = Object.defineProperties;
var iu = Object.getOwnPropertyDescriptors;
var ei = Object.getOwnPropertySymbols;
var su = Object.prototype.hasOwnProperty,
  au = Object.prototype.propertyIsEnumerable;
var ti = (e, t, n) =>
    t in e
      ? ru(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  re = (e, t) => {
    for (var n in (t ||= {})) su.call(t, n) && ti(e, n, t[n]);
    if (ei) for (var n of ei(t)) au.call(t, n) && ti(e, n, t[n]);
    return e;
  },
  oe = (e, t) => ou(e, iu(t));
var h = (e, t) => () => (e && (t = e((e = 0))), t);
var cu = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
var Fn = (e, t, n) =>
  new Promise((r, o) => {
    var i = (c) => {
        try {
          a(n.next(c));
        } catch (u) {
          o(u);
        }
      },
      s = (c) => {
        try {
          a(n.throw(c));
        } catch (u) {
          o(u);
        }
      },
      a = (c) => (c.done ? r(c.value) : Promise.resolve(c.value).then(i, s));
    a((n = n.apply(e, t)).next());
  });
function I(e) {
  let t = kn;
  return (kn = e), t;
}
function ri() {
  return kn;
}
function uu(e) {
  if (!($n(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === Pn)) {
    if (!e.producerMustRecompute(e) && !Vn(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = Pn);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = Pn);
  }
}
function jn(e) {
  return e && (e.nextProducerIndex = 0), I(e);
}
function oi(e, t) {
  if (
    (I(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if ($n(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        Hn(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function Vn(e) {
  Un(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (uu(n), r !== n.version)) return !0;
  }
  return !1;
}
function Bn(e) {
  if ((Un(e), $n(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Hn(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function Hn(e, t) {
  if ((lu(e), e.liveConsumerNode.length === 1 && du(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      Hn(e.producerNode[r], e.producerIndexOfThis[r]);
  let n = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t];
    Un(o), (o.producerIndexOfThis[r] = t);
  }
}
function $n(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function Un(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function lu(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function du(e) {
  return e.producerNode !== void 0;
}
function fu() {
  throw new Error();
}
function ii(e) {
  hu = e;
}
var kn,
  Pn,
  ni,
  Ln,
  hu,
  si = h(() => {
    "use strict";
    (kn = null), (Pn = 1), (ni = Symbol("SIGNAL"));
    Ln = {
      version: 0,
      lastCleanEpoch: 0,
      dirty: !1,
      producerNode: void 0,
      producerLastReadVersion: void 0,
      producerIndexOfThis: void 0,
      nextProducerIndex: 0,
      liveConsumerNode: void 0,
      liveConsumerIndexOfThis: void 0,
      consumerAllowSignalWrites: !1,
      consumerIsAlwaysLive: !1,
      producerMustRecompute: () => !1,
      producerRecomputeValue: () => {},
      consumerMarkedDirty: () => {},
      consumerOnSignalRead: () => {},
    };
    hu = fu;
  });
function y(e) {
  return typeof e == "function";
}
var F = h(() => {
  "use strict";
});
function St(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var zn = h(() => {
  "use strict";
});
var Tt,
  ai = h(() => {
    "use strict";
    zn();
    Tt = St(
      (e) =>
        function (n) {
          e(this),
            (this.message = n
              ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
              : ""),
            (this.name = "UnsubscriptionError"),
            (this.errors = n);
        }
    );
  });
function rt(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var Gn = h(() => {
  "use strict";
});
function xt(e) {
  return (
    e instanceof O ||
    (e && "closed" in e && y(e.remove) && y(e.add) && y(e.unsubscribe))
  );
}
function ci(e) {
  y(e) ? e() : e.unsubscribe();
}
var O,
  Wn,
  ot = h(() => {
    "use strict";
    F();
    ai();
    Gn();
    O = class e {
      constructor(t) {
        (this.initialTeardown = t),
          (this.closed = !1),
          (this._parentage = null),
          (this._finalizers = null);
      }
      unsubscribe() {
        let t;
        if (!this.closed) {
          this.closed = !0;
          let { _parentage: n } = this;
          if (n)
            if (((this._parentage = null), Array.isArray(n)))
              for (let i of n) i.remove(this);
            else n.remove(this);
          let { initialTeardown: r } = this;
          if (y(r))
            try {
              r();
            } catch (i) {
              t = i instanceof Tt ? i.errors : [i];
            }
          let { _finalizers: o } = this;
          if (o) {
            this._finalizers = null;
            for (let i of o)
              try {
                ci(i);
              } catch (s) {
                (t = t ?? []),
                  s instanceof Tt ? (t = [...t, ...s.errors]) : t.push(s);
              }
          }
          if (t) throw new Tt(t);
        }
      }
      add(t) {
        var n;
        if (t && t !== this)
          if (this.closed) ci(t);
          else {
            if (t instanceof e) {
              if (t.closed || t._hasParent(this)) return;
              t._addParent(this);
            }
            (this._finalizers =
              (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
          }
      }
      _hasParent(t) {
        let { _parentage: n } = this;
        return n === t || (Array.isArray(n) && n.includes(t));
      }
      _addParent(t) {
        let { _parentage: n } = this;
        this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
      }
      _removeParent(t) {
        let { _parentage: n } = this;
        n === t ? (this._parentage = null) : Array.isArray(n) && rt(n, t);
      }
      remove(t) {
        let { _finalizers: n } = this;
        n && rt(n, t), t instanceof e && t._removeParent(this);
      }
    };
    O.EMPTY = (() => {
      let e = new O();
      return (e.closed = !0), e;
    })();
    Wn = O.EMPTY;
  });
var $,
  it = h(() => {
    "use strict";
    $ = {
      onUnhandledError: null,
      onStoppedNotification: null,
      Promise: void 0,
      useDeprecatedSynchronousErrorHandling: !1,
      useDeprecatedNextContext: !1,
    };
  });
var ke,
  qn = h(() => {
    "use strict";
    ke = {
      setTimeout(e, t, ...n) {
        let { delegate: r } = ke;
        return r?.setTimeout
          ? r.setTimeout(e, t, ...n)
          : setTimeout(e, t, ...n);
      },
      clearTimeout(e) {
        let { delegate: t } = ke;
        return (t?.clearTimeout || clearTimeout)(e);
      },
      delegate: void 0,
    };
  });
function Nt(e) {
  ke.setTimeout(() => {
    let { onUnhandledError: t } = $;
    if (t) t(e);
    else throw e;
  });
}
var Zn = h(() => {
  "use strict";
  it();
  qn();
});
function Yn() {}
var ui = h(() => {
  "use strict";
});
function di(e) {
  return Qn("E", void 0, e);
}
function fi(e) {
  return Qn("N", e, void 0);
}
function Qn(e, t, n) {
  return { kind: e, value: t, error: n };
}
var li,
  hi = h(() => {
    "use strict";
    li = Qn("C", void 0, void 0);
  });
function Le(e) {
  if ($.useDeprecatedSynchronousErrorHandling) {
    let t = !De;
    if ((t && (De = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = De;
      if (((De = null), n)) throw r;
    }
  } else e();
}
function pi(e) {
  $.useDeprecatedSynchronousErrorHandling &&
    De &&
    ((De.errorThrown = !0), (De.error = e));
}
var De,
  At = h(() => {
    "use strict";
    it();
    De = null;
  });
function Kn(e, t) {
  return pu.call(e, t);
}
function Ot(e) {
  $.useDeprecatedSynchronousErrorHandling ? pi(e) : Nt(e);
}
function gu(e) {
  throw e;
}
function Jn(e, t) {
  let { onStoppedNotification: n } = $;
  n && ke.setTimeout(() => n(e, t));
}
var Ee,
  pu,
  Xn,
  je,
  mu,
  er = h(() => {
    "use strict";
    F();
    ot();
    it();
    Zn();
    ui();
    hi();
    qn();
    At();
    (Ee = class extends O {
      constructor(t) {
        super(),
          (this.isStopped = !1),
          t
            ? ((this.destination = t), xt(t) && t.add(this))
            : (this.destination = mu);
      }
      static create(t, n, r) {
        return new je(t, n, r);
      }
      next(t) {
        this.isStopped ? Jn(fi(t), this) : this._next(t);
      }
      error(t) {
        this.isStopped
          ? Jn(di(t), this)
          : ((this.isStopped = !0), this._error(t));
      }
      complete() {
        this.isStopped
          ? Jn(li, this)
          : ((this.isStopped = !0), this._complete());
      }
      unsubscribe() {
        this.closed ||
          ((this.isStopped = !0),
          super.unsubscribe(),
          (this.destination = null));
      }
      _next(t) {
        this.destination.next(t);
      }
      _error(t) {
        try {
          this.destination.error(t);
        } finally {
          this.unsubscribe();
        }
      }
      _complete() {
        try {
          this.destination.complete();
        } finally {
          this.unsubscribe();
        }
      }
    }),
      (pu = Function.prototype.bind);
    (Xn = class {
      constructor(t) {
        this.partialObserver = t;
      }
      next(t) {
        let { partialObserver: n } = this;
        if (n.next)
          try {
            n.next(t);
          } catch (r) {
            Ot(r);
          }
      }
      error(t) {
        let { partialObserver: n } = this;
        if (n.error)
          try {
            n.error(t);
          } catch (r) {
            Ot(r);
          }
        else Ot(t);
      }
      complete() {
        let { partialObserver: t } = this;
        if (t.complete)
          try {
            t.complete();
          } catch (n) {
            Ot(n);
          }
      }
    }),
      (je = class extends Ee {
        constructor(t, n, r) {
          super();
          let o;
          if (y(t) || !t)
            o = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && $.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: t.next && Kn(t.next, i),
                  error: t.error && Kn(t.error, i),
                  complete: t.complete && Kn(t.complete, i),
                }))
              : (o = t);
          }
          this.destination = new Xn(o);
        }
      });
    mu = { closed: !0, next: Yn, error: gu, complete: Yn };
  });
var Ve,
  Rt = h(() => {
    "use strict";
    Ve = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
  });
function Ft(e) {
  return e;
}
var tr = h(() => {
  "use strict";
});
function gi(e) {
  return e.length === 0
    ? Ft
    : e.length === 1
    ? e[0]
    : function (n) {
        return e.reduce((r, o) => o(r), n);
      };
}
var mi = h(() => {
  "use strict";
  tr();
});
function yi(e) {
  var t;
  return (t = e ?? $.Promise) !== null && t !== void 0 ? t : Promise;
}
function yu(e) {
  return e && y(e.next) && y(e.error) && y(e.complete);
}
function vu(e) {
  return (e && e instanceof Ee) || (yu(e) && xt(e));
}
var A,
  Ie = h(() => {
    "use strict";
    er();
    ot();
    Rt();
    mi();
    it();
    F();
    At();
    A = (() => {
      class e {
        constructor(n) {
          n && (this._subscribe = n);
        }
        lift(n) {
          let r = new e();
          return (r.source = this), (r.operator = n), r;
        }
        subscribe(n, r, o) {
          let i = vu(n) ? n : new je(n, r, o);
          return (
            Le(() => {
              let { operator: s, source: a } = this;
              i.add(
                s
                  ? s.call(i, a)
                  : a
                  ? this._subscribe(i)
                  : this._trySubscribe(i)
              );
            }),
            i
          );
        }
        _trySubscribe(n) {
          try {
            return this._subscribe(n);
          } catch (r) {
            n.error(r);
          }
        }
        forEach(n, r) {
          return (
            (r = yi(r)),
            new r((o, i) => {
              let s = new je({
                next: (a) => {
                  try {
                    n(a);
                  } catch (c) {
                    i(c), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            })
          );
        }
        _subscribe(n) {
          var r;
          return (r = this.source) === null || r === void 0
            ? void 0
            : r.subscribe(n);
        }
        [Ve]() {
          return this;
        }
        pipe(...n) {
          return gi(n)(this);
        }
        toPromise(n) {
          return (
            (n = yi(n)),
            new n((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            })
          );
        }
      }
      return (e.create = (t) => new e(t)), e;
    })();
  });
function Du(e) {
  return y(e?.lift);
}
function Z(e) {
  return (t) => {
    if (Du(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
var Be = h(() => {
  "use strict";
  F();
});
function Y(e, t, n, r, o) {
  return new nr(e, t, n, r, o);
}
var nr,
  st = h(() => {
    "use strict";
    er();
    nr = class extends Ee {
      constructor(t, n, r, o, i, s) {
        super(t),
          (this.onFinalize = i),
          (this.shouldUnsubscribe = s),
          (this._next = n
            ? function (a) {
                try {
                  n(a);
                } catch (c) {
                  t.error(c);
                }
              }
            : super._next),
          (this._error = o
            ? function (a) {
                try {
                  o(a);
                } catch (c) {
                  t.error(c);
                } finally {
                  this.unsubscribe();
                }
              }
            : super._error),
          (this._complete = r
            ? function () {
                try {
                  r();
                } catch (a) {
                  t.error(a);
                } finally {
                  this.unsubscribe();
                }
              }
            : super._complete);
      }
      unsubscribe() {
        var t;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
          let { closed: n } = this;
          super.unsubscribe(),
            !n &&
              ((t = this.onFinalize) === null || t === void 0 || t.call(this));
        }
      }
    };
  });
var vi,
  Di = h(() => {
    "use strict";
    zn();
    vi = St(
      (e) =>
        function () {
          e(this),
            (this.name = "ObjectUnsubscribedError"),
            (this.message = "object unsubscribed");
        }
    );
  });
var Q,
  Pt,
  kt = h(() => {
    "use strict";
    Ie();
    ot();
    Di();
    Gn();
    At();
    (Q = (() => {
      class e extends A {
        constructor() {
          super(),
            (this.closed = !1),
            (this.currentObservers = null),
            (this.observers = []),
            (this.isStopped = !1),
            (this.hasError = !1),
            (this.thrownError = null);
        }
        lift(n) {
          let r = new Pt(this, this);
          return (r.operator = n), r;
        }
        _throwIfClosed() {
          if (this.closed) throw new vi();
        }
        next(n) {
          Le(() => {
            if ((this._throwIfClosed(), !this.isStopped)) {
              this.currentObservers ||
                (this.currentObservers = Array.from(this.observers));
              for (let r of this.currentObservers) r.next(n);
            }
          });
        }
        error(n) {
          Le(() => {
            if ((this._throwIfClosed(), !this.isStopped)) {
              (this.hasError = this.isStopped = !0), (this.thrownError = n);
              let { observers: r } = this;
              for (; r.length; ) r.shift().error(n);
            }
          });
        }
        complete() {
          Le(() => {
            if ((this._throwIfClosed(), !this.isStopped)) {
              this.isStopped = !0;
              let { observers: n } = this;
              for (; n.length; ) n.shift().complete();
            }
          });
        }
        unsubscribe() {
          (this.isStopped = this.closed = !0),
            (this.observers = this.currentObservers = null);
        }
        get observed() {
          var n;
          return (
            ((n = this.observers) === null || n === void 0
              ? void 0
              : n.length) > 0
          );
        }
        _trySubscribe(n) {
          return this._throwIfClosed(), super._trySubscribe(n);
        }
        _subscribe(n) {
          return (
            this._throwIfClosed(),
            this._checkFinalizedStatuses(n),
            this._innerSubscribe(n)
          );
        }
        _innerSubscribe(n) {
          let { hasError: r, isStopped: o, observers: i } = this;
          return r || o
            ? Wn
            : ((this.currentObservers = null),
              i.push(n),
              new O(() => {
                (this.currentObservers = null), rt(i, n);
              }));
        }
        _checkFinalizedStatuses(n) {
          let { hasError: r, thrownError: o, isStopped: i } = this;
          r ? n.error(o) : i && n.complete();
        }
        asObservable() {
          let n = new A();
          return (n.source = this), n;
        }
      }
      return (e.create = (t, n) => new Pt(t, n)), e;
    })()),
      (Pt = class extends Q {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          (r =
            (n = this.destination) === null || n === void 0
              ? void 0
              : n.next) === null ||
            r === void 0 ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          (r =
            (n = this.destination) === null || n === void 0
              ? void 0
              : n.error) === null ||
            r === void 0 ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          (n =
            (t = this.destination) === null || t === void 0
              ? void 0
              : t.complete) === null ||
            n === void 0 ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return (r =
            (n = this.source) === null || n === void 0
              ? void 0
              : n.subscribe(t)) !== null && r !== void 0
            ? r
            : Wn;
        }
      });
  });
var at,
  Ei = h(() => {
    "use strict";
    kt();
    at = class extends Q {
      constructor(t) {
        super(), (this._value = t);
      }
      get value() {
        return this.getValue();
      }
      _subscribe(t) {
        let n = super._subscribe(t);
        return !n.closed && t.next(this._value), n;
      }
      getValue() {
        let { hasError: t, thrownError: n, _value: r } = this;
        if (t) throw n;
        return this._throwIfClosed(), r;
      }
      next(t) {
        super.next((this._value = t));
      }
    };
  });
var rr,
  Ii = h(() => {
    "use strict";
    rr = {
      now() {
        return (rr.delegate || Date).now();
      },
      delegate: void 0,
    };
  });
var ct,
  wi = h(() => {
    "use strict";
    kt();
    Ii();
    ct = class extends Q {
      constructor(t = 1 / 0, n = 1 / 0, r = rr) {
        super(),
          (this._bufferSize = t),
          (this._windowTime = n),
          (this._timestampProvider = r),
          (this._buffer = []),
          (this._infiniteTimeWindow = !0),
          (this._infiniteTimeWindow = n === 1 / 0),
          (this._bufferSize = Math.max(1, t)),
          (this._windowTime = Math.max(1, n));
      }
      next(t) {
        let {
          isStopped: n,
          _buffer: r,
          _infiniteTimeWindow: o,
          _timestampProvider: i,
          _windowTime: s,
        } = this;
        n || (r.push(t), !o && r.push(i.now() + s)),
          this._trimBuffer(),
          super.next(t);
      }
      _subscribe(t) {
        this._throwIfClosed(), this._trimBuffer();
        let n = this._innerSubscribe(t),
          { _infiniteTimeWindow: r, _buffer: o } = this,
          i = o.slice();
        for (let s = 0; s < i.length && !t.closed; s += r ? 1 : 2) t.next(i[s]);
        return this._checkFinalizedStatuses(t), n;
      }
      _trimBuffer() {
        let {
            _bufferSize: t,
            _timestampProvider: n,
            _buffer: r,
            _infiniteTimeWindow: o,
          } = this,
          i = (o ? 1 : 2) * t;
        if ((t < 1 / 0 && i < r.length && r.splice(0, r.length - i), !o)) {
          let s = n.now(),
            a = 0;
          for (let c = 1; c < r.length && r[c] <= s; c += 2) a = c;
          a && r.splice(0, a + 1);
        }
      }
    };
  });
var Ci,
  bi = h(() => {
    "use strict";
    Ie();
    Ci = new A((e) => e.complete());
  });
function Mi(e) {
  return e && y(e.schedule);
}
var _i = h(() => {
  "use strict";
  F();
});
function Si(e) {
  return e[e.length - 1];
}
function Ti(e) {
  return Mi(Si(e)) ? e.pop() : void 0;
}
function xi(e, t) {
  return typeof Si(e) == "number" ? e.pop() : t;
}
var Ni = h(() => {
  "use strict";
  _i();
});
function Oi(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(l) {
      try {
        u(r.next(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      try {
        u(r.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      l.done ? i(l.value) : o(l.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
}
function Ai(e) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function we(e) {
  return this instanceof we ? ((this.v = e), this) : new we(e);
}
function Ri(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype
    )),
    a("next"),
    a("throw"),
    a("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (v) {
      return Promise.resolve(v).then(f, d);
    };
  }
  function a(f, v) {
    r[f] &&
      ((o[f] = function (S) {
        return new Promise(function (R, N) {
          i.push([f, S, R, N]) > 1 || c(f, S);
        });
      }),
      v && (o[f] = v(o[f])));
  }
  function c(f, v) {
    try {
      u(r[f](v));
    } catch (S) {
      g(i[0][3], S);
    }
  }
  function u(f) {
    f.value instanceof we
      ? Promise.resolve(f.value.v).then(l, d)
      : g(i[0][2], f);
  }
  function l(f) {
    c("next", f);
  }
  function d(f) {
    c("throw", f);
  }
  function g(f, v) {
    f(v), i.shift(), i.length && c(i[0][0], i[0][1]);
  }
}
function Fi(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof Ai == "function" ? Ai(e) : e[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = e[i](s)), o(a, c, s.done, s.value);
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (u) {
      i({ value: u, done: a });
    }, s);
  }
}
var or = h(() => {
  "use strict";
});
var Lt,
  ir = h(() => {
    "use strict";
    Lt = (e) => e && typeof e.length == "number" && typeof e != "function";
  });
function jt(e) {
  return y(e?.then);
}
var sr = h(() => {
  "use strict";
  F();
});
function Vt(e) {
  return y(e[Ve]);
}
var ar = h(() => {
  "use strict";
  Rt();
  F();
});
function Bt(e) {
  return Symbol.asyncIterator && y(e?.[Symbol.asyncIterator]);
}
var cr = h(() => {
  "use strict";
  F();
});
function Ht(e) {
  return new TypeError(
    `You provided ${
      e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
var ur = h(() => {
  "use strict";
});
function Eu() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var $t,
  lr = h(() => {
    "use strict";
    $t = Eu();
  });
function Ut(e) {
  return y(e?.[$t]);
}
var dr = h(() => {
  "use strict";
  lr();
  F();
});
function zt(e) {
  return Ri(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield we(n.read());
        if (o) return yield we(void 0);
        yield yield we(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Gt(e) {
  return y(e?.getReader);
}
var Wt = h(() => {
  "use strict";
  or();
  F();
});
function P(e) {
  if (e instanceof A) return e;
  if (e != null) {
    if (Vt(e)) return Iu(e);
    if (Lt(e)) return wu(e);
    if (jt(e)) return Cu(e);
    if (Bt(e)) return Pi(e);
    if (Ut(e)) return bu(e);
    if (Gt(e)) return Mu(e);
  }
  throw Ht(e);
}
function Iu(e) {
  return new A((t) => {
    let n = e[Ve]();
    if (y(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function wu(e) {
  return new A((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function Cu(e) {
  return new A((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n)
    ).then(null, Nt);
  });
}
function bu(e) {
  return new A((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function Pi(e) {
  return new A((t) => {
    _u(e, t).catch((n) => t.error(n));
  });
}
function Mu(e) {
  return Pi(zt(e));
}
function _u(e, t) {
  var n, r, o, i;
  return Oi(this, void 0, void 0, function* () {
    try {
      for (n = Fi(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
var le = h(() => {
  "use strict";
  or();
  ir();
  sr();
  Ie();
  ar();
  cr();
  ur();
  dr();
  Wt();
  F();
  Zn();
  Rt();
});
function V(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
var ut = h(() => {
  "use strict";
});
function qt(e, t = 0) {
  return Z((n, r) => {
    n.subscribe(
      Y(
        r,
        (o) => V(r, e, () => r.next(o), t),
        () => V(r, e, () => r.complete(), t),
        (o) => V(r, e, () => r.error(o), t)
      )
    );
  });
}
var fr = h(() => {
  "use strict";
  ut();
  Be();
  st();
});
function Zt(e, t = 0) {
  return Z((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
var hr = h(() => {
  "use strict";
  Be();
});
function ki(e, t) {
  return P(e).pipe(Zt(t), qt(t));
}
var Li = h(() => {
  "use strict";
  le();
  fr();
  hr();
});
function ji(e, t) {
  return P(e).pipe(Zt(t), qt(t));
}
var Vi = h(() => {
  "use strict";
  le();
  fr();
  hr();
});
function Bi(e, t) {
  return new A((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
var Hi = h(() => {
  "use strict";
  Ie();
});
function $i(e, t) {
  return new A((n) => {
    let r;
    return (
      V(n, t, () => {
        (r = e[$t]()),
          V(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0
          );
      }),
      () => y(r?.return) && r.return()
    );
  });
}
var Ui = h(() => {
  "use strict";
  Ie();
  lr();
  F();
  ut();
});
function Yt(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new A((n) => {
    V(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      V(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0
      );
    });
  });
}
var pr = h(() => {
  "use strict";
  Ie();
  ut();
});
function zi(e, t) {
  return Yt(zt(e), t);
}
var Gi = h(() => {
  "use strict";
  pr();
  Wt();
});
function Wi(e, t) {
  if (e != null) {
    if (Vt(e)) return ki(e, t);
    if (Lt(e)) return Bi(e, t);
    if (jt(e)) return ji(e, t);
    if (Bt(e)) return Yt(e, t);
    if (Ut(e)) return $i(e, t);
    if (Gt(e)) return zi(e, t);
  }
  throw Ht(e);
}
var qi = h(() => {
  "use strict";
  Li();
  Vi();
  Hi();
  Ui();
  pr();
  ar();
  sr();
  ir();
  dr();
  cr();
  ur();
  Wt();
  Gi();
});
function Zi(e, t) {
  return t ? Wi(e, t) : P(e);
}
var Yi = h(() => {
  "use strict";
  qi();
  le();
});
function Ce(e, t) {
  return Z((n, r) => {
    let o = 0;
    n.subscribe(
      Y(r, (i) => {
        r.next(e.call(t, i, o++));
      })
    );
  });
}
var gr = h(() => {
  "use strict";
  Be();
  st();
});
function Qi(e, t, n, r, o, i, s, a) {
  let c = [],
    u = 0,
    l = 0,
    d = !1,
    g = () => {
      d && !c.length && !u && t.complete();
    },
    f = (S) => (u < r ? v(S) : c.push(S)),
    v = (S) => {
      i && t.next(S), u++;
      let R = !1;
      P(n(S, l++)).subscribe(
        Y(
          t,
          (N) => {
            o?.(N), i ? f(N) : t.next(N);
          },
          () => {
            R = !0;
          },
          void 0,
          () => {
            if (R)
              try {
                for (u--; c.length && u < r; ) {
                  let N = c.shift();
                  s ? V(t, s, () => v(N)) : v(N);
                }
                g();
              } catch (N) {
                t.error(N);
              }
          }
        )
      );
    };
  return (
    e.subscribe(
      Y(t, f, () => {
        (d = !0), g();
      })
    ),
    () => {
      a?.();
    }
  );
}
var Ki = h(() => {
  "use strict";
  le();
  ut();
  st();
});
function mr(e, t, n = 1 / 0) {
  return y(t)
    ? mr((r, o) => Ce((i, s) => t(r, i, o, s))(P(e(r, o))), n)
    : (typeof t == "number" && (n = t), Z((r, o) => Qi(r, o, e, n)));
}
var Ji = h(() => {
  "use strict";
  gr();
  le();
  Be();
  Ki();
  F();
});
function Xi(e = 1 / 0) {
  return mr(Ft, e);
}
var es = h(() => {
  "use strict";
  Ji();
  tr();
});
function yr(...e) {
  let t = Ti(e),
    n = xi(e, 1 / 0),
    r = e;
  return r.length ? (r.length === 1 ? P(r[0]) : Xi(n)(Zi(r, t))) : Ci;
}
var ts = h(() => {
  "use strict";
  es();
  le();
  bi();
  Ni();
  Yi();
});
var ns = h(() => {
  "use strict";
});
function vr(e, t) {
  return Z((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      Y(
        r,
        (c) => {
          o?.unsubscribe();
          let u = 0,
            l = i++;
          P(e(c, l)).subscribe(
            (o = Y(
              r,
              (d) => r.next(t ? t(c, d, l, u++) : d),
              () => {
                (o = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
var rs = h(() => {
  "use strict";
  le();
  Be();
  st();
});
var Dr = h(() => {
  "use strict";
  kt();
  Ei();
  wi();
  ot();
  ts();
  ns();
});
var Er = h(() => {
  "use strict";
  gr();
  rs();
});
function so(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function Su(e) {
  return { toString: e }.toString();
}
function _(e) {
  for (let t in e) if (e[t] === _) return t;
  throw Error("Could not find renamed property on target object.");
}
function W(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return "[" + e.map(W).join(", ") + "]";
  if (e == null) return "" + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let n = t.indexOf(`
`);
  return n === -1 ? t : t.substring(0, n);
}
function os(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
    ? e
    : e + " " + t;
}
function Vs(e) {
  return (
    (e.__forward_ref__ = Vs),
    (e.toString = function () {
      return W(this());
    }),
    e
  );
}
function z(e) {
  return xu(e) ? e() : e;
}
function xu(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(Tu) && e.__forward_ref__ === Vs
  );
}
function x(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function ao(e) {
  return is(e, Bs) || is(e, Hs);
}
function is(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function Nu(e) {
  let t = e && (e[Bs] || e[Hs]);
  return t || null;
}
function ss(e) {
  return e && (e.hasOwnProperty(as) || e.hasOwnProperty(Au)) ? e[as] : null;
}
function $s(e) {
  return e && !!e.ɵproviders;
}
function Us(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function Pu(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
    ? e.type.name || e.type.toString()
    : Us(e);
}
function ku(e, t) {
  let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new D(-200, e);
}
function co(e, t) {
  throw new D(-201, !1);
}
function zs() {
  return Tr;
}
function K(e) {
  let t = Tr;
  return (Tr = e), t;
}
function Gs(e, t, n) {
  let r = ao(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & m.Optional) return null;
  if (t !== void 0) return t;
  co(e, "Injector");
}
function $u() {
  return Ge;
}
function He(e) {
  let t = Ge;
  return (Ge = e), t;
}
function Uu(e, t = m.Default) {
  if (Ge === void 0) throw new D(-203, !1);
  return Ge === null
    ? Gs(e, void 0, t)
    : Ge.get(e, t & m.Optional ? null : void 0, t);
}
function M(e, t = m.Default) {
  return (zs() || Uu)(z(e), t);
}
function w(e, t = m.Default) {
  return M(e, yn(t));
}
function yn(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function xr(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = z(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new D(900, !1);
      let o,
        i = m.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = zu(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      t.push(M(o, i));
    } else t.push(M(r));
  }
  return t;
}
function zu(e) {
  return e[ju];
}
function Gu(e, t, n, r) {
  let o = e[nn];
  throw (
    (t[ls] && o.unshift(t[ls]),
    (e.message = Wu(
      `
` + e.message,
      o,
      n,
      r
    )),
    (e[Vu] = o),
    (e[nn] = null),
    e)
  );
}
function Wu(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == Hu
      ? e.slice(2)
      : e;
  let o = W(t);
  if (Array.isArray(t)) o = t.map(W).join(" -> ");
  else if (typeof t == "object") {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : W(a)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
    Bu,
    `
  `
  )}`;
}
function ht(e, t) {
  let n = e.hasOwnProperty(cs);
  return n ? e[cs] : null;
}
function uo(e, t) {
  e.forEach((n) => (Array.isArray(n) ? uo(n, t) : t(n)));
}
function Ws(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function qu(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
function Nr(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      Yu(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function Zu(e) {
  return e === 3 || e === 4 || e === 6;
}
function Yu(e) {
  return e.charCodeAt(0) === 64;
}
function lo(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number"
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? ds(e, n, o, null, t[++r])
              : ds(e, n, o, null, null));
      }
    }
  return e;
}
function ds(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        o !== null && (e[i + 1] = o);
        return;
      } else if (r === e[i + 1]) {
        e[i + 2] = o;
        return;
      }
    }
    i++, r !== null && i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    r !== null && e.splice(i++, 0, r),
    o !== null && e.splice(i++, 0, o);
}
function Qu(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && qu(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (fo(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function fo(e) {
  return e.type === 4 && e.value !== Qs;
}
function Ku(e, t, n) {
  let r = e.type === 4 && !n ? Qs : e.value;
  return t === r;
}
function Ju(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? tl(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "number") {
      if (!s && !U(r) && !U(c)) return !1;
      if (s && U(c)) continue;
      (s = !1), (r = c | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !Ku(e, c, n)) || (c === "" && t.length === 1))
        ) {
          if (U(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !Qu(e, o, c, n)) {
          if (U(r)) return !1;
          s = !0;
        }
      } else {
        let u = t[++a],
          l = Xu(c, o, fo(e), n);
        if (l === -1) {
          if (U(r)) return !1;
          s = !0;
          continue;
        }
        if (u !== "") {
          let d;
          if (
            (l > i ? (d = "") : (d = o[l + 1].toLowerCase()), r & 2 && u !== d)
          ) {
            if (U(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return U(r) || s;
}
function U(e) {
  return (e & 1) === 0;
}
function Xu(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == "string"; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return nl(t, e);
}
function el(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (Ju(e, t[r], n)) return !0;
  return !1;
}
function tl(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (Zu(n)) return t;
  }
  return e.length;
}
function nl(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function fs(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function rl(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = "",
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == "string")
      if (r & 2) {
        let a = e[++n];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      o !== "" && !U(s) && ((t += fs(i, o)), (o = "")),
        (r = s),
        (i = i || !U(r));
    n++;
  }
  return o !== "" && (t += fs(i, o)), t;
}
function ol(e) {
  return e.map(rl).join(",");
}
function il(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!U(o)) break;
      o = i;
    }
    r++;
  }
  return { attrs: t, classes: n };
}
function Ks(e) {
  return Su(() => {
    let t = ul(e),
      n = oe(re({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Ys.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || ee.Emulated,
        styles: e.styles || qe,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    ll(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = ps(r, !1)), (n.pipeDefs = ps(r, !0)), (n.id = dl(n)), n
    );
  });
}
function sl(e) {
  return vn(e) || Js(e);
}
function al(e) {
  return e !== null;
}
function hs(e, t) {
  if (e == null) return pt;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a = he.None;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = a !== he.None ? [r, a] : r), (t[i] = s)) : (n[i] = r);
    }
  return n;
}
function vn(e) {
  return e[Ou] || null;
}
function Js(e) {
  return e[Ru] || null;
}
function Xs(e) {
  return e[Fu] || null;
}
function cl(e) {
  let t = vn(e) || Js(e) || Xs(e);
  return t !== null ? t.standalone : !1;
}
function ul(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || pt,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || qe,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: hs(e.inputs, t),
    outputs: hs(e.outputs),
    debugInfo: null,
  };
}
function ll(e) {
  e.features?.forEach((t) => t(e));
}
function ps(e, t) {
  if (!e) return null;
  let n = t ? Xs : sl;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(al);
}
function dl(e) {
  let t = 0,
    n = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      e.consts,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ].join("|");
  for (let o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function fl(...e) {
  return { ɵproviders: ea(!0, e), ɵfromNgModule: !0 };
}
function ea(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    uo(t, (s) => {
      let a = s;
      Ar(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && ta(o, i),
    n
  );
}
function ta(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    ho(o, (i) => {
      t(i, r);
    });
  }
}
function Ar(e, t, n, r) {
  if (((e = z(e)), !e)) return !1;
  let o = null,
    i = ss(e),
    s = !i && vn(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = ss(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let u of c) Ar(u, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let u;
      try {
        uo(i.imports, (l) => {
          Ar(l, t, n, r) && ((u ||= []), u.push(l));
        });
      } finally {
      }
      u !== void 0 && ta(u, t);
    }
    if (!a) {
      let u = ht(o) || (() => new o());
      t({ provide: o, useFactory: u, deps: qe }, o),
        t({ provide: Zs, useValue: o, multi: !0 }, o),
        t({ provide: gt, useValue: () => M(o), multi: !0 }, o);
    }
    let c = i.providers;
    if (c != null && !a) {
      let u = e;
      ho(c, (l) => {
        t(l, u);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function ho(e, t) {
  for (let n of e)
    $s(n) && (n = n.ɵproviders), Array.isArray(n) ? ho(n, t) : t(n);
}
function na(e) {
  return e !== null && typeof e == "object" && hl in e;
}
function pl(e) {
  return !!(e && e.useExisting);
}
function gl(e) {
  return !!(e && e.useFactory);
}
function Or(e) {
  return typeof e == "function";
}
function po() {
  return Ir === void 0 && (Ir = new rn()), Ir;
}
function Rr(e) {
  let t = ao(e),
    n = t !== null ? t.factory : ht(e);
  if (n !== null) return n;
  if (e instanceof b) throw new D(204, !1);
  if (e instanceof Function) return yl(e);
  throw new D(204, !1);
}
function yl(e) {
  if (e.length > 0) throw new D(204, !1);
  let n = Nu(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function vl(e) {
  if (na(e)) return $e(void 0, e.useValue);
  {
    let t = Dl(e);
    return $e(t, Kt);
  }
}
function Dl(e, t, n) {
  let r;
  if (Or(e)) {
    let o = z(e);
    return ht(o) || Rr(o);
  } else if (na(e)) r = () => z(e.useValue);
  else if (gl(e)) r = () => e.useFactory(...xr(e.deps || []));
  else if (pl(e)) r = () => M(z(e.useExisting));
  else {
    let o = z(e && (e.useClass || e.provide));
    if (El(e)) r = () => new o(...xr(e.deps));
    else return ht(o) || Rr(o);
  }
  return r;
}
function $e(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function El(e) {
  return !!e.deps;
}
function Il(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function wl(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof b);
}
function Fr(e, t) {
  for (let n of e)
    Array.isArray(n) ? Fr(n, t) : n && $s(n) ? Fr(n.ɵproviders, t) : t(n);
}
function Cl() {
  return zs() !== void 0 || $u() != null;
}
function Me(e) {
  return Array.isArray(e) && typeof e[oa] == "object";
}
function et(e) {
  return Array.isArray(e) && e[oa] === !0;
}
function ia(e) {
  return (e.flags & 4) !== 0;
}
function mo(e) {
  return e.componentOffset > -1;
}
function sa(e) {
  return (e.flags & 1) === 1;
}
function wt(e) {
  return !!e.template;
}
function Lr(e) {
  return (e[p] & 512) !== 0;
}
function aa(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
function yo() {
  return ca;
}
function ca(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = _l), Ml;
}
function Ml() {
  let e = la(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === pt) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function _l(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = la(e) || Sl(e, { previous: pt, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    u = c[i];
  (a[i] = new yt(u && u.currentValue, n, c === pt)), aa(e, t, o, n);
}
function la(e) {
  return e[ua] || null;
}
function Sl(e, t) {
  return (e[ua] = t);
}
function Ne(e) {
  for (; Array.isArray(e); ) e = e[ge];
  return e;
}
function Nl(e, t) {
  return Ne(t[e]);
}
function ye(e, t) {
  return Ne(t[e.index]);
}
function Al(e, t) {
  return e.data[t];
}
function tt(e, t) {
  let n = t[e];
  return Me(n) ? n : n[ge];
}
function vo(e) {
  return (e[p] & 128) === 128;
}
function ys(e, t) {
  return t == null ? null : e[t];
}
function da(e) {
  e[Ue] = 0;
}
function fa(e) {
  e[p] & 1024 || ((e[p] |= 1024), vo(e) && wn(e));
}
function In(e) {
  return !!(e[p] & 9216 || e[B]?.dirty);
}
function vs(e) {
  e[se].changeDetectionScheduler?.notify(8),
    e[p] & 64 && (e[p] |= 1024),
    In(e) && wn(e);
}
function wn(e) {
  e[se].changeDetectionScheduler?.notify(0);
  let t = Ye(e);
  for (; t !== null && !(t[p] & 8192 || ((t[p] |= 8192), !vo(t))); ) t = Ye(t);
}
function ha(e, t) {
  if ((e[p] & 256) === 256) throw new D(911, !1);
  e[fe] === null && (e[fe] = []), e[fe].push(t);
}
function Ol(e, t) {
  if (e[fe] === null) return;
  let n = e[fe].indexOf(t);
  n !== -1 && e[fe].splice(n, 1);
}
function Ye(e) {
  let t = e[q];
  return et(t) ? t[q] : t;
}
function Rl() {
  return C.lFrame.elementDepthCount;
}
function Fl() {
  C.lFrame.elementDepthCount++;
}
function Pl() {
  C.lFrame.elementDepthCount--;
}
function ga() {
  return C.bindingsEnabled;
}
function kl() {
  return C.skipHydrationRootTNode !== null;
}
function Ll(e) {
  return C.skipHydrationRootTNode === e;
}
function jl() {
  C.skipHydrationRootTNode = null;
}
function L() {
  return C.lFrame.lView;
}
function Ct() {
  return C.lFrame.tView;
}
function ue() {
  let e = ma();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function ma() {
  return C.lFrame.currentTNode;
}
function Vl() {
  let e = C.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Cn(e, t) {
  let n = C.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function ya() {
  return C.lFrame.isParent;
}
function Bl() {
  C.lFrame.isParent = !1;
}
function va() {
  return pa;
}
function Ds(e) {
  pa = e;
}
function Hl(e) {
  return (C.lFrame.bindingIndex = e);
}
function $l() {
  return C.lFrame.bindingIndex++;
}
function Ul() {
  return C.lFrame.inI18n;
}
function zl(e, t) {
  let n = C.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), jr(t);
}
function Gl() {
  return C.lFrame.currentDirectiveIndex;
}
function jr(e) {
  C.lFrame.currentDirectiveIndex = e;
}
function Da(e) {
  C.lFrame.currentQueryIndex = e;
}
function Wl(e) {
  let t = e[E];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[me] : null;
}
function Ea(e, t, n) {
  if (n & m.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & m.Host); )
      if (((o = Wl(i)), o === null || ((i = i[It]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (C.lFrame = Ia());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function Do(e) {
  let t = Ia(),
    n = e[E];
  (C.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function Ia() {
  let e = C.lFrame,
    t = e === null ? null : e.child;
  return t === null ? wa(e) : t;
}
function wa(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function Ca() {
  let e = C.lFrame;
  return (C.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
function Eo() {
  let e = Ca();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function Io() {
  return C.lFrame.selectedIndex;
}
function Te(e) {
  C.lFrame.selectedIndex = e;
}
function ql() {
  return C.lFrame.currentNamespace;
}
function _a() {
  return Ma;
}
function Sa(e) {
  Ma = e;
}
function Zl(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = ca(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function Ta(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: u,
        ngOnDestroy: l,
      } = i;
    s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      c && (e.viewHooks ??= []).push(-n, c),
      u &&
        ((e.viewHooks ??= []).push(n, u), (e.viewCheckHooks ??= []).push(n, u)),
      l != null && (e.destroyHooks ??= []).push(n, l);
  }
}
function Jt(e, t, n) {
  xa(e, t, 3, n);
}
function Xt(e, t, n, r) {
  (e[p] & 3) === n && xa(e, t, n, r);
}
function Cr(e, t) {
  let n = e[p];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[p] = n));
}
function xa(e, t, n, r) {
  let o = r !== void 0 ? e[Ue] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof t[c + 1] == "number") {
      if (((a = t[c]), r != null && a >= r)) break;
    } else
      t[c] < 0 && (e[Ue] += 65536),
        (a < i || i == -1) &&
          (Yl(e, n, t, c), (e[Ue] = (e[Ue] & 4294901760) + c + 2)),
        c++;
}
function Es(e, t) {
  J(4, e, t);
  let n = I(null);
  try {
    t.call(e);
  } finally {
    I(n), J(5, e, t);
  }
}
function Yl(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[p] >> 14 < e[Ue] >> 16 &&
      (e[p] & 3) === t &&
      ((e[p] += 16384), Es(a, i))
    : Es(a, i);
}
function Ql(e) {
  return e instanceof vt;
}
function Kl(e) {
  return (e.flags & 8) !== 0;
}
function Jl(e) {
  return (e.flags & 16) !== 0;
}
function Xl(e) {
  return e !== We;
}
function Br(e) {
  return e & 32767;
}
function ed(e) {
  return e >> 16;
}
function Hr(e, t) {
  let n = ed(e),
    r = t;
  for (; n > 0; ) (r = r[It]), n--;
  return r;
}
function Is(e) {
  let t = $r;
  return ($r = e), t;
}
function rd(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(dt) && (r = n[dt]),
    r == null && (r = n[dt] = nd++);
  let o = r & Na,
    i = 1 << o;
  t.data[e + (o >> Aa)] |= i;
}
function Oa(e, t) {
  let n = Ra(e, t);
  if (n !== -1) return n;
  let r = t[E];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Mr(r.data, e),
    Mr(t, null),
    Mr(r.blueprint, null));
  let o = Fa(e, t),
    i = e.injectorIndex;
  if (Xl(o)) {
    let s = Br(o),
      a = Hr(o, t),
      c = a[E].data;
    for (let u = 0; u < 8; u++) t[i + u] = a[s + u] | c[s + u];
  }
  return (t[i + 8] = o), i;
}
function Mr(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function Ra(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Fa(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = Va(o)), r === null)) return We;
    if ((n++, (o = o[It]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return We;
}
function od(e, t, n) {
  rd(e, t, n);
}
function Pa(e, t, n) {
  if (n & m.Optional || e !== void 0) return e;
  co(t, "NodeInjector");
}
function ka(e, t, n, r) {
  if (
    (n & m.Optional && r === void 0 && (r = null), !(n & (m.Self | m.Host)))
  ) {
    let o = e[Ze],
      i = K(void 0);
    try {
      return o ? o.get(t, r, n & m.Optional) : Gs(t, r, n & m.Optional);
    } finally {
      K(i);
    }
  }
  return Pa(r, t, n);
}
function La(e, t, n, r = m.Default, o) {
  if (e !== null) {
    if (t[p] & 2048 && !(r & m.Self)) {
      let s = ud(e, t, n, r, X);
      if (s !== X) return s;
    }
    let i = ja(e, t, n, r, X);
    if (i !== X) return i;
  }
  return ka(t, n, r, o);
}
function ja(e, t, n, r, o) {
  let i = ad(n);
  if (typeof i == "function") {
    if (!Ea(t, e, r)) return r & m.Host ? Pa(o, n, r) : ka(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & m.Optional))) co(n);
      else return s;
    } finally {
      ba();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = Ra(e, t),
      c = We,
      u = r & m.Host ? t[ae][me] : null;
    for (
      (a === -1 || r & m.SkipSelf) &&
      ((c = a === -1 ? Fa(e, t) : t[a + 8]),
      c === We || !Cs(r, !1)
        ? (a = -1)
        : ((s = t[E]), (a = Br(c)), (t = Hr(c, t))));
      a !== -1;

    ) {
      let l = t[E];
      if (ws(i, a, l.data)) {
        let d = id(a, t, n, s, r, u);
        if (d !== X) return d;
      }
      (c = t[a + 8]),
        c !== We && Cs(r, t[E].data[a + 8] === u) && ws(i, a, t)
          ? ((s = l), (a = Br(c)), (t = Hr(c, t)))
          : (a = -1);
    }
  }
  return o;
}
function id(e, t, n, r, o, i) {
  let s = t[E],
    a = s.data[e + 8],
    c = r == null ? mo(a) && $r : r != s && (a.type & 3) !== 0,
    u = o & m.Host && i === a,
    l = sd(a, s, n, c, u);
  return l !== null ? Dt(t, s, l, a) : X;
}
function sd(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    c = e.directiveStart,
    u = e.directiveEnd,
    l = i >> 20,
    d = r ? a : a + l,
    g = o ? a + l : u;
  for (let f = d; f < g; f++) {
    let v = s[f];
    if ((f < c && n === v) || (f >= c && v.type === n)) return f;
  }
  if (o) {
    let f = s[c];
    if (f && wt(f) && f.type === n) return c;
  }
  return null;
}
function Dt(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (Ql(o)) {
    let s = o;
    s.resolving && ku(Pu(i[n]));
    let a = Is(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      u = s.injectImpl ? K(s.injectImpl) : null,
      l = Ea(e, r, m.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Zl(n, i[n], t);
    } finally {
      u !== null && K(u), Is(a), (s.resolving = !1), ba();
    }
  }
  return o;
}
function ad(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(dt) ? e[dt] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & Na : cd) : t;
}
function ws(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> Aa)] & r);
}
function Cs(e, t) {
  return !(e & m.Self) && !(e & m.Host && t);
}
function cd() {
  return new ln(ue(), L());
}
function ud(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[p] & 2048 && !(s[p] & 512); ) {
    let a = ja(i, s, n, r | m.Self, X);
    if (a !== X) return a;
    let c = i.parent;
    if (!c) {
      let u = s[ra];
      if (u) {
        let l = u.get(n, X, r);
        if (l !== X) return l;
      }
      (c = Va(s)), (s = s[It]);
    }
    i = c;
  }
  return o;
}
function Va(e) {
  let t = e[E],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[me] : null;
}
function bs(e, t = null, n = null, r) {
  let o = ld(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function ld(e, t = null, n = null, r, o = new Set()) {
  let i = [n || qe, fl(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : W(e))),
    new on(i, t || po(), r || null, o)
  );
}
function _r(e) {
  return e[fd];
}
function hd() {
  return new Ur(L());
}
function dn(...e) {}
function $a(e) {
  let t, n;
  function r() {
    e = dn;
    try {
      n !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t);
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      e(), r();
    })),
    typeof requestAnimationFrame == "function" &&
      (n = requestAnimationFrame(() => {
        e(), r();
      })),
    () => r()
  );
}
function Ms(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = dn;
    }
  );
}
function Co(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function md(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    $a(() => {
      (e.callbackScheduled = !1),
        Gr(e),
        (e.isCheckStableRunning = !0),
        Co(e),
        (e.isCheckStableRunning = !1);
    });
  }
  e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    Gr(e);
}
function yd(e) {
  let t = () => {
      md(e);
    },
    n = pd++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [wo]: !0, [fn]: n, [fn + n]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (vd(c)) return r.invokeTask(i, s, a, c);
      try {
        return _s(e), r.invokeTask(i, s, a, c);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          Ss(e);
      }
    },
    onInvoke: (r, o, i, s, a, c, u) => {
      try {
        return _s(e), r.invoke(i, s, a, c, u);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !Dd(c) &&
          t(),
          Ss(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), Gr(e), Co(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function Gr(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function _s(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function Ss(e) {
  e._nesting--, Co(e);
}
function vd(e) {
  return Ua(e, "__ignore_ng_zone__");
}
function Dd(e) {
  return Ua(e, "__scheduler_tick__");
}
function Ua(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
function Id() {
  return za(ue(), L());
}
function za(e, t) {
  return new Ga(ye(e, t));
}
function wd(e) {
  return (e.flags & 128) === 128;
}
function bd() {
  return Cd++;
}
function Md(e) {
  Wa.set(e[En], e);
}
function qr(e) {
  Wa.delete(e[En]);
}
function Qe(e, t) {
  Me(t) ? ((e[Ts] = t[En]), Md(t)) : (e[Ts] = t);
}
function qa(e) {
  return Ya(e[mt]);
}
function Za(e) {
  return Ya(e[de]);
}
function Ya(e) {
  for (; e !== null && !et(e); ) e = e[de];
  return e;
}
function Qa(e) {
  Zr = e;
}
function _d() {
  if (Zr !== void 0) return Zr;
  if (typeof document < "u") return document;
  throw new D(210, !1);
}
function So(e, t, n = !1) {
  return Nd(e, t, n);
}
function Ja(e, t) {
  return Od(e, t);
}
function ze(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    et(r) ? (i = r) : Me(r) && ((s = !0), (r = r[ge]));
    let a = Ne(r);
    e === 0 && n !== null
      ? o == null
        ? tc(t, n, a)
        : Yr(t, n, a, o || null, !0)
      : e === 1 && n !== null
      ? Yr(t, n, a, o || null, !0)
      : e === 2
      ? Zd(t, a, s)
      : e === 3 && t.destroyNode(a),
      i != null && Qd(t, e, i, n, o);
  }
}
function Rd(e, t) {
  return e.createText(t);
}
function Fd(e, t, n) {
  e.setValue(t, n);
}
function Xa(e, t, n) {
  return e.createElement(t, n);
}
function Pd(e, t) {
  ec(e, t), (t[ge] = null), (t[me] = null);
}
function ec(e, t) {
  t[se].changeDetectionScheduler?.notify(9), No(e, t, t[te], 2, null, null);
}
function kd(e) {
  let t = e[mt];
  if (!t) return Sr(e[E], e);
  for (; t; ) {
    let n = null;
    if (Me(t)) n = t[mt];
    else {
      let r = t[be];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[de] && t !== e; ) Me(t) && Sr(t[E], t), (t = t[q]);
      t === null && (t = e), Me(t) && Sr(t[E], t), (n = t && t[de]);
    }
    t = n;
  }
}
function Ld(e, t) {
  let n = e[cn],
    r = t[q];
  if (Me(r)) e[p] |= un.HasTransplantedViews;
  else {
    let o = r[q][ae];
    t[ae] !== o && (e[p] |= un.HasTransplantedViews);
  }
  n === null ? (e[cn] = [t]) : n.push(t);
}
function To(e, t) {
  let n = e[cn],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function jd(e, t) {
  if (e.length <= be) return;
  let n = be + t,
    r = e[n];
  if (r) {
    let o = r[an];
    o !== null && o !== e && To(o, r), t > 0 && (e[n - 1][de] = r[de]);
    let i = Ws(e, be + t);
    Pd(r[E], r);
    let s = i[go];
    s !== null && s.detachView(i[E]),
      (r[q] = null),
      (r[de] = null),
      (r[p] &= -129);
  }
  return r;
}
function Vd(e, t) {
  if (!(t[p] & 256)) {
    let n = t[te];
    n.destroyNode && No(e, t, n, 3, null, null), kd(t);
  }
}
function Sr(e, t) {
  if (t[p] & 256) return;
  let n = I(null);
  try {
    (t[p] &= -129),
      (t[p] |= 256),
      t[B] && Bn(t[B]),
      Hd(e, t),
      Bd(e, t),
      t[E].type === 1 && t[te].destroy();
    let r = t[an];
    if (r !== null && et(t[q])) {
      r !== t[q] && To(r, t);
      let o = t[go];
      o !== null && o.detachView(e);
    }
    qr(t);
  } finally {
    I(n);
  }
}
function Bd(e, t) {
  let n = e.cleanup,
    r = t[sn];
  if (n !== null)
    for (let i = 0; i < n.length - 1; i += 2)
      if (typeof n[i] == "string") {
        let s = n[i + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
      } else {
        let s = r[n[i + 1]];
        n[i].call(s);
      }
  r !== null && (t[sn] = null);
  let o = t[fe];
  if (o !== null) {
    t[fe] = null;
    for (let i = 0; i < o.length; i++) {
      let s = o[i];
      s();
    }
  }
}
function Hd(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof vt)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            J(4, a, c);
            try {
              c.call(a);
            } finally {
              J(5, a, c);
            }
          }
        else {
          J(4, o, i);
          try {
            i.call(o);
          } finally {
            J(5, o, i);
          }
        }
      }
    }
}
function $d(e, t, n) {
  return Ud(e, t.parent, n);
}
function Ud(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[ge];
  {
    let { componentOffset: o } = r;
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o];
      if (i === ee.None || i === ee.Emulated) return null;
    }
    return ye(r, n);
  }
}
function Yr(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function tc(e, t, n) {
  e.appendChild(t, n);
}
function xs(e, t, n, r, o) {
  r !== null ? Yr(e, t, n, r, o) : tc(e, t, n);
}
function zd(e, t, n) {
  return Wd(e, t, n);
}
function Gd(e, t, n) {
  return e.type & 40 ? ye(e, n) : null;
}
function nc(e, t, n, r) {
  let o = $d(e, r, t),
    i = t[te],
    s = r.parent || t[me],
    a = zd(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) xs(i, o, n[c], a, !1);
    else xs(i, o, n, a, !1);
  Ns !== void 0 && Ns(i, r, t, n, o);
}
function qd(e, t) {
  if (t !== null) {
    let r = e[ae][me],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function Zd(e, t, n) {
  e.removeChild(null, t, n);
}
function xo(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      c = n.type;
    if (
      (s && t === 0 && (a && Qe(Ne(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) xo(e, t, n.child, r, o, i, !1), ze(t, e, o, a, i);
      else if (c & 32) {
        let u = Ja(n, r),
          l;
        for (; (l = u()); ) ze(t, e, o, l, i);
        ze(t, e, o, a, i);
      } else c & 16 ? Yd(e, t, r, n, o, i) : ze(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function No(e, t, n, r, o, i) {
  xo(n, r, e.firstChild, t, o, i, !1);
}
function Yd(e, t, n, r, o, i) {
  let s = n[ae],
    c = s[me].projection[r.projection];
  if (Array.isArray(c))
    for (let u = 0; u < c.length; u++) {
      let l = c[u];
      ze(t, e, o, l, i);
    }
  else {
    let u = c,
      l = s[q];
    wd(r) && (u.flags |= 128), xo(e, t, u, l, o, i, !0);
  }
}
function Qd(e, t, n, r, o) {
  let i = n[kr],
    s = Ne(n);
  i !== s && ze(t, e, r, i, o);
  for (let a = be; a < n.length; a++) {
    let c = n[a];
    No(c[E], c, e, t, r, i);
  }
}
function Kd(e, t, n) {
  e.setAttribute(t, "style", n);
}
function rc(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function oc(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && Nr(e, t, r),
    o !== null && rc(e, t, o),
    i !== null && Kd(e, t, i);
}
function ic(e = 1) {
  sc(Ct(), L(), Io() + e, !1);
}
function sc(e, t, n, r) {
  if (!r)
    if ((t[p] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && Jt(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && Xt(t, i, 0, n);
    }
  Te(n);
}
function Jd(e, t = m.Default) {
  let n = L();
  if (n === null) return M(e, t);
  let r = ue();
  return La(r, n, z(e), t);
}
function ac(e, t, n, r, o, i) {
  let s = I(null);
  try {
    let a = null;
    o & he.SignalBased && (a = t[r][ni]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & he.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, n, r) : aa(t, a, r, i);
  } finally {
    I(s);
  }
}
function Xd(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) Te(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          zl(s, i);
          let c = t[i];
          a(2, c);
        }
      }
    } finally {
      Te(-1);
    }
}
function Ao(e, t, n, r, o, i, s, a, c, u, l) {
  let d = t.blueprint.slice();
  return (
    (d[ge] = o),
    (d[p] = r | 4 | 128 | 8 | 64),
    (u !== null || (e && e[p] & 2048)) && (d[p] |= 2048),
    da(d),
    (d[q] = d[It] = e),
    (d[ie] = n),
    (d[se] = s || (e && e[se])),
    (d[te] = a || (e && e[te])),
    (d[Ze] = c || (e && e[Ze]) || null),
    (d[me] = i),
    (d[En] = bd()),
    (d[Pr] = l),
    (d[ra] = u),
    (d[ae] = t.type == 2 ? e[ae] : d),
    d
  );
}
function Oo(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = ef(e, t, n, r, o)), Ul() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = Vl();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Cn(i, !0), i;
}
function ef(e, t, n, r, o) {
  let i = ma(),
    s = ya(),
    a = s ? i : i && i.parent,
    c = (e.data[t] = cf(e, a, n, t, r, o));
  return (
    e.firstChild === null && (e.firstChild = c),
    i !== null &&
      (s
        ? i.child == null && c.parent !== null && (i.child = c)
        : i.next === null && ((i.next = c), (c.prev = i))),
    c
  );
}
function cc(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function uc(e, t, n, r, o) {
  let i = Io(),
    s = r & 2;
  try {
    Te(-1), s && t.length > Se && sc(e, t, Se, !1), J(s ? 2 : 0, o), n(r, o);
  } finally {
    Te(i), J(s ? 3 : 1, o);
  }
}
function lc(e, t, n) {
  if (ia(t)) {
    let r = I(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = n[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      I(r);
    }
  }
}
function tf(e, t, n) {
  ga() && (hf(e, t, n, ye(n, t)), (n.flags & 64) === 64 && pc(e, t, n));
}
function nf(e, t, n = ye) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function dc(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = fc(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id
      ))
    : t;
}
function fc(e, t, n, r, o, i, s, a, c, u, l) {
  let d = Se + r,
    g = d + o,
    f = rf(d, g),
    v = typeof u == "function" ? u() : u;
  return (f[E] = {
    type: e,
    blueprint: f,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: g,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: v,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function rf(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : Mn);
  return n;
}
function of(e, t, n, r) {
  let i = r.get(Ad, Ka) || n === ee.ShadowDom,
    s = e.selectRootElement(t, i);
  return sf(s), s;
}
function sf(e) {
  af(e);
}
function cf(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    kl() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function As(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let s = t[i];
    if (s === void 0) continue;
    r ??= {};
    let a,
      c = he.None;
    Array.isArray(s) ? ((a = s[0]), (c = s[1])) : (a = s);
    let u = i;
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue;
      u = o[i];
    }
    e === 0 ? Os(r, n, u, a, c) : Os(r, n, u, a);
  }
  return r;
}
function Os(e, t, n, r, o) {
  let i;
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o);
}
function uf(e, t, n) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    a = [],
    c = null,
    u = null;
  for (let l = r; l < o; l++) {
    let d = i[l],
      g = n ? n.get(d) : null,
      f = g ? g.inputs : null,
      v = g ? g.outputs : null;
    (c = As(0, d.inputs, l, c, f)), (u = As(1, d.outputs, l, u, v));
    let S = c !== null && s !== null && !fo(t) ? wf(c, l, s) : null;
    a.push(S);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (t.flags |= 8),
    c.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = c),
    (t.outputs = u);
}
function lf(e, t, n, r) {
  if (ga()) {
    let o = r === null ? null : { "": -1 },
      i = gf(e, n),
      s,
      a;
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && hc(e, t, n, s, o, a),
      o && mf(n, r, o);
  }
  n.mergedAttrs = lo(n.mergedAttrs, n.attrs);
}
function hc(e, t, n, r, o, i) {
  for (let u = 0; u < r.length; u++) od(Oa(n, t), e, r[u].type);
  vf(n, e.data.length, r.length);
  for (let u = 0; u < r.length; u++) {
    let l = r[u];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    c = cc(e, t, r.length, null);
  for (let u = 0; u < r.length; u++) {
    let l = r[u];
    (n.mergedAttrs = lo(n.mergedAttrs, l.hostAttrs)),
      Df(e, n, t, c, l),
      yf(c, l, o),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      c++;
  }
  uf(e, n, i);
}
function df(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    ff(s) != a && s.push(a), s.push(n, r, i);
  }
}
function ff(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function hf(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd;
  mo(n) && Ef(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || Oa(n, t),
    Qe(r, t);
  let s = n.initialInputs;
  for (let a = o; a < i; a++) {
    let c = e.data[a],
      u = Dt(t, e, a, n);
    if ((Qe(u, t), s !== null && If(t, a - o, u, c, n, s), wt(c))) {
      let l = tt(n.index, t);
      l[ie] = Dt(t, e, a, n);
    }
  }
}
function pc(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = Gl();
  try {
    Te(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        u = t[a];
      jr(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          pf(c, u);
    }
  } finally {
    Te(-1), jr(s);
  }
}
function pf(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function gf(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (el(t, s.selectors, !1))
        if ((r || (r = []), wt(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              r.unshift(...a, s);
            let c = a.length;
            Qr(e, t, c);
          } else r.unshift(s), Qr(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
    }
  return r === null ? null : [r, o];
}
function Qr(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function mf(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new D(-301, !1);
      r.push(t[o], i);
    }
  }
}
function yf(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    wt(t) && (n[""] = e);
  }
}
function vf(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function Df(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = ht(o.type, !0)),
    s = new vt(i, wt(o), Jd);
  (e.blueprint[r] = s), (n[r] = s), df(e, t, r, cc(e, n, o.hostVars, Mn), o);
}
function Ef(e, t, n) {
  let r = ye(t, e),
    o = dc(n),
    i = e[se].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = mc(
    e,
    Ao(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null)
  );
  e[t.index] = a;
}
function If(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        u = s[a++],
        l = s[a++],
        d = s[a++];
      ac(r, n, c, u, l, d);
    }
}
function wf(e, t, n) {
  let r = null,
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (i === 0) {
      o += 4;
      continue;
    } else if (i === 5) {
      o += 2;
      continue;
    }
    if (typeof i == "number") break;
    if (e.hasOwnProperty(i)) {
      r === null && (r = []);
      let s = e[i];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          r.push(i, s[a + 1], s[a + 2], n[o + 1]);
          break;
        }
    }
    o += 2;
  }
  return r;
}
function gc(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = I(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          Da(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      I(r);
    }
  }
}
function mc(e, t) {
  return e[mt] ? (e[gs][de] = t) : (e[mt] = t), (e[gs] = t), t;
}
function Kr(e, t, n) {
  Da(0);
  let r = I(null);
  try {
    t(e, n);
  } finally {
    I(r);
  }
}
function Cf(e) {
  return (e[sn] ??= []);
}
function bf(e) {
  return (e.cleanup ??= []);
}
function yc(e, t) {
  let n = e[Ze],
    r = n ? n.get(ce, null) : null;
  r && r.handleError(t);
}
function vc(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      a = n[i++],
      c = n[i++],
      u = t[s],
      l = e.data[s];
    ac(l, u, r, a, c, o);
  }
}
function Mf(e, t, n) {
  let r = Nl(t, e);
  Fd(e[te], r, n);
}
function _f(e, t) {
  let n = tt(t, e),
    r = n[E];
  Sf(r, n);
  let o = n[ge];
  o !== null && n[Pr] === null && (n[Pr] = So(o, n[Ze])), Dc(r, n, n[ie]);
}
function Sf(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Dc(e, t, n) {
  Do(t);
  try {
    let r = e.viewQuery;
    r !== null && Kr(1, r, n);
    let o = e.template;
    o !== null && uc(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[go]?.finishViewCreation(e),
      e.staticContentQueries && gc(e, t),
      e.staticViewQueries && Kr(2, e.viewQuery, n);
    let i = e.components;
    i !== null && Tf(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[p] &= -5), Eo();
  }
}
function Tf(e, t) {
  for (let n = 0; n < t.length; n++) _f(e, t[n]);
}
function hn(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    i !== null && r.push(Ne(i)), et(i) && xf(i, r);
    let s = n.type;
    if (s & 8) hn(e, t, n.child, r);
    else if (s & 32) {
      let a = Ja(n, t),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = qd(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = Ye(t[ae]);
        hn(c[E], c, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function xf(e, t) {
  for (let n = be; n < e.length; n++) {
    let r = e[n],
      o = r[E].firstChild;
    o !== null && hn(r[E], r, o, t);
  }
  e[kr] !== e[ge] && t.push(e[kr]);
}
function Nf(e) {
  return e[B] ?? Af(e);
}
function Af(e) {
  let t = Ec.pop() ?? Object.create(Rf);
  return (t.lView = e), t;
}
function Of(e) {
  e.lView[B] !== e && ((e.lView = null), Ec.push(e));
}
function Ff(e) {
  let t = e[B] ?? Object.create(Pf);
  return (t.lView = e), t;
}
function Ic(e) {
  return e.type !== 2;
}
function wc(e, t = !0, n = 0) {
  let r = e[se],
    o = r.rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    Lf(e, n);
  } catch (s) {
    throw (t && yc(e, s), s);
  } finally {
    i || (o.end?.(), r.inlineEffectRunner?.flush());
  }
}
function Lf(e, t) {
  let n = va();
  try {
    Ds(!0), Jr(e, t);
    let r = 0;
    for (; In(e); ) {
      if (r === kf) throw new D(103, !1);
      r++, Jr(e, 1);
    }
  } finally {
    Ds(n);
  }
}
function jf(e, t, n, r) {
  let o = t[p];
  if ((o & 256) === 256) return;
  let i = !1,
    s = !1;
  !i && t[se].inlineEffectRunner?.flush(), Do(t);
  let a = !0,
    c = null,
    u = null;
  i ||
    (Ic(e)
      ? ((u = Nf(t)), (c = jn(u)))
      : ri() === null
      ? ((a = !1), (u = Ff(t)), (c = jn(u)))
      : t[B] && (Bn(t[B]), (t[B] = null)));
  try {
    da(t), Hl(e.bindingStartIndex), n !== null && uc(e, t, n, 2, r);
    let l = (o & 3) === 3;
    if (!i)
      if (l) {
        let f = e.preOrderCheckHooks;
        f !== null && Jt(t, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && Xt(t, f, 0, null), Cr(t, 0);
      }
    if ((s || Vf(t), Cc(t, 0), e.contentQueries !== null && gc(e, t), !i))
      if (l) {
        let f = e.contentCheckHooks;
        f !== null && Jt(t, f);
      } else {
        let f = e.contentHooks;
        f !== null && Xt(t, f, 1), Cr(t, 1);
      }
    Xd(e, t);
    let d = e.components;
    d !== null && Mc(t, d, 0);
    let g = e.viewQuery;
    if ((g !== null && Kr(2, g, r), !i))
      if (l) {
        let f = e.viewCheckHooks;
        f !== null && Jt(t, f);
      } else {
        let f = e.viewHooks;
        f !== null && Xt(t, f, 2), Cr(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[wr])) {
      for (let f of t[wr]) f();
      t[wr] = null;
    }
    i || (t[p] &= -73);
  } catch (l) {
    throw (i || wn(t), l);
  } finally {
    u !== null && (oi(u, c), a && Of(u)), Eo();
  }
}
function Cc(e, t) {
  for (let n = qa(e); n !== null; n = Za(n))
    for (let r = be; r < n.length; r++) {
      let o = n[r];
      bc(o, t);
    }
}
function Vf(e) {
  for (let t = qa(e); t !== null; t = Za(t)) {
    if (!(t[p] & un.HasTransplantedViews)) continue;
    let n = t[cn];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      fa(o);
    }
  }
}
function Bf(e, t, n) {
  let r = tt(t, e);
  bc(r, n);
}
function bc(e, t) {
  vo(e) && Jr(e, t);
}
function Jr(e, t) {
  let r = e[E],
    o = e[p],
    i = e[B],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Vn(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[p] &= -9217),
    s)
  )
    jf(r, e, r.template, e[ie]);
  else if (o & 8192) {
    Cc(e, 1);
    let a = r.components;
    a !== null && Mc(e, a, 1);
  }
}
function Mc(e, t, n) {
  for (let r = 0; r < t.length; r++) Bf(e, t[r], n);
}
function Ro(e, t) {
  let n = va() ? 64 : 1088;
  for (e[se].changeDetectionScheduler?.notify(t); e; ) {
    e[p] |= n;
    let r = Ye(e);
    if (Lr(e) && !r) return e;
    e = r;
  }
  return null;
}
function Hf(e) {
  let t = Error(`No component factory found for ${W(e)}.`);
  return (t[$f] = e), t;
}
function to(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = os(o, a);
      else if (i == 2) {
        let c = a,
          u = t[++s];
        r = os(r, c + ": " + u + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
function Rs(e, t) {
  let n = [];
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue;
    let o = e[r];
    if (o === void 0) continue;
    let i = Array.isArray(o),
      s = i ? o[0] : o,
      a = i ? o[1] : he.None;
    t
      ? n.push({
          propName: s,
          templateName: r,
          isSignal: (a & he.SignalBased) !== 0,
        })
      : n.push({ propName: s, templateName: r });
  }
  return n;
}
function zf(e) {
  let t = e.toLowerCase();
  return t === "svg" ? Tl : t === "math" ? xl : null;
}
function Gf(e, t) {
  let n = e[E],
    r = Se;
  return (e[r] = t), Oo(n, r, 2, "#host", null);
}
function Wf(e, t, n, r, o, i, s) {
  let a = o[E];
  qf(r, e, t, s);
  let c = null;
  t !== null && (c = So(t, o[Ze]));
  let u = i.rendererFactory.createRenderer(t, n),
    l = 16;
  n.signals ? (l = 4096) : n.onPush && (l = 64);
  let d = Ao(o, dc(n), null, l, o[e.index], e, i, u, null, null, c);
  return (
    a.firstCreatePass && Qr(a, e, r.length - 1), mc(o, d), (o[e.index] = d)
  );
}
function qf(e, t, n, r) {
  for (let o of e) t.mergedAttrs = lo(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    (to(t, t.mergedAttrs, !0), n !== null && oc(r, n, t));
}
function Zf(e, t, n, r, o, i) {
  let s = ue(),
    a = o[E],
    c = ye(s, o);
  hc(a, o, s, n, null, r);
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      g = Dt(o, a, d, s);
    Qe(g, o);
  }
  pc(a, o, s), c && Qe(c, o);
  let u = Dt(o, a, s.directiveStart + s.componentOffset, s);
  if (((e[ie] = o[ie] = u), i !== null)) for (let l of i) l(u, t);
  return lc(a, s, o), u;
}
function Yf(e, t, n, r) {
  if (r) Nr(e, n, ["ng-version", "18.2.13"]);
  else {
    let { attrs: o, classes: i } = il(t.selectors[0]);
    o && Nr(e, n, o), i && i.length > 0 && rc(e, n, i.join(" "));
  }
}
function Qf(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null ? Array.from(i) : null);
  }
}
function Kf() {
  let e = ue();
  Ta(L()[E], e);
}
function Tc(e) {
  Fs.has(e) ||
    (Fs.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
function Jf(e, t, n = null) {
  return new gn({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
function Xf(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function eh(e) {
  return (e.flags & 32) === 32;
}
function nh(e, t, n, r) {
  return Xf(e, $l(), n) ? t + Us(n) + r : Mn;
}
function ks(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? "class" : "style";
  vc(e, n, i[s], s, r);
}
function rh(e, t, n, r, o, i) {
  let s = t.consts,
    a = ys(s, o),
    c = Oo(t, e, 2, r, a);
  return (
    lf(t, n, c, ys(s, i)),
    c.attrs !== null && to(c, c.attrs, !1),
    c.mergedAttrs !== null && to(c, c.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, c),
    c
  );
}
function _n(e, t, n, r) {
  let o = L(),
    i = Ct(),
    s = Se + e,
    a = o[te],
    c = i.firstCreatePass ? rh(s, i, o, t, n, r) : i.data[s],
    u = oh(i, o, c, a, t, e);
  o[s] = u;
  let l = sa(c);
  return (
    Cn(c, !0),
    oc(a, u, c),
    !eh(c) && _a() && nc(i, o, u, c),
    Rl() === 0 && Qe(u, o),
    Fl(),
    l && (tf(i, o, c), lc(i, c, o)),
    r !== null && nf(o, c),
    _n
  );
}
function Sn() {
  let e = ue();
  ya() ? Bl() : ((e = e.parent), Cn(e, !1));
  let t = e;
  Ll(t) && jl(), Pl();
  let n = Ct();
  return (
    n.firstCreatePass && (Ta(n, e), ia(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      Kl(t) &&
      ks(n, t, L(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Jl(t) &&
      ks(n, t, L(), t.stylesWithoutHost, !1),
    Sn
  );
}
function sh(e) {
  typeof e == "string" && (ih = e.toLowerCase().replace(/_/g, "-"));
}
function Po(e, t, n, r) {
  let o = L(),
    i = Ct(),
    s = ue();
  return uh(i, o, o[te], s, e, t, r), Po;
}
function ch(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[sn],
          c = o[i + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (i += 2);
    }
  return null;
}
function uh(e, t, n, r, o, i, s) {
  let a = sa(r),
    u = e.firstCreatePass && bf(e),
    l = t[ie],
    d = Cf(t),
    g = !0;
  if (r.type & 3 || s) {
    let S = ye(r, t),
      R = s ? s(S) : S,
      N = d.length,
      j = s ? (H) => s(Ne(H[r.index])) : r.index,
      ne = null;
    if ((!s && a && (ne = ch(e, t, o, r.index)), ne !== null)) {
      let H = ne.__ngLastListenerFn__ || ne;
      (H.__ngNextListenerFn__ = i), (ne.__ngLastListenerFn__ = i), (g = !1);
    } else {
      (i = js(r, t, l, i)), ah(S, o, i);
      let H = n.listen(R, o, i);
      d.push(i, H), u && u.push(o, j, N, N + 1);
    }
  } else i = js(r, t, l, i);
  let f = r.outputs,
    v;
  if (g && f !== null && (v = f[o])) {
    let S = v.length;
    if (S)
      for (let R = 0; R < S; R += 2) {
        let N = v[R],
          j = v[R + 1],
          Fe = t[N][j].subscribe(i),
          k = d.length;
        d.push(i, Fe), u && u.push(o, r.index, k, -(k + 1));
      }
  }
}
function Ls(e, t, n, r) {
  let o = I(null);
  try {
    return J(6, t, n), n(r) !== !1;
  } catch (i) {
    return yc(e, i), !1;
  } finally {
    J(7, t, n), I(o);
  }
}
function js(e, t, n, r) {
  return function o(i) {
    if (i === Function) return r;
    let s = e.componentOffset > -1 ? tt(e.index, t) : t;
    Ro(s, 5);
    let a = Ls(t, n, r, i),
      c = o.__ngNextListenerFn__;
    for (; c; ) (a = Ls(t, n, c, i) && a), (c = c.__ngNextListenerFn__);
    return a;
  };
}
function ko(e, t = "") {
  let n = L(),
    r = Ct(),
    o = e + Se,
    i = r.firstCreatePass ? Oo(r, o, 1, t, null) : r.data[o],
    s = lh(r, n, i, t, e);
  (n[o] = s), _a() && nc(r, n, s, i), Cn(i, !1);
}
function Lo(e) {
  return xc("", e, ""), Lo;
}
function xc(e, t, n) {
  let r = L(),
    o = nh(r, e, t, n);
  return o !== Mn && Mf(r, Io(), o), xc;
}
function Nc(e) {
  Tc("NgStandalone"),
    (e.getStandaloneInjector = (t) =>
      t.get(dh).getOrCreateStandaloneInjector(e));
}
function jo(e) {
  return !!e && typeof e.then == "function";
}
function Oc(e) {
  return !!e && typeof e.subscribe == "function";
}
function ph() {
  ii(() => {
    throw new D(600, !1);
  });
}
function gh(e) {
  return e.isBoundToModule;
}
function yh(e, t, n) {
  try {
    let r = n();
    return jo(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
function en(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function vh(e, t, n, r) {
  if (!n && !In(e)) return;
  wc(e, t, n && !r ? 0 : 1);
}
function Eh({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new T(oe(re({}, Ih()), { scheduleInRootZone: n }))),
    [
      { provide: T, useFactory: e },
      {
        provide: gt,
        multi: !0,
        useFactory: () => {
          let r = w(Dh, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: gt,
        multi: !0,
        useFactory: () => {
          let r = w(wh);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: _c, useValue: !0 } : [],
      { provide: Sc, useValue: n ?? Ba },
    ]
  );
}
function Ih(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
function bh() {
  return (typeof $localize < "u" && $localize.locale) || mn;
}
function Qt(e) {
  return !e.moduleRef;
}
function Mh(e) {
  let t = Qt(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(T);
  return n.run(() => {
    Qt(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(ce, null),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({
          next: (i) => {
            r.handleError(i);
          },
        });
      }),
      Qt(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(io);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(io);
      s.add(i),
        e.moduleRef.onDestroy(() => {
          en(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i);
        });
    }
    return yh(r, n, () => {
      let i = t.get(Rc);
      return (
        i.runInitializers(),
        i.donePromise.then(() => {
          let s = t.get(Vo, mn);
          if ((sh(s || mn), Qt(e))) {
            let a = t.get(Oe);
            return (
              e.rootComponent !== void 0 && a.bootstrap(e.rootComponent), a
            );
          } else return _h(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function _h(e, t) {
  let n = e.injector.get(Oe);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new D(-403, !1);
  t.push(e);
}
function Sh(e = [], t) {
  return xe.create({
    name: t,
    providers: [
      { provide: Dn, useValue: "platform" },
      { provide: io, useValue: new Set([() => (tn = null)]) },
      ...e,
    ],
  });
}
function Th(e = []) {
  if (tn) return tn;
  let t = Sh(e);
  return (tn = t), ph(), xh(t), t;
}
function xh(e) {
  e.get(Mo, null)?.forEach((n) => n());
}
function Nh(e) {
  return Ah(ue(), L(), (e & 16) === 16);
}
function Ah(e, t, n) {
  if (mo(e) && !n) {
    let r = tt(e.index, t);
    return new Et(r, r);
  } else if (e.type & 175) {
    let r = t[ae];
    return new Et(r, t);
  }
  return null;
}
function Fc(e) {
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = Th(r),
      i = [Eh({}), { provide: Ke, useExisting: Ch }, ...(n || [])],
      s = new gn({
        providers: i,
        parent: o,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return Mh({
      r3Injector: s.injector,
      platformInjector: o,
      rootComponent: t,
    });
  } catch (t) {
    return Promise.reject(t);
  }
}
var D,
  Tu,
  Bs,
  as,
  Hs,
  Au,
  b,
  Ou,
  Ru,
  Fu,
  cs,
  dt,
  us,
  m,
  Tr,
  Lu,
  ft,
  ju,
  nn,
  Vu,
  Bu,
  Hu,
  ls,
  Ge,
  pt,
  qe,
  gt,
  qs,
  Zs,
  rn,
  Ys,
  ee,
  he,
  Qs,
  hl,
  Dn,
  Kt,
  ml,
  Ir,
  _e,
  on,
  ge,
  E,
  p,
  q,
  de,
  me,
  Pr,
  sn,
  ie,
  Ze,
  se,
  te,
  mt,
  gs,
  It,
  ae,
  an,
  Ue,
  go,
  En,
  ra,
  fe,
  wr,
  B,
  Se,
  oa,
  kr,
  bl,
  cn,
  be,
  un,
  yt,
  ua,
  ms,
  J,
  Tl,
  xl,
  C,
  pa,
  ba,
  Ma,
  We,
  vt,
  br,
  Vr,
  $r,
  td,
  Na,
  Aa,
  nd,
  X,
  ln,
  xe,
  dd,
  fd,
  Ba,
  Ha,
  Ur,
  bn,
  zr,
  G,
  wo,
  fn,
  pd,
  T,
  gd,
  Wr,
  ce,
  Ed,
  Ga,
  Wa,
  Cd,
  Ts,
  Zr,
  bo,
  Sd,
  Mo,
  nt,
  _o,
  Td,
  xd,
  Nd,
  Ka,
  Ad,
  Ae,
  Od,
  Wd,
  Ns,
  Mn,
  af,
  Ec,
  Rf,
  Pf,
  kf,
  Et,
  Ly,
  Ke,
  Fo,
  _c,
  Sc,
  Xr,
  pn,
  $f,
  eo,
  pe,
  Je,
  Uf,
  no,
  ro,
  oo,
  Fs,
  Xe,
  gn,
  lt,
  th,
  Ps,
  oh,
  mn,
  ih,
  ah,
  lh,
  dh,
  Ac,
  fh,
  Rc,
  hh,
  mh,
  Oe,
  Dh,
  wh,
  Ch,
  Vo,
  io,
  tn,
  Bo,
  Re = h(() => {
    "use strict";
    si();
    Dr();
    Er();
    D = class extends Error {
      constructor(t, n) {
        super(so(t, n)), (this.code = t);
      }
    };
    Tu = _({ __forward_ref__: _ });
    (Bs = _({ ɵprov: _ })),
      (as = _({ ɵinj: _ })),
      (Hs = _({ ngInjectableDef: _ })),
      (Au = _({ ngInjectorDef: _ })),
      (b = class {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            typeof n == "number"
              ? (this.__NG_ELEMENT_ID__ = n)
              : n !== void 0 &&
                (this.ɵprov = x({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      });
    (Ou = _({ ɵcmp: _ })),
      (Ru = _({ ɵdir: _ })),
      (Fu = _({ ɵpipe: _ })),
      (cs = _({ ɵfac: _ })),
      (dt = _({ __NG_ELEMENT_ID__: _ })),
      (us = _({ __NG_ENV_ID__: _ }));
    m = (function (e) {
      return (
        (e[(e.Default = 0)] = "Default"),
        (e[(e.Host = 1)] = "Host"),
        (e[(e.Self = 2)] = "Self"),
        (e[(e.SkipSelf = 4)] = "SkipSelf"),
        (e[(e.Optional = 8)] = "Optional"),
        e
      );
    })(m || {});
    (Lu = {}),
      (ft = Lu),
      (ju = "__NG_DI_FLAG__"),
      (nn = "ngTempTokenPath"),
      (Vu = "ngTokenPath"),
      (Bu = /\n/gm),
      (Hu = "\u0275"),
      (ls = "__source");
    (pt = {}),
      (qe = []),
      (gt = new b("")),
      (qs = new b("", -1)),
      (Zs = new b("")),
      (rn = class {
        get(t, n = ft) {
          if (n === ft) {
            let r = new Error(`NullInjectorError: No provider for ${W(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }),
      (Ys = (function (e) {
        return (
          (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e
        );
      })(Ys || {})),
      (ee = (function (e) {
        return (
          (e[(e.Emulated = 0)] = "Emulated"),
          (e[(e.None = 2)] = "None"),
          (e[(e.ShadowDom = 3)] = "ShadowDom"),
          e
        );
      })(ee || {})),
      (he = (function (e) {
        return (
          (e[(e.None = 0)] = "None"),
          (e[(e.SignalBased = 1)] = "SignalBased"),
          (e[(e.HasDecoratorInputTransform = 2)] =
            "HasDecoratorInputTransform"),
          e
        );
      })(he || {}));
    Qs = "ng-template";
    hl = _({ provide: String, useValue: _ });
    (Dn = new b("")), (Kt = {}), (ml = {});
    (_e = class {}),
      (on = class extends _e {
        get destroyed() {
          return this._destroyed;
        }
        constructor(t, n, r, o) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            Fr(t, (s) => this.processProvider(s)),
            this.records.set(qs, $e(void 0, this)),
            o.has("environment") && this.records.set(_e, $e(void 0, this));
          let i = this.records.get(Dn);
          i != null && typeof i.value == "string" && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(Zs, qe, m.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          let t = I(null);
          try {
            for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
            let n = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (let r of n) r();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              I(t);
          }
        }
        onDestroy(t) {
          return (
            this.assertNotDestroyed(),
            this._onDestroyHooks.push(t),
            () => this.removeOnDestroy(t)
          );
        }
        runInContext(t) {
          this.assertNotDestroyed();
          let n = He(this),
            r = K(void 0),
            o;
          try {
            return t();
          } finally {
            He(n), K(r);
          }
        }
        get(t, n = ft, r = m.Default) {
          if ((this.assertNotDestroyed(), t.hasOwnProperty(us)))
            return t[us](this);
          r = yn(r);
          let o,
            i = He(this),
            s = K(void 0);
          try {
            if (!(r & m.SkipSelf)) {
              let c = this.records.get(t);
              if (c === void 0) {
                let u = wl(t) && ao(t);
                u && this.injectableDefInScope(u)
                  ? (c = $e(Rr(t), Kt))
                  : (c = null),
                  this.records.set(t, c);
              }
              if (c != null) return this.hydrate(t, c);
            }
            let a = r & m.Self ? po() : this.parent;
            return (n = r & m.Optional && n === ft ? null : n), a.get(t, n);
          } catch (a) {
            if (a.name === "NullInjectorError") {
              if (((a[nn] = a[nn] || []).unshift(W(t)), i)) throw a;
              return Gu(a, t, "R3InjectorError", this.source);
            } else throw a;
          } finally {
            K(s), He(i);
          }
        }
        resolveInjectorInitializers() {
          let t = I(null),
            n = He(this),
            r = K(void 0),
            o;
          try {
            let i = this.get(gt, qe, m.Self);
            for (let s of i) s();
          } finally {
            He(n), K(r), I(t);
          }
        }
        toString() {
          let t = [],
            n = this.records;
          for (let r of n.keys()) t.push(W(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new D(205, !1);
        }
        processProvider(t) {
          t = z(t);
          let n = Or(t) ? t : z(t && t.provide),
            r = vl(t);
          if (!Or(t) && t.multi === !0) {
            let o = this.records.get(n);
            o ||
              ((o = $e(void 0, Kt, !0)),
              (o.factory = () => xr(o.multi)),
              this.records.set(n, o)),
              (n = t),
              o.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          let r = I(null);
          try {
            return (
              n.value === Kt && ((n.value = ml), (n.value = n.factory())),
              typeof n.value == "object" &&
                n.value &&
                Il(n.value) &&
                this._ngOnDestroyHooks.add(n.value),
              n.value
            );
          } finally {
            I(r);
          }
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          let n = z(t.providedIn);
          return typeof n == "string"
            ? n === "any" || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
        removeOnDestroy(t) {
          let n = this._onDestroyHooks.indexOf(t);
          n !== -1 && this._onDestroyHooks.splice(n, 1);
        }
      });
    (ge = 0),
      (E = 1),
      (p = 2),
      (q = 3),
      (de = 4),
      (me = 5),
      (Pr = 6),
      (sn = 7),
      (ie = 8),
      (Ze = 9),
      (se = 10),
      (te = 11),
      (mt = 12),
      (gs = 13),
      (It = 14),
      (ae = 15),
      (an = 16),
      (Ue = 17),
      (go = 18),
      (En = 19),
      (ra = 20),
      (fe = 21),
      (wr = 22),
      (B = 23),
      (Se = 25),
      (oa = 1),
      (kr = 7),
      (bl = 8),
      (cn = 9),
      (be = 10),
      (un = (function (e) {
        return (
          (e[(e.None = 0)] = "None"),
          (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
          e
        );
      })(un || {}));
    yt = class {
      constructor(t, n, r) {
        (this.previousValue = t),
          (this.currentValue = n),
          (this.firstChange = r);
      }
      isFirstChange() {
        return this.firstChange;
      }
    };
    yo.ngInherit = !0;
    ua = "__ngSimpleChanges__";
    (ms = null),
      (J = function (e, t, n) {
        ms?.(e, t, n);
      }),
      (Tl = "svg"),
      (xl = "math");
    (C = {
      lFrame: wa(null),
      bindingsEnabled: !0,
      skipHydrationRootTNode: null,
    }),
      (pa = !1);
    ba = Ca;
    Ma = !0;
    (We = -1),
      (vt = class {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      });
    (br = {}),
      (Vr = class {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          r = yn(r);
          let o = this.injector.get(t, br, r);
          return o !== br || n === br ? o : this.parentInjector.get(t, n, r);
        }
      });
    $r = !0;
    (td = 256), (Na = td - 1), (Aa = 5), (nd = 0), (X = {});
    ln = class {
      constructor(t, n) {
        (this._tNode = t), (this._lView = n);
      }
      get(t, n, r) {
        return La(this._tNode, this._lView, t, yn(r), n);
      }
    };
    xe = class e {
      static {
        this.THROW_IF_NOT_FOUND = ft;
      }
      static {
        this.NULL = new rn();
      }
      static create(t, n) {
        if (Array.isArray(t)) return bs({ name: "" }, n, t, "");
        {
          let r = t.name ?? "";
          return bs({ name: r }, t.parent, t.providers, r);
        }
      }
      static {
        this.ɵprov = x({ token: e, providedIn: "any", factory: () => M(qs) });
      }
      static {
        this.__NG_ELEMENT_ID__ = -1;
      }
    };
    dd = new b("");
    dd.__NG_ELEMENT_ID__ = (e) => {
      let t = ue();
      if (t === null) throw new D(204, !1);
      if (t.type & 2) return t.value;
      if (e & m.Optional) return null;
      throw new D(204, !1);
    };
    fd = "ngOriginalError";
    (Ba = !0),
      (Ha = (() => {
        class e {
          static {
            this.__NG_ELEMENT_ID__ = hd;
          }
          static {
            this.__NG_ENV_ID__ = (n) => n;
          }
        }
        return e;
      })()),
      (Ur = class extends Ha {
        constructor(t) {
          super(), (this._lView = t);
        }
        onDestroy(t) {
          return ha(this._lView, t), () => Ol(this._lView, t);
        }
      });
    (bn = (() => {
      class e {
        constructor() {
          (this.taskId = 0),
            (this.pendingTasks = new Set()),
            (this.hasPendingTasks = new at(!1));
        }
        get _hasPendingTasks() {
          return this.hasPendingTasks.value;
        }
        add() {
          this._hasPendingTasks || this.hasPendingTasks.next(!0);
          let n = this.taskId++;
          return this.pendingTasks.add(n), n;
        }
        remove(n) {
          this.pendingTasks.delete(n),
            this.pendingTasks.size === 0 &&
              this._hasPendingTasks &&
              this.hasPendingTasks.next(!1);
        }
        ngOnDestroy() {
          this.pendingTasks.clear(),
            this._hasPendingTasks && this.hasPendingTasks.next(!1);
        }
        static {
          this.ɵprov = x({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          });
        }
      }
      return e;
    })()),
      (zr = class extends Q {
        constructor(t = !1) {
          super(),
            (this.destroyRef = void 0),
            (this.pendingTasks = void 0),
            (this.__isAsync = t),
            Cl() &&
              ((this.destroyRef = w(Ha, { optional: !0 }) ?? void 0),
              (this.pendingTasks = w(bn, { optional: !0 }) ?? void 0));
        }
        emit(t) {
          let n = I(null);
          try {
            super.next(t);
          } finally {
            I(n);
          }
        }
        subscribe(t, n, r) {
          let o = t,
            i = n || (() => null),
            s = r;
          if (t && typeof t == "object") {
            let c = t;
            (o = c.next?.bind(c)),
              (i = c.error?.bind(c)),
              (s = c.complete?.bind(c));
          }
          this.__isAsync &&
            ((i = this.wrapInTimeout(i)),
            o && (o = this.wrapInTimeout(o)),
            s && (s = this.wrapInTimeout(s)));
          let a = super.subscribe({ next: o, error: i, complete: s });
          return t instanceof O && t.add(a), a;
        }
        wrapInTimeout(t) {
          return (n) => {
            let r = this.pendingTasks?.add();
            setTimeout(() => {
              t(n), r !== void 0 && this.pendingTasks?.remove(r);
            });
          };
        }
      }),
      (G = zr);
    (wo = "isAngularZone"),
      (fn = wo + "_ID"),
      (pd = 0),
      (T = class e {
        constructor(t) {
          (this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new G(!1)),
            (this.onMicrotaskEmpty = new G(!1)),
            (this.onStable = new G(!1)),
            (this.onError = new G(!1));
          let {
            enableLongStackTrace: n = !1,
            shouldCoalesceEventChangeDetection: r = !1,
            shouldCoalesceRunChangeDetection: o = !1,
            scheduleInRootZone: i = Ba,
          } = t;
          if (typeof Zone > "u") throw new D(908, !1);
          Zone.assertZonePatched();
          let s = this;
          (s._nesting = 0),
            (s._outer = s._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
            n &&
              Zone.longStackTraceZoneSpec &&
              (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
            (s.shouldCoalesceEventChangeDetection = !o && r),
            (s.shouldCoalesceRunChangeDetection = o),
            (s.callbackScheduled = !1),
            (s.scheduleInRootZone = i),
            yd(s);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && Zone.current.get(wo) === !0;
        }
        static assertInAngularZone() {
          if (!e.isInAngularZone()) throw new D(909, !1);
        }
        static assertNotInAngularZone() {
          if (e.isInAngularZone()) throw new D(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          let i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, gd, dn, dn);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }),
      (gd = {});
    Wr = class {
      constructor() {
        (this.hasPendingMicrotasks = !1),
          (this.hasPendingMacrotasks = !1),
          (this.isStable = !0),
          (this.onUnstable = new G()),
          (this.onMicrotaskEmpty = new G()),
          (this.onStable = new G()),
          (this.onError = new G());
      }
      run(t, n, r) {
        return t.apply(n, r);
      }
      runGuarded(t, n, r) {
        return t.apply(n, r);
      }
      runOutsideAngular(t) {
        return t();
      }
      runTask(t, n, r, o) {
        return t.apply(n, r);
      }
    };
    (ce = class {
      constructor() {
        this._console = console;
      }
      handleError(t) {
        let n = this._findOriginalError(t);
        this._console.error("ERROR", t),
          n && this._console.error("ORIGINAL ERROR", n);
      }
      _findOriginalError(t) {
        let n = t && _r(t);
        for (; n && _r(n); ) n = _r(n);
        return n || null;
      }
    }),
      (Ed = new b("", {
        providedIn: "root",
        factory: () => {
          let e = w(T),
            t = w(ce);
          return (n) => e.runOutsideAngular(() => t.handleError(n));
        },
      }));
    Ga = (() => {
      class e {
        constructor(n) {
          this.nativeElement = n;
        }
        static {
          this.__NG_ELEMENT_ID__ = Id;
        }
      }
      return e;
    })();
    (Wa = new Map()), (Cd = 0);
    Ts = "__ngContext__";
    (bo = new b("", { providedIn: "root", factory: () => Sd })),
      (Sd = "ng"),
      (Mo = new b("")),
      (nt = new b("", { providedIn: "platform", factory: () => "unknown" })),
      (_o = new b("", {
        providedIn: "root",
        factory: () =>
          _d()
            .body?.querySelector("[ngCspNonce]")
            ?.getAttribute("ngCspNonce") || null,
      })),
      (Td = "h"),
      (xd = "b"),
      (Nd = () => null);
    (Ka = !1),
      (Ad = new b("", { providedIn: "root", factory: () => Ka })),
      (Ae = (function (e) {
        return (
          (e[(e.Important = 1)] = "Important"),
          (e[(e.DashCase = 2)] = "DashCase"),
          e
        );
      })(Ae || {}));
    Wd = Gd;
    Mn = {};
    af = () => null;
    Ec = [];
    Rf = oe(re({}, Ln), {
      consumerIsAlwaysLive: !0,
      consumerMarkedDirty: (e) => {
        wn(e.lView);
      },
      consumerOnSignalRead() {
        this.lView[B] = this;
      },
    });
    Pf = oe(re({}, Ln), {
      consumerIsAlwaysLive: !0,
      consumerMarkedDirty: (e) => {
        let t = Ye(e.lView);
        for (; t && !Ic(t[E]); ) t = Ye(t);
        t && fa(t);
      },
      consumerOnSignalRead() {
        this.lView[B] = this;
      },
    });
    kf = 100;
    (Et = class {
      get rootNodes() {
        let t = this._lView,
          n = t[E];
        return hn(n, t, n.firstChild, []);
      }
      constructor(t, n, r = !0) {
        (this._lView = t),
          (this._cdRefInjectingView = n),
          (this.notifyErrorHandler = r),
          (this._appRef = null),
          (this._attachedToViewContainer = !1);
      }
      get context() {
        return this._lView[ie];
      }
      set context(t) {
        this._lView[ie] = t;
      }
      get destroyed() {
        return (this._lView[p] & 256) === 256;
      }
      destroy() {
        if (this._appRef) this._appRef.detachView(this);
        else if (this._attachedToViewContainer) {
          let t = this._lView[q];
          if (et(t)) {
            let n = t[bl],
              r = n ? n.indexOf(this) : -1;
            r > -1 && (jd(t, r), Ws(n, r));
          }
          this._attachedToViewContainer = !1;
        }
        Vd(this._lView[E], this._lView);
      }
      onDestroy(t) {
        ha(this._lView, t);
      }
      markForCheck() {
        Ro(this._cdRefInjectingView || this._lView, 4);
      }
      detach() {
        this._lView[p] &= -129;
      }
      reattach() {
        vs(this._lView), (this._lView[p] |= 128);
      }
      detectChanges() {
        (this._lView[p] |= 1024), wc(this._lView, this.notifyErrorHandler);
      }
      checkNoChanges() {}
      attachToViewContainerRef() {
        if (this._appRef) throw new D(902, !1);
        this._attachedToViewContainer = !0;
      }
      detachFromAppRef() {
        this._appRef = null;
        let t = Lr(this._lView),
          n = this._lView[an];
        n !== null && !t && To(n, this._lView), ec(this._lView[E], this._lView);
      }
      attachToAppRef(t) {
        if (this._attachedToViewContainer) throw new D(902, !1);
        this._appRef = t;
        let n = Lr(this._lView),
          r = this._lView[an];
        r !== null && !n && Ld(r, this._lView), vs(this._lView);
      }
    }),
      (Ly = new RegExp(`^(\\d+)*(${xd}|${Td})*(.*)`)),
      (Ke = class {}),
      (Fo = new b("", { providedIn: "root", factory: () => !1 })),
      (_c = new b("")),
      (Sc = new b("")),
      (Xr = class {}),
      (pn = class {});
    ($f = "ngComponent"),
      (eo = class {
        resolveComponentFactory(t) {
          throw Hf(t);
        }
      }),
      (pe = class {
        static {
          this.NULL = new eo();
        }
      }),
      (Je = class {}),
      (Uf = (() => {
        class e {
          static {
            this.ɵprov = x({
              token: e,
              providedIn: "root",
              factory: () => null,
            });
          }
        }
        return e;
      })());
    no = class extends pe {
      constructor(t) {
        super(), (this.ngModule = t);
      }
      resolveComponentFactory(t) {
        let n = vn(t);
        return new ro(n, this.ngModule);
      }
    };
    (ro = class extends pn {
      get inputs() {
        let t = this.componentDef,
          n = t.inputTransforms,
          r = Rs(t.inputs, !0);
        if (n !== null)
          for (let o of r)
            n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
        return r;
      }
      get outputs() {
        return Rs(this.componentDef.outputs, !1);
      }
      constructor(t, n) {
        super(),
          (this.componentDef = t),
          (this.ngModule = n),
          (this.componentType = t.type),
          (this.selector = ol(t.selectors)),
          (this.ngContentSelectors = t.ngContentSelectors
            ? t.ngContentSelectors
            : []),
          (this.isBoundToModule = !!n);
      }
      create(t, n, r, o) {
        let i = I(null);
        try {
          o = o || this.ngModule;
          let s = o instanceof _e ? o : o?.injector;
          s &&
            this.componentDef.getStandaloneInjector !== null &&
            (s = this.componentDef.getStandaloneInjector(s) || s);
          let a = s ? new Vr(t, s) : t,
            c = a.get(Je, null);
          if (c === null) throw new D(407, !1);
          let u = a.get(Uf, null),
            l = a.get(Ke, null),
            d = {
              rendererFactory: c,
              sanitizer: u,
              inlineEffectRunner: null,
              changeDetectionScheduler: l,
            },
            g = c.createRenderer(null, this.componentDef),
            f = this.componentDef.selectors[0][0] || "div",
            v = r
              ? of(g, r, this.componentDef.encapsulation, a)
              : Xa(g, f, zf(f)),
            S = 512;
          this.componentDef.signals
            ? (S |= 4096)
            : this.componentDef.onPush || (S |= 16);
          let R = null;
          v !== null && (R = So(v, a, !0));
          let N = fc(0, null, null, 1, 0, null, null, null, null, null, null),
            j = Ao(null, N, null, S, null, null, d, g, a, null, R);
          Do(j);
          let ne,
            H,
            Fe = null;
          try {
            let k = this.componentDef,
              Pe,
              Rn = null;
            k.findHostDirectiveDefs
              ? ((Pe = []),
                (Rn = new Map()),
                k.findHostDirectiveDefs(k, Pe, Rn),
                Pe.push(k))
              : (Pe = [k]);
            let nu = Gf(j, v);
            (Fe = Wf(nu, v, k, Pe, j, d, g)),
              (H = Al(N, Se)),
              v && Yf(g, k, v, r),
              n !== void 0 && Qf(H, this.ngContentSelectors, n),
              (ne = Zf(Fe, k, Pe, Rn, j, [Kf])),
              Dc(N, j, null);
          } catch (k) {
            throw (Fe !== null && qr(Fe), qr(j), k);
          } finally {
            Eo();
          }
          return new oo(this.componentType, ne, za(H, j), j, H);
        } finally {
          I(i);
        }
      }
    }),
      (oo = class extends Xr {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.previousInputValues = null),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new Et(o, void 0, !1)),
            (this.componentType = t);
        }
        setInput(t, n) {
          let r = this._tNode.inputs,
            o;
          if (r !== null && (o = r[t])) {
            if (
              ((this.previousInputValues ??= new Map()),
              this.previousInputValues.has(t) &&
                Object.is(this.previousInputValues.get(t), n))
            )
              return;
            let i = this._rootLView;
            vc(i[E], i, o, t, n), this.previousInputValues.set(t, n);
            let s = tt(this._tNode.index, i);
            Ro(s, 1);
          }
        }
        get injector() {
          return new ln(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      });
    Fs = new Set();
    (Xe = class {}),
      (gn = class extends Xe {
        constructor(t) {
          super(),
            (this.componentFactoryResolver = new no(this)),
            (this.instance = null);
          let n = new on(
            [
              ...t.providers,
              { provide: Xe, useValue: this },
              { provide: pe, useValue: this.componentFactoryResolver },
            ],
            t.parent || po(),
            t.debugName,
            new Set(["environment"])
          );
          (this.injector = n),
            t.runEnvironmentInitializers && n.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(t) {
          this.injector.onDestroy(t);
        }
      });
    (lt = (function (e) {
      return (
        (e[(e.EarlyRead = 0)] = "EarlyRead"),
        (e[(e.Write = 1)] = "Write"),
        (e[(e.MixedReadWrite = 2)] = "MixedReadWrite"),
        (e[(e.Read = 3)] = "Read"),
        e
      );
    })(lt || {})),
      (th = (() => {
        class e {
          constructor() {
            this.impl = null;
          }
          execute() {
            this.impl?.execute();
          }
          static {
            this.ɵprov = x({
              token: e,
              providedIn: "root",
              factory: () => new e(),
            });
          }
        }
        return e;
      })()),
      (Ps = class e {
        constructor() {
          (this.ngZone = w(T)),
            (this.scheduler = w(Ke)),
            (this.errorHandler = w(ce, { optional: !0 })),
            (this.sequences = new Set()),
            (this.deferredRegistrations = new Set()),
            (this.executing = !1);
        }
        static {
          this.PHASES = [lt.EarlyRead, lt.Write, lt.MixedReadWrite, lt.Read];
        }
        execute() {
          this.executing = !0;
          for (let t of e.PHASES)
            for (let n of this.sequences)
              if (!(n.erroredOrDestroyed || !n.hooks[t]))
                try {
                  n.pipelinedValue = this.ngZone.runOutsideAngular(() =>
                    n.hooks[t](n.pipelinedValue)
                  );
                } catch (r) {
                  (n.erroredOrDestroyed = !0),
                    this.errorHandler?.handleError(r);
                }
          this.executing = !1;
          for (let t of this.sequences)
            t.afterRun(), t.once && (this.sequences.delete(t), t.destroy());
          for (let t of this.deferredRegistrations) this.sequences.add(t);
          this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
            this.deferredRegistrations.clear();
        }
        register(t) {
          this.executing
            ? this.deferredRegistrations.add(t)
            : (this.sequences.add(t), this.scheduler.notify(6));
        }
        unregister(t) {
          this.executing && this.sequences.has(t)
            ? ((t.erroredOrDestroyed = !0),
              (t.pipelinedValue = void 0),
              (t.once = !0))
            : (this.sequences.delete(t), this.deferredRegistrations.delete(t));
        }
        static {
          this.ɵprov = x({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          });
        }
      });
    (oh = (e, t, n, r, o, i) => (Sa(!0), Xa(r, o, ql()))),
      (mn = "en-US"),
      (ih = mn);
    ah = (e, t, n) => {};
    lh = (e, t, n, r, o) => (Sa(!0), Rd(t[te], r));
    dh = (() => {
      class e {
        constructor(n) {
          (this._injector = n), (this.cachedInjectors = new Map());
        }
        getOrCreateStandaloneInjector(n) {
          if (!n.standalone) return null;
          if (!this.cachedInjectors.has(n)) {
            let r = ea(!1, n.type),
              o =
                r.length > 0
                  ? Jf([r], this._injector, `Standalone[${n.type.name}]`)
                  : null;
            this.cachedInjectors.set(n, o);
          }
          return this.cachedInjectors.get(n);
        }
        ngOnDestroy() {
          try {
            for (let n of this.cachedInjectors.values())
              n !== null && n.destroy();
          } finally {
            this.cachedInjectors.clear();
          }
        }
        static {
          this.ɵprov = x({
            token: e,
            providedIn: "environment",
            factory: () => new e(M(_e)),
          });
        }
      }
      return e;
    })();
    Ac = new b("");
    (fh = new b("")),
      (Rc = (() => {
        class e {
          constructor() {
            (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((n, r) => {
                (this.resolve = n), (this.reject = r);
              })),
              (this.appInits = w(fh, { optional: !0 }) ?? []);
          }
          runInitializers() {
            if (this.initialized) return;
            let n = [];
            for (let o of this.appInits) {
              let i = o();
              if (jo(i)) n.push(i);
              else if (Oc(i)) {
                let s = new Promise((a, c) => {
                  i.subscribe({ complete: a, error: c });
                });
                n.push(s);
              }
            }
            let r = () => {
              (this.done = !0), this.resolve();
            };
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((o) => {
                this.reject(o);
              }),
              n.length === 0 && r(),
              (this.initialized = !0);
          }
          static {
            this.ɵfac = function (r) {
              return new (r || e)();
            };
          }
          static {
            this.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" });
          }
        }
        return e;
      })()),
      (hh = new b(""));
    mh = 10;
    Oe = (() => {
      class e {
        constructor() {
          (this._bootstrapListeners = []),
            (this._runningTick = !1),
            (this._destroyed = !1),
            (this._destroyListeners = []),
            (this._views = []),
            (this.internalErrorHandler = w(Ed)),
            (this.afterRenderManager = w(th)),
            (this.zonelessEnabled = w(Fo)),
            (this.dirtyFlags = 0),
            (this.deferredDirtyFlags = 0),
            (this.externalTestViews = new Set()),
            (this.beforeRender = new Q()),
            (this.afterTick = new Q()),
            (this.componentTypes = []),
            (this.components = []),
            (this.isStable = w(bn).hasPendingTasks.pipe(Ce((n) => !n))),
            (this._injector = w(_e));
        }
        get allViews() {
          return [...this.externalTestViews.keys(), ...this._views];
        }
        get destroyed() {
          return this._destroyed;
        }
        whenStable() {
          let n;
          return new Promise((r) => {
            n = this.isStable.subscribe({
              next: (o) => {
                o && r();
              },
            });
          }).finally(() => {
            n.unsubscribe();
          });
        }
        get injector() {
          return this._injector;
        }
        bootstrap(n, r) {
          let o = n instanceof pn;
          if (!this._injector.get(Rc).done) {
            let g = !o && cl(n),
              f = !1;
            throw new D(405, f);
          }
          let s;
          o ? (s = n) : (s = this._injector.get(pe).resolveComponentFactory(n)),
            this.componentTypes.push(s.componentType);
          let a = gh(s) ? void 0 : this._injector.get(Xe),
            c = r || s.selector,
            u = s.create(xe.NULL, [], c, a),
            l = u.location.nativeElement,
            d = u.injector.get(Ac, null);
          return (
            d?.registerApplication(l),
            u.onDestroy(() => {
              this.detachView(u.hostView),
                en(this.components, u),
                d?.unregisterApplication(l);
            }),
            this._loadComponent(u),
            u
          );
        }
        tick() {
          this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
        }
        _tick() {
          if (this._runningTick) throw new D(101, !1);
          let n = I(null);
          try {
            (this._runningTick = !0), this.synchronize();
          } catch (r) {
            this.internalErrorHandler(r);
          } finally {
            (this._runningTick = !1), I(n), this.afterTick.next();
          }
        }
        synchronize() {
          let n = null;
          this._injector.destroyed ||
            (n = this._injector.get(Je, null, { optional: !0 })),
            (this.dirtyFlags |= this.deferredDirtyFlags),
            (this.deferredDirtyFlags = 0);
          let r = 0;
          for (; this.dirtyFlags !== 0 && r++ < mh; ) this.synchronizeOnce(n);
        }
        synchronizeOnce(n) {
          if (
            ((this.dirtyFlags |= this.deferredDirtyFlags),
            (this.deferredDirtyFlags = 0),
            this.dirtyFlags & 7)
          ) {
            let r = !!(this.dirtyFlags & 1);
            (this.dirtyFlags &= -8),
              (this.dirtyFlags |= 8),
              this.beforeRender.next(r);
            for (let { _lView: o, notifyErrorHandler: i } of this._views)
              vh(o, i, r, this.zonelessEnabled);
            if (
              ((this.dirtyFlags &= -5),
              this.syncDirtyFlagsWithViews(),
              this.dirtyFlags & 7)
            )
              return;
          } else n?.begin?.(), n?.end?.();
          this.dirtyFlags & 8 &&
            ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
            this.syncDirtyFlagsWithViews();
        }
        syncDirtyFlagsWithViews() {
          if (this.allViews.some(({ _lView: n }) => In(n))) {
            this.dirtyFlags |= 2;
            return;
          } else this.dirtyFlags &= -8;
        }
        attachView(n) {
          let r = n;
          this._views.push(r), r.attachToAppRef(this);
        }
        detachView(n) {
          let r = n;
          en(this._views, r), r.detachFromAppRef();
        }
        _loadComponent(n) {
          this.attachView(n.hostView), this.tick(), this.components.push(n);
          let r = this._injector.get(hh, []);
          [...this._bootstrapListeners, ...r].forEach((o) => o(n));
        }
        ngOnDestroy() {
          if (!this._destroyed)
            try {
              this._destroyListeners.forEach((n) => n()),
                this._views.slice().forEach((n) => n.destroy());
            } finally {
              (this._destroyed = !0),
                (this._views = []),
                (this._bootstrapListeners = []),
                (this._destroyListeners = []);
            }
        }
        onDestroy(n) {
          return (
            this._destroyListeners.push(n), () => en(this._destroyListeners, n)
          );
        }
        destroy() {
          if (this._destroyed) throw new D(406, !1);
          let n = this._injector;
          n.destroy && !n.destroyed && n.destroy();
        }
        get viewCount() {
          return this._views.length;
        }
        warnIfDestroyed() {}
        static {
          this.ɵfac = function (r) {
            return new (r || e)();
          };
        }
        static {
          this.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
      }
      return e;
    })();
    Dh = (() => {
      class e {
        constructor() {
          (this.zone = w(T)),
            (this.changeDetectionScheduler = w(Ke)),
            (this.applicationRef = w(Oe));
        }
        initialize() {
          this._onMicrotaskEmptySubscription ||
            (this._onMicrotaskEmptySubscription =
              this.zone.onMicrotaskEmpty.subscribe({
                next: () => {
                  this.changeDetectionScheduler.runningTick ||
                    this.zone.run(() => {
                      this.applicationRef.tick();
                    });
                },
              }));
        }
        ngOnDestroy() {
          this._onMicrotaskEmptySubscription?.unsubscribe();
        }
        static {
          this.ɵfac = function (r) {
            return new (r || e)();
          };
        }
        static {
          this.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
      }
      return e;
    })();
    (wh = (() => {
      class e {
        constructor() {
          (this.subscription = new O()),
            (this.initialized = !1),
            (this.zone = w(T)),
            (this.pendingTasks = w(bn));
        }
        initialize() {
          if (this.initialized) return;
          this.initialized = !0;
          let n = null;
          !this.zone.isStable &&
            !this.zone.hasPendingMacrotasks &&
            !this.zone.hasPendingMicrotasks &&
            (n = this.pendingTasks.add()),
            this.zone.runOutsideAngular(() => {
              this.subscription.add(
                this.zone.onStable.subscribe(() => {
                  T.assertNotInAngularZone(),
                    queueMicrotask(() => {
                      n !== null &&
                        !this.zone.hasPendingMacrotasks &&
                        !this.zone.hasPendingMicrotasks &&
                        (this.pendingTasks.remove(n), (n = null));
                    });
                })
              );
            }),
            this.subscription.add(
              this.zone.onUnstable.subscribe(() => {
                T.assertInAngularZone(), (n ??= this.pendingTasks.add());
              })
            );
        }
        ngOnDestroy() {
          this.subscription.unsubscribe();
        }
        static {
          this.ɵfac = function (r) {
            return new (r || e)();
          };
        }
        static {
          this.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" });
        }
      }
      return e;
    })()),
      (Ch = (() => {
        class e {
          constructor() {
            (this.appRef = w(Oe)),
              (this.taskService = w(bn)),
              (this.ngZone = w(T)),
              (this.zonelessEnabled = w(Fo)),
              (this.disableScheduling = w(_c, { optional: !0 }) ?? !1),
              (this.zoneIsDefined = typeof Zone < "u" && !!Zone.root.run),
              (this.schedulerTickApplyArgs = [
                { data: { __scheduler_tick__: !0 } },
              ]),
              (this.subscriptions = new O()),
              (this.angularZoneId = this.zoneIsDefined
                ? this.ngZone._inner?.get(fn)
                : null),
              (this.scheduleInRootZone =
                !this.zonelessEnabled &&
                this.zoneIsDefined &&
                (w(Sc, { optional: !0 }) ?? !1)),
              (this.cancelScheduledCallback = null),
              (this.useMicrotaskScheduler = !1),
              (this.runningTick = !1),
              (this.pendingRenderTaskId = null),
              this.subscriptions.add(
                this.appRef.afterTick.subscribe(() => {
                  this.runningTick || this.cleanup();
                })
              ),
              this.subscriptions.add(
                this.ngZone.onUnstable.subscribe(() => {
                  this.runningTick || this.cleanup();
                })
              ),
              (this.disableScheduling ||=
                !this.zonelessEnabled &&
                (this.ngZone instanceof Wr || !this.zoneIsDefined));
          }
          notify(n) {
            if (!this.zonelessEnabled && n === 5) return;
            switch (n) {
              case 0: {
                this.appRef.dirtyFlags |= 2;
                break;
              }
              case 3:
              case 2:
              case 4:
              case 5:
              case 1: {
                this.appRef.dirtyFlags |= 4;
                break;
              }
              case 7: {
                this.appRef.deferredDirtyFlags |= 8;
                break;
              }
              case 9:
              case 8:
              case 6:
              case 10:
              default:
                this.appRef.dirtyFlags |= 8;
            }
            if (!this.shouldScheduleTick()) return;
            let r = this.useMicrotaskScheduler ? Ms : $a;
            (this.pendingRenderTaskId = this.taskService.add()),
              this.scheduleInRootZone
                ? (this.cancelScheduledCallback = Zone.root.run(() =>
                    r(() => this.tick())
                  ))
                : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(
                    () => r(() => this.tick())
                  ));
          }
          shouldScheduleTick() {
            return !(
              this.disableScheduling ||
              this.pendingRenderTaskId !== null ||
              this.runningTick ||
              this.appRef._runningTick ||
              (!this.zonelessEnabled &&
                this.zoneIsDefined &&
                Zone.current.get(fn + this.angularZoneId))
            );
          }
          tick() {
            if (this.runningTick || this.appRef.destroyed) return;
            !this.zonelessEnabled &&
              this.appRef.dirtyFlags & 7 &&
              (this.appRef.dirtyFlags |= 1);
            let n = this.taskService.add();
            try {
              this.ngZone.run(
                () => {
                  (this.runningTick = !0), this.appRef._tick();
                },
                void 0,
                this.schedulerTickApplyArgs
              );
            } catch (r) {
              throw (this.taskService.remove(n), r);
            } finally {
              this.cleanup();
            }
            (this.useMicrotaskScheduler = !0),
              Ms(() => {
                (this.useMicrotaskScheduler = !1), this.taskService.remove(n);
              });
          }
          ngOnDestroy() {
            this.subscriptions.unsubscribe(), this.cleanup();
          }
          cleanup() {
            if (
              ((this.runningTick = !1),
              this.cancelScheduledCallback?.(),
              (this.cancelScheduledCallback = null),
              this.pendingRenderTaskId !== null)
            ) {
              let n = this.pendingRenderTaskId;
              (this.pendingRenderTaskId = null), this.taskService.remove(n);
            }
          }
          static {
            this.ɵfac = function (r) {
              return new (r || e)();
            };
          }
          static {
            this.ɵprov = x({ token: e, factory: e.ɵfac, providedIn: "root" });
          }
        }
        return e;
      })());
    (Vo = new b("", {
      providedIn: "root",
      factory: () => w(Vo, m.Optional | m.SkipSelf) || bh(),
    })),
      (io = new b(""));
    tn = null;
    Bo = (() => {
      class e {
        static {
          this.__NG_ELEMENT_ID__ = Nh;
        }
      }
      return e;
    })();
  });
function Oh(e) {
  return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
}
function Rh(e) {
  return !!e && e.nodeType === Node.ELEMENT_NODE;
}
function Fh(e) {
  return typeof e == "function";
}
function Ph(e, t) {
  if (!Ho) {
    let n = Element.prototype;
    Ho =
      n.matches ||
      n.matchesSelector ||
      n.mozMatchesSelector ||
      n.msMatchesSelector ||
      n.oMatchesSelector ||
      n.webkitMatchesSelector;
  }
  return e.nodeType === Node.ELEMENT_NODE ? Ho.call(e, t) : !1;
}
function kh(e, t) {
  return e === t || (e !== e && t !== t);
}
function Lh(e) {
  let t = {};
  return (
    e.forEach(({ propName: n, templateName: r, transform: o }) => {
      t[Oh(r)] = [n, o];
    }),
    t
  );
}
function jh(e, t) {
  return t.get(pe).resolveComponentFactory(e).inputs;
}
function Vh(e, t) {
  let n = e.childNodes,
    r = t.map(() => []),
    o = -1;
  t.some((i, s) => (i === "*" ? ((o = s), !0) : !1));
  for (let i = 0, s = n.length; i < s; ++i) {
    let a = n[i],
      c = Bh(a, t, o);
    c !== -1 && r[c].push(a);
  }
  return r;
}
function Bh(e, t, n) {
  let r = n;
  return (
    Rh(e) && t.some((o, i) => (o !== "*" && Ph(e, o) ? ((r = i), !0) : !1)), r
  );
}
function Lc(e, t) {
  let n = jh(e, t.injector),
    r = t.strategyFactory || new $o(e, t.injector),
    o = Lh(n);
  class i extends zo {
    static {
      this.observedAttributes = Object.keys(o);
    }
    get ngElementStrategy() {
      if (!this._ngElementStrategy) {
        let a = (this._ngElementStrategy = r.create(
          this.injector || t.injector
        ));
        n.forEach(({ propName: c, transform: u }) => {
          if (!this.hasOwnProperty(c)) return;
          let l = this[c];
          delete this[c], a.setInputValue(c, l, u);
        });
      }
      return this._ngElementStrategy;
    }
    constructor(a) {
      super(), (this.injector = a);
    }
    attributeChangedCallback(a, c, u, l) {
      let [d, g] = o[a];
      this.ngElementStrategy.setInputValue(d, u, g);
    }
    connectedCallback() {
      let a = !1;
      this.ngElementStrategy.events && (this.subscribeToEvents(), (a = !0)),
        this.ngElementStrategy.connect(this),
        a || this.subscribeToEvents();
    }
    disconnectedCallback() {
      this._ngElementStrategy && this._ngElementStrategy.disconnect(),
        this.ngElementEventsSubscription &&
          (this.ngElementEventsSubscription.unsubscribe(),
          (this.ngElementEventsSubscription = null));
    }
    subscribeToEvents() {
      this.ngElementEventsSubscription =
        this.ngElementStrategy.events.subscribe((a) => {
          let c = new CustomEvent(a.name, { detail: a.value });
          this.dispatchEvent(c);
        });
    }
  }
  return (
    n.forEach(({ propName: s, transform: a }) => {
      Object.defineProperty(i.prototype, s, {
        get() {
          return this.ngElementStrategy.getInputValue(s);
        },
        set(c) {
          this.ngElementStrategy.setInputValue(s, c, a);
        },
        configurable: !0,
        enumerable: !0,
      });
    }),
    i
  );
}
var Tn,
  Ho,
  Hh,
  $o,
  Uo,
  zo,
  jc = h(() => {
    "use strict";
    Re();
    Dr();
    Er();
    Tn = {
      schedule(e, t) {
        let n = setTimeout(e, t);
        return () => clearTimeout(n);
      },
      scheduleBeforeRender(e) {
        if (typeof window > "u") return Tn.schedule(e, 0);
        if (typeof window.requestAnimationFrame > "u")
          return Tn.schedule(e, 16);
        let t = window.requestAnimationFrame(e);
        return () => window.cancelAnimationFrame(t);
      },
    };
    (Hh = 10),
      ($o = class {
        constructor(t, n) {
          this.componentFactory = n.get(pe).resolveComponentFactory(t);
        }
        create(t) {
          return new Uo(this.componentFactory, t);
        }
      }),
      (Uo = class {
        constructor(t, n) {
          (this.componentFactory = t),
            (this.injector = n),
            (this.eventEmitters = new ct(1)),
            (this.events = this.eventEmitters.pipe(vr((r) => yr(...r)))),
            (this.componentRef = null),
            (this.viewChangeDetectorRef = null),
            (this.inputChanges = null),
            (this.hasInputChanges = !1),
            (this.implementsOnChanges = !1),
            (this.scheduledChangeDetectionFn = null),
            (this.scheduledDestroyFn = null),
            (this.initialInputValues = new Map()),
            (this.unchangedInputs = new Set(
              this.componentFactory.inputs.map(({ propName: r }) => r)
            )),
            (this.ngZone = this.injector.get(T)),
            (this.elementZone =
              typeof Zone > "u" ? null : this.ngZone.run(() => Zone.current));
        }
        connect(t) {
          this.runInZone(() => {
            if (this.scheduledDestroyFn !== null) {
              this.scheduledDestroyFn(), (this.scheduledDestroyFn = null);
              return;
            }
            this.componentRef === null && this.initializeComponent(t);
          });
        }
        disconnect() {
          this.runInZone(() => {
            this.componentRef === null ||
              this.scheduledDestroyFn !== null ||
              (this.scheduledDestroyFn = Tn.schedule(() => {
                this.componentRef !== null &&
                  (this.componentRef.destroy(),
                  (this.componentRef = null),
                  (this.viewChangeDetectorRef = null));
              }, Hh));
          });
        }
        getInputValue(t) {
          return this.runInZone(() =>
            this.componentRef === null
              ? this.initialInputValues.get(t)
              : this.componentRef.instance[t]
          );
        }
        setInputValue(t, n, r) {
          this.runInZone(() => {
            if (
              (r && (n = r.call(this.componentRef?.instance, n)),
              this.componentRef === null)
            ) {
              this.initialInputValues.set(t, n);
              return;
            }
            (kh(n, this.getInputValue(t)) &&
              !(n === void 0 && this.unchangedInputs.has(t))) ||
              (this.recordInputChange(t, n),
              this.unchangedInputs.delete(t),
              (this.hasInputChanges = !0),
              (this.componentRef.instance[t] = n),
              this.scheduleDetectChanges());
          });
        }
        initializeComponent(t) {
          let n = xe.create({ providers: [], parent: this.injector }),
            r = Vh(t, this.componentFactory.ngContentSelectors);
          (this.componentRef = this.componentFactory.create(n, r, t)),
            (this.viewChangeDetectorRef = this.componentRef.injector.get(Bo)),
            (this.implementsOnChanges = Fh(
              this.componentRef.instance.ngOnChanges
            )),
            this.initializeInputs(),
            this.initializeOutputs(this.componentRef),
            this.detectChanges(),
            this.injector.get(Oe).attachView(this.componentRef.hostView);
        }
        initializeInputs() {
          this.componentFactory.inputs.forEach(
            ({ propName: t, transform: n }) => {
              this.initialInputValues.has(t) &&
                this.setInputValue(t, this.initialInputValues.get(t), n);
            }
          ),
            this.initialInputValues.clear();
        }
        initializeOutputs(t) {
          let n = this.componentFactory.outputs.map(
            ({ propName: r, templateName: o }) =>
              t.instance[r].pipe(Ce((s) => ({ name: o, value: s })))
          );
          this.eventEmitters.next(n);
        }
        callNgOnChanges(t) {
          if (!this.implementsOnChanges || this.inputChanges === null) return;
          let n = this.inputChanges;
          (this.inputChanges = null), t.instance.ngOnChanges(n);
        }
        markViewForCheck(t) {
          this.hasInputChanges &&
            ((this.hasInputChanges = !1), t.markForCheck());
        }
        scheduleDetectChanges() {
          this.scheduledChangeDetectionFn ||
            (this.scheduledChangeDetectionFn = Tn.scheduleBeforeRender(() => {
              (this.scheduledChangeDetectionFn = null), this.detectChanges();
            }));
        }
        recordInputChange(t, n) {
          if (!this.implementsOnChanges) return;
          this.inputChanges === null && (this.inputChanges = {});
          let r = this.inputChanges[t];
          if (r) {
            r.currentValue = n;
            return;
          }
          let o = this.unchangedInputs.has(t),
            i = o ? void 0 : this.getInputValue(t);
          this.inputChanges[t] = new yt(i, n, o);
        }
        detectChanges() {
          this.componentRef !== null &&
            (this.callNgOnChanges(this.componentRef),
            this.markViewForCheck(this.viewChangeDetectorRef),
            this.componentRef.changeDetectorRef.detectChanges());
        }
        runInZone(t) {
          return this.elementZone && Zone.current !== this.elementZone
            ? this.ngZone.run(t)
            : t();
        }
      }),
      (zo = class extends HTMLElement {
        constructor() {
          super(...arguments), (this.ngElementEventsSubscription = null);
        }
      });
  });
function Go() {
  return Vc;
}
function Bc(e) {
  Vc ??= e;
}
function Hc(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(";")) {
    let r = n.indexOf("="),
      [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
function Wo(e) {
  return e === Uh;
}
var Vc,
  xn,
  ve,
  $c,
  Uh,
  Nn,
  Uc = h(() => {
    "use strict";
    Re();
    Vc = null;
    (xn = class {}), (ve = new b(""));
    ($c = "browser"), (Uh = "server");
    Nn = class {};
  });
function Gh() {
  return (
    (bt = bt || document.querySelector("base")),
    bt ? bt.getAttribute("href") : null
  );
}
function Wh(e) {
  return new URL(e, document.baseURI).pathname;
}
function Jh(e) {
  return Yh.replace(Xo, e);
}
function Xh(e) {
  return Zh.replace(Xo, e);
}
function Qc(e, t) {
  return t.map((n) => n.replace(Xo, e));
}
function Gc(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
function Kc(e) {
  return Fc(op(e));
}
function op(e) {
  return {
    appProviders: [...up, ...(e?.providers ?? [])],
    platformProviders: cp,
  };
}
function ip() {
  Qo.makeCurrent();
}
function sp() {
  return new ce();
}
function ap() {
  return Qa(document), document;
}
var Yo,
  Qo,
  bt,
  qh,
  Ko,
  qc,
  An,
  qo,
  Zc,
  Zo,
  Xo,
  Yc,
  Zh,
  Yh,
  Qh,
  Kh,
  zc,
  Mt,
  Jo,
  _t,
  On,
  ep,
  Wc,
  tp,
  np,
  rp,
  cp,
  up,
  Jc = h(() => {
    "use strict";
    Uc();
    Re();
    Re();
    (Yo = class extends xn {
      constructor() {
        super(...arguments), (this.supportsDOMEvents = !0);
      }
    }),
      (Qo = class e extends Yo {
        static makeCurrent() {
          Bc(new e());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r),
            () => {
              t.removeEventListener(n, r);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.remove();
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()), n.createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return n === "window"
            ? window
            : n === "document"
            ? t
            : n === "body"
            ? t.body
            : null;
        }
        getBaseHref(t) {
          let n = Gh();
          return n == null ? null : Wh(n);
        }
        resetBaseElement() {
          bt = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return Hc(document.cookie, t);
        }
      }),
      (bt = null);
    (qh = (() => {
      class e {
        build() {
          return new XMLHttpRequest();
        }
        static {
          this.ɵfac = function (r) {
            return new (r || e)();
          };
        }
        static {
          this.ɵprov = x({ token: e, factory: e.ɵfac });
        }
      }
      return e;
    })()),
      (Ko = new b("")),
      (qc = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => {
                o.manager = this;
              }),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            let r = this._eventNameToPlugin.get(n);
            if (r) return r;
            if (((r = this._plugins.find((i) => i.supports(n))), !r))
              throw new D(5101, !1);
            return this._eventNameToPlugin.set(n, r), r;
          }
          static {
            this.ɵfac = function (r) {
              return new (r || e)(M(Ko), M(T));
            };
          }
          static {
            this.ɵprov = x({ token: e, factory: e.ɵfac });
          }
        }
        return e;
      })()),
      (An = class {
        constructor(t) {
          this._doc = t;
        }
      }),
      (qo = "ng-app-id"),
      (Zc = (() => {
        class e {
          constructor(n, r, o, i = {}) {
            (this.doc = n),
              (this.appId = r),
              (this.nonce = o),
              (this.platformId = i),
              (this.styleRef = new Map()),
              (this.hostNodes = new Set()),
              (this.styleNodesInDOM = this.collectServerRenderedStyles()),
              (this.platformIsServer = Wo(i)),
              this.resetHostNodes();
          }
          addStyles(n) {
            for (let r of n)
              this.changeUsageCount(r, 1) === 1 && this.onStyleAdded(r);
          }
          removeStyles(n) {
            for (let r of n)
              this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
          }
          ngOnDestroy() {
            let n = this.styleNodesInDOM;
            n && (n.forEach((r) => r.remove()), n.clear());
            for (let r of this.getAllStyles()) this.onStyleRemoved(r);
            this.resetHostNodes();
          }
          addHost(n) {
            this.hostNodes.add(n);
            for (let r of this.getAllStyles()) this.addStyleToHost(n, r);
          }
          removeHost(n) {
            this.hostNodes.delete(n);
          }
          getAllStyles() {
            return this.styleRef.keys();
          }
          onStyleAdded(n) {
            for (let r of this.hostNodes) this.addStyleToHost(r, n);
          }
          onStyleRemoved(n) {
            let r = this.styleRef;
            r.get(n)?.elements?.forEach((o) => o.remove()), r.delete(n);
          }
          collectServerRenderedStyles() {
            let n = this.doc.head?.querySelectorAll(
              `style[${qo}="${this.appId}"]`
            );
            if (n?.length) {
              let r = new Map();
              return (
                n.forEach((o) => {
                  o.textContent != null && r.set(o.textContent, o);
                }),
                r
              );
            }
            return null;
          }
          changeUsageCount(n, r) {
            let o = this.styleRef;
            if (o.has(n)) {
              let i = o.get(n);
              return (i.usage += r), i.usage;
            }
            return o.set(n, { usage: r, elements: [] }), r;
          }
          getStyleElement(n, r) {
            let o = this.styleNodesInDOM,
              i = o?.get(r);
            if (i?.parentNode === n)
              return o.delete(r), i.removeAttribute(qo), i;
            {
              let s = this.doc.createElement("style");
              return (
                this.nonce && s.setAttribute("nonce", this.nonce),
                (s.textContent = r),
                this.platformIsServer && s.setAttribute(qo, this.appId),
                n.appendChild(s),
                s
              );
            }
          }
          addStyleToHost(n, r) {
            let o = this.getStyleElement(n, r),
              i = this.styleRef,
              s = i.get(r)?.elements;
            s ? s.push(o) : i.set(r, { elements: [o], usage: 1 });
          }
          resetHostNodes() {
            let n = this.hostNodes;
            n.clear(), n.add(this.doc.head);
          }
          static {
            this.ɵfac = function (r) {
              return new (r || e)(M(ve), M(bo), M(_o, 8), M(nt));
            };
          }
          static {
            this.ɵprov = x({ token: e, factory: e.ɵfac });
          }
        }
        return e;
      })()),
      (Zo = {
        svg: "http://www.w3.org/2000/svg",
        xhtml: "http://www.w3.org/1999/xhtml",
        xlink: "http://www.w3.org/1999/xlink",
        xml: "http://www.w3.org/XML/1998/namespace",
        xmlns: "http://www.w3.org/2000/xmlns/",
        math: "http://www.w3.org/1998/Math/MathML",
      }),
      (Xo = /%COMP%/g),
      (Yc = "%COMP%"),
      (Zh = `_nghost-${Yc}`),
      (Yh = `_ngcontent-${Yc}`),
      (Qh = !0),
      (Kh = new b("", { providedIn: "root", factory: () => Qh }));
    (zc = (() => {
      class e {
        constructor(n, r, o, i, s, a, c, u = null) {
          (this.eventManager = n),
            (this.sharedStylesHost = r),
            (this.appId = o),
            (this.removeStylesOnCompDestroy = i),
            (this.doc = s),
            (this.platformId = a),
            (this.ngZone = c),
            (this.nonce = u),
            (this.rendererByCompId = new Map()),
            (this.platformIsServer = Wo(a)),
            (this.defaultRenderer = new Mt(n, s, c, this.platformIsServer));
        }
        createRenderer(n, r) {
          if (!n || !r) return this.defaultRenderer;
          this.platformIsServer &&
            r.encapsulation === ee.ShadowDom &&
            (r = oe(re({}, r), { encapsulation: ee.Emulated }));
          let o = this.getOrCreateRenderer(n, r);
          return (
            o instanceof On
              ? o.applyToHost(n)
              : o instanceof _t && o.applyStyles(),
            o
          );
        }
        getOrCreateRenderer(n, r) {
          let o = this.rendererByCompId,
            i = o.get(r.id);
          if (!i) {
            let s = this.doc,
              a = this.ngZone,
              c = this.eventManager,
              u = this.sharedStylesHost,
              l = this.removeStylesOnCompDestroy,
              d = this.platformIsServer;
            switch (r.encapsulation) {
              case ee.Emulated:
                i = new On(c, u, r, this.appId, l, s, a, d);
                break;
              case ee.ShadowDom:
                return new Jo(c, u, n, r, s, a, this.nonce, d);
              default:
                i = new _t(c, u, r, l, s, a, d);
                break;
            }
            o.set(r.id, i);
          }
          return i;
        }
        ngOnDestroy() {
          this.rendererByCompId.clear();
        }
        static {
          this.ɵfac = function (r) {
            return new (r || e)(
              M(qc),
              M(Zc),
              M(bo),
              M(Kh),
              M(ve),
              M(nt),
              M(T),
              M(_o)
            );
          };
        }
        static {
          this.ɵprov = x({ token: e, factory: e.ɵfac });
        }
      }
      return e;
    })()),
      (Mt = class {
        constructor(t, n, r, o) {
          (this.eventManager = t),
            (this.doc = n),
            (this.ngZone = r),
            (this.platformIsServer = o),
            (this.data = Object.create(null)),
            (this.throwOnSyntheticProps = !0),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? this.doc.createElementNS(Zo[n] || n, t)
            : this.doc.createElement(t);
        }
        createComment(t) {
          return this.doc.createComment(t);
        }
        createText(t) {
          return this.doc.createTextNode(t);
        }
        appendChild(t, n) {
          (Gc(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (Gc(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          n.remove();
        }
        selectRootElement(t, n) {
          let r = typeof t == "string" ? this.doc.querySelector(t) : t;
          if (!r) throw new D(-5104, !1);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            let i = Zo[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            let o = Zo[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & (Ae.DashCase | Ae.Important)
            ? t.style.setProperty(n, r, o & Ae.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & Ae.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t != null && (t[n] = r);
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          if (
            typeof t == "string" &&
            ((t = Go().getGlobalEventTarget(this.doc, t)), !t)
          )
            throw new Error(`Unsupported event target ${t} for event ${n}`);
          return this.eventManager.addEventListener(
            t,
            n,
            this.decoratePreventDefault(r)
          );
        }
        decoratePreventDefault(t) {
          return (n) => {
            if (n === "__ngUnwrap__") return t;
            (this.platformIsServer
              ? this.ngZone.runGuarded(() => t(n))
              : t(n)) === !1 && n.preventDefault();
          };
        }
      });
    (Jo = class extends Mt {
      constructor(t, n, r, o, i, s, a, c) {
        super(t, i, s, c),
          (this.sharedStylesHost = n),
          (this.hostEl = r),
          (this.shadowRoot = r.attachShadow({ mode: "open" })),
          this.sharedStylesHost.addHost(this.shadowRoot);
        let u = Qc(o.id, o.styles);
        for (let l of u) {
          let d = document.createElement("style");
          a && d.setAttribute("nonce", a),
            (d.textContent = l),
            this.shadowRoot.appendChild(d);
        }
      }
      nodeOrShadowRoot(t) {
        return t === this.hostEl ? this.shadowRoot : t;
      }
      appendChild(t, n) {
        return super.appendChild(this.nodeOrShadowRoot(t), n);
      }
      insertBefore(t, n, r) {
        return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
      }
      removeChild(t, n) {
        return super.removeChild(null, n);
      }
      parentNode(t) {
        return this.nodeOrShadowRoot(
          super.parentNode(this.nodeOrShadowRoot(t))
        );
      }
      destroy() {
        this.sharedStylesHost.removeHost(this.shadowRoot);
      }
    }),
      (_t = class extends Mt {
        constructor(t, n, r, o, i, s, a, c) {
          super(t, i, s, a),
            (this.sharedStylesHost = n),
            (this.removeStylesOnCompDestroy = o),
            (this.styles = c ? Qc(c, r.styles) : r.styles);
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles);
        }
        destroy() {
          this.removeStylesOnCompDestroy &&
            this.sharedStylesHost.removeStyles(this.styles);
        }
      }),
      (On = class extends _t {
        constructor(t, n, r, o, i, s, a, c) {
          let u = o + "-" + r.id;
          super(t, n, r, i, s, a, c, u),
            (this.contentAttr = Jh(u)),
            (this.hostAttr = Xh(u));
        }
        applyToHost(t) {
          this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          let r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }),
      (ep = (() => {
        class e extends An {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
          static {
            this.ɵfac = function (r) {
              return new (r || e)(M(ve));
            };
          }
          static {
            this.ɵprov = x({ token: e, factory: e.ɵfac });
          }
        }
        return e;
      })()),
      (Wc = ["alt", "control", "meta", "shift"]),
      (tp = {
        "\b": "Backspace",
        "	": "Tab",
        "\x7F": "Delete",
        "\x1B": "Escape",
        Del: "Delete",
        Esc: "Escape",
        Left: "ArrowLeft",
        Right: "ArrowRight",
        Up: "ArrowUp",
        Down: "ArrowDown",
        Menu: "ContextMenu",
        Scroll: "ScrollLock",
        Win: "OS",
      }),
      (np = {
        alt: (e) => e.altKey,
        control: (e) => e.ctrlKey,
        meta: (e) => e.metaKey,
        shift: (e) => e.shiftKey,
      }),
      (rp = (() => {
        class e extends An {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return e.parseEventName(n) != null;
          }
          addEventListener(n, r, o) {
            let i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Go().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            let r = n.toLowerCase().split("."),
              o = r.shift();
            if (r.length === 0 || !(o === "keydown" || o === "keyup"))
              return null;
            let i = e._normalizeKey(r.pop()),
              s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              Wc.forEach((u) => {
                let l = r.indexOf(u);
                l > -1 && (r.splice(l, 1), (s += u + "."));
              }),
              (s += i),
              r.length != 0 || i.length === 0)
            )
              return null;
            let c = {};
            return (c.domEventName = o), (c.fullKey = s), c;
          }
          static matchEventFullKeyCode(n, r) {
            let o = tp[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              o == null || !o
                ? !1
                : ((o = o.toLowerCase()),
                  o === " " ? (o = "space") : o === "." && (o = "dot"),
                  Wc.forEach((s) => {
                    if (s !== o) {
                      let a = np[s];
                      a(n) && (i += s + ".");
                    }
                  }),
                  (i += o),
                  i === r)
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return n === "esc" ? "escape" : n;
          }
          static {
            this.ɵfac = function (r) {
              return new (r || e)(M(ve));
            };
          }
          static {
            this.ɵprov = x({ token: e, factory: e.ɵfac });
          }
        }
        return e;
      })());
    (cp = [
      { provide: nt, useValue: $c },
      { provide: Mo, useValue: ip, multi: !0 },
      { provide: ve, useFactory: ap, deps: [] },
    ]),
      (up = [
        { provide: Dn, useValue: "root" },
        { provide: ce, useFactory: sp, deps: [] },
        { provide: Ko, useClass: ep, multi: !0, deps: [ve, T, nt] },
        { provide: Ko, useClass: rp, multi: !0, deps: [ve] },
        zc,
        Zc,
        qc,
        { provide: Je, useExisting: zc },
        { provide: Nn, useClass: qh, deps: [] },
        [],
      ]);
  });
var Xc,
  eu = h(() => {
    "use strict";
    Re();
    Re();
    Xc = (() => {
      class e {
        constructor() {
          (this.title = "Web Component Example"),
            (this.messageFromReact = ""),
            (this.dataSent = new G());
        }
        ngOnChanges(n) {
          n.messageFromReact &&
            console.log("Message from React:", n.messageFromReact.currentValue);
        }
        sendData() {
          this.dataSent.emit("~ data from my Angular web component.");
        }
        static {
          this.ɵfac = function (r) {
            return new (r || e)();
          };
        }
        static {
          this.ɵcmp = Ks({
            type: e,
            selectors: [["wcomp"]],
            inputs: { title: "title", messageFromReact: "messageFromReact" },
            outputs: { dataSent: "dataSent" },
            standalone: !0,
            features: [yo, Nc],
            decls: 5,
            vars: 1,
            consts: [[3, "click"]],
            template: function (r, o) {
              r & 1 &&
                (_n(0, "div")(1, "h2"),
                ko(2),
                Sn(),
                _n(3, "button", 0),
                Po("click", function () {
                  return o.sendData();
                }),
                ko(4, "get my message from Angular"),
                Sn()()),
                r & 2 && (ic(2), Lo(o.title));
            },
            encapsulation: 2,
            changeDetection: 0,
          });
        }
      }
      return e;
    })();
  });
var lp = cu((tu) => {
  jc();
  Jc();
  eu();
  Fn(tu, null, function* () {
    let e = yield Kc({ providers: [] }),
      t = Lc(Xc, { injector: e.injector });
    customElements.define("wcomp", t);
  });
});
export default lp();
