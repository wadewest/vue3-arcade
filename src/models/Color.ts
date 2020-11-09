export default class Color {

  _red: number = 0;
  _blue: number = 0;
  _green: number = 0;
  _alpha: number = 0;

  constructor(r:number, g:number, b:number, a:number=1) {
    this._red = r;
    this._blue = b;
    this._green = g;
    this._alpha = a;
  }

  static create_random(alpha:number = 1): Color {
    return new Color( Math.random()*256, Math.random()*256, Math.random()*256, alpha);
  }

  get red() { return Math.floor(this._red); }
  get blue() { return Math.floor(this._blue); }
  get green() { return Math.floor(this._green); }
  get alpha() { return this._alpha; }
  set red(i:number) { if(i>256) i-=256; if(i<0) i+=256; this._red=i; }
  set blue(i:number) { if(i>256) i-=256; if(i<0) i+=256; this._blue=i; }
  set green(i:number) { if(i>256) i-=256; if(i<0) i+=256; this._green=i; }
  set alpha(i:number) { if(i>1.0) i-=1.0; if(i<0.0) i+=1.0; this._alpha=i; }

  get rgba() {
    return 'rgba('+this.red+','+this.green+','+this.blue+','+this.alpha+')'
  }

  copy(): Color {
    return new Color(this.red, this.green, this.blue, this.alpha);
  }

}