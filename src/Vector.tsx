export default class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static zero(): Vector {
    return new Vector(0, 0);
  }

  static epsilon(): Vector {
    return new Vector(0.0001, 0.0001);
  }

  add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  scale(k: number): Vector {
    return new Vector(k * this.x, k * this.y);
  }

  dot(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }

  sub(other: Vector): number {
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
}
