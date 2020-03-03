import * as THREE from "three";

export default class Vector {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toString(): string {
    return `(x=${this.x}, y=${this.y} z=${this.z})`;
  }

  static zero(): Vector {
    return new Vector(0, 0, 0);
  }

  static epsilon(): Vector {
    return new Vector(0.01 * Math.random(), 0.01 * Math.random(), 0);
  }

  static random(): Vector {
    return new Vector(-10 + 20 * Math.random(), -10 + 20 * Math.random(), 0);
  }

  add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  scale(k: number): Vector {
    return new Vector(k * this.x, k * this.y, k * this.z);
  }

  dot(other: Vector): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  sub(other: Vector): Vector {
    return this.add(other.scale(-1));
  }

  length(): number {
    return Math.sqrt(this.dot(this));
  }

  scaleTo(k: number): Vector {
    let len = this.length();
    let base = len === 0 ? Vector.epsilon() : this;
    return base.scale(k / base.length());
  }

  normalize(): Vector {
    return this.scaleTo(1);
  }

  toVector3(): THREE.Vector3 {
    return new THREE.Vector3(this.x, this.y, this.z);
  }

  cross(other: Vector): Vector {
    return new Vector(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }
}
