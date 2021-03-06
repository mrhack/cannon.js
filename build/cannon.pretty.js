/**
 * Copyright (c) 2012 cannon.js Authors
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */(function() {
    var a = a || {};
    this.Int32Array || (this.Int32Array = Array, this.Float32Array = Array), a.Broadphase = function() {
        this.world = null;
    }, a.Broadphase.prototype.constructor = a.BroadPhase, a.Broadphase.prototype.collisionPairs = function(a) {
        throw "collisionPairs not implemented for this BroadPhase class!";
    }, a.NaiveBroadphase = function() {
        this.temp = {
            r: new a.Vec3,
            normal: new a.Vec3,
            quat: new a.Quaternion
        };
    }, a.NaiveBroadphase.prototype = new a.Broadphase, a.NaiveBroadphase.prototype.constructor = a.NaiveBroadphase, a.NaiveBroadphase.prototype.collisionPairs = function(b) {
        var c = [], d = [], e = b.numObjects(), f = a.Shape.types.SPHERE, g = a.Shape.types.PLANE, h = a.Shape.types.BOX, i = a.Shape.types.COMPOUND, j = b.bodies, k = this.temp.r, l = this.temp.normal, m = this.temp.quat;
        for (var n = 0; n < e; n++) for (var o = 0; o < n; o++) {
            var p = j[n], q = j[o], r = p.shape.type, s = q.shape.type;
            if (r == h && s == h || r == h && s == i || r == h && s == f || r == f && s == h || r == f && s == f || r == f && s == i || r == i && s == i || r == i && s == f || r == i && s == h) {
                q.position.vsub(p.position, k);
                var t = p.shape.boundingSphereRadius(), u = q.shape.boundingSphereRadius();
                k.norm() < t + u && (c.push(n), d.push(o));
            } else if (r == f && s == g || r == g && s == f || r == h && s == g || r == g && s == h || r == i && s == g || r == g && s == i) {
                var v = r == g ? n : o, w = r != g ? n : o;
                j[w].position.vsub(j[v].position, k), j[v].quaternion.vmult(j[v].shape.normal, l);
                var x = k.dot(l) - j[w].shape.boundingSphereRadius();
                x < 0 && (c.push(n), d.push(o));
            }
        }
        return [ c, d ];
    }, a.Mat3 = function(a) {
        a ? this.elements = new Float32Array(a) : this.elements = new Float32Array(9);
    }, a.Mat3.prototype.identity = function() {
        this.elements[0] = 1, this.elements[1] = 0, this.elements[2] = 0, this.elements[3] = 0, this.elements[4] = 1, this.elements[5] = 0, this.elements[6] = 0, this.elements[7] = 0, this.elements[8] = 1;
    }, a.Mat3.prototype.vmult = function(b, c) {
        c === undefined && (c = new a.Vec3);
        var d = [ b.x, b.y, b.z ], e = [ 0, 0, 0 ];
        for (var f = 0; f < 3; f++) for (var g = 0; g < 3; g++) e[f] += this.elements[f + 3 * g] * d[f];
        return c.x = e[0], c.y = e[1], c.z = e[2], c;
    }, a.Mat3.prototype.smult = function(a) {
        for (var b = 0; b < this.elements.length; b++) this.elements[b] *= a;
    }, a.Mat3.prototype.mmult = function(b) {
        var c = new a.Mat3;
        for (var d = 0; d < 3; d++) for (var e = 0; e < 3; e++) {
            var f = 0;
            for (var g = 0; g < 3; g++) f += this.elements[d + g] * b.elements[g + e * 3];
            c.elements[d + e * 3] = f;
        }
        return c;
    }, a.Mat3.prototype.solve = function(b, c) {
        c = c || new a.Vec3;
        var d = 3, e = 4, f = new Float32Array(d * e);
        for (var g = 0; g < 3; g++) for (var h = 0; h < 3; h++) f[g + e * h] = this.elements[g + 3 * h];
        f[3] = b.x, f[7] = b.y, f[11] = b.z;
        var i = 3, j = i, g, k, l = 4, m, n;
        do {
            g = j - i;
            if (f[g + e * g] == 0) for (h = g + 1; h < j; h++) if (f[g + e * h] != 0) {
                n = [], k = l;
                do m = l - k, n.push(f[m + e * g] + f[m + e * h]); while (--k);
                f[g + e * 0] = n[0], f[g + e * 1] = n[1], f[g + e * 2] = n[2];
                break;
            }
            if (f[g + e * g] != 0) for (h = g + 1; h < j; h++) {
                var o = f[g + e * h] / f[g + e * g];
                n = [], k = l;
                do m = l - k, n.push(m <= g ? 0 : f[m + e * h] - f[m + e * g] * o); while (--k);
                f[h + e * 0] = n[0], f[h + e * 1] = n[1], f[h + e * 2] = n[2];
            }
        } while (--i);
        c.z = f[2 * e + 3] / f[2 * e + 2], c.y = (f[1 * e + 3] - f[1 * e + 2] * c.z) / f[1 * e + 1], c.x = (f[0 * e + 3] - f[0 * e + 2] * c.z - f[0 * e + 1] * c.y) / f[0 * e + 0];
        if (isNaN(c.x) || isNaN(c.y) || isNaN(c.z) || c.x == Infinity || c.y == Infinity || c.z == Infinity) throw "Could not solve equation! Got x=[" + c.toString() + "], b=[" + b.toString() + "], A=[" + this.toString() + "]";
        return c;
    }, a.Mat3.prototype.e = function(a, b, c) {
        if (c == undefined) return this.elements[a + 3 * b];
        this.elements[a + 3 * b] = c;
    }, a.Mat3.prototype.copy = function(a) {
        a = a || new Mat3;
        for (var b = 0; b < this.elements.length; b++) a.elements[b] = this.elements[b];
        return a;
    }, a.Mat3.prototype.toString = function() {
        var a = "", b = ",";
        for (var c = 0; c < 9; c++) a += this.elements[c] + b;
        return a;
    }, a.Vec3 = function(a, b, c) {
        this.x = a || 0, this.y = b || 0, this.z = c || 0;
    }, a.Vec3.prototype.cross = function(b, c) {
        c = c || new a.Vec3;
        var d = [ this.x, this.y, this.z ], e = [ b.x, b.y, b.z ];
        return c.x = d[1] * e[2] - d[2] * e[1], c.y = d[2] * e[0] - d[0] * e[2], c.z = d[0] * e[1] - d[1] * e[0], c;
    }, a.Vec3.prototype.set = function(a, b, c) {
        return this.x = a, this.y = b, this.z = c, this;
    }, a.Vec3.prototype.vadd = function(b, c) {
        if (!c) return new a.Vec3(this.x + b.x, this.y + b.y, this.z + b.z);
        c.x = b.x + this.x, c.y = b.y + this.y, c.z = b.z + this.z;
    }, a.Vec3.prototype.vsub = function(b, c) {
        if (!c) return new a.Vec3(this.x - b.x, this.y - b.y, this.z - b.z);
        c.x = this.x - b.x, c.y = this.y - b.y, c.z = this.z - b.z;
    }, a.Vec3.prototype.crossmat = function() {
        return new a.Mat3([ 0, -this.z, this.y, this.z, 0, -this.x, -this.y, this.x, 0 ]);
    }, a.Vec3.prototype.normalize = function() {
        var a = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        return a > 0 ? (this.x /= a, this.y /= a, this.z /= a) : (this.x = 0, this.y = 0, this.z = 0), a;
    }, a.Vec3.prototype.unit = function(b) {
        b = b || new a.Vec3;
        var c = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        return c > 0 ? (c = 1 / c, b.x = this.x * c, b.y = this.y * c, b.z = this.z * c) : (b.x = 0, b.y = 0, b.z = 0), b;
    }, a.Vec3.prototype.norm = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }, a.Vec3.prototype.mult = function(b, c) {
        return c || (c = new a.Vec3), c.x = b * this.x, c.y = b * this.y, c.z = b * this.z, c;
    }, a.Vec3.prototype.dot = function(a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }, a.Vec3.prototype.negate = function(b) {
        return b = b || new a.Vec3, b.x = -this.x, b.y = -this.y, b.z = -this.z, b;
    }, a.Vec3.prototype.tangents = function(b, c) {
        var d = this.norm();
        if (d > 0) {
            var e = new a.Vec3(this.x / d, this.y / d, this.z / d);
            if (e.x < .9) {
                var f = Math.random();
                e.cross((new a.Vec3(f, 1e-7, 0)).unit(), b);
            } else e.cross((new a.Vec3(1e-7, f, 0)).unit(), b);
            e.cross(b, c);
        } else b.set(1, 0, 0).normalize(), c.set(0, 1, 0).normalize();
    }, a.Vec3.prototype.toString = function() {
        return this.x + "," + this.y + "," + this.z;
    }, a.Vec3.prototype.copy = function(b) {
        return b = b || new a.Vec3, b.x = this.x, b.y = this.y, b.z = this.z, b;
    }, a.Quaternion = function(a, b, c, d) {
        this.x = a != undefined ? a : 0, this.y = b != undefined ? b : 0, this.z = c != undefined ? c : 0, this.w = d != undefined ? d : 1;
    }, a.Quaternion.prototype.set = function(a, b, c, d) {
        this.x = a, this.y = b, this.z = c, this.w = d;
    }, a.Quaternion.prototype.toString = function() {
        return this.x + "," + this.y + "," + this.z + "," + this.w;
    }, a.Quaternion.prototype.setFromAxisAngle = function(a, b) {
        var c = Math.sin(b * .5);
        this.x = a.x * c, this.y = a.y * c, this.z = a.z * c, this.w = Math.cos(b * .5);
    }, a.Quaternion.prototype.setFromVectors = function(a, b) {
        var c = a.cross(b);
        this.x = c.x, this.y = c.y, this.z = c.z, this.w = Math.sqrt(Math.pow(a.norm(), 2) * Math.pow(b.norm(), 2)) + a.dot(b), this.normalize();
    }, a.Quaternion.prototype.mult = function(b, c) {
        c == undefined && (c = new a.Quaternion);
        var d = new a.Vec3(this.x, this.y, this.z), e = new a.Vec3(b.x, b.y, b.z);
        return c.w = this.w * b.w - d.dot(e), vaxvb = d.cross(e), c.x = this.w * e.x + b.w * d.x + vaxvb.x, c.y = this.w * e.y + b.w * d.y + vaxvb.y, c.z = this.w * e.z + b.w * d.z + vaxvb.z, c;
    }, a.Quaternion.prototype.inverse = function(b) {
        return b == undefined && (b = new a.Quaternion), b.x = -this.x, b.y = -this.y, b.z = -this.z, b.w = this.w, b;
    }, a.Quaternion.prototype.normalize = function() {
        var a = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        a === 0 ? (this.x = 0, this.y = 0, this.z = 0, this.w = 0) : (a = 1 / a, this.x *= a, this.y *= a, this.z *= a, this.w *= a);
    }, a.Quaternion.prototype.vmult = function(b, c) {
        c = c || new a.Vec3;
        if (this.w == 0) c.x = b.x, c.y = b.y, c.z = b.z; else {
            var d = b.x, e = b.y, f = b.z, g = this.x, h = this.y, i = this.z, j = this.w, k = j * d + h * f - i * e, l = j * e + i * d - g * f, m = j * f + g * e - h * d, n = -g * d - h * e - i * f;
            c.x = k * j + n * -g + l * -i - m * -h, c.y = l * j + n * -h + m * -g - k * -i, c.z = m * j + n * -i + k * -h - l * -g;
        }
        return c;
    }, a.Quaternion.prototype.copy = function(a) {
        a.x = this.x, a.y = this.y, a.z = this.z, a.w = this.w;
    }, a.Shape = function() {
        this.type = 0;
    }, a.Shape.prototype.constructor = a.Shape, a.Shape.prototype.boundingSphereRadius = function() {
        throw "boundingSphereRadius() not implemented for shape type " + this.type;
    }, a.Shape.prototype.volume = function() {
        throw "volume() not implemented for shape type " + this.type;
    }, a.Shape.prototype.calculateLocalInertia = function(a, b) {
        throw "calculateLocalInertia() not implemented for shape type " + this.type;
    }, a.Shape.prototype.calculateTransformedInertia = function(b, c, d) {
        d == undefined && (d = new a.Vec3), c.normalize();
        var e = this.calculateLocalInertia(b), f = c.vmult(e);
        return d.x = Math.abs(f.x), d.y = Math.abs(f.y), d.z = Math.abs(f.z), d;
    }, a.Shape.types = {
        SPHERE: 1,
        PLANE: 2,
        BOX: 4,
        COMPOUND: 8
    }, a.RigidBody = function(b, c, d) {
        this.position = new a.Vec3, this.initPosition = new a.Vec3, this.velocity = new a.Vec3, this.initVelocity = new a.Vec3, this.force = new a.Vec3, this.tau = new a.Vec3, this.quaternion = new a.Quaternion, this.initQuaternion = new a.Quaternion, this.angularVelocity = new a.Vec3, this.initAngularVelocity = new a.Vec3, this.mass = b, this.invMass = b > 0 ? 1 / b : 0, this.shape = c, this.inertia = c.calculateLocalInertia(b), this.invInertia = new a.Vec3(this.inertia.x > 0 ? 1 / this.inertia.x : 0, this.inertia.y > 0 ? 1 / this.inertia.y : 0, this.inertia.z > 0 ? 1 / this.inertia.z : 0), this.material = d, this.linearDamping = .01, this.angularDamping = .01, this.fixed = b <= 0, this.world = null;
    }, a.Sphere = function(b) {
        a.Shape.call(this), this.radius = b != undefined ? Number(b) : 1, this.type = a.Shape.types.SPHERE;
    }, a.Sphere.prototype = new a.Shape, a.Sphere.prototype.constructor = a.Sphere, a.Sphere.prototype.calculateLocalInertia = function(b, c) {
        c = c || new a.Vec3;
        var d = 2 * b * this.radius * this.radius / 5;
        return c.x = d, c.y = d, c.z = d, c;
    }, a.Sphere.prototype.volume = function() {
        return 4 * Math.PI * this.radius / 3;
    }, a.Sphere.prototype.boundingSphereRadius = function() {
        return this.radius;
    }, a.Box = function(b) {
        a.Shape.call(this), this.halfExtents = b, this.type = a.Shape.types.BOX;
    }, a.Box.prototype = new a.Shape, a.Box.prototype.constructor = a.Box, a.Box.prototype.calculateLocalInertia = function(b, c) {
        return c = c || new a.Vec3, c.x = 1 / 12 * b * (2 * this.halfExtents.y * 2 * this.halfExtents.y + 2 * this.halfExtents.z * 2 * this.halfExtents.z), c.y = 1 / 12 * b * (2 * this.halfExtents.x * 2 * this.halfExtents.x + 2 * this.halfExtents.z * 2 * this.halfExtents.z), c.z = 1 / 12 * b * (2 * this.halfExtents.y * 2 * this.halfExtents.y + 2 * this.halfExtents.x * 2 * this.halfExtents.x), c;
    }, a.Box.prototype.getCorners = function(b) {
        var c = [], d = this.halfExtents;
        c.push(new a.Vec3(d.x, d.y, d.z)), c.push(new a.Vec3(-d.x, d.y, d.z)), c.push(new a.Vec3(-d.x, -d.y, d.z)), c.push(new a.Vec3(-d.x, -d.y, -d.z)), c.push(new a.Vec3(d.x, -d.y, -d.z)), c.push(new a.Vec3(d.x, d.y, -d.z)), c.push(new a.Vec3(-d.x, d.y, -d.z)), c.push(new a.Vec3(d.x, -d.y, d.z));
        for (var e = 0; b != undefined && e < c.length; e++) b.vmult(c[e], c[e]);
        return c;
    }, a.Box.prototype.getSideNormals = function(b, c) {
        var d = [], e = this.halfExtents;
        d.push(new a.Vec3(e.x, 0, 0)), d.push(new a.Vec3(0, e.y, 0)), d.push(new a.Vec3(0, 0, e.z)), b != undefined && b && (d.push(new a.Vec3(-e.x, 0, 0)), d.push(new a.Vec3(0, -e.y, 0)), d.push(new a.Vec3(0, 0, -e.z)));
        for (var f = 0; c != undefined && f < d.length; f++) c.vmult(d[f], d[f]);
        return d;
    }, a.Box.prototype.volume = function() {
        return 8 * this.halfExtents.x * this.halfExtents.y * this.halfExtents.z;
    }, a.Box.prototype.boundingSphereRadius = function() {
        return this.halfExtents.norm();
    }, a.Plane = function(b) {
        a.Shape.call(this), b.normalize(), this.normal = b, this.type = a.Shape.types.PLANE;
    }, a.Plane.prototype = new a.Shape, a.Plane.prototype.constructor = a.Plane, a.Plane.prototype.calculateLocalInertia = function(b, c) {
        return c = c || new a.Vec3, c;
    }, a.Plane.prototype.volume = function() {
        return Infinity;
    }, a.Compound = function() {
        a.Shape.call(this), this.type = a.Shape.types.COMPOUND, this.childShapes = [], this.childOffsets = [], this.childOrientations = [];
    }, a.Compound.prototype = new a.Shape, a.Compound.prototype.constructor = a.Compound, a.Compound.prototype.addChild = function(b, c, d) {
        c = c || new a.Vec3, d = d || new a.Quaternion, this.childShapes.push(b), this.childOffsets.push(c), this.childOrientations.push(d);
    }, a.Compound.prototype.volume = function() {
        var a = 0;
        for (var b = 0; b < this.childShapes.length; b++) a += this.childShapes[b].volume();
        return a;
    }, a.Compound.prototype.calculateLocalInertia = function(b, c) {
        c = c || new a.Vec3;
        var d = this.volume();
        for (var e = 0; e < this.childShapes.length; e++) {
            var f = this.childShapes[e], g = this.childOffsets[e], h = this.childOrientations[e], i = f.volume() / d * b, j = f.calculateTransformedInertia(i, h);
            c.vadd(j, c);
            var k = new a.Vec3(i * g.x * g.x, i * g.y * g.y, i * g.z * g.z);
            c.vadd(k, c);
        }
        return c;
    }, a.Compound.prototype.boundingSphereRadius = function() {
        var a = 0;
        for (var b = 0; b < this.childShapes.length; b++) {
            var c = this.childOffsets[b].norm() + this.childShapes[b].boundingSphereRadius();
            a < c && (a = c);
        }
        return a;
    }, a.Solver = function(a, b, c, d, e, f, g) {
        this.iterations = f || 10, this.h = g || 1 / 60, this.a = a, this.b = b, this.eps = c, this.k = d, this.d = e, this.reset(0), this.debug = !1, this.debug && console.log("a:", a, "b", b, "eps", c, "k", d, "d", e);
    }, a.Solver.prototype.reset = function(a) {
        this.G = [], this.MinvTrace = [], this.Fext = [], this.q = [], this.qdot = [], this.n = 0, this.upper = [], this.lower = [], this.hasupper = [], this.haslower = [], this.i = [], this.j = [], this.vxlambda = new Float32Array(a), this.vylambda = new Float32Array(a), this.vzlambda = new Float32Array(a), this.wxlambda = new Float32Array(a), this.wylambda = new Float32Array(a), this.wzlambda = new Float32Array(a);
    }, a.Solver.prototype.addConstraint = function(a, b, c, d, e, f, g, h, i) {
        this.debug && (console.log("Adding constraint ", this.n), console.log("G:", a), console.log("q:", c), console.log("qdot:", d), console.log("Fext:", e), console.log("lower:", f), console.log("upper:", g));
        for (var j = 0; j < 12; j++) this.q.push(c[j]), this.qdot.push(d[j]), this.MinvTrace.push(b[j]), this.G.push(a[j]), this.Fext.push(e[j]);
        return this.upper.push(g), this.hasupper.push(!isNaN(g)), this.lower.push(f), this.haslower.push(!isNaN(f)), this.i.push(h), this.j.push(i), this.n += 1, this.n - 1;
    }, a.Solver.prototype.addNonPenetrationConstraint = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s) {
        var t = f.cross(e), u = m.vsub(l), v = d.vadd(g).vsub(c.vadd(f)), w = v.dot(e);
        w < 0 && (this.debug && (console.log("i:", a, "j", b, "xi", c.toString(), "xj", d.toString()), console.log("ni", e.toString(), "ri", f.toString(), "rj", g.toString()), console.log("iMi", h.toString(), "iMj", i.toString(), "iIi", j.toString(), "iIj", k.toString(), "vi", l.toString(), "vj", m.toString(), "wi", n.toString(), "wj", o.toString(), "fi", p.toString(), "fj", q.toString(), "taui", r.toString(), "tauj", s.toString())), this.addConstraint([ -e.x, -e.y, -e.z, -t.x, -t.y, -t.z, e.x, e.y, e.z, t.x, t.y, t.z ], [ h.x, h.y, h.z, j.z, j.y, j.z, i.x, i.y, i.z, k.z, k.y, k.z ], [ -v.x, -v.y, -v.z, 0, 0, 0, v.x, v.y, v.z, 0, 0, 0 ], [ -u.x, -u.y, -u.z, 0, 0, 0, u.x, u.y, u.z, 0, 0, 0 ], [ p.x, p.y, p.z, r.x, r.y, r.z, q.x, q.y, q.z, s.x, s.y, s.z ], 0, "inf", a, b));
    }, a.Solver.prototype.solve = function() {
        this.i = new Int16Array(this.i);
        var a = this.n, b = new Float32Array(a), c = new Float32Array(a), d = new Float32Array(12 * a), e = new Float32Array(a), f = new Float32Array(a), g = new Int16Array(a), h = new Float32Array(this.G);
        for (var i = 0; i < this.iterations; i++) for (var j = 0; j < a; j++) {
            var k = this.i[j], l = this.j[j], m = 12 * j;
            if (!g[j]) {
                var n = 0, o = 0, p = 0, q = 0;
                for (var r = 0; r < 12; r++) {
                    var s = m + r;
                    n += h[s] * this.MinvTrace[s] * h[s], o += h[s] * this.q[s], p += h[s] * this.qdot[s], q += h[s] * this.MinvTrace[s] * this.Fext[s];
                }
                f[j] = 1 / (n + this.eps), e[j] = -this.a * o - this.b * p - this.h * q, g[j] = 1, this.debug && (console.log("G_Minv_Gt[" + j + "]:", n), console.log("Gq[" + j + "]:", o), console.log("GW[" + j + "]:", p), console.log("GMinvf[" + j + "]:", q));
            }
            var t = 0;
            t += h[0 + m] * this.vxlambda[k], t += h[1 + m] * this.vylambda[k], t += h[2 + m] * this.vzlambda[k], t += h[3 + m] * this.wxlambda[k], t += h[4 + m] * this.wylambda[k], t += h[5 + m] * this.wzlambda[k], t += h[6 + m] * this.vxlambda[l], t += h[7 + m] * this.vylambda[l], t += h[8 + m] * this.vzlambda[l], t += h[9 + m] * this.wxlambda[l], t += h[10 + m] * this.wylambda[l], t += h[11 + m] * this.wzlambda[l], c[j] = f[j] * (e[j] - t - this.eps * b[j]), this.debug && console.log("dlambda[" + j + "]=", c[j]), b[j] = b[j] + c[j], this.haslower[j] && b[j] < this.lower[j] && (this.debug && console.log("hit lower bound for constraint " + j + ", truncating " + b[j] + " to the bound " + this.lower[j]), b[j] = this.lower[j], c[j] = this.lower[j] - b[j]), this.hasupper && b[j] > this.upper[j] && (this.debug && console.log("hit upper bound for constraint " + j + ", truncating " + b[j] + " to the bound " + this.upper[j]), b[j] = this.upper[j], c[j] = this.upper[j] - b[j]), this.vxlambda[k] += c[j] * this.MinvTrace[m + 0] * h[m + 0], this.vylambda[k] += c[j] * this.MinvTrace[m + 1] * h[m + 1], this.vzlambda[k] += c[j] * this.MinvTrace[m + 2] * h[m + 2], this.wxlambda[k] += c[j] * this.MinvTrace[m + 3] * h[m + 3], this.wylambda[k] += c[j] * this.MinvTrace[m + 4] * h[m + 4], this.wzlambda[k] += c[j] * this.MinvTrace[m + 5] * h[m + 5], this.vxlambda[l] += c[j] * this.MinvTrace[m + 6] * h[m + 6], this.vylambda[l] += c[j] * this.MinvTrace[m + 7] * h[m + 7], this.vzlambda[l] += c[j] * this.MinvTrace[m + 8] * h[m + 8], this.wxlambda[l] += c[j] * this.MinvTrace[m + 9] * h[m + 9], this.wylambda[l] += c[j] * this.MinvTrace[m + 10] * h[m + 10], this.wzlambda[l] += c[j] * this.MinvTrace[m + 11] * h[m + 11];
        }
        if (this.debug) for (var r = 0; r < this.vxlambda.length; r++) console.log("dv[" + r + "]=", this.vxlambda[r], this.vylambda[r], this.vzlambda[r], this.wxlambda[r], this.wylambda[r], this.wzlambda[r]);
    }, a.Material = function(a) {
        this.name = a, this.id = -1;
    }, a.ContactMaterial = function(a, b, c, d) {
        this.id = -1, this.materials = [ a, b ], this.friction = c != undefined ? Number(c) : .3, this.restitution = d != undefined ? Number(d) : .3;
    }, a.ContactPoint = function(b, c) {
        this.r = new a.Vec3, this.n = new a.Vec3, this.fromBody = null, this.toBody = null;
    }, a.ContactPoint = function() {}, a.World = function() {
        this.time = 0, this.stepnumber = 0, this.spook_k = 3e3, this.spook_d = 3, this.default_dt = 1 / 60, this.last_dt = this.default_dt, this.nextId = 0, this.gravity = new a.Vec3, this.broadphase = null, this.bodies = [];
        var b = this;
        this.spook_a = function(a) {
            return 4 / (a * (1 + 4 * b.spook_d));
        }, this.spook_b = 4 * this.spook_d / (1 + 4 * this.spook_d), this.spook_eps = function(a) {
            return 4 / (a * a * b.spook_k * (1 + 4 * b.spook_d));
        }, this.solver = new a.Solver(this.spook_a(1 / 60), this.spook_b, this.spook_eps(1 / 60), this.spook_k, this.spook_d, 5, 1 / 60), this.materials = [], this.contactmaterials = [], this.mats2cmat = [], this.temp = {
            gvec: new a.Vec3,
            vi: new a.Vec3,
            vj: new a.Vec3,
            wi: new a.Vec3,
            wj: new a.Vec3,
            t1: new a.Vec3,
            t2: new a.Vec3,
            rixn: new a.Vec3,
            rjxn: new a.Vec3,
            step_q: new a.Quaternion,
            step_w: new a.Quaternion,
            step_wq: new a.Quaternion
        };
    }, a.World.prototype.getContactMaterial = function(b, c) {
        if (b instanceof a.Material && c instanceof a.Material) {
            var d = b.id, e = c.id;
            if (d < e) {
                var f = d;
                d = e, e = f;
            }
            return this.contactmaterials[this.mats2cmat[d + e * this.materials.length]];
        }
    }, a.World.prototype._addImpulse = function(b, c, d, e, f, g, h, i) {
        var j = d.crossmat(), k = e.crossmat(), l = this.inertiax[b] > 0 ? 1 / this.inertiax[b] : 0, m = new a.Mat3([ l, 0, 0, 0, l, 0, 0, 0, l ]);
        l = this.inertiax[c] > 0 ? 1 / this.inertiax[c] : 0;
        var n = new a.Mat3([ l, 0, 0, 0, l, 0, 0, 0, l ]), o = this.invm[b] + this.invm[c], p = new a.Mat3([ o, 0, 0, 0, o, 0, 0, 0, o ]), q = j.mmult(m.mmult(j)), r = k.mmult(n.mmult(k)), s = g.mult(-h * f.dot(g)), t = p.solve(s.vsub(f)), i = 0;
        if (i > 0) {
            var u = g.mult(t.dot(g)), v = t.vsub(u);
            if (v.norm() > u.mult(i).norm()) {
                var w = f.vsub(g.mult(f.dot(g))), x = w.mult(1 / (w.norm() + 1e-4)), y = -(1 + h) * f.dot(g) / g.dot(p.vmult(g.vsub(x.mult(i))));
                t = g.mult(y).vsub(x.mult(i * y));
            }
        }
        var z = this.invm[b], A = this.invm[c];
        this.vx[b] += t.x * z - (this.vx[c] - f.x), this.vy[b] += t.y * z - (this.vy[c] - f.y), this.vz[b] += t.z * z - (this.vz[c] - f.z), this.vx[c] -= t.x * A + (this.vx[b] + f.x), this.vy[c] -= t.y * A + (this.vy[b] + f.y), this.vz[c] -= t.z * A + (this.vz[b] + f.z);
        var B = d.cross(t), C = B.mult(1 / this.inertiax[b]);
    }, a.World.prototype.numObjects = function() {
        return this.bodies.length;
    }, a.World.prototype.clearCollisionState = function(a) {
        var b = this.numObjects(), c = a.id;
        for (var d = 0; d < b; d++) {
            var e = d;
            c > e ? this.collision_matrix[e + c * b] = 0 : this.collision_matrix[c + e * b] = 0;
        }
    }, a.World.prototype.add = function(b) {
        if (b instanceof a.RigidBody) {
            var c = this.numObjects();
            this.bodies.push(b), b.id = this.id(), b.world = this, b.position.copy(b.initPosition), b.velocity.copy(b.initVelocity), b.angularVelocity.copy(b.initAngularVelocity), b.quaternion.copy(b.initQuaternion), this.collision_matrix = new Int16Array((c + 1) * (c + 1));
        }
    }, a.World.prototype.id = function() {
        return this.nextId++;
    }, a.World.prototype.remove = function(b) {
        if (b instanceof a.RigidBody) {
            b.world = null;
            var c = this.numObjects(), d = this.bodies;
            for (var e in d) d[e].id == b.id && d.splice(e, 1);
            this.collision_matrix = new Int16Array((c - 1) * (c - 1));
        }
    }, a.World.prototype.addMaterial = function(a) {
        if (a.id == -1) {
            this.materials.push(a), a.id = this.materials.length - 1;
            var b = new Int16Array(this.materials.length * this.materials.length);
            for (var c = 0; c < b.length; c++) b[c] = -1;
            for (var c = 0; c < this.materials.length - 1; c++) for (var d = 0; d < this.materials.length - 1; d++) b[c + this.materials.length * d] = this.mats2cmat[c + (this.materials.length - 1) * d];
            this.mats2cmat = b;
        }
    }, a.World.prototype.addContactMaterial = function(a) {
        this.addMaterial(a.materials[0]), this.addMaterial(a.materials[1]), a.materials[0].id > a.materials[1].id ? (i = a.materials[0].id, j = a.materials[1].id) : (j = a.materials[0].id, i = a.materials[1].id), this.contactmaterials.push(a), a.id = this.contactmaterials.length - 1, this.mats2cmat[i + this.materials.length * j] = a.id;
    }, a.World.prototype.step = function(b) {
        function n(a, b, c, e) {
            if (c == 0 && a < b || c == -1 && a > b) {
                var f = b;
                b = a, a = f;
            }
            if (e === undefined) return d.collision_matrix[a + b * d.numObjects()];
            d.collision_matrix[a + b * d.numObjects()] = parseInt(e);
        }
        function s(b, c, d, e, f, g, h) {
            function k() {
                return {
                    ri: new a.Vec3,
                    rj: new a.Vec3,
                    ni: new a.Vec3
                };
            }
            function l(b) {
                var c = a.Vec3();
                c = b.ri, b.ri = b.rj, b.rj = c, b.ni.negate(b.ni);
            }
            function m(a, b, c, d, e, f, g) {
                for (var h = 0; h < c.childShapes.length; h++) {
                    var i = [];
                    s(i, b, c.childShapes[h], d, e.vadd(g.vmult(c.childOffsets[h])), f, g.mult(c.childOrientations[h]));
                    for (var j = 0; j < i.length; j++) i[j].rj.vadd(g.vmult(c.childOffsets[h]), i[j].rj), a.push(i[j]);
                }
            }
            var i = !1;
            if (c.type > d.type) {
                var j;
                j = d, d = c, c = j, j = f, f = e, e = j, j = h, h = g, g = j, i = !0;
            }
            if (c.type == a.Shape.types.SPHERE) if (d.type == a.Shape.types.SPHERE) {
                var n = k();
                f.vsub(e, n.ni), n.ni.normalize(), n.ni.copy(n.ri), n.ni.copy(n.rj), n.ri.mult(c.radius, n.ri), n.rj.mult(-d.radius, n.rj), b.push(n);
            } else if (d.type == a.Shape.types.PLANE) {
                var n = k();
                d.normal.copy(n.ni), h.vmult(n.ni, n.ni), n.ni.negate(n.ni), n.ni.normalize(), n.ni.mult(c.radius, n.ri);
                var o = e.vsub(f), p = n.ni.mult(n.ni.dot(o));
                n.rj = o.vsub(p), p.norm() <= c.radius && b.push(n);
            } else if (d.type == a.Shape.types.BOX) {
                var q = e.vsub(f), r = d.getSideNormals(!0, h), t = c.radius, u = [], v = !1;
                for (var w = 0; w < r.length && !v; w++) {
                    var x = r[w].copy(), y = x.norm();
                    x.normalize();
                    var z = q.dot(x);
                    if (z < y + t && z > 0) {
                        var A = r[(w + 1) % 3].copy(), B = r[(w + 2) % 3].copy(), C = A.norm(), D = B.norm();
                        A.normalize(), B.normalize();
                        var E = q.dot(A), F = q.dot(B);
                        if (E < C && E > -C && F < D && F > -D) {
                            v = !0;
                            var n = k();
                            x.mult(-t, n.ri), x.copy(n.ni), n.ni.negate(n.ni), x.mult(y).vadd(A.mult(E)).vadd(B.mult(F), n.rj), b.push(n);
                        }
                    }
                }
                var G = new a.Vec3;
                for (var H = 0; H < 2 && !v; H++) for (var I = 0; I < 2 && !v; I++) for (var J = 0; J < 2 && !v; J++) {
                    G.set(0, 0, 0), H ? G.vadd(r[0], G) : G.vsub(r[0], G), I ? G.vadd(r[1], G) : G.vsub(r[1], G), J ? G.vadd(r[2], G) : G.vsub(r[2], G);
                    var K = f.vadd(G).vsub(e);
                    if (K.norm() < t) {
                        v = !0;
                        var n = k();
                        K.copy(n.ri), n.ri.normalize(), n.ri.copy(n.ni), n.ri.mult(t, n.ri), G.copy(n.rj), b.push(n);
                    }
                }
                var L = new a.Vec3, M = new a.Vec3, n = new a.Vec3, N = new a.Vec3, O = new a.Vec3;
                for (var H = 0; H < r.length && !v; H++) for (var I = 0; I < r.length && !v; I++) if (H % 3 != I % 3) {
                    r[I].cross(r[H], L), L.normalize(), r[H].vadd(r[I], M), e.copy(n), n.vsub(M, n), n.vsub(f, n);
                    var P = n.dot(L);
                    L.mult(P, N);
                    var J = 0;
                    while (J == H % 3 || J == I % 3) J++;
                    e.copy(O), O.vsub(N, O), O.vsub(M, O), O.vsub(f, O);
                    var Q = Math.abs(P), R = O.norm();
                    if (Q < r[J].norm() && R < t) {
                        v = !0;
                        var S = k();
                        M.vadd(N, S.rj), S.rj.copy(S.rj), O.negate(S.ni), S.ni.normalize(), S.rj.copy(S.ri), S.ri.vadd(f, S.ri), S.ri.vsub(e, S.ri), S.ri.normalize(), S.ri.mult(t, S.ri), b.push(S);
                    }
                }
            } else d.type == a.Shape.types.COMPOUND && m(b, c, d, e, f, g, h); else if (c.type == a.Shape.types.PLANE) {
                if (d.type == a.Shape.types.PLANE) throw "Plane-plane collision... wait, you did WHAT?";
                if (d.type == a.Shape.types.BOX) {
                    var T = c.normal.copy(), U = 0, V = d.getCorners(h);
                    for (var w = 0; w < V.length && U <= 4; w++) {
                        var n = k(), W = V[w].vadd(f);
                        V[w].copy(n.rj);
                        var X = W.vsub(e), Y = T.dot(X);
                        if (Y <= 0) {
                            U++;
                            var Z = T.mult(Y);
                            X.vsub(Z, n.ri), T.copy(n.ni), b.push(n);
                        }
                    }
                } else d.type == a.Shape.types.COMPOUND && m(b, c, d, e, f, g, h);
            } else if (c.type == a.Shape.types.BOX) {
                if (d.type == a.Shape.types.BOX) throw "box-box collision not implemented yet";
                d.type == a.Shape.types.COMPOUND && m(b, c, d, e, f, g, h);
            } else c.type == a.Shape.types.COMPOUND && d.type == a.Shape.types.COMPOUND && m(b, c, d, e, f, g, h);
            for (var $ = 0; i && $ < b.length; $++) l(b[$]);
        }
        var c = this, d = this, e = this.numObjects(), f = this.bodies;
        b == undefined && (this.last_dt ? b = this.last_dt : b = this.default_dt);
        var g = this.broadphase.collisionPairs(this), h = g[0], i = g[1], j = a.Shape.types.SPHERE, k = a.Shape.types.PLANE, l = a.Shape.types.BOX, m = a.Shape.types.COMPOUND;
        for (var o in f) for (var p = 0; p < o; p++) n(o, p, -1, n(o, p, 0)), n(o, p, 0, 0);
        for (var o in f) {
            var q = f[o].force, r = f[o].mass;
            q.x += c.gravity.x * r, q.y += c.gravity.y * r, q.z += c.gravity.z * r;
        }
        this.solver.reset(e), this.contacts = {};
        var t = this.temp;
        for (var u = 0; u < h.length; u++) {
            var o = h[u], p = i[u], v = f[o], w = f[p], x = n(o, p, -1), y = .3, z = .2, A = this.getContactMaterial(v.material, w.material);
            A && (y = A.friction, z = A.restitution);
            var B = [];
            s(B, v.shape, w.shape, v.position, w.position, v.quaternion, w.quaternion), this.contacts[o + "," + p] = B;
            for (var C = 0; C < B.length; C++) {
                var D = B[C], E = t.gvec;
                E.set(w.position.x + D.rj.x - v.position.x - D.ri.x, w.position.y + D.rj.y - v.position.y - D.ri.y, w.position.z + D.rj.z - v.position.z - D.ri.z);
                var F = E.dot(D.ni);
                if (F < 0) {
                    var G = v.velocity, H = v.angularVelocity, I = w.velocity, J = w.angularVelocity, K = D.ni, L = [ t.t1, t.t2 ];
                    K.tangents(L[0], L[1]);
                    var M = G.vadd(H.cross(D.ri)), N = I.vadd(J.cross(D.rj)), O = N.vsub(M), P = J.cross(D.rj).vsub(H.cross(D.ri)), Q = I.vsub(G), R = D.rj.cross(J).vsub(D.ri.cross(H));
                    Q.vsub(R, Q);
                    var S = v.invMass, T = w.invMass, U = v.invInertia.x, V = v.invInertia.y, W = v.invInertia.z, X = w.invInertia.x, Y = w.invInertia.y, Z = w.invInertia.z, $ = t.rixn, _ = t.rjxn;
                    D.ri.cross(K, $), D.rj.cross(K, _);
                    var ab = K.mult(O.dot(K)), bb = $.unit().mult(P.dot($.unit())), cb = _.unit().mult(-P.dot(_.unit())), db = D.ni.mult(F);
                    this.solver.addConstraint([ -K.x, -K.y, -K.z, -$.x, -$.y, -$.z, K.x, K.y, K.z, _.x, _.y, _.z ], [ S, S, S, U, V, W, T, T, T, X, Y, Z ], [ -db.x, -db.y, -db.z, 0, 0, 0, db.x, db.y, db.z, 0, 0, 0 ], [ -ab.x, -ab.y, -ab.z, 0, 0, 0, ab.x, ab.y, ab.z, 0, 0, 0 ], [ v.force.x, v.force.y, v.force.z, v.tau.x, v.tau.y, v.tau.z, w.force.x, w.force.y, w.force.z, w.tau.x, w.tau.y, w.tau.z ], 0, "inf", o, p);
                    if (y > 0) {
                        var F = d.gravity.norm();
                        for (var eb = 0; eb < L.length; eb++) {
                            var fb = L[eb], gb = D.ri.cross(fb), hb = D.rj.cross(fb), ib = fb.mult(O.dot(fb)), jb = gb.unit().mult(O.dot(gb.unit())), kb = hb.unit().mult(-O.dot(hb.unit()));
                            this.solver.addConstraint([ -fb.x, -fb.y, -fb.z, -gb.x, -gb.y, -gb.z, fb.x, fb.y, fb.z, hb.x, hb.y, hb.z ], [ S, S, S, U, V, W, T, T, T, X, Y, Z ], [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], [ -ib.x, -ib.y, -ib.z, 0, 0, 0, ib.x, ib.y, ib.z, 0, 0, 0 ], [ v.force.x, v.force.y, v.force.z, v.tau.x, v.tau.y, v.tau.z, w.force.x, w.force.y, w.force.z, w.tau.x, w.tau.y, w.tau.z ], -y * F * (v.mass + w.mass), y * F * (v.mass + w.mass), o, p);
                        }
                    }
                }
            }
        }
        if (this.solver.n) {
            this.solver.solve();
            for (var o in f) {
                var lb = f[o];
                lb.velocity.x += this.solver.vxlambda[o], lb.velocity.y += this.solver.vylambda[o], lb.velocity.z += this.solver.vzlambda[o], lb.angularVelocity.x += this.solver.wxlambda[o], lb.angularVelocity.y += this.solver.wylambda[o], lb.angularVelocity.z += this.solver.wzlambda[o];
            }
        }
        for (var o in f) {
            var mb = 1 - f[o].linearDamping, nb = 1 - f[o].angularDamping;
            f[o].velocity.mult(mb, f[o].velocity), f[o].angularVelocity.mult(nb, f[o].angularVelocity);
        }
        var ob = t.step_q, pb = t.step_w, qb = t.step_wq;
        for (var o in f) {
            var lb = f[o];
            lb.fixed || (lb.velocity.x += lb.force.x * lb.invMass * b, lb.velocity.y += lb.force.y * lb.invMass * b, lb.velocity.z += lb.force.z * lb.invMass * b, lb.angularVelocity.x += lb.tau.x * lb.invInertia.x * b, lb.angularVelocity.y += lb.tau.y * lb.invInertia.y * b, lb.angularVelocity.z += lb.tau.z * lb.invInertia.z * b, lb.position.x += lb.velocity.x * b, lb.position.y += lb.velocity.y * b, lb.position.z += lb.velocity.z * b, pb.set(lb.angularVelocity.x, lb.angularVelocity.y, lb.angularVelocity.z, 0), pb.mult(lb.quaternion, qb), lb.quaternion.x += b * .5 * qb.x, lb.quaternion.y += b * .5 * qb.y, lb.quaternion.z += b * .5 * qb.z, lb.quaternion.w += b * .5 * qb.w, lb.quaternion.normalize()), lb.force.set(0, 0, 0), lb.tau.set(0, 0, 0);
        }
        c.time += b, c.stepnumber += 1;
    }, typeof module != "undefined" ? module.exports = a : this.CANNON = a;
}).apply(this);