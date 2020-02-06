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
    if (len === 0) {
      return Vector.epsilon();
    }
    return this.scale(k / len);
  }

  // Rotates anticlockwise around the z-axis.
  rotate(radians: number): Vector {
    return new Vector(
      Math.cos(radians) * this.x - Math.sin(radians) * this.y,
      Math.sin(radians) * this.x + Math.cos(radians) * this.y,
      this.z
    );
  }
}
